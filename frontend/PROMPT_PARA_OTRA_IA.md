# 🤖 Prompt para Otra IA - Deployment del Proyecto

Copia y pega este prompt en ChatGPT, Claude, o cualquier otra IA para obtener ayuda con el deployment:

---

## PROMPT COMPLETO

```
Hola, necesito ayuda para desplegar un proyecto educativo en producción.

## 📋 CONTEXTO DEL PROYECTO

Tengo una aplicación web educativa de "Historia de Venezuela" para niños de primaria (grados 1-6).

### Stack Tecnológico Actual:

**Frontend (React + Vite):**
- React 19 con Vite como bundler
- CoreUI React para componentes UI
- React Router DOM v7 para navegación
- Context API para manejo de estado (autenticación)
- SCSS + Bootstrap para estilos

**Backend Simulado:**
- JSON Server corriendo en puerto 3001
- Archivo db.json con datos mock:
  * Usuarios (estudiantes y profesores)
  * Temas por grado (1-6)
  * Progreso de estudiantes
  * Configuraciones

**Chatbot con IA:**
- Ollama corriendo localmente en puerto 11434
- Modelo: Llama 3.2
- Endpoint usado: POST http://localhost:11434/api/chat

### Cómo Funciona el Chatbot:

1. El componente `PersonalizedContent.jsx` genera un **System Prompt dinámico** basado en:
   - Grado del estudiante (1-6)
   - Edad objetivo (6-12 años)
   - Estilo de aprendizaje (Visual, Auditivo, o Kinestésico)
   - Temas permitidos según el grado (ej: "Símbolos Patrios", "Héroes de la Independencia")
   - Restricciones de contenido apropiadas para la edad

2. Cuando el estudiante envía un mensaje:
   - Se construye el historial de conversación
   - Se añade el System Prompt personalizado
   - Se envía todo a Ollama vía POST request
   - Ollama responde con texto generado por Llama 3.2
   - La respuesta se muestra en la interfaz

3. Código clave del chatbot:

```javascript
const getSystemPrompt = () => {
    return `Eres un profesor de Historia de Venezuela experto y muy amigable.
    
    **Perfil del Estudiante:**
    - Nombre: ${currentUser.name}
    - Grado: ${allowedTopics.grade_name}
    - Edad: ${allowedTopics.edad_objetivo}
    - Estilo de Aprendizaje: ${currentUser.learning_style}
    
    **Temas Permitidos:**
    ${allowedTopics.temas.join(', ')}
    
    **Reglas:**
    - Solo habla de Historia de Venezuela
    - Usa lenguaje apropiado para niños de ${allowedTopics.edad_objetivo}
    - Adapta respuestas según estilo de aprendizaje
    - Respuestas cortas (máximo 3 párrafos)`;
};

const handleSendMessage = async (userMessage) => {
    const response = await fetch(import.meta.env.VITE_OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: "llama3.2",
            messages: [
                { role: "system", content: getSystemPrompt() },
                ...historyForOllama,
                { role: "user", content: userMessage }
            ],
            stream: false
        })
    });
    
    const data = await response.json();
    return data.message.content;
};
```

## 🎯 LO QUE NECESITO

Quiero desplegar esta aplicación en producción usando servicios gratuitos o de bajo costo:

**Servicios que planeo usar:**
- **Frontend**: Netlify (gratis)
- **Backend**: Render (free tier o $7/mes)
- **Base de datos**: PostgreSQL en Render (gratis)
- **IA**: [NECESITO TU CONSEJO AQUÍ]

## ❓ MIS PREGUNTAS

1. **Ollama en Producción:**
   - ¿Cómo puedo desplegar Ollama con Llama 3.2 en Render?
   - ¿Necesito usar Docker? ¿Cuál sería el Dockerfile?
   - ¿Render Free tier soporta Ollama o necesito el plan de pago?
   - Alternativa: ¿Debería migrar a OpenAI/Gemini/Claude en su lugar?

2. **Backend Express:**
   - Necesito crear un servidor Express que:
     * Sirva de proxy entre el frontend y Ollama
     * Maneje los endpoints de db.json (o migrar a PostgreSQL)
     * Gestione autenticación de usuarios
   - ¿Puedes darme el código completo del server.js?

3. **Migración de db.json a PostgreSQL:**
   - ¿Cómo estructuro las tablas?
   - ¿Uso Prisma, Sequelize, o SQL puro?
   - ¿Cómo migro los datos existentes?

4. **Variables de Entorno:**
   - Frontend (.env para Vite):
     * VITE_OLLAMA_URL=???
     * ¿Qué más necesito?
   - Backend (.env para Express):
     * OLLAMA_URL=???
     * DATABASE_URL=???
     * FRONTEND_URL=??? (para CORS)

5. **Configuración de CORS:**
   - ¿Cómo configuro CORS correctamente?
   - ¿Qué orígenes debo permitir?

6. **Costos:**
   - ¿Cuánto costaría mensualmente?
   - ¿Hay alternativas más baratas?

## 📁 ARCHIVOS QUE TENGO

- `package.json` del frontend (React + Vite)
- `PersonalizedContent.jsx` (componente del chatbot)
- `db.json` (estructura de datos actual)
- `.env` actual: `VITE_OLLAMA_URL=http://localhost:11434/api/chat`

## 🎯 RESULTADO ESPERADO

Al final, quiero:
1. Frontend desplegado en Netlify
2. Backend en Render que maneje:
   - Proxy a Ollama (o API alternativa)
   - Endpoints de datos (usuarios, temas, progreso)
   - Autenticación
3. Base de datos PostgreSQL funcional
4. Chatbot funcionando en producción
5. Costos mensuales < $20 USD

## 🚀 BONUS

Si puedes darme:
- Código completo del backend Express
- Dockerfile para Ollama (si es viable)
- Scripts de migración de db.json a PostgreSQL
- Instrucciones paso a paso para deployment
- Alternativas si algo no es viable en free tier

¡Muchas gracias! 🙏
```

---

## 📝 NOTAS ADICIONALES

Si la IA te pide más información, puedes compartir:

1. **package.json completo**
2. **Estructura de db.json** (usuarios, topics, progress)
3. **Código de PersonalizedContent.jsx**
4. **Variables de entorno actuales**

## 🎯 VARIANTES DEL PROMPT

### Si quieres enfocarte en Ollama:
Añade: "Prefiero mantener Ollama por privacidad y control. ¿Cuál es la forma más económica de desplegarlo?"

### Si prefieres API comercial:
Añade: "Estoy abierto a migrar de Ollama a OpenAI/Gemini/Claude. ¿Cuál recomiendas para un chatbot educativo? ¿Cómo adapto el código?"

### Si tienes presupuesto limitado:
Añade: "Mi presupuesto es $0-5 USD/mes. ¿Qué configuración recomiendas con este límite?"

### Si quieres máxima simplicidad:
Añade: "Priorizo simplicidad sobre costo. ¿Cuál es la arquitectura más simple que funcionará?"
