import React from 'react';
import { CAlert } from '@coreui/react';

const Alertas = ({ message, type }) => {
  return (
    <CAlert color={type} className="text-center" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>
      {message}
    </CAlert>
  );
};

export default Alertas;