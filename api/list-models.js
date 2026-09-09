const AVAILABLE_MODELS = [
  'qwen/qwen3.8-27b',
  'qwen/qwen3.6-27b',
  'groq/compound-mini',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'allam-2-7b',
  'groq/compound'
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.status(200).json({ 
    success: true, 
    models: AVAILABLE_MODELS,
    workingModel: 'Determined at runtime'
  });
};