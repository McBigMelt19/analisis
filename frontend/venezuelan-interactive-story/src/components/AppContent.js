import React from 'react';

const AppContent = () => {
  return (
    <div className="app-content">
      <h1 className="text-center" style={{ color: '#FFD700', fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>
        ¡Bienvenidos a la Historia Interactiva de Venezuela!
      </h1>
      <p style={{ color: '#FF4500', fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>
        Aquí podrás explorar y aprender sobre la rica cultura, historia y tradiciones de Venezuela a través de una narrativa divertida y educativa.
      </p>
      <div className="interactive-elements">
        {/* Aquí se pueden agregar componentes interactivos como botones, imágenes, etc. */}
      </div>
    </div>
  );
};

export default AppContent;