# Proyecto: Árbol de Logros de Minecraft

## Descripción

Este proyecto es una réplica del Árbol de Logros de Minecraft. La aplicación fue desarrollada en React y gestiona el estado de los logros utilizando Redux. El árbol de logros se puede cargar desde un archivo JSON local o dinámicamente desde una URL externa mediante query parameters.

## Características

- ✨ Interfaz interactiva del árbol de habilidades estilo Minecraft
- 🎮 Sistema de desbloqueo de logros progresivo
- 📱 Diseño responsivo con soporte táctil para dispositivos móviles
- 🔗 Carga dinámica de datos desde URLs externas
- 🎵 Música de fondo opcional
- 🖱️ Navegación por arrastre (drag) tanto con mouse como con gestos táctiles

## Ejecución

1. **Instalar dependencias**:
   Una vez que tengas el proyecto descargado y descomprimido, navega al directorio del proyecto e instala las dependencias ejecutando:

    ```bash
    npm install
    # o si usas bun
    bun install
    ```

2. **Iniciar el servidor de desarrollo**:
   Para ejecutar el proyecto localmente, usa el siguiente comando:

    ```bash
    npm run start
    # o si usas bun
    bun run start
    ```

3. **Acceder a la aplicación**:
   Una vez que el servidor esté en funcionamiento, abre tu navegador y ve a `http://localhost:3000` para ver la aplicación en acción.

## Cargar Datos Personalizados

### Usando Query Parameters

Puedes cargar un árbol de habilidades personalizado desde cualquier URL pública que sirva un archivo JSON compatible. Simplemente agrega el parámetro `dataUrl` a la URL:

```text
https://tu-dominio.com/?dataUrl=https://ejemplo.com/mi-skill-tree.json
```

**Ejemplo en desarrollo local:**

```text
http://localhost:3000/?dataUrl=https://raw.githubusercontent.com/usuario/repo/main/data.json
```

### Formato del JSON

El archivo JSON debe seguir la siguiente estructura:

```json
{
  "name": "Raíz del Árbol",
  "description": "Descripción del nodo raíz",
  "image": "https://ejemplo.com/imagen.png",
  "children": [
    {
      "name": "Logro 1",
      "description": "Descripción del logro",
      "image": "https://ejemplo.com/logro1.png",
      "children": []
    }
  ]
}
```

**Propiedades:**

- `name` (string): Nombre del logro
- `description` (string): Descripción detallada del logro
- `image` (string): URL de la imagen del logro
- `children` (array): Array de nodos hijos con la misma estructura

### Manejo de Errores

Si la URL proporcionada no es válida o no se puede cargar el JSON, la aplicación:

1. Mostrará un mensaje de error
2. Automáticamente cargará los datos por defecto incluidos en el proyecto
3. El usuario podrá seguir interactuando con el árbol de habilidades

## Tecnologías Utilizadas

- **React** + **TypeScript**: Framework y lenguaje principal
- **Redux Toolkit**: Gestión de estado
- **Vite**: Build tool y servidor de desarrollo
- **Tailwind CSS**: Estilos
- **Biome**: Linter y formatter


