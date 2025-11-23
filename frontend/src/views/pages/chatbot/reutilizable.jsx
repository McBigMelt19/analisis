// reutilizable.jsx
import React from 'react';
import ChatBot from 'react-chatbotify';

// El chatbot recibe una prop llamada 'moduleData'
const Reutilizable = ({ moduleData }) => {

  // =========================================================================
  // 🚨 MEDIDA DE SEGURIDAD TEMPORAL (GUARD CLAUSE) 🚨
  // Si moduleData es undefined o le falta la propiedad 'grado', retorna un error.
  if (!moduleData || typeof moduleData.grado === 'undefined') {
    return (
        <div style={{ 
            padding: '20px', 
            border: '2px solid red', 
            backgroundColor: '#ffdddd',
            color: '#cc0000',
            fontFamily: 'Arial, sans-serif'
        }}>
            ⚠️ <strong>ERROR DE CONFIGURACIÓN DEL CHATBOT</strong>
            <p><strong>Causa:</strong> Faltan datos esenciales (prop `moduleData`).</p>
            <p><strong>Acción:</strong> Asegúrate de que en la página (`chatbot.jsx`), estés pasando la data correcta:</p>
        </div>
    );
  }
  // =========================================================================

  // Función auxiliar que construye el mensaje final según el estilo
  const makeMessage = (styleKey) => {
    const content = moduleData.knowledgeBase[styleKey];
    if (!content) return { message: "Contenido no disponible para este estilo." };

    let finalMessage = `Tema (${moduleData.grado}° Grado): ${moduleData.tema}\n\n`;
    finalMessage += `Estilo (${styleKey.toUpperCase()}):\n${content.message}`;

    if (content.link) {
      finalMessage += `\n\n🔗 Enlace de Recurso: ${content.link}`;
    }

    return { message: finalMessage };
  };

  const flow = {
    start: {
      message: `¡Hola! Estás en la sección de ${moduleData.grado}° Grado sobre ${moduleData.tema}.`,
      transition: { duration: 1000 },
      path: "select_style" 
    },
    
    select_style: {
      message: "¿Cómo te gustaría aprender hoy?",
    options: [
  { id: 'kin', value: "Haciendo (Kinestésico)", path: "display_result", handler: () => setLearningStyle('kinestesico') },
  { id: 'aud', value: "Escuchando (Auditivo)", path: "display_result", handler: () => setLearningStyle('auditivo') },
  { id: 'vis', value: "Viendo (Visual)", path: "display_result", handler: () => setLearningStyle('visual') },
],
    },
    
    // Nodos de resultado concretos (evitan depender de setState asincrónico)
    display_kinestesico: {
      handler: () => makeMessage('kinestesico'),
      path: "repeat_query"
    },
    display_auditivo: {
      handler: () => makeMessage('auditivo'),
      path: "repeat_query"
    },
    display_visual: {
      handler: () => makeMessage('visual'),
      path: "repeat_query"
    },

    repeat_query: {
        message: "¿Qué otro estilo quieres probar o tienes otra pregunta?",
        options: [
            { value: "Volver a Estilos", path: "select_style" },
            { value: "No, gracias", path: "end" }
        ]
    },
    end: { message: "¡Sigue explorando nuestra historia!" },
  };
  
  return <ChatBot flow={flow} />;
};

export default Reutilizable;