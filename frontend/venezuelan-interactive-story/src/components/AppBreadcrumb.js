import React from 'react';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';
import { NavLink } from 'react-router-dom';

const AppBreadcrumb = () => {
  return (
    <CBreadcrumb className="border-0 mb-0">
      <CBreadcrumbItem>
        <NavLink to="/">Inicio</NavLink>
      </CBreadcrumbItem>
      <CBreadcrumbItem active>Historia Interactiva</CBreadcrumbItem>
    </CBreadcrumb>
  );
};

export default AppBreadcrumb;