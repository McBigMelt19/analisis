import React, { useState } from 'react'
import {
  CButton, CCard, CCardBody, CCol, CRow, CCardImage, CCardTitle, CCardText, CCardHeader,
  CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CFormInput, CFormLabel,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
// Importa las imágenes por defecto
import ReactImg from 'src/assets/images/vue.jpg' 
import ReactImgAdd from 'src/assets/images/add.jpg'
// Importamos el componente de Alerta (asumiendo que la ruta es correcta)
import AlertMessage from 'src/components/Alertas' 

const Parts = () => {
  const DEFAULT_IMAGE = ReactImg; 

  // --- ESTADOS DE LA APLICACIÓN ---
  const [products, setProducts] = useState([]) 
  const [modalVisible, setModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null) 

  const [newProductTitle, setNewProductTitle] = useState('')
  const [newProductDescription, setNewProductDescription] = useState('')
  const [newProductImage, setNewProductImage] = useState(DEFAULT_IMAGE) 

  // --- ESTADOS Y LÓGICA DE ALERTA (REUBICADOS CORRECTAMENTE) ---
  const [alertState, setAlertState] = useState({
    isVisible: false,
    message: '',
    color: 'success', 
  });
  
  const displayAlert = (message, color) => {
    setAlertState({
      isVisible: true,
      message: message,
      color: color,
    });
    
    // Ocultar automáticamente
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, isVisible: false }));
    }, 4000);
  };
  // -------------------------------------------------------------

  const handleImageChange = (event) => {
      const file = event.target.files[0]
      if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
              setNewProductImage(reader.result)
          }
          reader.readAsDataURL(file)
      }
  }

  const resetFormAndCloseModal = () => {
    setNewProductTitle('') 
    setNewProductDescription('') 
    setNewProductImage(DEFAULT_IMAGE) 
    setEditingProduct(null) 
    setModalVisible(false) 
  }

  const handleOpenCreateModal = () => {
    setEditingProduct(null) 
    setModalVisible(true)
  }

  const handleOpenEditModal = (productToEdit) => {
    setEditingProduct(productToEdit) 
    setNewProductTitle(productToEdit.title) 
    setNewProductDescription(productToEdit.description)
    setNewProductImage(productToEdit.image) 
    setModalVisible(true)
  }
  
  const handleDeleteCard = (idToDelete) => {
    // Usamos la confirmación nativa para la acción irreversible
    if (window.confirm('¿Estás seguro de que quieres eliminar este repuesto? Esta acción es irreversible.')) {
      const deletedProduct = products.find(p => p.id === idToDelete);
      setProducts(products.filter(p => p.id !== idToDelete))
      
      // ALERTA DE ÉXITO DE ELIMINACIÓN
      displayAlert(`El repuesto **${deletedProduct?.title || 'desconocido'}** ha sido eliminado.`, 'warning');
    }
  }

  const handleSave = () => {
    if (!newProductTitle.trim()) {
        // REEMPLAZO: Alerta de Validación
        displayAlert('El **Nombre del Repuesto** es obligatorio. Por favor, rellena el campo.', 'danger');
        return
    }

    if (editingProduct) {
      // MODO EDICIÓN
      setProducts(products.map(p => 
        p.id === editingProduct.id
          ? { ...p, 
              title: newProductTitle, 
              description: newProductDescription,
              image: newProductImage,
            } 
          : p
      ))
      // ALERTA DE EDICIÓN EXITOSA
      displayAlert(`El repuesto **${newProductTitle}** se ha actualizado correctamente.`, 'success');
    } else {
      // MODO CREACIÓN
      const newProductId = Date.now() 
      const newProduct = {
        id: newProductId,
        title: newProductTitle,
        description: newProductDescription || 'Sin descripción proporcionada.',
        image: newProductImage,
        isNew: true, 
      }
      setProducts([...products, newProduct])
      // ALERTA DE CREACIÓN EXITOSA
      displayAlert(`El repuesto **${newProductTitle}** se ha creado con éxito.`, 'success');
    }
    
    resetFormAndCloseModal()
  }
  
  // ... (ProductCard sin cambios)

  const ProductCard = ({ product }) => (
    <CCol xs key={product.id}>
      <CCard style={{ width: '18rem' }} className="card-hover-scale">
        <CCardImage orientation="top" src={product.image} /> 
        <CCardBody>
          <CCardTitle>{product.title}</CCardTitle>
          <CCardText>{product.description}</CCardText>
            <CRow className="align-items-center">
              <CCol xs="auto">
                <CButton color="warning" className="px-4" variant="outline" onClick={() => handleOpenEditModal(product)}>
                  Edit
                </CButton>
              </CCol>
              <CCol xs="auto" className="ms-auto">
                <CButton color="danger" className="px-4" variant="outline" onClick={() => handleDeleteCard(product.id)}>
                  Delete
                </CButton>
              </CCol>
            </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  )


  return (
    <>
    <div className="alert-fixed-bottom-right">
        <AlertMessage 
            isVisible={alertState.isVisible} 
            color={alertState.color} 
            message={alertState.message}
            onDismiss={() => setAlertState(prev => ({ ...prev, isVisible: false }))} 
        />
      </div>
      <CCard className="mb-4">
        <CCardHeader><strong>Parts (Admin View)</strong></CCardHeader>
        <CCardBody>
          <CRow>{/* ... (Metadata) */}</CRow><hr />
          

          <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }}>

            {products.map(product => (<ProductCard key={product.id} product={product} />))}

            <CCol xs>
              <CCard 
                style={{ width: '18rem', cursor: 'pointer', height: '100%', border: '2px dashed #0d6efd' }} 
                onClick={handleOpenCreateModal} 
                className="card-hover-scale"
              >
                <CCardImage orientation="top" src={ReactImgAdd} />
                <CCardBody>
                  <CCardTitle className="text-primary">Agregar Nuevo Repuesto</CCardTitle>
                  <CCardText className="text-body-secondary">Haz clic para añadir un nuevo producto al stock.</CCardText>
                </CCardBody>
              </CCard>
            </CCol>

          </CRow>
        </CCardBody>
      </CCard>

      {/* CModal - MODAL UNIFICADO PARA CREAR Y EDITAR */}
      <CModal alignment="center" visible={modalVisible} onClose={resetFormAndCloseModal}>
        <CModalHeader><CModalTitle>{editingProduct ? `Editar Repuesto: ${editingProduct.title}` : 'Formulario de Creación de Repuesto'}</CModalTitle></CModalHeader>
        <CModalBody>
          {/* VISTA PREVIA Y CARGA DE IMAGEN */}
          <div className="mb-3">
              <CFormLabel>Vista Previa</CFormLabel>
              <CCardImage 
                  orientation="top" 
                  src={newProductImage} 
                  style={{ maxHeight: '150px', objectFit: 'contain', border: '1px solid #ddd', padding: '5px' }} 
              />
          </div>
          <div className="mb-3">
              <CFormLabel htmlFor="productImage">Cargar Imagen del Repuesto</CFormLabel>
              <CFormInput 
                id="productImage" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} // Función para procesar el archivo
              />
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="productName">Nombre del Repuesto</CFormLabel>
            <CFormInput 
              id="productName" placeholder="Ej: Freno de disco" value={newProductTitle}
              onChange={(e) => setNewProductTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="productDescription">Descripción</CFormLabel>
            <CFormInput 
              id="productDescription" placeholder="Ej: Para modelo 2024, material de carbono" value={newProductDescription}
              onChange={(e) => setNewProductDescription(e.target.value)}
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={resetFormAndCloseModal}> Cerrar</CButton>
          <CButton color="primary" onClick={handleSave}>
            {editingProduct ? 'Guardar Cambios' : 'Guardar y Agregar Tarjeta'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Parts