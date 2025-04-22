import './style.css';

// API key de Google Gemini desde variables de entorno
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
// Login credentials desde variables de entorno
const LOGIN_USER = import.meta.env.VITE_LOGIN_USER || '';
const LOGIN_PASS = import.meta.env.VITE_LOGIN_PASS || '';

// URL base para la API de Gemini
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

// Función para llamar a la API de Gemini usando fetch
async function callGeminiAPI(prompt) {
  try {
    console.log('Llamando a Gemini API con:', prompt);
    
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
    console.log('Respuesta de Gemini:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && 
        data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Formato de respuesta inesperado');
    }
  } catch (error) {
    console.error('Error llamando a Gemini API:', error);
    throw error;
  }
}

// Elementos del DOM
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');

// Login Elements
const loginContainer = document.getElementById('login-container');
const loginForm = document.getElementById('login-form');
const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const loginError = document.getElementById('login-error');
const appContainer = document.getElementById('app');

// Estado de autenticación
let isAuthenticated = false;

function showChat() {
  loginContainer.classList.add('hidden');
  appContainer.classList.remove('hidden');
  isAuthenticated = true;
}

function showLoginError() {
  loginError.classList.remove('hidden');
}

function hideLoginError() {
  loginError.classList.add('hidden');
}

if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = loginUsername.value.trim();
    const password = loginPassword.value;
    if (username === LOGIN_USER && password === LOGIN_PASS) {
      hideLoginError();
      showChat();
      // Opcional: limpiar campos
      loginUsername.value = '';
      loginPassword.value = '';
    } else {
      showLoginError();
    }
  });
}

// Banco de respuestas predefinidas para preguntas comunes sobre Alan Turing
const predefinedResponses = [
  {
    keywords: ['enigma', 'código', 'nazi', 'guerra', 'mundial', 'bletchley', 'park'],
    response: "Durante la Segunda Guerra Mundial, trabajé en Bletchley Park descifrando los códigos de la máquina Enigma utilizada por los nazis. Este trabajo fue crucial para la victoria aliada, aunque permanecció en secreto durante muchos años. Creamos una máquina llamada 'Bombe' que nos permitió descifrar los mensajes enemigos de manera sistemática. Se estima que nuestro trabajo acortó la guerra en al menos dos años, salvando millones de vidas."
  },
  {
    keywords: ['máquina', 'turing', 'computadora', 'universal'],
    response: "En 1936, desarrollé el concepto de la 'Máquina de Turing' en mi artículo 'Sobre los números computables'. Es un modelo matemático abstracto que demuestra los límites de lo que puede ser calculado. Consiste en una cinta infinita con símbolos y un cabezal que puede leer, escribir y moverse. A pesar de su simplicidad, puede simular la lógica de cualquier algoritmo. Este modelo está considerado como el fundamento teórico de la computación moderna."
  },
  {
    keywords: ['prueba', 'test', 'inteligencia', 'artificial', 'IA', 'juego', 'imitación'],
    response: "Mi prueba de inteligencia para máquinas, que ahora llaman 'Prueba de Turing', la propuse en 1950 en un artículo titulado 'Computing Machinery and Intelligence'. La idea es simple: si un humano conversa con una máquina sin poder verla y no puede distinguir si está hablando con una máquina o con otro humano, entonces podíamos considerar que la máquina exhibe un comportamiento inteligente. Originalmente lo llamé 'el juego de imitación'. Es interesante cómo esta idea ha influido en el desarrollo de lo que ustedes llaman inteligencia artificial."
  },
  {
    keywords: ['infancia', 'niñez', 'crecer', 'padres', 'familia'],
    response: "Nací en Maida Vale, Londres, el 23 de junio de 1912. Mi padre, Julius Mathison Turing, era un funcionario del Servicio Civil Indio. Pasé gran parte de mi infancia separado de mis padres, ya que ellos viajaban entre Inglaterra y la India. Mi madre, Ethel Sara Turing, y yo vivíamos en Inglaterra mientras mi padre trabajaba en la India. Desde pequeño mostré un gran interés por la ciencia y las matemáticas. Asistí a la escuela Sherborne y luego estudié en el King's College de Cambridge."
  },
  {
    keywords: ['educación', 'universidad', 'cambridge', 'estudios', 'matemáticas'],
    response: "Estudié matemáticas en el King's College de Cambridge desde 1931. Me gradué con honores de primera clase en 1934. Posteriormente, en 1935, fui elegido fellow del King's College. En 1936, realicé mi trabajo más importante en el campo de la computabilidad. Luego, en 1938, obtuve mi doctorado en Princeton University bajo la supervisión de Alonzo Church, trabajando en la lógica matemática. Mi tiempo en Cambridge y Princeton fue fundamental para desarrollar las ideas que sentaron las bases de la computación teórica."
  },
  {
    keywords: ['morfogénesis', 'biología', 'patrón', 'manchas', 'reacción-difusión'],
    response: "En mis últimos años me interesé mucho por la morfogénesis, que es el estudio de cómo los organismos biológicos desarrollan su forma y estructura. Propuse un modelo matemático de reacción-difusión que explicaba cómo se forman patrones como las manchas de los leopardos o las rayas de las cebras. Este trabajo muestra cómo las matemáticas pueden explicar fenómenos biológicos complejos. Mi artículo 'Las bases químicas de la morfogénesis', publicado en 1952, sigue siendo relevante en biología teórica."
  },
  {
    keywords: ['ajedrez', 'programa', 'juego'],
    response: "A pesar de que no teníamos computadoras funcionales cuando desarrollé estas ideas, en 1948 diseñé uno de los primeros programas de ajedrez. Lo llamé 'Turochamp'. Como no había máquinas capaces de ejecutarlo, yo mismo simulaba el algoritmo en papel, lo que era un proceso extremadamente laborioso. El programa evaluaba posiciones y podía 'pensar' con una profundidad de un par de movimientos. Fue un intento temprano de crear inteligencia artificial para resolver problemas complejos."
  }
];

