# Chatbot Emulador de Alan Turing

Esta aplicación es un chatbot que emula la personalidad de Alan Turing, pionero de la computación e inteligencia artificial. 

## Tecnologías utilizadas

- JavaScript vanilla
- Vite.js como empaquetador
- TailwindCSS para los estilos
- Google Gemini API para la generación de respuestas IA

## Características

- Interfaz de chat intuitiva y responsiva
- Emulación de la personalidad e información de Alan Turing
- Login simple con usuario y contraseña definidos por variables de entorno
- Integración con modelos de lenguaje de Google Gemini

## Login simple (usuario y contraseña)

Antes de acceder al chat, deberás iniciar sesión con usuario y contraseña. Estos datos están definidos en las variables de entorno:

- `VITE_LOGIN_USER` (por defecto: `prueba`)
- `VITE_LOGIN_PASS` (por defecto: `pruebaturing`)

Puedes cambiarlos en tu archivo `.env` si lo deseas. Si el login es correcto, se mostrará el chat; si no, verás un mensaje de error. Si modificas estos valores, recuerda reiniciar el servidor de desarrollo para que los cambios tengan efecto.

## Detalles de desarrollo

Para conocer mayores detalles del desarrollo, ingresa al archivo guia.md

## Cómo iniciar la aplicación

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir en el navegador la URL que se muestra en la terminal (normalmente http://localhost:5173)

## Personalización

- Para utilizar tu propia API key de Google Gemini en:

https://aistudio.google.com/apikey

- luego coloca tu clave en la variable `VITE_GEMINI_API_KEY` dentro de tu archivo `.env`.
- Puedes cambiar el usuario y contraseña del login modificando las variables `VITE_LOGIN_USER` y `VITE_LOGIN_PASS` en tu `.env`.

## Nota sobre la API de Gemini

Esta aplicación utiliza la API de Google Gemini para generar las respuestas de IA. Debes tener una clave válida y configurarla en tu archivo `.env` como `VITE_GEMINI_API_KEY`. Si experimentas problemas de límite o autenticación, revisa la documentación oficial de Google AI para obtener una nueva clave o solucionar problemas de acceso.
