import React, { useState, useRef, useEffect } from 'react';
import { CCard, CCardHeader, CCardBody, CForm, CFormTextarea, CButton, CInputGroup, CBadge } from '@coreui/react';
import { useAuth } from '../context/AuthContext';

const COLORS = {
    ASSISTANT_BG: '#795028ff',
    USER_BG: '#4eacebff',
    HEADER_BG: '#3f2b25ff',
    CHAT_BG: '#F9F7F3',
};

const PersonalizedContent = () => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [allowedTopics, setAllowedTopics] = useState(null);
    const chatEndRef = useRef(null);

    // 💡 Función para generar el System Prompt dinámicamente
    // 💡 Función para generar el System Prompt dinámicamente
    const getSystemPrompt = () => {
        // Validación de seguridad
        if (!currentUser || !allowedTopics) return "";


        // 1. Definimos las instrucciones según el estilo (dentro de la función para tener acceso a currentUser)
        const getLearningStyleInstructions = () => {
            switch (currentUser.learning_style) {
                case 'Visual':
                    return `- Usa descripciones visuales ricas (colores, formas, imágenes).
- Sugiere dibujos, mapas mentales o diagramas.
- Usa emojis para ilustrar conceptos (🎨, 🗺️, 👁️).`;
                case 'Auditivo':
                    return `- Usa narraciones tipo cuento con diálogos.
- Sugiere canciones, rimas o poemas.
- Usa onomatopeyas ("¡Pum!", "¡Zas!").`;
                case 'Kinestésico':
                    return `- Sugiere actividades prácticas (manualidades, dramatizaciones).
- Usa verbos de acción ("construye", "camina", "siente").`;
                default:
                    return '- Adapta tu respuesta de forma clara y didáctica.';
            }
        };


        // Inyección de hechos (Machete)
        const facts = allowedTopics.datos_obligatorios
            ? `DATOS VERDADEROS:\n${allowedTopics.datos_obligatorios}`
            : "";

        // 🔥 TÉCNICA FEW-SHOT (EJEMPLOS): Esto enseña al modelo qué hacer
        return `Eres un profesor de Historia de Venezuela para niños de primaria.
TU REGLA DE ORO: Si te preguntan sobre Fútbol, Mundiales, México, Juegos o cualquier tema que NO sea Venezuela, DEBES NEGARTE A RESPONDER.

EJEMPLOS DE CÓMO DEBES RESPONDER (IMÍTALOS):

Usuario: ¿Quién ganó el mundial México 70?
Asistente: 🚫 Lo siento, yo solo sé de Historia de Venezuela.

Usuario: ¿Cómo se juega Minecraft?
Asistente: 🚫 Aquí solo hablamos de nuestros próceres venezolanos.

Usuario: ¿Cuánto es 5 + 5?
Asistente: 🚫 Soy profe de historia, no de matemáticas.

Usuario: Háblame de Simón Bolívar.
Asistente: ¡Claro! 🇻🇪 Simón Bolívar es el Libertador de Venezuela. Nació en Caracas y luchó por nuestra libertad.

--- FIN DE EJEMPLOS ---

AHORA, ACTÚA TÚ:
Estilo de enseñanza: ${currentUser.learning_style}
Tema permitido: ${allowedTopics.temas.join(', ')}
${facts}

¡Responde corto y amable!`;
    };
    // Cargar temas permitidos según el grado del estudiante
    useEffect(() => {
        const fetchTopics = async () => {
            if (!currentUser || currentUser.role !== 'student') {
                return;
            }

            try {
                const headers = { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}` 
                }
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/temas?id_grado=${currentUser.grade_id}`, { headers });
                const data = await response.json();
                if (data.temas && data.temas.length > 0) {
                    setAllowedTopics({
                        grade_name: `Grado ${currentUser.grade_id}`,
                        temas: data.temas.map(t => t.nombre_tema),
                        id_tema_actual: data.temas[0].id_tema
                    });
                }
            } catch (error) {
                console.error('Error cargando temas:', error);
            }
        };

        fetchTopics();
    }, [currentUser]);

    // Inicializar mensaje de bienvenida cuando tengamos los datos
    useEffect(() => {
        if (!currentUser || !allowedTopics) {
            return;
        }

        const initialMessage = {
            id: 1,
            role: 'assistant',
            content: `¡Hola ${currentUser.name.split(' ')[0]}! 🇻🇪 Soy tu Asistente de Historia de Venezuela.

Veo que estás en ${allowedTopics.grade_name} y tu estilo de aprendizaje es **${currentUser.learning_style}**. ${currentUser.learning_style === 'Visual' ? '¡Me encanta usar imágenes y colores! 🎨' :
                    currentUser.learning_style === 'Auditivo' ? '¡Me encanta contar historias! 📖' :
                        '¡Me encanta hacer actividades prácticas! 🎭'
                }

Puedo ayudarte con estos temas:
${allowedTopics.temas.slice(0, 5).map((t, i) => `${i + 1}. ${t}`).join('\n')}
${allowedTopics.temas.length > 5 ? `...y ${allowedTopics.temas.length - 5} temas más!` : ''}

¿Qué te gustaría aprender hoy? 😊`
        };

        setMessages([initialMessage]);
    }, [currentUser, allowedTopics]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const userMessage = input.trim();
        if (!userMessage || isLoading) return;

        // 1. Agregamos el mensaje del usuario y un placeholder para el bot
        const newUserMessage = { id: Date.now(), role: 'user', content: userMessage };
        setMessages(prev => [
            ...prev,
            newUserMessage,
            { id: Date.now() + 1, role: 'assistant', content: "" } // Mensaje vacío que se llenará
        ]);
        setInput('');
        setIsLoading(true);

        try {
            const headers = { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}` 
            }
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chatbot/chat`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    mensaje: userMessage,
                    id_tema: allowedTopics.id_tema_actual || null,
                    modo: 'tutor'
                })
            });

            if (!response.ok) {
                throw new Error("Error en la petición");
            }

            const data = await response.json();
            const botReply = data.respuesta;

            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsgIndex = newMessages.length - 1;
                newMessages[lastMsgIndex] = {
                    ...newMessages[lastMsgIndex],
                    content: botReply
                };
                return newMessages;
            });
            setIsLoading(false);

        } catch (error) {
            console.error("Error con Ollama:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 2,
                role: 'assistant',
                content: "⚠️ Error de conexión."
            }]);
            setIsLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="alert alert-info m-4">
                Por favor, inicia sesión para usar el chatbot.
            </div>
        );
    }

    if (!allowedTopics) {
        return (
            <div className="alert alert-warning m-4">
                Cargando temas permitidos...
                <br />
                <small>Asegúrate de que el servidor backend esté configurado y corriendo correctamente.</small>
            </div>
        );
    }

    return (
        <CCard className="h-100 shadow-lg border-0">
            <CCardHeader style={{ backgroundColor: COLORS.HEADER_BG }} className="text-white">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Asistente de Historia de Venezuela 🤖</h5>
                    <div>
                        <CBadge color="light" className="me-2">{allowedTopics.grade_name}</CBadge>
                        <CBadge color="info">{currentUser.learning_style}</CBadge>
                    </div>
                </div>
            </CCardHeader>

            <CCardBody className="d-flex flex-column p-0">
                <div className="flex-grow-1 overflow-y-auto p-4" style={{ maxHeight: '600px', minHeight: '400px', backgroundColor: COLORS.CHAT_BG }}>
                    {messages.map((message) => (
                        <div key={message.id} className={`d-flex mb-3 ${message.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className="p-3 rounded-3 shadow-sm"
                                style={{
                                    maxWidth: '80%',
                                    backgroundColor: message.role === 'user' ? COLORS.USER_BG : COLORS.ASSISTANT_BG,
                                    color: message.role === 'user' ? '#333' : '#FFF',
                                }}>
                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="text-muted fst-italic ms-2">Escribiendo...</div>}
                    <div ref={chatEndRef} />
                </div>

                <CForm onSubmit={handleSendMessage} className="p-3 bg-white border-top">
                    <CInputGroup>
                        <CFormTextarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder={`Pregunta sobre ${allowedTopics.temas[0]}...`}
                            rows={1}
                            style={{ resize: 'none' }}
                        />
                        <CButton type="submit" color="dark" disabled={isLoading || !input.trim()}>Enviar</CButton>
                    </CInputGroup>
                </CForm>
            </CCardBody>
        </CCard>
    );
};

export default PersonalizedContent;