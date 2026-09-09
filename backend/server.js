const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.use(cors());
app.use(express.json());

console.log('🚀 Server starting...');
console.log('🔑 Groq API Key:', GROQ_API_KEY ? '✅ Loaded' : '❌ Missing');

// ===== YOUR AVAILABLE MODELS FROM THE API =====
const AVAILABLE_MODELS = [
  'qwen/qwen3.8-27b',
  'qwen/qwen3.6-27b',
  'groq/compound-mini',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'allam-2-7b',
  'groq/compound'
];

let workingModel = null;

// Find working model on startup
async function findWorkingModel() {
  for (const model of AVAILABLE_MODELS) {
    try {
      console.log(`🔍 Testing: ${model}...`);
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: model,
          messages: [{ role: 'user', content: 'Say hello' }],
          max_tokens: 5,
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );
      if (response.data?.choices?.[0]?.message?.content) {
        workingModel = model;
        console.log(`✅ Working model found: ${model}`);
        return model;
      }
    } catch (error) {
      console.log(`❌ ${model} failed`);
    }
  }
  console.log('⚠️ No working model found. Using fallback.');
  return null;
}

// ===== CHAT ENDPOINT =====
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const userMessage = messages[messages.length - 1].content;
    console.log('📨 User:', userMessage);

    // If no working model, find one
    if (!workingModel) {
      await findWorkingModel();
    }

    // If we have a working model, use it
    if (workingModel) {
      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: workingModel,
            messages: messages,
            temperature: 0.7,
            max_tokens: 500,
          },
          {
            headers: {
              'Authorization': `Bearer ${GROQ_API_KEY}`,
              'Content-Type': 'application/json',
            },
            timeout: 15000,
          }
        );

        const reply = response.data.choices[0].message.content;
        console.log(`✅ ${workingModel} replied`);
        return res.json({ reply, success: true, model: workingModel });
      } catch (error) {
        console.log('⚠️ Model error, trying others...');
        // If model fails, clear it and try again
        workingModel = null;
        await findWorkingModel();
        // Retry with new model
        if (workingModel) {
          try {
            const response = await axios.post(
              'https://api.groq.com/openai/v1/chat/completions',
              {
                model: workingModel,
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
              },
              {
                headers: {
                  'Authorization': `Bearer ${GROQ_API_KEY}`,
                  'Content-Type': 'application/json',
                },
                timeout: 15000,
              }
            );
            const reply = response.data.choices[0].message.content;
            console.log(`✅ ${workingModel} replied`);
            return res.json({ reply, success: true, model: workingModel });
          } catch (retryError) {
            console.log('⚠️ Retry failed');
          }
        }
      }
    }

    // FALLBACK: Smart local responses
    console.log('⚠️ Using fallback responses');
    const reply = getLocalResponse(userMessage);
    res.json({ reply, success: true, fallback: true });

  } catch (error) {
    console.error('❌ Error:', error.message);
    const reply = getLocalResponse(req.body.messages[req.body.messages.length - 1].content);
    res.json({ reply, success: true, fallback: true });
  }
});

