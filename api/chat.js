const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

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

async function findWorkingModel() {
  for (const model of AVAILABLE_MODELS) {
    try {
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
        return model;
      }
    } catch (error) {
      // Continue to next model
    }
  }
  return null;
}

function getLocalResponse(message) {
  const msg = message.toLowerCase().trim();
  
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
  
  if (msg.includes('comsats') || msg.includes('cui') || msg.includes('abbottabad')) {
    return "COMSATS University Abbottabad Campus is in Abbottabad, Pakistan. Offers CS, Engineering, Business, Mathematics, Physics. 🎓";
  }
  
  if (msg.match(/^(hello|hi|hey|howdy|good morning|good evening|sup|yo)/i)) {
    const replies = ["Hello! How can I help you? 😊", "Hi there! What can I do for you?", "Hey! How can I assist you today?"];
    return replies[Math.floor(Math.random() * replies.length)];
  }
  
  if (msg.includes('how are you')) {
    return "I'm doing great! Thanks for asking! 😄";
  }
  
  if (msg.includes('joke') || msg.includes('funny')) {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs! 😄",
      "What do you call a fake noodle? An impasta! 🍝",
      "Why did the scarecrow win an award? Outstanding in his field! 🌾",
      "Why don't scientists trust atoms? Because they make up everything! ⚛️"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  
  if (msg.includes('help') || msg.includes('what can you do')) {
    return "I can help with:\n📍 Geography - 'Where is Pakistan?'\n🎓 COMSATS University info\n😄 Jokes\n💬 General questions\n\nWhat would you like to know?";
  }
  
  if (msg.includes('time') || msg.includes('date')) {
    return `Current time: ${new Date().toLocaleString()} ⏰`;
  }
  
  return `I understand you asked: "${message}". I can help with geography, COMSATS info, jokes, and more! What would you like to know? 🤔`;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    const userMessage = messages[messages.length - 1].content;

    if (!workingModel) {
      await findWorkingModel();
    }

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
        return res.status(200).json({ reply, success: true, model: workingModel });
      } catch (error) {
        workingModel = null;
        await findWorkingModel();
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
            return res.status(200).json({ reply, success: true, model: workingModel });
          } catch (retryError) {
            // Continue to fallback
          }
        }
      }
    }

    const reply = getLocalResponse(userMessage);
    res.status(200).json({ reply, success: true, fallback: true });

  } catch (error) {
    const reply = getLocalResponse(req.body.messages[req.body.messages.length - 1].content);
    res.status(200).json({ reply, success: true, fallback: true });
  }
};