import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CCard, CCardHeader, CCardBody, CForm, CFormTextarea, CButton, CInputGroup, CBadge } from '@coreui/react';
import { useAuth } from '../context/AuthContext';

const COLORS = {
    ASSISTANT_BG: '#FFF3E0',
    USER_BG: '#E3F2FD',
    HEADER_BG: '#5D4037',
    CHAT_BG: '#FFFFFF',
    LOGIC_TEXT: '#666',
};

// CONFIGURACIÓN DE GROQ
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant"; // Modelo rápido y actual

const PersonalizedContent = () => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [allowedTopics, setAllowedTopics] = useState(null);
    const chatEndRef = useRef(null);

    // 💡 SOLUCIÓN AL BUCLE INFINITO: Usamos useMemo
    // Esto asegura que el objeto 'effectiveUser' sea EL MISMO en memoria
    // a menos que cambie algo real. Así el useEffect no se vuelve loco.
    const effectiveUser = useMemo(() => {
        return currentUser || {
            name: "Explorador",
            role: "student",
            grade_id: 4,
            learning_style: "Visual"
        };
    }, [currentUser]); // Solo se recalcula si currentUser cambia

    // SYSTEM PROMPT
    const getSystemPrompt = () => {
        if (!allowedTopics) return "";

        return `Eres un profesor de Historia de Venezuela experto.
TU OBJETIVO: Enseñar a un niño de ${allowedTopics.grade_name} (${allowedTopics.edad_objetivo}).

IMPORTANTE: DEBES RESPONDER SIEMPRE EN FORMATO JSON ESTRICTO.
Estructura:
{
  "respuesta_nino": "Respuesta adaptada, amigable y con emojis.",
  "explicacion_logica": "Fuente histórica y justificación breve."
}

TEMA: ${allowedTopics.temas.join(', ')}.
ESTILO: ${effectiveUser.learning_style}.`;
    };

    // 💡 CARGA DE DATOS INTELIGENTE
    useEffect(() => {
        const loadTopics = async () => {
            // DATOS DE RESPALDO (Fijos)
            const fallbackData = {
                grade_name: "4to Grado",
                edad_objetivo: "9-10 años",
                temas: ["Simón Bolívar", "Independencia", "Símbolos Patrios"],
                restricciones_ia: "No violencia explícita."
            };

            // Detectamos si estamos en localhost o en Netlify
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

            // Si estamos en Netlify (Producción), USAMOS EL RESPALDO DIRECTAMENTE
            // Esto evita el error rojo de conexión en la consola.
            if (!isLocalhost) {
                console.log("🚀 Modo Producción: Usando datos internos.");
                setAllowedTopics(fallbackData);
                return;
            }

            // Solo intentamos fetch si estamos en local
            try {
                const response = await fetch(`http://localhost:3001/topics?grade_id=${effectiveUser.grade_id}`);
                if (!response.ok) throw new Error("No server");
                const data = await response.json();
                if (data.length > 0) {
                    setAllowedTopics(data[0]);
                } else {
                    setAllowedTopics(fallbackData);
                }
            } catch (error) {
                console.warn("⚠️ Usando datos de respaldo (Localhost sin JSON Server)");
                setAllowedTopics(fallbackData);
            }
        };

        loadTopics();
    }, [effectiveUser]); // ✅ Ahora effectiveUser es estable gracias a useMemo

    // Mensaje inicial
    useEffect(() => {
        if (!allowedTopics) return;
        // Solo enviamos el mensaje inicial si la lista de mensajes está vacía
        setMessages(prev => {
            if (prev.length > 0) return prev;
            return [{
                id: 1,
                role: 'assistant',
                content: `¡Hola ${effectiveUser.name}! 🇻🇪 Soy tu profe de Historia.\nPodemos hablar de: ${allowedTopics.temas.slice(0, 3).join(', ')}.`,
                logic: "Sistema inicializado correctamente."
            }];
        });
    }, [allowedTopics, effectiveUser.name]);

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
            const historyForAI = messages.map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            }));

            const response = await fetch(GROQ_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: GROQ_MODEL,
                    messages: [
                        { role: "system", content: getSystemPrompt() },
                        ...historyForAI,
                        { role: "user", content: userMessage }
                    ],
                    temperature: 0.5,
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || "Error Groq");
            }

            const data = await response.json();
            const aiRawContent = data.choices[0].message.content;

            let parsedContent, logicContent;
            try {
                const jsonResponse = JSON.parse(aiRawContent);
                parsedContent = jsonResponse.respuesta_nino;
                logicContent = jsonResponse.explicacion_logica;
            } catch (e) {
                parsedContent = aiRawContent;
                logicContent = "No se pudo generar la traza lógica.";
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: parsedContent,
                logic: logicContent
            }]);

        } catch (error) {
            console.error("Error Groq:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: "⚠️ Error de conexión. Revisa tu internet.",
                logic: error.message
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!allowedTopics) return <div className="p-4 text-center">Cargando historia... ⏳</div>;

    return (
        <CCard className="h-100 shadow-lg border-0">
            <CCardHeader style={{ backgroundColor: COLORS.HEADER_BG }} className="text-white">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-0">🇻🇪 Historia Bot</h5>
                        <small style={{ opacity: 0.8 }}>Modo: {effectiveUser.learning_style}</small>
                    </div>
                    <CBadge color="warning" shape="rounded-pill">IA Activa ⚡</CBadge>
                </div>
            </CCardHeader>

            {/* AQUÍ ESTÁ EL TAMAÑO AGRANDADO DEL CHAT */}
            <CCardBody className="d-flex flex-column p-0 bg-light">
                <div className="flex-grow-1 overflow-y-auto p-3"
                    style={{ height: '80vh', minHeight: '500px', backgroundColor: COLORS.CHAT_BG }}>

                    {messages.map((msg) => (
                        <div key={msg.id} className={`d-flex flex-column mb-3 ${msg.role === 'user' ? 'align-items-end' : 'align-items-start'}`}>
                            <div className="p-3 rounded-3 shadow-sm"
                                style={{
                                    maxWidth: '85%',
                                    backgroundColor: msg.role === 'user' ? COLORS.USER_BG : COLORS.ASSISTANT_BG,
                                    borderBottomRightRadius: msg.role === 'user' ? '0' : '1rem',
                                    borderBottomLeftRadius: msg.role === 'assistant' ? '0' : '1rem',
                                }}>
                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                            </div>

                            {msg.role === 'assistant' && msg.logic && (
                                <div className="mt-1 ms-1" style={{ maxWidth: '85%' }}>
                                    <details style={{ fontSize: '0.75rem', color: COLORS.LOGIC_TEXT, cursor: 'pointer' }}>
                                        <summary>🔍 Ver lógica (Profesor)</summary>
                                        <div className="p-2 mt-1 border rounded bg-white">
                                            <em>Fuente:</em> {msg.logic}
                                        </div>
                                    </details>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && <div className="text-muted ms-3">⏳ Escribiendo...</div>}
                    <div ref={chatEndRef} />
                </div>

                <CForm onSubmit={handleSendMessage} className="p-3 bg-white border-top">
                    <CInputGroup>
                        <CFormTextarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                            placeholder="Haz una pregunta..."
                            rows={1}
                            style={{ resize: 'none' }}
                        />
                        <CButton type="submit" color="primary" disabled={isLoading || !input.trim()}>Enviar 🚀</CButton>
                    </CInputGroup>
                </CForm>
            </CCardBody>
        </CCard>
    );
};

export default PersonalizedContent;