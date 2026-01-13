import React from 'react';
import { CNavLink } from '@coreui/react';

const DocsLink = () => {
  return (
    <div>
      <h2>Documentación de Componentes</h2>
      <p>Explora la documentación de los componentes utilizados en esta aplicación.</p>
      <ul>
        <li>
          <CNavLink to="/docs/components">Componentes</CNavLink>
        </li>
        <li>
          <CNavLink to="/docs/icons">Íconos</CNavLink>
        </li>
        <li>
          <CNavLink to="/docs/examples">Ejemplos</CNavLink>
        </li>
      </ul>
    </div>
  );
};

export default DocsLink;