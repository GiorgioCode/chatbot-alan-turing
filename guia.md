# Guía: Creación del Chatbot que Emula a Alan Turing

Esta guía detalla el proceso completo para crear un chatbot que emula la personalidad de Alan Turing, utilizando JavaScript vanilla empaquetado con Vite.js, estilizado con TailwindCSS y conectado a la API de Google Gemini.

## Tabla de Contenidos

1. [Configuración del Proyecto](#1-configuración-del-proyecto)
2. [Instalación de Dependencias](#2-instalación-de-dependencias)
3. [Configuración de TailwindCSS](#3-configuración-de-tailwindcss)
4. [Diseño de la Interfaz](#4-diseño-de-la-interfaz)
5. [Configuración de Variables de Entorno](#5-configuración-de-variables-de-entorno)
6. [Integración con Google Gemini API](#6-integración-con-google-gemini-api)
7. [Implementación de Respuestas Predefinidas](#7-implementación-de-respuestas-predefinidas)
8. [Mejoras Visuales y Tema Oscuro](#8-mejoras-visuales-y-tema-oscuro)
9. [Añadiendo Avatares](#9-añadiendo-avatares)

## 1. Configuración del Proyecto

Para iniciar, creamos un nuevo proyecto con Vite:

```bash
# Crear un directorio para el proyecto
mkdir chatbot
cd chatbot

# Inicializar el proyecto con Vite
npm create vite@latest . -- --template vanilla
```

## 2. Instalación de Dependencias

Instalamos las dependencias necesarias:

```bash
# Instalar dependencias básicas de Vite
npm install

# Integrar TailwindCSS (mediante CDN para simplicidad)
# No se necesita instalación, se incluye directamente en el HTML
```

Para la API de Google Gemini, no usamos una biblioteca específica sino solicitudes fetch nativas.

## 3. Configuración de TailwindCSS

En lugar de configurar TailwindCSS localmente, lo incluimos a través de CDN para simplificar el proceso. En el archivo `index.html`:

```html
<head>
  <!-- ... -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {}
      }
    }
  </script>
</head>
```

## 4. Diseño de la Interfaz

La interfaz se compone de tres partes principales:

1. **Header**: Título y descripción breve
2. **Área de chat**: Donde se visualizan los mensajes
3. **Área de entrada**: Campo de texto y botón para enviar mensajes

### Estructura HTML Base

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chat con Alan Turing - IA Emulador de Personalidad</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {}
        }
      }
    </script>
  </head>
  <body class="bg-gray-900 text-white dark">
    <div id="app" class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Chat con Alan Turing</h1>
        <p class="text-gray-400">Conversa con una IA que emula la personalidad de Alan Turing...</p>
      </header>
      
      <!-- Área de chat -->
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div id="chat-messages" class="flex flex-col space-y-4 h-[450px] overflow-y-auto mb-6 p-2">
          <!-- Mensajes dinámicos -->
        </div>
        
        <!-- Indicador de escritura -->
        <div id="typing-indicator" class="message-container bot-message hidden mb-4">
          <!-- ... -->
        </div>
        
        <!-- Área de entrada -->
        <div class="flex items-center">
          <input type="text" id="user-input" class="..." />
          <button id="send-button" class="...">Enviar</button>
        </div>
      </div>
      
      <!-- Footer -->
      <footer class="mt-8 text-center text-sm text-gray-500">
        <p>Este chatbot emula la personalidad de Alan Turing...</p>
      </footer>
    </div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

## 5. Configuración de Variables de Entorno y Login

La aplicación requiere variables de entorno para funcionar correctamente. Crea un archivo `.env` en la raíz del proyecto (puedes copiar el ejemplo de `.env.example`). Este archivo **no debe subirse al control de versiones**.

Ejemplo de archivo `.env`:

```env
VITE_GEMINI_API_KEY=tu_api_key_de_gemini_aqui
VITE_LOGIN_USER=prueba
VITE_LOGIN_PASS=pruebaturing
```

- `VITE_GEMINI_API_KEY`: Tu clave de API obtenida en [Google AI Studio](https://aistudio.google.com/apikey)
- `VITE_LOGIN_USER`: Usuario para acceder al chat (puedes personalizarlo)
- `VITE_LOGIN_PASS`: Contraseña del login (puedes personalizarla)

El archivo `.env.example` debe proveer la estructura, pero con valores genéricos o en blanco:

```env
VITE_GEMINI_API_KEY=tu_api_key_aqui
VITE_LOGIN_USER=XXX
VITE_LOGIN_PASS=XXXXXX
```

**Importante:** Si cambias usuario o contraseña, reinicia el servidor de desarrollo para que los cambios tengan efecto.

### Login simple

Antes de poder acceder al chat, los usuarios verán un formulario de login donde deberán ingresar el usuario y contraseña definidos en las variables de entorno. Si las credenciales son correctas, se mostrará el chat; si no, se mostrará un mensaje de error.

Para manejar de forma segura las claves de API y otras configuraciones confidenciales, utilizamos variables de entorno. Esto evita exponer información sensible en el código fuente y facilita la configuración en diferentes entornos.

### Instalación de dotenv

```bash
npm install dotenv --save
```

### Creación de archivos de entorno

Crea dos archivos en la raíz del proyecto:

1. `.env` - Contiene las variables reales (este archivo NO debe subirse al control de versiones)

```
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

2. `.env.example` - Plantilla para que otros desarrolladores sepan qué variables necesitan configurar

```
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

Nota: Vite expone automáticamente las variables que comienzan con `VITE_` a tu código a través de `import.meta.env`.

### Agregar .env a .gitignore

Asegúrate de agregar el archivo `.env` a tu `.gitignore` para evitar compartir accidentalmente tus claves:

```
# .gitignore
node_modules
.env
```

## 6. Integración con Google Gemini API

La integración se realiza mediante llamadas HTTP `fetch` a la API de Gemini usando la clave definida en las variables de entorno. No se utiliza ninguna librería adicional para la conexión. Asegúrate de que tu clave esté correctamente configurada en el archivo `.env`.

Para integrar la API de Google Gemini, creamos una función para realizar solicitudes HTTP, utilizando la variable de entorno para la API key:

```javascript
// API key de Google Gemini desde variables de entorno
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// URL base para la API de Gemini
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

// Función para llamar a la API de Gemini usando fetch
async function callGeminiAPI(prompt) {
  try {
    console.log('Llamando a Gemini API con prompt');
    
    // Verificar que la API key está configurada
    if (!GEMINI_API_KEY) {
      throw new Error('API key no configurada. Por favor, configura la variable de entorno VITE_GEMINI_API_KEY');
    }
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.95,
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Respuesta recibida de Gemini');
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Formato de respuesta inesperado');
    }
  } catch (error) {
    console.error('Error llamando a Gemini API:', error);
    throw error;
  }
}
```

## 7. Implementación de Respuestas Predefinidas

Para mejorar la experiencia del usuario, implementamos respuestas predefinidas para preguntas comunes sobre Alan Turing:

```javascript
// Banco de respuestas predefinidas para preguntas comunes sobre Alan Turing
const predefinedResponses = [
  {
    keywords: ['enigma', 'código', 'nazi', 'guerra', 'mundial', 'bletchley', 'park'],
    response: "Durante la Segunda Guerra Mundial, trabajé en Bletchley Park descifrando los códigos de la máquina Enigma..."
  },
  {
    keywords: ['máquina', 'turing', 'computadora', 'universal'],
    response: "En 1936, desarrollé el concepto de la 'Máquina de Turing'..."
  },
  // Más respuestas predefinidas...
];

// Función para encontrar respuestas predefinidas basadas en palabras clave
function findPredefinedResponse(message) {
  const messageText = message.content.toLowerCase();
  
  for (const responseObj of predefinedResponses) {
    const matchCount = responseObj.keywords.filter(keyword => 
      messageText.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount >= 1) {
      return responseObj.response;
    }
  }
  
  return null;
}
```

## 8. Mejoras Visuales y Tema Oscuro

Para el tema oscuro y las mejoras visuales, definimos estilos CSS específicos:

```css
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color-scheme: dark;
}

body {
  min-height: 100vh;
  background-color: #111827; /* Fondo oscuro */
  color: #e5e7eb; /* Texto claro */
}

/* Estilos para mensajes */
.message-container {
  display: flex;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  max-width: calc(100% - 60px);
  word-break: break-word;
}

.user-message .message-content {
  background-color: #1e40af; /* Azul oscuro */
  color: #e5e7eb;
  border-radius: 1.5rem 1.5rem 0 1.5rem;
  margin-left: auto;
}

.bot-message .message-content {
  background-color: #1f2937; /* Gris oscuro */
  color: #e5e7eb;
  border-radius: 1.5rem 1.5rem 1.5rem 0;
}
```

## 9. Añadiendo Avatares

Para personalizar la experiencia, añadimos avatares para Alan Turing y el usuario:

1. Colocamos las imágenes en la carpeta `public`:
   - `alan-avatar.jpg` para Alan Turing
   - `user-avatar.jpg` para el usuario

2. Definimos los estilos para los avatares:

```css
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;
  border: 2px solid #4b5563;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Invertir dirección para mensajes del usuario */
.user-message {
  flex-direction: row-reverse;
}

.user-message .avatar {
  margin-right: 0;
  margin-left: 12px;
}
```

3. Actualizamos la función `displayMessage` para incluir avatares:

```javascript
function displayMessage(message) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');
  
  let avatarSrc = "";
  
  if (message.role === 'user') {
    messageContainer.classList.add('user-message');
    avatarSrc = '/user-avatar.jpg';
  } else {
    messageContainer.classList.add('bot-message');
    avatarSrc = '/alan-avatar.jpg';
  }
  
  // Crear el avatar
  const avatarDiv = document.createElement('div');
  avatarDiv.classList.add('avatar');
  avatarDiv.innerHTML = `<img src="${avatarSrc}" alt="${message.role === 'user' ? 'Usuario' : 'Alan Turing'}" />`;
  
  // Crear el contenido del mensaje
  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.innerHTML = `<p>${message.content}</p>`;
  
  // Añadir las partes al contenedor
  messageContainer.appendChild(avatarDiv);
  messageContainer.appendChild(messageContent);
  
  // Añadir el mensaje completo al chat
  chatMessages.appendChild(messageContainer);
  
  // Desplazar al último mensaje
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
```

## Consideraciones Finales

Para que la aplicación funcione correctamente, asegúrate de:

1. Obtener una API key válida de Google Gemini en [Google AI Studio](https://aistudio.google.com/apikey)
2. Configurar correctamente el archivo `.env` con tu API key, usuario y contraseña, y no incluirlo en el control de versiones
3. Proporcionar el archivo `.env.example` para que otros desarrolladores sean capaces de configurar las variables de entorno fácilmente
4. Usar imágenes apropiadas para los avatares (idealmente de 100x100 píxeles o más)
5. Probar la aplicación en diferentes dispositivos para garantizar la responsividad

**Recuerda:** El login simple es solo para propósitos demostrativos y no debe usarse en producción para proteger información sensible.

Esta aplicación puede mejorarse con características adicionales como:
- Persistencia de la conversación usando almacenamiento local
- Más opciones de personalización de la interfaz
- Selección de diferentes personalidades históricas
- Reconocimiento de voz para entrada de mensajes

¡Disfruta de tu chatbot de Alan Turing!
