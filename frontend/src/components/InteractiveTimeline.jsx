import React, { useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CBadge,
  CCollapse,
} from '@coreui/react'

// Base de datos enriquecida de eventos históricos de Venezuela adaptada por grado
const timelineEvents = {
  1: [
    {
      year: '14000 a.C.',
      title: 'Primeros Pobladores de Venezuela',
      desc: 'Comunidades de cazadores y recolectores se asientan en el territorio (como el yacimiento de Taima-Taima en Falcón), conviviendo con la megafauna americana.',
      icon: '🏹',
      theme: 'Época Indígena',
    },
    {
      year: '1000 a.C.',
      title: 'Nacimiento de la Agricultura',
      desc: 'Poblaciones originarias desarrollan técnicas de cultivo (yuca y maíz) y alfarería en las cuencas del Río Orinoco, estableciendo las primeras aldeas sedentarias.',
      icon: '🌽',
      theme: 'Sedentarismo',
    },
  ],
  2: [
    {
      year: '1498',
      title: 'Tierra de Gracia',
      desc: 'Cristóbal Colón llega a las costas venezolanas (Península de Paria, Macuro) en su tercer viaje, maravillado por las bellezas naturales a las que llama "Tierra de Gracia".',
      icon: '⛵',
      theme: 'Descubrimiento',
    },
    {
      year: '1550',
      title: 'Resistencia Indígena liderada por Guaicaipuro',
      desc: 'El Cacique Guaicaipuro unifica a las tribus del centro (Caribes) en una férrea alianza militar para defender sus tierras ancestrales frente a las tropas españolas.',
      icon: '🛡️',
      theme: 'Resistencia',
    },
  ],
  3: [
    {
      year: '1527',
      title: 'Fundación de Santa Ana de Coro',
      desc: 'Juan de Ampíes funda Coro, una de las primeras ciudades estables del continente y capital de la Provincia de Venezuela durante los primeros años coloniales.',
      icon: '🏰',
      theme: 'Colonización',
    },
    {
      year: '1567',
      title: 'Nacimiento de Santiago de León de Caracas',
      desc: 'Diego de Losada funda la ciudad de Caracas en un valle fértil custodiado por el cerro El Ávila (Waraira Repano), consolidándose luego como la capital.',
      icon: '⛰️',
      theme: 'Fundación',
    },
  ],
  4: [
    {
      year: '1810',
      title: 'El Grito de Independencia (19 de Abril)',
      desc: 'El Cabildo de Caracas declara la destitución del Capitán General Vicente Emparan. Se forma la Junta Suprema conservadora de los derechos de Fernando VII, marcando el inicio del proceso emancipador.',
      icon: '🗣️',
      theme: 'Pre-Independencia',
    },
    {
      year: '1811',
      title: 'Declaración Formal de la Independencia (5 de Julio)',
      desc: 'El Congreso de las Provincias Unidas de Venezuela redacta y aprueba el Acta de Declaración de la Independencia, fundando la Primera República de Venezuela.',
      icon: '📜',
      theme: 'Independencia',
    },
  ],
  5: [
    {
      year: '1813',
      title: 'La Campaña Admirable y el Título de Libertador',
      desc: 'Simón Bolívar lidera una brillante ofensiva militar desde la Nueva Granada para liberar el occidente del país. Al entrar triunfal a Caracas, la municipalidad le confiere el título de "Libertador".',
      icon: '🐎',
      theme: 'Emancipación',
    },
    {
      year: '1821',
      title: 'La Gloriosa Batalla de Carabobo (24 de Junio)',
      desc: 'El ejército patriota al mando de Simón Bolívar derrota decisivamente a las fuerzas realistas españolas de Miguel de la Torre, sellando de manera definitiva la independencia de Venezuela.',
      icon: '⚔️',
      theme: 'Consolidación',
    },
  ],
  6: [
    {
      year: '1830',
      title: 'Disolución de la Gran Colombia',
      desc: 'Venezuela se separa formalmente de la unión colombiana tras el Congreso de Valencia. Nace la República independiente de Venezuela bajo la presidencia del General José Antonio Páez.',
      icon: '🗺️',
      theme: 'República',
    },
    {
      year: '1914',
      title: 'El Pozo Zumaque I y la Era Petrolera',
      desc: 'Se descubre petróleo de gran calidad en el pozo Zumaque I (Mene Grande, Zulia), iniciando la transición de una economía agraria y cafetalera a una potencia energética global.',
      icon: '🛢️',
      theme: 'Industrialización',
    },
  ],
}

