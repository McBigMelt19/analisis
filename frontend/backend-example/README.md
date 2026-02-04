# Backend para Historia de Venezuela

Este es el servidor backend que conecta el frontend React con Ollama.

## 🚀 Instalación Local

```bash
cd backend-example
npm install
cp .env.example .env
# Edita .env con tus valores
npm run dev
```

## 📦 Despliegue en Render

### 1. Crear Web Service en Render

1. Ve a [render.com](https://render.com) y crea una cuenta
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: `historia-venezuela-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2. Variables de Entorno en Render

En la sección "Environment":

```
OLLAMA_URL=https://tu-ollama-server.onrender.com
FRONTEND_URL=https://tu-app.netlify.app
```

### 3. Actualizar Frontend

En tu `.env` del frontend (Netlify):

```bash
VITE_OLLAMA_URL=https://historia-venezuela-backend.onrender.com/api/chat
```

## 🐳 Desplegar Ollama en Render

Crea otro Web Service con Docker:

### Dockerfile

```dockerfile
FROM ollama/ollama:latest

# Descargar el modelo
RUN ollama pull llama3.2

EXPOSE 11434

CMD ["ollama", "serve"]
```

### render.yaml

```yaml
services:
  - type: web
    name: ollama-server
    env: docker
    dockerfilePath: ./Dockerfile
    plan: starter  # $7/mes (Free tier no soporta Docker)
```

## 🔄 Alternativa: Usar API Comercial

Si Ollama es muy caro, modifica `server.js`:

```javascript
// Reemplaza el endpoint /api/chat con:
app.post('/api/chat', async (req, res) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: req.body.messages
        })
    });
    
    const data = await response.json();
    res.json({
        message: {
            content: data.choices[0].message.content
        }
    });
});
```

## 📊 Endpoints

- `POST /api/chat` - Chatbot (proxy a Ollama)
- `GET /users` - Lista de usuarios
- `GET /topics?grade_id=X` - Temas por grado
- `POST /login` - Autenticación
- `GET /health` - Health check

## 🔐 Seguridad (TODO)

- [ ] Implementar JWT para autenticación
- [ ] Rate limiting para prevenir abuso
- [ ] Validación de inputs
- [ ] HTTPS obligatorio en producción
- [ ] Migrar passwords a hash (bcrypt)

## 📚 Próximos Pasos

1. Migrar `db.json` a PostgreSQL
2. Implementar autenticación real con JWT
3. Agregar endpoints para progreso del estudiante
4. Implementar caché para respuestas frecuentes
5. Agregar logging y monitoreo
