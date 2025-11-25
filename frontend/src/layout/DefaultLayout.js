import React, { useEffect, useState, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRole, logout } from '../config/auth'; // Importa la función de obtener y cerrar sesión

// Importa los componentes de CoreUI que ya tienes definidos en la carpeta 'components'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'; 

// Importa los dos sets de navegación que creaste
import navStudent from '../_nav_student'; // Asume que la ruta es correcta
import navTeacher from '../_nav_teacher'; // Asume que la ruta es correcta

// Placeholder para la carga
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const DefaultLayout = () => {
  // Inicializa el rol desde localStorage de forma síncrona para evitar
  // que el componente haga un render inicial con `role === null` y provoque
  // una redirección inmediata de vuelta al login (bucle).
  const [role, setRole] = useState(() => getUserRole());
  const [navigation, setNavigation] = useState([]);

  // Actualiza la navegación cuando cambie el rol.
  useEffect(() => {
    if (role === 'student') {
      setNavigation(navStudent);
    } else if (role === 'teacher') {
      setNavigation(navTeacher);
    } else {
      setNavigation([]);
    }
  }, [role]);

  // 2. Lógica de Protección de Ruta (Si no hay rol, redirigir a Login)
  if (role === null) {
    // Si localStorage está vacío y no hay rol, redirige al login
    return <Navigate to="/login" replace />;
  }
  
  // 3. Renderizar el Layout Condicionalmente
return (
    <div>
      <AppSidebar nav={navigation} /> 
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader logout={logout} role={role} /> 
        <div className="body flex-grow-1">
          <Suspense fallback={loading}>
            {/* Si AppContent falla aquí (por falta de rutas), regresa al login */}
            <AppContent /> 
          </Suspense>
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default DefaultLayout;