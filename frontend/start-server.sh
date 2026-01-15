#!/bin/bash

# Script para iniciar json-server de forma confiable

echo "🔍 Verificando si json-server ya está corriendo..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Puerto 3001 ya está en uso. Deteniendo proceso..."
    pkill -f json-server
    sleep 2
fi

echo "🚀 Iniciando json-server en puerto 3001..."
npx -y json-server db.json --port 3001 &

sleep 3

echo "✅ Verificando conexión..."
if curl -s http://localhost:3001/users >/dev/null 2>&1; then
    echo "✅ json-server está corriendo correctamente en http://localhost:3001"
    echo "📊 Endpoints disponibles:"
    echo "   - http://localhost:3001/users"
    echo "   - http://localhost:3001/grades"
    echo "   - http://localhost:3001/progress"
    echo "   - http://localhost:3001/topics"
else
    echo "❌ Error: json-server no respondió"
    echo "💡 Intenta manualmente: npx json-server db.json --port 3001"
fi
