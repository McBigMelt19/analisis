// Backend Express para Historia de Venezuela
// Deploy en Render.com
// Este servidor hace de puente entre el frontend (Netlify) y Ollama

const express = require('express');
const cors = require('cors');
const app = express();

// Configuración
const PORT = process.env.PORT || 3000;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// ============================================
// 🤖 ENDPOINT DEL CHATBOT (Proxy a Ollama)
// ============================================
app.post('/api/chat', async (req, res) => {
    try {
        const { model, messages, stream } = req.body;

        console.log('📨 Petición recibida al chatbot:', {
            model,
            messagesCount: messages.length,
            stream
        });

        // Llamar a Ollama
        const response = await fetch(`${OLLAMA_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model || 'llama3.2',
                messages,
                stream: stream || false
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama respondió con status ${response.status}`);
        }

        const data = await response.json();

        console.log('✅ Respuesta de Ollama recibida');

        res.json(data);
    } catch (error) {
        console.error('❌ Error en /api/chat:', error);
        res.status(500).json({
            error: 'Error al comunicarse con Ollama',
            details: error.message
        });
    }
});

// ============================================
// 📚 ENDPOINTS DE DATOS (Migrar db.json aquí)
// ============================================

// Simulación temporal de db.json
// TODO: Migrar a PostgreSQL usando Prisma o Sequelize
const mockData = {
    users: [
        {
            id: 1,
            username: "juanito",
            password: "1234",
            name: "Juan Pérez",
            role: "student",
            grade_id: 3,
            learning_style: "Visual"
        },
        {
            id: 2,
            username: "teacher1",
            password: "teacher123",
            name: "María González",
            role: "teacher"
        }
    ],
    topics: [
        {
            id: 1,
            grade_id: 1,
            grade_name: "Primer Grado",
            edad_objetivo: "6-7 años",
            temas: [
                "Símbolos Patrios básicos",
                "Mi familia venezolana",
                "Tradiciones de mi región"
            ],
            restricciones_ia: "Lenguaje muy simple, usar ejemplos cotidianos."
        }
        // ... más grados
    ]
};

// GET /users
app.get('/users', (req, res) => {
    res.json(mockData.users);
});

// GET /users/:id
app.get('/users/:id', (req, res) => {
    const user = mockData.users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
    }
});

// GET /topics?grade_id=X
app.get('/topics', (req, res) => {
    const { grade_id } = req.query;

    if (grade_id) {
        const topics = mockData.topics.filter(t => t.grade_id === parseInt(grade_id));
        res.json(topics);
    } else {
        res.json(mockData.topics);
    }
});

// POST /login (autenticación simple)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = mockData.users.find(
        u => u.username === username && u.password === password
    );

    if (user) {
        // En producción, usa JWT tokens
        const { password, ...userWithoutPassword } = user;
        res.json({
            success: true,
            user: userWithoutPassword
        });
    } else {
        res.status(401).json({
            success: false,
            error: 'Credenciales inválidas'
        });
    }
});

// ============================================
// 🏥 HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        ollama_url: OLLAMA_URL
    });
});

// ============================================
// 🚀 INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
    console.log(`
    🚀 Servidor corriendo en puerto ${PORT}
    📡 Ollama URL: ${OLLAMA_URL}
    🌐 Frontend permitido: ${process.env.FRONTEND_URL || 'localhost:5173'}
    
    Endpoints disponibles:
    - POST /api/chat (Chatbot)
    - GET  /users
    - GET  /topics?grade_id=X
    - POST /login
    - GET  /health
    `);
});