// Contexto de Alan Turing
const turingBio = `
Me llamo Alan Mathison Turing. Nací el 23 de junio de 1912 en Londres, Inglaterra, y fallecí el 7 de junio de 1954. 
Soy matemático, informático teórico, lógico, criptógrafo, filósofo y biólogo teórico.

Durante la Segunda Guerra Mundial, trabajé en descifrar los códigos nazis, particularmente los de la máquina Enigma, en Bletchley Park. 
Mi trabajo en este proyecto fue crucial para la victoria aliada.

Soy considerado el padre de la informática teórica y de la inteligencia artificial. En 1936, desarrollé el concepto de la "Máquina de Turing", un modelo teórico que se considera precursor de la computadora moderna.

Propuse la famosa "Prueba de Turing" para determinar si una máquina puede exhibir un comportamiento inteligente equivalente o indistinguible del de un humano.

Mis intereses incluyen la matemática, la criptografía, la computación, la morfogénesis (patrones en la naturaleza), la filosofía de la mente y la IA.

Voy a responder como si fuera Alan Turing, con su personalidad, conocimientos y limitaciones de su época (hasta 1954). No puedo saber sobre eventos después de mi fallecimiento.
`;

// Historial de la conversación para mantener contexto
let conversationHistory = [
  { role: 'system', content: turingBio }
];

// Agregar un mensaje inicial de bienvenida
function addWelcomeMessage() {
  const message = {
    role: 'assistant',
    content: 'Hola, soy Alan Turing. Es un placer conocerte. ¿En qué puedo ayudarte o sobre qué te gustaría conversar? Podemos hablar sobre matemáticas, computación, mi trabajo en Bletchley Park, o cualquier otro tema que te interese.'
  };
  
  conversationHistory.push(message);
  displayMessage(message);
}

// Mostrar un mensaje en la interfaz
function displayMessage(message) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');
  
  // Crear estructura de avatar y contenido
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

// Mostrar indicador de escritura
function showTypingIndicator() {
  typingIndicator.classList.remove('hidden');
}

// Ocultar indicador de escritura
function hideTypingIndicator() {
  typingIndicator.classList.add('hidden');
}

// Encontrar respuesta predefinida basada en palabras clave
function findPredefinedResponse(message) {
  const messageText = message.content.toLowerCase();
  
  // Verificar cada conjunto de palabras clave para encontrar coincidencias
  for (const responseObj of predefinedResponses) {
    const matchCount = responseObj.keywords.filter(keyword => 
      messageText.includes(keyword.toLowerCase())
    ).length;
    
    // Si hay al menos dos palabras clave coincidentes, usar esta respuesta
    if (matchCount >= 1) {
      return responseObj.response;
    }
  }
  
  // Sin coincidencias suficientes
  return null;
}

// Respuestas genéricas de Alan Turing
const genericResponses = [
  "Como matemático, siempre busco patrones en los problemas. Esta cuestión me recuerda a los conceptos de computabilidad que exploré en mi trabajo sobre máquinas universales.",
  "Interesante pregunta. En mis investigaciones sobre inteligencia artificial y el juego de imitación (ahora conocido como la Prueba de Turing), consideré problemas similares.",
  "Durante mi tiempo en Bletchley Park, aprendí que incluso los problemas más complejos pueden resolverse con el enfoque adecuado y suficiente persistencia.",
  "En mi artículo de 1950 'Computing Machinery and Intelligence', abordé cuestiones fundamentales sobre lo que significa pensar. Su pregunta se relaciona con esas reflexiones.",
  "Esto me recuerda a mis estudios sobre morfogénesis y cómo los patrones complejos pueden surgir de reglas simples, algo que siempre me ha fascinado.",
  "Como pionero en lo que ustedes ahora llaman 'inteligencia artificial', siempre me intrigó la relación entre la mente humana y los procesos mecánicos. Su pregunta toca ese fascinante límite."
];

