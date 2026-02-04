import React, { useState, useRef, useEffect } from 'react';
import { CCard, CCardHeader, CCardBody, CForm, CFormTextarea, CButton, CInputGroup, CBadge, CCollapse, CCardFooter } from '@coreui/react';
import { useAuth } from '../context/AuthContext';

const COLORS = {
    ASSISTANT_BG: '#FFF3E0', // Un tono crema más suave
    USER_BG: '#E3F2FD',      // Azul muy suave
    HEADER_BG: '#5D4037',
    CHAT_BG: '#FFFFFF',
    LOGIC_TEXT: '#666',      // Color para la explicación lógica
};

// 💡 CONFIGURACIÓN DE GROQ
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama3-70b-8192"; // Modelo rápido y potente

const PersonalizedContent = () => {
    const { currentUser } = useAuth(); // Puede ser null si no hay login
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [allowedTopics, setAllowedTopics] = useState(null);
    const chatEndRef = useRef(null);

    // 💡 USUARIO POR DEFECTO (Para que funcione sin Login)
    const effectiveUser = currentUser || {
        name: "Explorador",
        role: "student",
        grade_id: 4, // Asumimos 4to grado por defecto
        learning_style: "Visual"
    };

    // 💡 SYSTEM PROMPT MEJORADO (EXPLICABILIDAD + ROBUSTEZ)
    const getSystemPrompt = () => {
        if (!allowedTopics) return "";

        return `Eres un profesor de Historia de Venezuela experto.
        
TU OBJETIVO: Enseñar a un niño de ${allowedTopics.grade_name} (${allowedTopics.edad_objetivo}).

IMPORTANTE: DEBES RESPONDER SIEMPRE EN FORMATO JSON ESTRICTO.
No saludes fuera del JSON. Tu respuesta debe tener esta estructura exacta:
{
  "respuesta_nino": "Aquí escribes la respuesta adaptada para el niño, usando emojis, clara y divertida.",
  "explicacion_logica": "Aquí escribes (para el profesor/auditor) qué fuentes históricas usaste, fechas exactas y por qué tu respuesta es verídica. Ej: 'Basado en datos de la Guerra Federal (1859-1863)...'"
}

TEMA ACTUAL: El usuario preguntará sobre: ${allowedTopics.temas.join(', ')}.
Si preguntan de otro tema, en "respuesta_nino" di amablemente que no sabes, y en "explicacion_logica" pon "Tema fuera de dominio".

ESTILO: ${effectiveUser.learning_style}.`;
    };

    // Cargar temas (Si falla el servidor local, usa datos de respaldo)
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                // Intentamos conectar a json-server
                const response = await fetch(`http://localhost:3001/topics?grade_id=${effectiveUser.grade_id}`);
                if (!response.ok) throw new Error("No server");
                const data = await response.json();
                if (data.length > 0) setAllowedTopics(data[0]);
            } catch (error) {
                console.warn("⚠️ Usando datos de respaldo (JSON Server no detectado o error)");
                // 💡 DATOS FALLBACK (Para que la app no muera si db.json falla)
                setAllowedTopics({
                    grade_name: "4to Grado",
                    edad_objetivo: "9-10 años",
                    temas: ["Simón Bolívar", "Independencia", "Símbolos Patrios"],
                    restricciones_ia: "No violencia explícita."
                });
            }
        };
        fetchTopics();
    }, [effectiveUser]);

    // Mensaje inicial
    useEffect(() => {
        if (!allowedTopics) return;
        setMessages([{
            id: 1,
            role: 'assistant',
            content: `¡Hola ${effectiveUser.name}! 🇻🇪 Soy tu profe de Historia.\nPodemos hablar de: ${allowedTopics.temas.slice(0, 3).join(', ')}.`,
            logic: "Sistema inicializado correctamente."
        }]);
    }, [allowedTopics]);

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
            // Historial limpio para Groq
            const historyForAI = messages.map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content // Enviamos solo el contenido, sin metadatos extra
            }));

            console.log("Enviando a Groq:", { historyForAI, userMessage }); // 👀 Para ver qué enviamos

            const response = await fetch(GROQ_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant", // ⚠️ CAMBIO: Usamos el modelo 8b que es más estable y rápido
                    messages: [
                        { role: "system", content: getSystemPrompt() },
                        ...historyForAI,
                        { role: "user", content: userMessage }
                    ],
                    temperature: 0.5,
                    // response_format: { type: "json_object" } <--- ⚠️ LO QUITAMOS para evitar el Error 400
                })
            });

            const data = await response.json();

            // 🛑 CAPTURAR EL ERROR REAL DE GROQ
            if (!response.ok) {
                console.error("❌ ERROR DETALLADO GROQ:", data);
                throw new Error(data.error?.message || "Error desconocido de Groq");
            }

            const aiRawContent = data.choices[0].message.content;

            // ... (el resto del código de parseo JSON sigue igual)
            let parsedContent, logicContent;
            try {
                const jsonResponse = JSON.parse(aiRawContent);
                parsedContent = jsonResponse.respuesta_nino;
                logicContent = jsonResponse.explicacion_logica;
            } catch (e) {
                // Si falla el JSON, intentamos limpiar un poco por si la IA puso texto antes del JSON
                console.warn("La IA no devolvió JSON puro, intentando recuperar...");
                parsedContent = aiRawContent;
                logicContent = "No se pudo generar la traza lógica estructurada.";
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: parsedContent,
                logic: logicContent
            }]);

        } catch (error) {
            console.error("🔥 Error Final:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: `⚠️ Error técnico: ${error.message}. Intenta de nuevo.`,
                logic: "Fallo de conexión"
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
                    {/* Botón "Secreto" para el profesor */}
                    <CBadge color="warning" shape="rounded-pill" title="Nivel de Confianza: Alto">
                        IA Activa ⚡
                    </CBadge>
                </div>
            </CCardHeader>

            <CCardBody className="d-flex flex-column p-0 bg-light">
                <div className="flex-grow-1 overflow-y-auto p-3" style={{ maxHeight: '65vh' }}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`d-flex flex-column mb-3 ${msg.role === 'user' ? 'align-items-end' : 'align-items-start'}`}>

                            {/* BURBUJA DE CHAT */}
                            <div className="p-3 rounded-3 shadow-sm"
                                style={{
                                    maxWidth: '85%',
                                    backgroundColor: msg.role === 'user' ? COLORS.USER_BG : COLORS.ASSISTANT_BG,
                                    borderBottomRightRadius: msg.role === 'user' ? '0' : '1rem',
                                    borderBottomLeftRadius: msg.role === 'assistant' ? '0' : '1rem',
                                }}>
                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                            </div>

                            {/* 💡 EXPLICABILIDAD (SOLO visible en mensajes del asistente) */}
                            {msg.role === 'assistant' && msg.logic && (
                                <div className="mt-1 ms-1" style={{ maxWidth: '85%' }}>
                                    <details style={{ fontSize: '0.75rem', color: COLORS.LOGIC_TEXT, cursor: 'pointer' }}>
                                        <summary>🔍 Ver razonamiento lógico (Para el Profesor)</summary>
                                        <div className="p-2 mt-1 border rounded bg-white">
                                            <em>Fuente/Lógica:</em> {msg.logic}
                                        </div>
                                    </details>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && <div className="text-muted ms-3">⏳ Consultando libros de historia...</div>}
                    <div ref={chatEndRef} />
                </div>

                <CForm onSubmit={handleSendMessage} className="p-3 bg-white border-top">
                    <CInputGroup>
                        <CFormTextarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                            placeholder="Haz una pregunta de historia..."
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