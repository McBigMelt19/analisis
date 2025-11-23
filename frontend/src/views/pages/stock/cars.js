import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCardImage,
  CCardTitle,
  CCardText,
  CCardHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMagnifyingGlass } from '@coreui/icons'
import { DocsComponents, DocsExample } from 'src/components'
import ReactImg from 'src/assets/images/react.jpg'



const Cars = () => {
  return (
    <>
            <CCard className="mb-4"> 
              <CCardHeader>
                <strong>Cars</strong>
              </CCardHeader>
            <CCardBody>
                <CRow>
                  <CCol sm='auto'>
                    <div className="small text-body-secondary">Cars in the stock</div>
                  </CCol>
              <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }}>
                <CCol xs>
              <CCard style={{ width: '18rem' }}>
                <CCardImage orientation="top" src={ReactImg} />
                <CCardBody>
                  <CCardTitle>Nombre del carrito</CCardTitle>
                  <CCardText>
                    Descripcion que tendra el carrito
                  </CCardText>
                  <CButton color="primary" href="#">
                    alguna funcion tendra
                  </CButton>
                </CCardBody>
              </CCard>
              </CCol>
                <CCol xs>
              <CCard style={{ width: '18rem' }}>
                <CCardImage orientation="top" src={ReactImg} />
                <CCardBody>
                  <CCardTitle>Nombre del carrito</CCardTitle>
                  <CCardText>
                    Descripcion que tendra el carrito
                  </CCardText>
                  <CButton color="primary" href="#">
                    alguna funcion tendra
                  </CButton>
                </CCardBody>
              </CCard>
              </CCol>
                <CCol xs>
              <CCard style={{ width: '18rem' }}>
                <CCardImage orientation="top" src={ReactImg} />
                <CCardBody>
                  <CCardTitle>Nombre del carrito</CCardTitle>
                  <CCardText>
                    Descripcion que tendra el carrito
                  </CCardText>
                  <CButton color="primary" href="#">
                    alguna funcion tendra
                  </CButton>
                </CCardBody>
              </CCard>
              </CCol>
              </CRow>
                </CRow>
              </CCardBody>
            </CCard>
      </>
  )
}

export default Cars

