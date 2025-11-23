import React, { useState } from 'react';
import './InputArea.css'; // Crearemos este CSS

const InputArea = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-area-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe tu mensaje..."
        className="input-field"
      />
      <button type="submit" className="send-button">Enviar</button>
    </form>
  );
};

export default InputArea;