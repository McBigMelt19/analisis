import React from 'react';

const ReutilizableComponent = ({ children }) => {
  return (
    <div className="reutilizable-component" style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#FFD700', color: '#000' }}>
      {children}
    </div>
  );
};

export default ReutilizableComponent;