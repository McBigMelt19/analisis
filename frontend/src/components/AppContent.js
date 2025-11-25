import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            if (!route.element) return null
            const Element = route.element
            return (
              <Route
                key={idx} // clave simple basada en índice
                path={route.path}
                name={route.name}
                element={<Element />}
              />
            )
          })}

          {/* Si el usuario llega a una ruta no registrada, enviamos a /home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

// Nota: Asegúrate de que el path en App.js para DefaultLayout es path="*"
export default React.memo(AppContent)