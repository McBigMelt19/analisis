#!/bin/bash

# ============================================================================
# SCRIPT DE LIMPIEZA - Elimina código muerto del proyecto
# Autor: Linus Torvalds Mode 🔥
# ============================================================================

echo "🔥 Iniciando limpieza de código muerto..."
echo ""

# Directorio base del proyecto
PROJECT_ROOT="/home/juancito/Documentos/Diseno/diseno/frontend"
cd "$PROJECT_ROOT" || exit 1

# ============================================================================
# 1. ELIMINAR CARPETAS COMPLETAS (Stock y Proveedores)
# ============================================================================
echo "📁 Eliminando carpetas de Stock y Proveedores..."
rm -rf src/views/pages/stock
rm -rf src/views/pages/proveedors
echo "   ✅ Carpetas eliminadas"
echo ""

# ============================================================================
# 2. ELIMINAR CHATBOT VIEJO Y COMPONENTES RELACIONADOS
# ============================================================================
echo "🤖 Eliminando implementación vieja del chatbot..."
rm -f src/views/pages/chatbot/Chatbot.jsx
rm -f src/views/pages/chatbot/Chatbot.css
rm -f src/views/pages/chatbot/ChatbotWrapper.jsx
rm -f src/views/pages/chatbot/MessageBubble.jsx
rm -f src/views/pages/chatbot/MessageBubble.css
rm -f src/views/pages/chatbot/OptionButtons.jsx
rm -f src/views/pages/chatbot/OptionButtons.css
rm -f src/views/pages/chatbot/InputArea.jsx
rm -f src/views/pages/chatbot/InputArea.css
rm -f src/views/pages/chatbot/datagrado.js
rm -f src/views/pages/chatbot/reutilizable.jsx
rm -f src/views/pages/chatbot/style.css
echo "   ✅ Chatbot viejo eliminado"
echo ""

# ============================================================================
# 3. ELIMINAR DASHBOARD GENÉRICO
# ============================================================================
echo "📊 Eliminando Dashboard genérico de CoreUI..."
rm -rf src/views/dashboard
echo "   ✅ Dashboard genérico eliminado"
echo ""

# ============================================================================
# 4. ELIMINAR NAVEGACIÓN OBSOLETA
# ============================================================================
echo "🧭 Eliminando navegación obsoleta..."
rm -f src/_nav.js
echo "   ✅ Navegación obsoleta eliminada"
echo ""

# ============================================================================
# 5. RESUMEN
# ============================================================================
echo "============================================================================"
echo "✅ LIMPIEZA COMPLETADA"
echo "============================================================================"
echo ""
echo "Archivos y carpetas eliminados:"
echo "  • src/views/pages/stock/"
echo "  • src/views/pages/proveedors/"
echo "  • src/views/dashboard/"
echo "  • src/views/pages/chatbot/Chatbot.jsx (+ 10 archivos relacionados)"
echo "  • src/_nav.js"
echo ""
echo "⚠️  PRÓXIMOS PASOS:"
echo "  1. Revisar src/routes.js (ya actualizado)"
echo "  2. Verificar que la app compile: npm start"
echo "  3. Hacer commit de los cambios"
echo ""
echo "🎉 Proyecto limpio y listo para producción"
echo "============================================================================"
