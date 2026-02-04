import React, { Suspense } from 'react';
// import { Navigate } from 'react-router-dom'; // 👈 YA NO LO NECESITAMOS
import { useAuth } from '../context/AuthContext';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import navStudent, { getStudentNav } from '../_nav_student';
import navTeacher from '../_nav_teacher';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const DefaultLayout = () => {
  const { currentUser, isAuthenticated, loading: authLoading, logout } = useAuth();

  // Mostrar loading mientras se verifica autenticación
  if (authLoading) {
    return loading;
  }

  // 🚨 BLOQUE ELIMINADO: Ya no redirigimos al login forzosamente
  // if (!isAuthenticated || !currentUser) {
  //   return <Navigate to="/login" replace />;
  // }

  // Determinar navegación según el rol
  const getNavigation = () => {
    // 💡 CORRECCIÓN: Si no hay usuario (Invitado), mostramos el menú de estudiante por defecto
    if (!currentUser) {
      return navStudent;
    }

    if (currentUser.role === 'student') {
      return getStudentNav(currentUser);
    } else if (currentUser.role === 'teacher') {
      return navTeacher;
    }
    return navStudent;
  };

  return (
    <div className="venezuelan-layout">
      {/* 💡 Opcional: Podrías ocultar el Sidebar si no hay usuario, pero dejémoslo para que se vea pro */}
      <AppSidebar nav={getNavigation()} />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader logout={logout} role={currentUser ? currentUser.role : 'guest'} />
        <div className="body flex-grow-1">
          <Suspense fallback={loading}>
            <AppContent />
          </Suspense>
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default DefaultLayout;