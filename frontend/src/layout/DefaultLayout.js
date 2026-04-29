import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import { getNavigation } from '../_nav';

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

  // Redirigir a login si no está autenticado
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    // aplicamos una clase global para tema y patrón pergamino
    <div className="venezuelan-layout">
      <AppSidebar nav={getNavigation(currentUser)} />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader logout={logout} role={currentUser.role} />
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