// ===== SMART LOCAL FALLBACK =====
function getLocalResponse(message) {
  const msg = message.toLowerCase().trim();
  
  // Countries
  const countries = {
    'pakistan': 'Pakistan is in South Asia. Capital: Islamabad. 🇵🇰',
    'france': 'France is in Western Europe. Capital: Paris. 🇫🇷',
    'india': 'India is in South Asia. Capital: New Delhi. 🇮🇳',
    'china': 'China is in East Asia. Capital: Beijing. 🇨🇳',
    'usa': 'USA is in North America. Capital: Washington D.C. 🇺🇸',
    'uk': 'UK is in Western Europe. Capital: London. 🇬🇧',
    'germany': 'Germany is in Central Europe. Capital: Berlin. 🇩🇪',
    'italy': 'Italy is in Southern Europe. Capital: Rome. 🇮🇹',
    'spain': 'Spain is in Southwestern Europe. Capital: Madrid. 🇪🇸',
    'canada': 'Canada is in North America. Capital: Ottawa. 🇨🇦',
    'australia': 'Australia is in Oceania. Capital: Canberra. 🇦🇺',
    'japan': 'Japan is in East Asia. Capital: Tokyo. 🇯🇵',
    'brazil': 'Brazil is in South America. Capital: Brasília. 🇧🇷',
    'egypt': 'Egypt is in North Africa. Capital: Cairo. 🇪🇬',
    'nigeria': 'Nigeria is in West Africa. Capital: Abuja. 🇳🇬',
    'russia': 'Russia is in Eastern Europe and Northern Asia. Capital: Moscow. 🇷🇺',
    'mexico': 'Mexico is in North America. Capital: Mexico City. 🇲🇽',
    'saudi arabia': 'Saudi Arabia is in Western Asia. Capital: Riyadh. 🇸🇦',
    'turkey': 'Turkey is in Western Asia and Southeastern Europe. Capital: Ankara. 🇹🇷',
    'iran': 'Iran is in Western Asia. Capital: Tehran. 🇮🇷',
    'afghanistan': 'Afghanistan is in Central/South Asia. Capital: Kabul. 🇦🇫',
    'bangladesh': 'Bangladesh is in South Asia. Capital: Dhaka. 🇧🇩',
    'south korea': 'South Korea is in East Asia. Capital: Seoul. 🇰🇷',
    'thailand': 'Thailand is in Southeast Asia. Capital: Bangkok. 🇹🇭',
    'vietnam': 'Vietnam is in Southeast Asia. Capital: Hanoi. 🇻🇳',
    'indonesia': 'Indonesia is in Southeast Asia. Capital: Jakarta. 🇮🇩',
    'malaysia': 'Malaysia is in Southeast Asia. Capital: Kuala Lumpur. 🇲🇾',
    'singapore': 'Singapore is a city-state in Southeast Asia. 🇸🇬',
    'argentina': 'Argentina is in South America. Capital: Buenos Aires. 🇦🇷',
    'chile': 'Chile is in South America. Capital: Santiago. 🇨🇱',
    'peru': 'Peru is in South America. Capital: Lima. 🇵🇪',
    'kenya': 'Kenya is in East Africa. Capital: Nairobi. 🇰🇪',
    'south africa': 'South Africa is at the southern tip of Africa. 🇿🇦',
    'ghana': 'Ghana is in West Africa. Capital: Accra. 🇬🇭',
    'morocco': 'Morocco is in North Africa. Capital: Rabat. 🇲🇦',
    'algeria': 'Algeria is in North Africa. Capital: Algiers. 🇩🇿',
    'new zealand': 'New Zealand is in Oceania. Capital: Wellington. 🇳🇿',
    'nepal': 'Nepal is in South Asia. Capital: Kathmandu. 🇳🇵',
    'sri lanka': 'Sri Lanka is an island country in South Asia. 🇱🇰'
  };
  
  for (const [country, info] of Object.entries(countries)) {
    if (msg.includes(`where is ${country}`) || 
        msg.includes(`where's ${country}`) ||
        msg.includes(`about ${country}`) ||
        msg.includes(`tell me about ${country}`) ||
        msg === country) {
      return info;
    }
  }
  
  // COMSATS
  if (msg.includes('comsats') || msg.includes('cui') || msg.includes('abbottabad')) {
    return "COMSATS University Abbottabad Campus is in Abbottabad, Pakistan. Offers CS, Engineering, Business, Mathematics, Physics. 🎓";
  }
  
  // Greetings
  if (msg.match(/^(hello|hi|hey|howdy|good morning|good evening|sup|yo)/i)) {
    const replies = ["Hello! How can I help you? 😊", "Hi there! What can I do for you?", "Hey! How can I assist you today?"];
    return replies[Math.floor(Math.random() * replies.length)];
  }
  
  if (msg.includes('how are you')) {
    return "I'm doing great! Thanks for asking! 😄";
  }
  
  // Jokes
  if (msg.includes('joke') || msg.includes('funny')) {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs! 😄",
      "What do you call a fake noodle? An impasta! 🍝",
      "Why did the scarecrow win an award? Outstanding in his field! 🌾",
      "Why don't scientists trust atoms? Because they make up everything! ⚛️"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  
  // Help
  if (msg.includes('help') || msg.includes('what can you do')) {
    return "I can help with:\n📍 Geography - 'Where is Pakistan?'\n🎓 COMSATS University info\n😄 Jokes\n💬 General questions\n\nWhat would you like to know?";
  }
  
  // Time
  if (msg.includes('time') || msg.includes('date')) {
    return `Current time: ${new Date().toLocaleString()} ⏰`;
  }
  
  // Default
  return `I understand you asked: "${message}". I can help with geography, COMSATS info, jokes, and more! What would you like to know? 🤔`;
}

// ===== LIST MODELS ENDPOINT =====
app.get('/api/list-models', (req, res) => {
  res.json({ 
    success: true, 
    models: AVAILABLE_MODELS,
    workingModel: workingModel || 'Not found yet'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Chatbot running',
    hasGroqKey: !!GROQ_API_KEY,
    workingModel: workingModel || 'Finding...'
  });
});

// Find working model on startup
findWorkingModel();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📋 Available models:', AVAILABLE_MODELS.join(', '));
});