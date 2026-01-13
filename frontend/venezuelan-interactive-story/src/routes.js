import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import Dashboard from './views/dashboard/Dashboard';
import TeacherDashboard from './views/pages/teacher/TeacherDashboard';
import HomePage from './views/pages/home/HomePageCoreUI';
import Login from './views/pages/login/Login';
import Page404 from './views/pages/page404/Page404';
import Page500 from './views/pages/page500/Page500';
import Register from './views/pages/register/Register';
import Stock from './views/pages/stock/stock';
import Chatbot from './views/pages/chatbot/Chatbot';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="stock" element={<Stock />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/404" element={<Page404 />} />
      <Route path="/500" element={<Page500 />} />
    </Routes>
  );
};

export default AppRoutes;