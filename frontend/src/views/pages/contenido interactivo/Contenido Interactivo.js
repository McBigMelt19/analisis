import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CBadge,
  CProgress,
  CAlert,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

// Banco de preguntas sobre Historia y Cultura de Venezuela
const preguntasBank = [
  {
    id: 1,
    pregunta: '¿Cuál es el árbol nacional de Venezuela que florece con un color amarillo intenso?',
    opciones: ['El Samán', 'El Araguaney', 'El Bucare', 'La Ceiba'],
    respuestaCorrecta: 1,
    explicacion: '🌳 ¡El Araguaney es el árbol nacional de Venezuela! Florece entre febrero y abril con hermosas flores amarillas.',
    emoji: '🌳',
    nivel: 'Básico',
  },
  {
    id: 2,
    pregunta: '¿Quién fue el Libertador de Venezuela y de varias naciones sudamericanas?',
    opciones: ['José Antonio Páez', 'Simón Bolívar', 'Francisco de Miranda', 'Antonio José de Sucre'],
    respuestaCorrecta: 1,
    explicacion: '⚔️ Simón Bolívar, conocido como "El Libertador", lideró la independencia de Venezuela, Colombia, Ecuador, Perú y Bolivia.',
    emoji: '⚔️',
    nivel: 'Básico',
  },
  {
    id: 3,
    pregunta: '¿Cuál es el salto de agua más alto del mundo, ubicado en Venezuela?',
    opciones: ['Salto Ángel', 'Cataratas del Niágara', 'Salto Kukenán', 'Cataratas del Iguazú'],
    respuestaCorrecta: 0,
    explicacion: '💧 ¡El Salto Ángel (Kerepakupai Merú) tiene 979 metros de altura! Está ubicado en el Parque Nacional Canaima, estado Bolívar.',
    emoji: '💧',
    nivel: 'Básico',
  },
  {
    id: 4,
    pregunta: '¿En qué año se firmó el Acta de Independencia de Venezuela?',
    opciones: ['1810', '1811', '1821', '1830'],
    respuestaCorrecta: 1,
    explicacion: '📜 El 5 de julio de 1811 se firmó el Acta de Independencia, siendo Venezuela la primera colonia española en declarar su independencia.',
    emoji: '📜',
    nivel: 'Intermedio',
  },
  {
    id: 5,
    pregunta: '¿Cuál es la flor nacional de Venezuela?',
    opciones: ['La Rosa', 'La Orquídea', 'El Girasol', 'El Lirio'],
    respuestaCorrecta: 1,
    explicacion: '🌺 La Orquídea (Cattleya mossiae), también conocida como "Flor de Mayo", es la flor nacional de Venezuela desde 1951.',
    emoji: '🌺',
    nivel: 'Básico',
  },
  {
    id: 6,
    pregunta: '¿Cuál es el ave nacional de Venezuela?',
    opciones: ['El Cóndor', 'El Turpial', 'El Águila', 'El Cardenalito'],
    respuestaCorrecta: 1,
    explicacion: '🐦 ¡El Turpial es el ave nacional! Se distingue por su plumaje amarillo y negro con una mancha azul alrededor del ojo.',
    emoji: '🐦',
    nivel: 'Básico',
  },
  {
    id: 7,
    pregunta: '¿Cuál es el río más largo de Venezuela?',
    opciones: ['Río Caroní', 'Río Apure', 'Río Orinoco', 'Río Arauca'],
    respuestaCorrecta: 2,
    explicacion: '🏞️ El Río Orinoco tiene aproximadamente 2.140 km de longitud y es el tercer río más caudaloso del mundo.',
    emoji: '🏞️',
    nivel: 'Intermedio',
  },
  {
    id: 8,
    pregunta: '¿Qué estado de Venezuela es famoso por sus tepuyes?',
    opciones: ['Zulia', 'Bolívar', 'Miranda', 'Lara'],
    respuestaCorrecta: 1,
    explicacion: '⛰️ El estado Bolívar alberga el Parque Nacional Canaima, famoso por sus tepuyes (mesetas de arenisca), incluyendo el Auyantepui.',
    emoji: '⛰️',
    nivel: 'Intermedio',
  },
  {
    id: 9,
    pregunta: '¿Cuál es el plato típico más representativo de Venezuela?',
    opciones: ['La Empanada', 'La Arepa', 'La Hallaca', 'El Pabellón Criollo'],
    respuestaCorrecta: 3,
    explicacion: '🍽️ El Pabellón Criollo es el plato nacional: arroz, caraotas negras, carne mechada y tajadas de plátano maduro.',
    emoji: '🍽️',
    nivel: 'Básico',
  },
  {
    id: 10,
    pregunta: '¿Quién fue conocido como "El Precursor" de la independencia venezolana?',
    opciones: ['Simón Bolívar', 'José Félix Ribas', 'Francisco de Miranda', 'Rafael Urdaneta'],
    respuestaCorrecta: 2,
    explicacion: '🗡️ Francisco de Miranda es conocido como "El Precursor" por ser el primero en concebir la idea de la independencia hispanoamericana.',
    emoji: '🗡️',
    nivel: 'Intermedio',
  },
]

