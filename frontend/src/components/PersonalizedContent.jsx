import React, { useState, useRef, useEffect } from 'react';
import { 
    CCard, 
    CCardHeader, 
    CCardBody, 
    CForm, 
    CFormTextarea, 
    CButton, 
    CInputGroup 
} from '@coreui/react';
// Importamos CIcon (aunque solo usaremos marcadores de texto en su lugar)
import CIcon from '@coreui/icons-react'; 

/**
 * Componente de Contenido con interfaz de chatbot GENÉRICO.
 */
const PersonalizedContent = () => {
    
    // --- DATOS GENÉRICOS ---
    const currentUnit = 'Asistencia Histórica Interactiva'; 

    // Mensaje de bienvenida general
    const initialMessageContent = 
        `¡Hola! Soy tu Asistente de Historia de Venezuela. Estoy listo para ayudarte a explorar la historia, los héroes, las batallas y la cultura de la nación.

        **Escribe tu pregunta o el tema que deseas explorar (ej: "Batalla de Carabobo", "Cultura Indígena", "Simón Bolívar").**`;

    const initialMessages = [{ id: 1, role: 'assistant', content: initialMessageContent }];
    
    // --- ESTADOS Y REFS ---
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null); 

    // Efecto para hacer scroll al final
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- FUNCIÓN DE ENVÍO Y RESPUESTA SIMULADA ---
    const handleSendMessage = (e) => {
        e.preventDefault();
        const userMessage = input.trim();
        if (!userMessage) return;

        const newUserMessage = { id: Date.now(), role: 'user', content: userMessage };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        
        // ******************************************************************
        // 💡 RESPUESTA SIMULADA DE CONTENIDO EDUCATIVO
        // ******************************************************************
        const simulatedContent = 
            `¡Qué excelente pregunta sobre "${userMessage}"!

            **La Gran Colombia** fue una república formada en 1819 por el Congreso de Angostura, uniendo las actuales naciones de Venezuela, Colombia, Ecuador y Panamá. Liderada por Simón Bolívar, su objetivo era establecer una nación fuerte y unida capaz de enfrentar la hegemonía española y garantizar la independencia de la región. Sin embargo, debido a diferencias regionales y políticas, se disolvió en 1831.

            (Aquí es donde integrarías la llamada a tu API/Genkit para obtener esta respuesta real.)`;

        const assistantResponse = {
            id: Date.now() + 1,
            role: 'assistant',
            content: simulatedContent,
        };

        // Simular tiempo de carga del asistente
        setTimeout(() => {
            setMessages(prev => [...prev, assistantResponse]);
        }, 1200);
    };

    // --- ESTILOS (Mantenemos los colores terrosos) ---
    const assistantBgColor = '#CC9966'; // Ocre
    const userBgColor = '#D5E5F0'; // Azul claro
    const headerBgColor = '#5D4037'; // Marrón oscuro
    
    return (
        <CCard className="h-100 shadow-lg border-0">
            <CCardHeader style={{ backgroundColor: headerBgColor }} className="text-white">
                <h5 className="mb-0">Asistente de Historia: {currentUnit}</h5>
            </CCardHeader>
            
            <CCardBody className="d-flex flex-column p-0">
                
                {/* 1. Área de Conversación con Scroll */}
                <div 
                    className="flex-grow-1 overflow-y-auto p-4" 
                    style={{ maxHeight: 'calc(100vh - 300px)', backgroundColor: '#F9F7F3' }} 
                >
                    {messages.map((message) => (
                        <div 
                            key={message.id} 
                            className={`d-flex mb-3 ${message.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                            <div className={`d-flex align-items-end ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                
                                {/* Icono del Emisor (Texto 'T' o 'IA') */}
                                <div className={`rounded-circle p-2 mx-2 text-white d-flex align-items-center justify-content-center`} 
                                    style={{ 
                                        backgroundColor: message.role === 'user' ? '#8D6E63' : assistantBgColor,
                                        width: '32px', height: '32px'
                                    }}>
                                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                        {message.role === 'user' ? 'T' : 'IA'}
                                    </span>
                                </div>
                                
                                {/* Contenido del Mensaje */}
                                <div 
                                    className={`p-3 rounded-3 shadow-sm`}
                                    style={{ 
                                        maxWidth: '75%', 
                                        backgroundColor: message.role === 'user' ? userBgColor : assistantBgColor + 'EE',
                                        color: message.role === 'user' ? '#333' : '#FFF',
                                    }}
                                >
                                    {/* Usamos el tag <p> pero con estilo para respetar saltos de línea */}
                                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} /> 
                </div>

                {/* 2. Caja de Chat (Input y Botón) */}
                <CForm onSubmit={handleSendMessage} className="mt-auto border-top p-3 bg-white">
                    <CInputGroup>
                        <CFormTextarea
                            placeholder="Escribe aquí tu pregunta de historia..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e); 
                                }
                            }}
                            rows={1}
                            style={{ minHeight: '40px', resize: 'none' }}
                        />
                        <CButton 
                            type="submit" 
                            color="dark" 
                            disabled={!input.trim()}
                            className="py-0 px-3"
                        >
                            <span style={{ fontSize: '18px' }}>➜</span> 
                        </CButton>
                    </CInputGroup>
                </CForm>
            </CCardBody>
        </CCard>
    );
};

export default PersonalizedContent;