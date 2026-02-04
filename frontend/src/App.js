import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom' // 💡 Usamos HashRouter para evitar errores en Netlify
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'

// Definition of Loading
const loading = (
  <div className="pt-3 text-center">
    <CSpinner color="primary" />
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// 💡 Ya no necesitamos páginas de login/error porque el chatbot es la entrada principal

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [])

  return (
    // 💡 CAMBIO CRÍTICO: HashRouter asegura que la app cargue bien en Netlify/GitHub Pages
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          {/* 🎯 RUTA ÚNICA: Todo pasa por DefaultLayout, que carga PersonalizedContent en "/" */}
          <Route path="*" name="Chatbot Principal" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App