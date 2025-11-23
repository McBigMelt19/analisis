import React from 'react';
import { CAlert } from '@coreui/react';

// Este componente solo se encarga de mostrar la alerta
const AlertMessage = ({ isVisible, color, message, onDismiss }) => {
    if (!isVisible) return null;

return (
    <CAlert
        color={color}
        visible={isVisible}
            onClose={onDismiss} // Permite cerrar manualmente
        className="mb-3"
    >
    {message}
    </CAlert>
);
};

export default AlertMessage;