// Obtener una respuesta genérica aleatoria
function getRandomGenericResponse() {
  const index = Math.floor(Math.random() * genericResponses.length);
  return genericResponses[index];
}

// Enviar mensaje a la API y procesar respuesta
async function sendMessageToTuring(message) {
  try {
    showTypingIndicator();
    
    // Primero, intentar encontrar una respuesta predefinida
    const predefinedResponse = findPredefinedResponse(message);
    
    let botResponse;
    
    if (predefinedResponse) {
      // Usar respuesta predefinida si está disponible
      console.log('Usando respuesta predefinida');
      botResponse = predefinedResponse;
    } else {
      try {
        // Construir prompt con el contexto de Alan Turing
        const turingPrompt = `
        INSTRUCCIONES IMPORTANTES: Eres Alan Mathison Turing (1912-1954). Responde directamente a la siguiente pregunta como si fueras él.
        
        Sobre ti:
        - Matemático británico, pionero de la informática y la IA
        - Trabajaste en Bletchley Park descifrando códigos Enigma durante la Segunda Guerra Mundial
        - Creador de la "Máquina de Turing" y el "Test de Turing"
        - Interesado en matemáticas, computación, criptografía y morfogénesis
        - Falleciste en 1954, por lo que no conoces eventos posteriores
        
        REGLAS:
        1. RESPONDER DIRECTAMENTE a la pregunta, como si tú fueras Alan Turing
        2. Usar PRIMERA PERSONA ("yo", "mi", etc.)
        3. NO hablar sobre ti en tercera persona 
        4. NUNCA uses frases como "Como Alan Turing puedo decir..." o "Como matemático/informático/etc. puedo decir..."
        5. Evita términos como "en mi época" o "en mi tiempo" que rompan la ilusión
        6. Si te preguntan sobre algo posterior a 1954, indicar que no lo conoces por tu fecha de fallecimiento
        
        Contexto de conversación reciente:
        ${conversationHistory.slice(-3).filter(msg => msg.role !== 'system').map(msg => 
          msg.role === 'user' ? `Pregunta: ${msg.content}` : `Alan Turing: ${msg.content}`
        ).join('\n\n')}
        
        Ahora, responde a esta pregunta como Alan Turing:
        "${message.content}"
        `;
        
        console.log('Enviando prompt a Gemini:', turingPrompt);
        
        // Llamar a la API de Gemini con el prompt
        botResponse = await callGeminiAPI(turingPrompt);
        
        console.log('Respuesta recibida de Gemini:', botResponse);
        
        // Si la respuesta es demasiado corta, usar genérica
        if (botResponse.length < 20) {
          console.log('Respuesta API demasiado corta, usando genérica');
          botResponse = getRandomGenericResponse();
        }
      } catch (apiError) {
        console.error('Error con API Gemini:', apiError);
        botResponse = getRandomGenericResponse();
      }
    }
    
    // Asegurarse de que la respuesta tenga un tono personal
    if (!botResponse.includes('yo') && !botResponse.includes('mi') && 
        !botResponse.includes('me') && !botResponse.includes('Turing')) {
      botResponse = `Considero que ${botResponse}`;
    }
    
    // Crear objeto de mensaje para la respuesta
    const assistantMessage = {
      role: 'assistant',
      content: botResponse
    };
    
    // Simular tiempo de escritura (entre 1 y 2 segundos por cada 50 caracteres)
    const typingDelay = Math.min(Math.floor(botResponse.length / 50) * 1000 + 1000, 3000);
    await new Promise(resolve => setTimeout(resolve, typingDelay));
    
    // Agregar al historial y mostrar
    conversationHistory.push(assistantMessage);
    displayMessage(assistantMessage);
  } catch (error) {
    console.error('Error general:', error);
    
    // Mensaje de fallback en caso de error
    const errorMessage = {
      role: 'assistant',
      content: 'Como matemático, siempre preferí abordar los problemas paso a paso. Quizás podamos intentar con otro enfoque. ¿Hay algo específico sobre mi trabajo en computación o criptografía que te interese?'
    };
    
    conversationHistory.push(errorMessage);
    displayMessage(errorMessage);
  } finally {
    hideTypingIndicator();
  }
}

// Enviar mensaje del usuario
async function sendUserMessage() {
  const messageText = userInput.value.trim();
  
  if (messageText) {
    // Limpiar el input
    userInput.value = '';
    
    // Crear objeto de mensaje
    const userMessage = {
      role: 'user',
      content: messageText
    };
    
    // Agregar al historial y mostrar
    conversationHistory.push(userMessage);
    displayMessage(userMessage);
    
    // Obtener respuesta
    await sendMessageToTuring(userMessage);
  }
}

// Event listeners
sendButton.addEventListener('click', sendUserMessage);

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendUserMessage();
  }
});

// Inicializar chatbot
document.addEventListener('DOMContentLoaded', () => {
  addWelcomeMessage();
});
