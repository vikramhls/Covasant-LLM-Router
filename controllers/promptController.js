const axios = require('axios');

const classifyPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post('http://localhost:5001/classify', { prompt });

    const { type, model } = response.data;

    res.json({ success: true, type, model });
  } catch (error) {
    console.error("Error communicating with Python:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { classifyPrompt };
