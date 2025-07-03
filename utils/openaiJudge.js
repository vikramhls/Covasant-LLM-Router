require('dotenv').config();
const axios = require('axios');

async function judgeAccuracyWithOpenAI(prompt, response) {
  const evalPrompt = `Given this prompt:\n"${prompt}"\nand the following response:\n"${response}"\nRate the accuracy of the response from 0 to 100: note return only number in response not any explanation and no 2 response must be same, measure smallest to smallest parameter infact note the way and correctness`;

  try {
    const res = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mistral-7B-Instruct-v0.2', // You can use other Together-supported chat models
        messages: [
          {
            role: 'user',
            content: evalPrompt,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        },
      }
    );

    const scoreText = res.data.choices[0].message.content.trim();
    const score = parseFloat(scoreText);
    return isNaN(score) ? 0 : score;
  } catch (error) {
    console.error('Together API error:', error.message);
    return 0;
  }
}

module.exports = { judgeAccuracyWithOpenAI };
