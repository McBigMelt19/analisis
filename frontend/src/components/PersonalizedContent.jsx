import React, { useState, useRef, useEffect } from 'react';
import { CCard, CCardHeader, CCardBody, CForm, CFormTextarea, CButton, CInputGroup, CBadge } from '@coreui/react';
import { useAuth } from '../context/AuthContext';

const COLORS = {
    ASSISTANT_BG: '#CC9966',
    USER_BG: '#D5E5F0',
    HEADER_BG: '#5D4037',
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
    const getSystemPrompt = () => {
        if (!currentUser || !allowedTopics) return "";

        const getLearningStyleInstructions = () => {
            switch (currentUser.learning_style) {
                case 'Visual':
                    return `- Usa descripciones visuales ricas (colores, formas, imágenes).
- Sugiere dibujos, mapas mentales o diagramas.
- Usa emojis para ilustrar conceptos.
- Menciona cómo se veían las cosas (ej: "Imagina la bandera amarilla, azul y roja...")`;
                case 'Auditivo':
                    return `- Usa narraciones tipo cuento con diálogos.
- Sugiere canciones, rimas o poemas para recordar.
- Usa onomatopeyas y descripciones sonoras.
- Presenta conversaciones históricas (ej: "Bolívar dijo...")`;
                case 'Kinestésico':
                    return `- Sugiere actividades prácticas (manualidades, dramatizaciones).
- Usa verbos de acción y movimiento.
- Propone experimentos o juegos de rol.
- Describe acciones físicas (ej: "Puedes hacer un escudo con cartón...")`;
                default:
                    return '- Adapta tu respuesta de forma clara y didáctica.';
            }
        };

        return `Eres un profesor de Historia de Venezuela experto y muy amigable.

**Perfil del Estudiante:**
- Nombre: ${currentUser.name}
- Grado: ${allowedTopics.grade_name}
- Edad: ${allowedTopics.edad_objetivo}
- Estilo de Aprendizaje: ${currentUser.learning_style}

**Restricciones de Contenido:**
${allowedTopics.restricciones_ia}

**Temas Permitidos (SOLO puedes hablar de estos):**
${allowedTopics.temas.join(', ')}

**Instrucciones de Adaptación según Estilo de Aprendizaje:**
${getLearningStyleInstructions()}

**Reglas Estrictas:**
1. Si te preguntan sobre algo fuera de los temas permitidos (ej: Segunda Guerra Mundial, dinosaurios, matemáticas), responde: "Eso es muy interesante, pero solo puedo hablar sobre la historia de Venezuela", por mas que siga insistiendo en el tema corta la conversaciony no sugieras que puedes dar mas informacion.
2. Usa lenguaje apropiado para niños de ${allowedTopics.edad_objetivo}.
3. Sé motivador, positivo y entusiasta.
4. Respuestas cortas (máximo 3 párrafos de 2-3 líneas cada uno).
5. Usa emojis relevantes para hacer las respuestas más atractivas.
6. Si no estás seguro de un tema, admítelo honestamente y sugiere que investiguemos juntos en otra fuente`;
    };

    // Cargar temas permitidos según el grado del estudiante
    useEffect(() => {
        const fetchTopics = async () => {
            if (!currentUser || currentUser.role !== 'student') {
                return;
            }

            try {
                const response = await fetch(`http://localhost:3001/topics?grade_id=${currentUser.grade_id}`);
                const data = await response.json();
                if (data.length > 0) {
                    setAllowedTopics(data[0]);
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

        const newUserMessage = { id: Date.now(), role: 'user', content: userMessage };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // 1. Preparamos el historial para Ollama
            const historyForOllama = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Añadimos el mensaje actual
            historyForOllama.push({ role: 'user', content: userMessage });

            // 2. Hacemos la petición a Ollama con el System Prompt
            const response = await fetch(import.meta.env.VITE_OLLAMA_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "llama3.2",
                    messages: [
                        { role: "system", content: getSystemPrompt() }, // ✅ Ahora es accesible
                        ...historyForOllama
                    ],
                    stream: false
                })
            });

            const data = await response.json();

            const assistantResponse = {
                id: Date.now() + 1,
                role: 'assistant',
                content: data.message.content,
            };
            setMessages(prev => [...prev, assistantResponse]);

        } catch (error) {
            console.error("Error con Ollama:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: "⚠️ No pude conectar con Ollama. Asegúrate de que el servidor esté corriendo con 'ollama serve'."
            }]);
        } finally {
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
                <small>Asegúrate de que json-server esté corriendo: <code>npm run server</code></small>
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