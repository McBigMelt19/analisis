import React, { useEffect, useState, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRole, logout } from '../config/auth';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'; 
import navStudent from '../_nav_student'; 
import navTeacher from '../_nav_teacher'; 

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const DefaultLayout = () => {
  const [role, setRole] = useState(() => getUserRole());
  const [navigation, setNavigation] = useState([]);

  useEffect(() => {
    if (role === 'student') {
      setNavigation(navStudent);
    } else if (role === 'teacher') {
      setNavigation(navTeacher);
    } else {
      setNavigation([]);
    }
  }, [role]);

  if (role === null) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    // aplicamos una clase global para tema y patrón pergamino
    <div className="venezuelan-layout"> 
      <AppSidebar nav={navigation} /> 
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader logout={logout} role={role} /> 
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