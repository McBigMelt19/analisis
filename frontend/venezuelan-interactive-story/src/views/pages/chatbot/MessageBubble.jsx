import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message, isUser }) => {
  return (
    <div className={`message-bubble ${isUser ? 'user' : 'bot'}`}>
      <p>{message}</p>
    </div>
  );
};

export default MessageBubble;