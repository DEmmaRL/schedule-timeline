# Development App

Esta es una aplicación de desarrollo para probar y visualizar el componente Schedule Timeline de forma interactiva.

## Uso

Desde el directorio raíz del proyecto:

```bash
# 1. Compilar la librería
npm run build

# 2. Instalar dependencias de dev-app (solo la primera vez)
cd dev-app && npm install

# 3. Ejecutar la aplicación de desarrollo
npm run dev
```

## Características

- **4 Ejemplos interactivos**: Básico, Conferencia, Tema personalizado, y Renderer personalizado
- **Eventos interactivos**: Click y hover en actividades
- **Diseño responsivo**: Funciona en desktop y móvil
- **Hot reload**: Los cambios se reflejan automáticamente

## Ejemplos incluidos

1. **Ejemplo Básico**: Horario simple con actividades de TCMX
2. **Conferencia**: Horario más complejo con múltiples tipos de actividades
3. **Tema Personalizado**: Colores personalizados para diferentes tipos
4. **Renderer Personalizado**: Diseño completamente personalizado con iconos

## Desarrollo

Para hacer cambios en la librería:

1. Modifica los archivos en `../src/`
2. Ejecuta `npm run build` desde el directorio raíz
3. La dev-app se actualizará automáticamente
