import React from 'react';
import Chatbot from './Chatbot';
import './Chatbot.css';

const ChatbotWrapper = () => {
  return (
    <div className="chatbot-wrapper" style={{ backgroundColor: '#FDE74C', padding: '20px', borderRadius: '10px' }}>
      <h2 style={{ color: '#A500B5', fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>¡Bienvenido al Chatbot Interactivo!</h2>
      <p style={{ color: '#D50000', fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>
        Aquí aprenderás sobre Venezuela de una manera divertida y emocionante.
      </p>
      <Chatbot />
    </div>
  );
};

export default ChatbotWrapper;