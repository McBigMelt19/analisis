import React, { useState, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import OptionButtons from './OptionButtons';
import InputArea from './InputArea';
import { GRADO_3_DATA } from './datagrado'; // Tu data de grado

import './Chatbot.css'; // Vamos a crear este archivo CSS para los estilos generales

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null); 
  const [currentStep, setCurrentStep] = useState('start'); 
  const [learningStyle, setLearningStyle] = useState(null);

  // Opciones
  const moduleOptions = [
    { value: 'independencia', label: '1. Héroes de la Independencia' },
    { value: 'cultura', label: '2. Costumbres y Tradiciones' },
    { value: 'geografia', label: '3. Regiones de Venezuela' },
  ];
  
  const learningStyleOptions = [
    { value: 'kinestesico', label: 'Haciendo (Kinestésico)' },
    { value: 'auditivo', label: 'Escuchando (Auditivo)' },
    { value: 'visual', label: 'Viendo (Visual)' },
  ];
  
  const repeatOptions = [
    { value: 'restart', label: 'Volver a Módulos' },
    { value: 'end', label: 'No, gracias' }
  ];

  // Función de ayuda para enviar mensajes del bot
  const handleBotMessage = (messageContent, isOption = false, imageUrl = null) => {
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: messageContent, sender: 'bot', isOption: isOption, imageUrl: imageUrl },
      ]);
    }, 500);
  };
  
  // Simula el flujo del chatbot INICIAL
  useEffect(() => {
    // Solo se ejecuta una vez al inicio
    if (currentStep === 'start') {
      handleBotMessage(
        `¡Hola! Bienvenido al módulo de Historia de Venezuela para 3er Grado.`
      );
      // Avanzamos el paso para mostrar las opciones de módulo
      setCurrentStep('select_module'); 
      
    } else if (currentStep === 'select_module' && messages.length === 1) { 
        // Solo preguntar si las opciones no se han mostrado todavía (solo está el mensaje inicial)
        handleBotMessage("¿Qué módulo quieres explorar hoy?", true); // Muestra botones
    }
  }, [currentStep, messages.length]);


  // Simula el flujo después de una selección o resultado
  useEffect(() => {
    if (currentStep === 'display_result' && learningStyle && selectedModule) {
      const moduleInfo = GRADO_3_DATA[selectedModule];
      const content = moduleInfo.knowledgeBase[learningStyle];
      
      let finalMessage = `**Módulo seleccionado:** ${moduleInfo.tema}\n\n`;
      finalMessage += `**Estilo (${learningStyle.toUpperCase()}):**\n${content.message}`;
      
      let imageContent = null;
      
      // LÓGICA PARA INSERTAR IMAGEN (Visual)
      if (learningStyle === 'visual' && moduleInfo.image) {
          imageContent = moduleInfo.image; 
          finalMessage += `\n\n[Mire la imagen/infografía relacionada arriba]`;
      }

      if (content.link) {
        finalMessage += `\n\n🔗 Enlace de Recurso: [Abrir Aquí](${content.link})`;
      }
      
      handleBotMessage(finalMessage, false, imageContent); 
      setCurrentStep('repeat_query'); // Ir a preguntar si quiere otro estilo

    } else if (currentStep === 'repeat_query' && messages.length > 0 && messages[messages.length - 1].text.indexOf("otro estilo quieres probar") === -1) {
        // La condición de repetición aquí es menos estricta
        handleBotMessage("¿Qué otro estilo quieres probar o tienes otra pregunta?", true);

    } else if (currentStep === 'end' && messages.length > 0 && messages[messages.length - 1].text !== "¡Sigue explorando nuestra historia!") {
        handleBotMessage("¡Sigue explorando nuestra historia!");
    }
  }, [currentStep, learningStyle, selectedModule, messages]);

  // Handler General para opciones (MODIFICADO)
  const handleSelectOption = (value) => {
    // 1. Mostrar la respuesta del usuario
    setMessages((prevMessages) => [...prevMessages, { text: `Seleccionado: ${value}`, sender: 'user' }]);

    if (currentStep === 'select_module') {
        const moduleInfo = GRADO_3_DATA[value];
        
        // 2. Actualizar el estado del módulo seleccionado
        setSelectedModule(value);
        
        // 3. 🚨 ENVIAR EL SIGUIENTE MENSAJE DEL BOT INMEDIATAMENTE 🚨
        handleBotMessage(`Has seleccionado el tema **${moduleInfo.tema}**. Ahora, ¿cómo te gustaría aprender este tema?`, true);

        // 4. Mover al siguiente paso
        setCurrentStep('select_style'); 
        setLearningStyle(null); 

    } else if (currentStep === 'select_style') {
        // Si ya estamos en selección de estilo, solo actualizamos el estilo y mostramos el resultado
        setLearningStyle(value);
        setCurrentStep('display_result'); 
    }
  };

  const handleRepeatOption = (action) => {
      setMessages((prevMessages) => [...prevMessages, { text: action === 'restart' ? "Volver a Módulos" : "No, gracias", sender: 'user' }]);
      if (action === 'restart') {
          // Si reinicia, volvemos al inicio para elegir MÓDULO (opciones)
          setSelectedModule(null);
          setLearningStyle(null); 
          // 🚨 Enviar mensaje de nuevo módulo al reiniciar
          handleBotMessage("¡Excelente! ¿Qué módulo quieres explorar ahora?", true);
          setCurrentStep('select_module'); 
      } else {
          setCurrentStep('end');
      }
  };


  return (
    <div className="chatbot-container">
      <div className="messages-display">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
      </div>
      <div className="input-area-container">
        
        {/* Muestra las opciones de módulo */}
        {currentStep === 'select_module' && (
          <OptionButtons options={moduleOptions} onSelect={handleSelectOption} />
        )}

        {/* Muestra las opciones de estilo */}
        {currentStep === 'select_style' && (
          <OptionButtons options={learningStyleOptions} onSelect={handleSelectOption} />
        )}
        
        {/* Muestra las opciones de repetir/finalizar */}
        {currentStep === 'repeat_query' && (
            <OptionButtons options={repeatOptions} onSelect={handleRepeatOption} />
        )}
        
      </div>
    </div>
  );
};

export default Chatbot;