import React, { useState } from 'react';
import './InputArea.css';

const InputArea = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="input-area">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Escribe tu mensaje..."
        className="input-field"
      />
      <button onClick={handleSendMessage} className="send-button">
        Enviar
      </button>
    </div>
  );
};

export default InputArea;