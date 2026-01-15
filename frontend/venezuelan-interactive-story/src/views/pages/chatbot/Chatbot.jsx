import React from 'react';
import './Chatbot.css'; // Importa los estilos específicos para el chatbot
import InputArea from './InputArea';
import MessageBubble from './MessageBubble';
import OptionButtons from './OptionButtons';

const Chatbot = () => {
  const [messages, setMessages] = React.useState([]);

  const handleSendMessage = (message) => {
    setMessages([...messages, { text: message, sender: 'user' }]);
    // Aquí puedes agregar la lógica para manejar la respuesta del chatbot
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <MessageBubble key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <InputArea onSendMessage={handleSendMessage} />
      <OptionButtons />
    </div>
  );
};

export default Chatbot;