const InteractiveTimeline = ({ gradeLevel }) => {
  const events = timelineEvents[gradeLevel || '4'] || timelineEvents[4]
  const [selectedEventIdx, setSelectedEventIdx] = useState(0)
  const [showDetail, setShowDetail] = useState(true)

  const handleSelectEvent = (idx) => {
    if (idx === selectedEventIdx) {
      setShowDetail(!showDetail)
    } else {
      setSelectedEventIdx(idx)
      setShowDetail(true)
    }
  }

  const selectedEvent = events[selectedEventIdx] || events[0]

  return (
    <CCard className="shadow-sm border-0 venezuelan-timeline-card">
      <CCardHeader
        className="border-0 text-white d-flex justify-content-between align-items-center"
        style={{
          background: 'linear-gradient(135deg, #00247d 0%, #764ba2 100%)',
        }}
      >
        <h5 className="mb-0">
          ⏳ Línea de Tiempo Interactiva — Grado {gradeLevel || '4'}°
        </h5>
        <CBadge color="warning" shape="rounded-pill" style={{ color: '#000', fontWeight: 'bold' }}>
          {selectedEvent.theme}
        </CBadge>
      </CCardHeader>
      <CCardBody className="p-4" style={{ backgroundColor: '#fcfbf7' }}>
        <p className="text-muted text-center mb-4" style={{ fontStyle: 'italic' }}>
          Haz clic en cada hito para explorar los acontecimientos que marcaron nuestra historia nacional.
        </p>

        {/* Eje de la Línea de Tiempo */}
        <div className="timeline-axis-container mb-4 position-relative py-3">
          <div
            className="timeline-line position-absolute w-100 bg-secondary"
            style={{ height: '4px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }}
          />

          <CRow className="justify-content-center text-center">
            {events.map((event, idx) => {
              const isSelected = idx === selectedEventIdx
              return (
                <CCol key={idx} xs={6} md={3} className="mb-3 mb-md-0 position-relative">
                  <div
                    className="timeline-node-wrapper mx-auto"
                    style={{ cursor: 'pointer', zIndex: 10, position: 'relative' }}
                    onClick={() => handleSelectEvent(idx)}
                  >
                    <div
                      className={`timeline-node rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm transition-all`}
                      style={{
                        width: '60px',
                        height: '60px',
                        fontSize: '1.8rem',
                        backgroundColor: isSelected ? '#ffcc00' : '#fff',
                        border: isSelected ? '4px solid #00247d' : '3px solid #ffcc00',
                        transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      }}
                    >
                      {event.icon}
                    </div>
                    <div className="mt-2">
                      <span
                        className="d-block"
                        style={{
                          fontWeight: isSelected ? '800' : '600',
                          fontSize: '1rem',
                          color: isSelected ? '#00247d' : '#4f5d73',
                        }}
                      >
                        {event.year}
                      </span>
                      <small className="text-muted d-block text-truncate px-2" style={{ fontSize: '0.8rem' }}>
                        {event.title}
                      </small>
                    </div>
                  </div>
                </CCol>
              )
            })}
          </CRow>
        </div>

        {/* Caja de Detalles del Evento */}
        <CCollapse visible={showDetail}>
          <CCard
            className="border-0 shadow-sm mt-3"
            style={{
              borderRadius: '12px',
              backgroundColor: '#fff',
              borderLeft: '5px solid #ffcc00',
            }}
          >
            <CCardBody className="p-4">
              <CRow className="align-items-center">
                <CCol xs={12} md={2} className="text-center mb-3 mb-md-0">
                  <span style={{ fontSize: '4rem', display: 'block', animation: 'bounce 2s infinite' }}>
                    {selectedEvent.icon}
                  </span>
                </CCol>
                <CCol xs={12} md={10}>
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <span
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: '900',
                        fontSize: '1.6rem',
                        color: '#00247d',
                      }}
                    >
                      {selectedEvent.year}
                    </span>
                    <CBadge color="info">{selectedEvent.theme}</CBadge>
                  </div>
                  <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '700', color: '#333' }}>
                    {selectedEvent.title}
                  </h4>
                  <p
                    className="mt-2 text-muted"
                    style={{
                      fontSize: '1.05rem',
                      lineHeight: '1.6',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {selectedEvent.desc}
                  </p>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCollapse>
      </CCardBody>

      {/* Estilos locales para las animaciones y transiciones premium */}
      <style>{`
        .timeline-node-wrapper:hover .timeline-node {
          transform: scale(1.1) !important;
          box-shadow: 0 8px 16px rgba(0, 36, 125, 0.15) !important;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </CCard>
  )
}

export default InteractiveTimeline