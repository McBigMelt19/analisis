import React from 'react';
import './MessageBubble.css'; // Crearemos este CSS

const MessageBubble = ({ message }) => {
  const { text, sender } = message;
  const isUser = sender === 'user';
  const bubbleClass = isUser ? 'user-bubble' : 'bot-bubble';

  // Función para renderizar el texto con formato Markdown básico
  const renderText = (messageText) => {
    // Reemplaza **texto** con <strong>texto</strong>
    let formattedText = messageText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Reemplaza \n\n con saltos de línea
    formattedText = formattedText.replace(/\n\n/g, '<br/><br/>');
    
    // Para el enlace, asumimos que siempre es al final y con el formato `[Abrir Aquí](link)`
    const linkRegex = /\[(.*?)\]\((.*?)\)/;
    const match = formattedText.match(linkRegex);

    if (match) {
        const linkText = match[1];
        const url = match[2];
        const linkElement = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
        formattedText = formattedText.replace(linkRegex, linkElement);
    }

    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  return (
    <div className={`message-bubble-wrapper ${isUser ? 'user-wrapper' : 'bot-wrapper'}`}>
      <div className={`message-bubble ${bubbleClass}`}>
        {renderText(text)}
        <span className="message-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        {isUser && <span className="message-status">✓</span>} {/* Indicador de enviado */}
      </div>
    </div>
  );
};

export default MessageBubble;