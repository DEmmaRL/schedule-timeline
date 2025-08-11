#!/bin/bash

# Script de desarrollo para Schedule Timeline
echo "🚀 Iniciando entorno de desarrollo..."

# Compilar la librería
echo "📦 Compilando librería..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error al compilar la librería"
    exit 1
fi

# Verificar si dev-app tiene dependencias instaladas
if [ ! -d "dev-app/node_modules" ]; then
    echo "📥 Instalando dependencias de dev-app..."
    cd dev-app && npm install && cd ..
fi

# Iniciar dev-app
echo "🎯 Iniciando aplicación de desarrollo..."
echo "📱 La aplicación estará disponible en http://localhost:5173/"
echo "🔄 Los cambios en src/ requieren ejecutar 'npm run build' para reflejarse"
echo ""

cd dev-app && npm run dev
