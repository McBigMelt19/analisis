import React, { useState, useRef, useEffect } from 'react';
// Usamos SOLO la librería oficial estable para web
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    CCard,
    CCardHeader,
    CCardBody,
    CForm,
    CFormTextarea,
    CButton,
    CInputGroup
} from '@coreui/react';

const PersonalizedContent = () => {
    // --- DATOS GENÉRICOS ---
    const currentUnit = 'Asistencia Histórica Interactiva';
    const initialMessageContent = `¡Hola! Soy tu Asistente de Historia de Venezuela. 🇻🇪\n\nEstoy listo para ayudarte a explorar:\n1. Héroes de la Independencia.\n2. Batallas Clave.\n3. Cultura y Tradiciones.\n\n¿Qué te gustaría saber hoy?`;

    const initialMessages = [{ id: 1, role: 'assistant', content: initialMessageContent }];

    // --- ESTADOS Y REFS ---
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Referencia para guardar la sesión del chat y no perder el contexto
    const chatSessionRef = useRef(null);

    // --- CONFIGURACIÓN DE GEMINI ---
    // Leemos la variable de entorno correctamente
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    useEffect(() => {
        if (!API_KEY) {
            console.error('⚠️ Falta la VITE_GEMINI_API_KEY en el archivo .env');
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'assistant',
                content: "⚠️ **Error de Configuración**: No encuentro la API Key. Por favor crea un archivo .env en la raíz y agrega VITE_GEMINI_API_KEY=tu_clave."
            }]);
            return;
        }

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash", // Usamos flash, es más rápido y eficiente
                systemInstruction: `Eres un experto historiador y guía turístico de Venezuela, diseñado para niños de primaria.
                
                Tus reglas son estrictas:
                1. SOLO respondes sobre: Héroes de Venezuela, Batallas de Independencia y Cultura Venezolana.
                2. Si te preguntan otra cosa, di amablemente que no sabes.
                3. Respuestas cortas (máximo 100 palabras) y divertidas para niños de primaria.
                4. Usa emojis y formato Markdown.`
            });

            // Iniciamos el chat una sola vez al montar el componente
            chatSessionRef.current = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: "Hola, compórtate según tus instrucciones." }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "¡Entendido! Estoy listo para enseñar historia de Venezuela." }],
                    },
                ],
            });
            console.log("✅ Gemini Inicializado correctamente");

        } catch (error) {
            console.error("Error inicializando Gemini:", error);
        }
    }, [API_KEY]); // Se ejecuta si cambia la API Key (o al inicio)

    // Scroll automático
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // --- FUNCIÓN DE ENVÍO ---
    const handleSendMessage = async (e) => {
        e.preventDefault();
        const userMessage = input.trim();
        if (!userMessage || isLoading) return;

        // 1. Agregar mensaje del usuario a la UI
        const newUserMessage = { id: Date.now(), role: 'user', content: userMessage };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        try {
            if (!chatSessionRef.current) {
                throw new Error("El chat no se inicializó correctamente (Revisa la API Key).");
            }

            // 2. Enviar mensaje a Gemini
            const result = await chatSessionRef.current.sendMessage(userMessage);
            const responseText = result.response.text();

            // 3. Agregar respuesta
            const assistantResponse = {
                id: Date.now() + 1,
                role: 'assistant',
                content: responseText,
            };
            setMessages(prev => [...prev, assistantResponse]);

        } catch (error) {
            console.error("Error al enviar mensaje:", error);

            let errorMsg = "Lo siento, hubo un error de conexión.";
            const errorText = error.message?.toLowerCase() || "";

            if (errorText.includes("api key") || errorText.includes("403")) {
                errorMsg = "Error de autenticación: Verifica tu API Key en el archivo .env.";
            } else if (errorText.includes("429") || errorText.includes("quota")) {
                errorMsg = "🚫 Has alcanzado el límite de cuota gratuita de Gemini. Intenta más tarde o verifica tu plan.";
            } else if (errorText.includes("fetch failed") || errorText.includes("network")) {
                errorMsg = "Error de red: Revisa tu conexión a internet.";
            } else {
                // Mostrar error real para debug
                errorMsg = `Error técnico: ${error.message}`;
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: `⚠️ ${errorMsg}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- ESTILOS ---
    const assistantBgColor = '#CC9966';
    const userBgColor = '#D5E5F0';
    const headerBgColor = '#5D4037';

    return (
        <CCard className="h-100 shadow-lg border-0">
            <CCardHeader style={{ backgroundColor: headerBgColor }} className="text-white">
                <h5 className="mb-0">Asistente de Historia: {currentUnit}</h5>
            </CCardHeader>

            <CCardBody className="d-flex flex-column p-0">
                <div className="flex-grow-1 overflow-y-auto p-4" style={{ maxHeight: '600px', minHeight: '400px', backgroundColor: '#F9F7F3' }}>
                    {messages.map((message) => (
                        <div key={message.id} className={`d-flex mb-3 ${message.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                            {/* Renderizado simple del mensaje */}
                            <div className={`p-3 rounded-3 shadow-sm`}
                                style={{
                                    maxWidth: '80%',
                                    backgroundColor: message.role === 'user' ? userBgColor : assistantBgColor,
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
                            placeholder="Pregunta sobre Bolívar, batallas..."
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