const FrontendJuegoHistoria = () => {
  const navigate = useNavigate()

  // Estados del juego
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null)
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [puntuacion, setPuntuacion] = useState(0)
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(0)
  const [juegoTerminado, setJuegoTerminado] = useState(false)
  const [racha, setRacha] = useState(0)
  const [mejorRacha, setMejorRacha] = useState(0)
  const [animarProgreso, setAnimarProgreso] = useState(false)

  const totalPreguntas = preguntasBank.length
  const pregunta = preguntasBank[preguntaActual]
  const progreso = Math.round(((preguntaActual) / totalPreguntas) * 100)

  // Manejar selección de respuesta
  const handleSeleccion = (indice) => {
    if (mostrarResultado) return // No permitir cambiar respuesta

    setRespuestaSeleccionada(indice)
    setMostrarResultado(true)

    const esCorrecta = indice === pregunta.respuestaCorrecta

    if (esCorrecta) {
      const puntosBase = 100
      const bonusRacha = racha >= 2 ? 50 : 0
      setPuntuacion((prev) => prev + puntosBase + bonusRacha)
      setRespuestasCorrectas((prev) => prev + 1)
      setRacha((prev) => {
        const nuevaRacha = prev + 1
        if (nuevaRacha > mejorRacha) setMejorRacha(nuevaRacha)
        return nuevaRacha
      })
    } else {
      setRacha(0)
    }

    setAnimarProgreso(true)
    setTimeout(() => setAnimarProgreso(false), 600)
  }

  // Pasar a la siguiente pregunta
  const siguientePregunta = () => {
    if (preguntaActual + 1 >= totalPreguntas) {
      setJuegoTerminado(true)
    } else {
      setPreguntaActual((prev) => prev + 1)
      setRespuestaSeleccionada(null)
      setMostrarResultado(false)
    }
  }

  // Reiniciar el juego
  const reiniciarJuego = () => {
    setPreguntaActual(0)
    setRespuestaSeleccionada(null)
    setMostrarResultado(false)
    setPuntuacion(0)
    setRespuestasCorrectas(0)
    setJuegoTerminado(false)
    setRacha(0)
    setMejorRacha(0)
  }

  // Obtener color del botón según el estado
  const getBotonStyle = (indice) => {
    if (!mostrarResultado) {
      return {
        backgroundColor: '#2b6cb0',
        borderRadius: '12px',
        fontSize: '1.05rem',
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
        cursor: 'pointer',
      }
    }

    if (indice === pregunta.respuestaCorrecta) {
      return {
        backgroundColor: '#38a169',
        borderRadius: '12px',
        fontSize: '1.05rem',
        transition: 'all 0.3s ease',
        transform: 'scale(1.03)',
        boxShadow: '0 4px 15px rgba(56, 161, 105, 0.4)',
      }
    }

    if (indice === respuestaSeleccionada && indice !== pregunta.respuestaCorrecta) {
      return {
        backgroundColor: '#e53e3e',
        borderRadius: '12px',
        fontSize: '1.05rem',
        transition: 'all 0.3s ease',
        transform: 'scale(0.98)',
        opacity: 0.9,
      }
    }

    return {
      backgroundColor: '#a0aec0',
      borderRadius: '12px',
      fontSize: '1.05rem',
      transition: 'all 0.3s ease',
      opacity: 0.5,
    }
  }

  // Calcular emoji de nota final
  const getNotaFinal = () => {
    const porcentaje = (respuestasCorrectas / totalPreguntas) * 100
    if (porcentaje >= 90) return { emoji: '🏆', texto: '¡Excelente! ¡Eres un experto!', color: '#38a169' }
    if (porcentaje >= 70) return { emoji: '🌟', texto: '¡Muy bien! ¡Sigue así!', color: '#d69e2e' }
    if (porcentaje >= 50) return { emoji: '💪', texto: '¡Buen intento! Puedes mejorar.', color: '#dd6b20' }
    return { emoji: '📚', texto: '¡Sigue estudiando! Tú puedes.', color: '#e53e3e' }
  }

  // ─── PANTALLA DE RESULTADOS ───
  if (juegoTerminado) {
    const nota = getNotaFinal()
    const porcentaje = Math.round((respuestasCorrectas / totalPreguntas) * 100)

    return (
      <div style={{ backgroundColor: '#fdf8e1', minHeight: '100vh', padding: '20px' }}>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCard className="border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #d9ad26 0%, #e8c84a 100%)',
                  padding: '40px',
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                <div style={{ fontSize: '80px', marginBottom: '10px' }}>{nota.emoji}</div>
                <h2 style={{ fontWeight: 'bold', marginBottom: '5px' }}>¡Aventura Completada!</h2>
                <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>{nota.texto}</p>
              </div>

              <CCardBody className="p-4">
                {/* Estadísticas */}
                <CRow className="g-3 mb-4">
                  <CCol xs={6} md={3}>
                    <div className="text-center p-3" style={{ backgroundColor: '#f0fff4', borderRadius: '12px' }}>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#38a169' }}>
                        {respuestasCorrectas}
                      </div>
                      <small className="text-muted">Correctas</small>
                    </div>
                  </CCol>
                  <CCol xs={6} md={3}>
                    <div className="text-center p-3" style={{ backgroundColor: '#fff5f5', borderRadius: '12px' }}>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#e53e3e' }}>
                        {totalPreguntas - respuestasCorrectas}
                      </div>
                      <small className="text-muted">Incorrectas</small>
                    </div>
                  </CCol>
                  <CCol xs={6} md={3}>
                    <div className="text-center p-3" style={{ backgroundColor: '#fffff0', borderRadius: '12px' }}>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#d69e2e' }}>
                        {puntuacion}
                      </div>
                      <small className="text-muted">Puntos</small>
                    </div>
                  </CCol>
                  <CCol xs={6} md={3}>
                    <div className="text-center p-3" style={{ backgroundColor: '#ebf8ff', borderRadius: '12px' }}>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2b6cb0' }}>
                        🔥 {mejorRacha}
                      </div>
                      <small className="text-muted">Mejor Racha</small>
                    </div>
                  </CCol>
                </CRow>

                {/* Barra de resultado */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ fontWeight: '600' }}>Resultado Final</span>
                    <span style={{ fontWeight: '600', color: nota.color }}>{porcentaje}%</span>
                  </div>
                  <CProgress
                    value={porcentaje}
                    color={porcentaje >= 70 ? 'success' : porcentaje >= 50 ? 'warning' : 'danger'}
                    height={14}
                    style={{ borderRadius: '7px' }}
                  />
                </div>

                {/* Nota en escala 1-20 */}
                <CAlert
                  color={porcentaje >= 50 ? 'success' : 'warning'}
                  className="text-center"
                  style={{ borderRadius: '12px' }}
                >
                  <strong>Tu nota: {Math.round((respuestasCorrectas / totalPreguntas) * 20)}/20</strong>
                  {porcentaje >= 50 ? ' ✅ ¡Aprobado!' : ' ⚠️ Necesitas repasar'}
                </CAlert>

                {/* Botones de acción */}
                <CRow className="g-3 mt-2">
                  <CCol xs={12} sm={6}>
                    <CButton
                      className="w-100 p-3 border-0 text-white"
                      style={{
                        backgroundColor: '#d9ad26',
                        borderRadius: '12px',
                        fontSize: '1.05rem',
                        fontWeight: '600',
                      }}
                      onClick={reiniciarJuego}
                    >
                      🔄 Intentar de Nuevo
                    </CButton>
                  </CCol>
                  <CCol xs={12} sm={6}>
                    <CButton
                      className="w-100 p-3 border-0 text-white"
                      style={{
                        backgroundColor: '#2b6cb0',
                        borderRadius: '12px',
                        fontSize: '1.05rem',
                        fontWeight: '600',
                      }}
                      onClick={() => navigate('/dashboard')}
                    >
                      🏠 Volver al Inicio
                    </CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    )
  }

  // ─── PANTALLA DEL QUIZ ───
  return (
    <div style={{ backgroundColor: '#fdf8e1', minHeight: '100vh', padding: '20px' }}>
      <CRow className="justify-content-center">
        <CCol md={8}>
          {/* Cabecera del Juego */}
          <div className="mb-4">
            <h2 style={{ color: '#d9ad26', fontWeight: 'bold' }}>
              Aventura Histórica: Venezuela 🇻🇪
            </h2>
            <p className="text-muted">Responde correctamente para ganar puntos de progreso.</p>
          </div>

          {/* Info bar: puntuación y racha */}
          <CRow className="g-2 mb-3">
            <CCol xs="auto">
              <CBadge
                style={{
                  padding: '10px 16px',
                  fontSize: '0.95rem',
                  backgroundColor: '#d9ad26',
                  borderRadius: '20px',
                }}
              >
                ⭐ {puntuacion} pts
              </CBadge>
            </CCol>
            {racha >= 2 && (
              <CCol xs="auto">
                <CBadge
                  style={{
                    padding: '10px 16px',
                    fontSize: '0.95rem',
                    backgroundColor: '#e53e3e',
                    borderRadius: '20px',
                  }}
                >
                  🔥 Racha x{racha} (+50 bonus)
                </CBadge>
              </CCol>
            )}
            <CCol xs="auto">
              <CBadge
                style={{
                  padding: '10px 16px',
                  fontSize: '0.95rem',
                  backgroundColor: '#38a169',
                  borderRadius: '20px',
                }}
              >
                ✅ {respuestasCorrectas}/{preguntaActual + (mostrarResultado ? 1 : 0)}
              </CBadge>
            </CCol>
          </CRow>

          <CCard className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <CCardHeader
              className="p-3 border-0 d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: '#ffffff',
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px',
              }}
            >
              <span style={{ fontWeight: '600', color: '#555' }}>
                Pregunta {preguntaActual + 1} de {totalPreguntas}
              </span>
              <CBadge
                color={pregunta.nivel === 'Básico' ? 'warning' : 'info'}
                shape="rounded-pill"
                style={{ padding: '8px 12px' }}
              >
                Nivel: {pregunta.nivel}
              </CBadge>
            </CCardHeader>

            <CCardBody className="p-5 text-center">
              {/* Emoji de la pregunta */}
              <div className="mb-3">
                <span style={{ fontSize: '60px' }}>{pregunta.emoji}</span>
              </div>

              <h4 className="mb-5" style={{ color: '#333', lineHeight: '1.5' }}>
                {pregunta.pregunta}
              </h4>

              {/* Botones de Respuesta */}
              <CRow className="g-3">
                {pregunta.opciones.map((opcion, indice) => (
                  <CCol xs={12} sm={6} key={indice}>
                    <CButton
                      className="w-100 p-3 border-0 text-white"
                      style={getBotonStyle(indice)}
                      onClick={() => handleSeleccion(indice)}
                      disabled={mostrarResultado}
                    >
                      <span style={{ marginRight: '8px', fontWeight: 'bold' }}>
                        {String.fromCharCode(65 + indice)}.
                      </span>
                      {opcion}
                      {mostrarResultado && indice === pregunta.respuestaCorrecta && ' ✓'}
                      {mostrarResultado &&
                        indice === respuestaSeleccionada &&
                        indice !== pregunta.respuestaCorrecta &&
                        ' ✗'}
                    </CButton>
                  </CCol>
                ))}
              </CRow>

              {/* Feedback después de responder */}
              {mostrarResultado && (
                <div
                  style={{
                    marginTop: '24px',
                    animation: 'fadeIn 0.4s ease-in',
                  }}
                >
                  <CAlert
                    color={
                      respuestaSeleccionada === pregunta.respuestaCorrecta ? 'success' : 'danger'
                    }
                    style={{ borderRadius: '12px', textAlign: 'left' }}
                  >
                    <strong>
                      {respuestaSeleccionada === pregunta.respuestaCorrecta
                        ? '🎉 ¡Correcto!'
                        : '❌ Incorrecto'}
                    </strong>
                    <br />
                    {pregunta.explicacion}
                  </CAlert>

                  <CButton
                    className="mt-2 px-5 py-2 border-0 text-white"
                    style={{
                      backgroundColor: '#d9ad26',
                      borderRadius: '50px',
                      fontSize: '1.05rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={siguientePregunta}
                  >
                    {preguntaActual + 1 >= totalPreguntas
                      ? '🏁 Ver Resultados'
                      : '➡️ Siguiente Pregunta'}
                  </CButton>
                </div>
              )}
            </CCardBody>

            {/* Barra de Progreso Inferior */}
            <div
              className="p-3"
              style={{
                backgroundColor: '#f8f9fa',
                borderBottomLeftRadius: '15px',
                borderBottomRightRadius: '15px',
              }}
            >
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Tu progreso</small>
                <small className="text-muted">
                  {Math.round(((preguntaActual + (mostrarResultado ? 1 : 0)) / totalPreguntas) * 100)}%
                </small>
              </div>
              <CProgress
                value={((preguntaActual + (mostrarResultado ? 1 : 0)) / totalPreguntas) * 100}
                color="info"
                height={10}
                style={{
                  borderRadius: '5px',
                  transition: 'all 0.5s ease',
                }}
              />
            </div>
          </CCard>

          {/* Botón de Ayuda - Chatbot IA */}
          <div className="mt-4 text-end">
            <CButton
              color="dark"
              variant="outline"
              style={{ borderRadius: '50px', padding: '10px 20px' }}
              onClick={() => navigate('/student/chatbot')}
            >
              <span className="me-2">🤖</span> Preguntar al Chatbot IA
            </CButton>
          </div>
        </CCol>
      </CRow>

      {/* CSS para animaciones */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .btn:hover:not(:disabled) {
          transform: scale(1.02) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  )
}

export default FrontendJuegoHistoria