import React from 'react';
import { CIcon } from '@coreui/icons-react';
import { cilStar, cilHeart, cilSmile } from '@coreui/icons';

const DocsIcons = () => {
  return (
    <div className="docs-icons">
      <h2>Íconos Disponibles</h2>
      <div className="icon-list">
        <div className="icon-item">
          <CIcon icon={cilStar} customClassName="nav-icon" />
          <span>Estrella</span>
        </div>
        <div className="icon-item">
          <CIcon icon={cilHeart} customClassName="nav-icon" />
          <span>Corazón</span>
        </div>
        <div className="icon-item">
          <CIcon icon={cilSmile} customClassName="nav-icon" />
          <span>Sonrisa</span>
        </div>
      </div>
    </div>
  );
};

export default DocsIcons;