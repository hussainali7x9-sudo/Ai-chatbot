module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  res.status(200).json({ 
    status: 'OK', 
    message: 'Chatbot running on Vercel',
    hasGroqKey: !!GROQ_API_KEY
  });
};