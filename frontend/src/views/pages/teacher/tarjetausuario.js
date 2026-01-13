import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CCardImage,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CFormLabel,
  CFormInput
} from '@coreui/react'
// Imagen de perfil por defecto (reemplaza con la ruta correcta a una imagen local)
import DefaultAvatar from 'src/assets/images/react.jpg' 

const UserProfile = () => {
  // DATOS DE USUARIO DE EJEMPLO (Simulación)
  // En una app real, estos datos vendrían de props o de un contexto de autenticación.
  const [userData, setUserData] = useState({
    username: 'Admin123',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'admin@ejemplo.com',
    role: 'Administrador',
    avatar: DefaultAvatar // URL o import de la imagen
  });

  // Estado para controlar el Modal de opciones de imagen
  const [imageModalVisible, setImageModalVisible] = useState(false);
  // Estado para controlar el Modal de vista previa de imagen
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  // Estado para almacenar la nueva imagen seleccionada (para subir)
  const [newProfileImage, setNewProfileImage] = useState(null);


  // --- MANEJADORES DE MODALES ---

  // Abre el modal con las dos opciones
  const handleAvatarClick = () => {
    setImageModalVisible(true);
  };

  // Opción 1: Ver Imagen
  const handleViewImage = () => {
    setImageModalVisible(false); // Cierra el primer modal
    setPreviewModalVisible(true); // Abre el modal de vista previa
  };

  // Opción 2: Subir Imagen (Abre el selector de archivos)
  const handleUploadImageClick = () => {
    document.getElementById('profileImageInput').click();
  };

  // Maneja el cambio en el input de archivo (cuando se selecciona una imagen)
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // AQUÍ IRÍA LA LÓGICA PARA ENVIAR LA IMAGEN AL SERVIDOR
        // O PROCESAR EL RECORTE (192x192).
        // Por ahora, simulamos que se actualiza el estado con la nueva imagen.
        setUserData(prev => ({ ...prev, avatar: reader.result }));
        setNewProfileImage(null); // Limpiar el estado temporal
        setImageModalVisible(false); // Cerrar modal
        alert('Simulación: Imagen de perfil actualizada.');
      };
      reader.readAsDataURL(file);
    }
  };


  // --- ESTILOS CSS PERSONALIZADOS (Podrías moverlos a un archivo CSS aparte) ---
  const styles = {
    // Aumentamos tamaños ~50% y fijamos avatar a un tamaño estático
    containerCard: {
      backgroundColor: '#e9f2f7',
      border: 'none',
      width: '100%', 
      margin: '0 auto', 
      minHeight: '100px',
      display: 'flex',
      flexDirection: 'column',      // Opcional: pequeño padding extra para dar sensación de tarjeta más grande
      padding: '10px',
    },
    leftColumn: {
      width: '350px', 
      flex: '0 0 350px', // Flex-grow: 0, Flex-shrink: 0, Flex-basis: 350px
    },
    avatarCard: {
      overflow: 'hidden', 
      border: 'none',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    // 3. LA MAGIA DE LA IMAGEN (NO DISTORSIÓN):
    avatarImageContainer: {
        height: '400px', // Altura fija imponente
        width: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#f0f0f0' // Fondo por si la imagen tarda en cargar
    },
    avatarImage: {
      width: '100%',
      height: '300px',
      // 'cover': Rellena el espacio recortando lo que sobra automáticamente.
      objectFit: 'cover', 
      objectPosition: 'center', 
      transition: 'transform 0.5s ease',
    },
    usernameBar: {
      backgroundColor: '#003366', 
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      fontSize: '1.8rem', 
      fontWeight: 'bold',
      height: '100px',// Ocupa el espacio restante verticalmente
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    usernameLine: {
      content: '""',
      display: 'block',
      width: '60px',
      height: '4px',
      backgroundColor: 'white',
      margin: '15px auto 0', 
      borderRadius: '2px',
    },
    dataCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '40px', 
      height: '100%', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center' 
    },
    dataLabel: {
        fontWeight: 'bold',
        color: '#6c757d',
        fontSize: '1.1rem'
    },
    dataValue: {
        fontSize: '1.3rem', 
        marginBottom: '2px',
        color: '#212529',
        borderBottom: '1px solid #eee', 
        paddingBottom: '5px',
        width: '100%'
    }
  };


  return (
    <>
      <CCard className="mb-4 shadow-lg"  style={styles.containerCard}>
        <CCardBody className="p-4 h-full flex flex-col">
          <CRow>
            {/* --- COLUMNA IZQUIERDA: Avatar y Nombre --- */}
            <CCol md="auto" style={styles.leftColumn}>
              <CCard style={styles.avatarImageContainer} className="mb-3">
                {/* Imagen Clickeable */}
                <div onClick={handleAvatarClick} style={{ overflow: 'hidden' }}>
                  <CCardImage
                    orientation="top"
                    src={userData.avatar}
                    style={styles.avatarImage}
                  />
                </div>
                {/* Barra Azul Marino con Nombre */}
                <div md="auto" style={styles.usernameBar}>
                  {userData.username}
                  <span style={styles.usernameLine}></span>
                </div>
              </CCard>
            </CCol>

            {/* --- COLUMNA DERECHA: Datos del Usuario --- */}
            <CCol>
              <CCard style={styles.dataCard}>
                <CCardBody>
                  <h4 className="mb-4">Información del Perfil</h4>
                  
                  <CRow className="mb-3">
                    <CCol sm="4" style={styles.dataLabel}>Nombre Completo:</CCol>
                    <CCol sm="8" style={styles.dataValue}>{userData.firstName} {userData.lastName}</CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol sm="4" style={styles.dataLabel}>Correo Electrónico:</CCol>
                    <CCol sm="8" style={styles.dataValue}>{userData.email}</CCol>
                  </CRow>
                  
                  <CRow className="mb-3">
                    <CCol sm="4" style={styles.dataLabel}>Rol:</CCol>
                    <CCol sm="8">
                        {/* Puedes usar un CBadge para que el rol destaque */}
                        <span className={`badge ${userData.role === 'Administrador' ? 'bg-primary' : 'bg-info'}`}>
                            {userData.role}
                        </span>
                    </CCol>
                  </CRow>
                  
                  <CRow>
                     <CCol>
                        <small className="text-muted">
                            * Estos campos no son editables desde esta vista.
                        </small>
                     </CCol>
                  </CRow>

                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* --- MODAL 1: Opciones de Imagen --- */}
      <CModal
        alignment="center"
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
      >
        <CModalHeader>
          <strong>Opciones de Foto de Perfil</strong>
        </CModalHeader>
        <CModalBody className="text-center">
          <p>¿Qué deseas hacer con tu foto de perfil?</p>
          <div className="d-grid gap-2 col-8 mx-auto">
            <CButton color="info" variant="outline" onClick={handleViewImage}>
              Ver Imagen Actual
            </CButton>
            <CButton color="primary" onClick={handleUploadImageClick}>
              Subir Nueva Imagen
            </CButton>
          </div>
          {/* Input de archivo oculto para la subida */}
          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </CModalBody>
      </CModal>

      {/* --- MODAL 2: Vista Previa de Imagen --- */}
      <CModal
        alignment="center"
        size="lg" // Modal grande para ver bien la imagen
        visible={previewModalVisible}
        onClose={() => setPreviewModalVisible(false)}
      >
        <CModalHeader>
          <strong>Foto de Perfil Actual</strong>
        </CModalHeader>
        <CModalBody className="text-center">
            <img 
                src={userData.avatar} 
                alt="Vista previa de perfil" 
                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }} 
            />
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setPreviewModalVisible(false)}>
                Cerrar
            </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default UserProfile