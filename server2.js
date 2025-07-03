require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const { performance } = require('perf_hooks');
const ollamaAnalysis = require('./ollamaService');
const { log } = require('console');
const { OpenAI } = require('openai');
const app = express();
const { judgeAccuracyWithOpenAI } = require('./utils/openaiJudge');
// Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(compression({ threshold: 0 }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure res.flush is defined
app.use((req, res, next) => {
  if (!res.flush) {
    res.flush = () => {
      if (res.socket && res.socket.writable) {
        res.socket.write('');
      }
    };
  }
  next();
});

// Route for UI
app.get('/', (req, res) => {
  res.render('index'); // index.ejs must exist in /views
});

// Evaluate Route - SSE Streaming
app.get('/evaluate', async (req, res) => {
  const startTime = performance.now();
  const { prompt, taskType = 'general', priority = 'balanced' } = req.query;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt must be a non-empty string.' });
  }

  const models = ['gemma3:12b', 'mistral'];

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  let finishedModels = 0;
  const modelResults = [];

  models.forEach((model) => {
    const chunks = [];

    ollamaAnalysis(prompt, model, (chunk) => {
      chunks.push(chunk);
      res.write(`event: ${model}-stream\ndata: ${JSON.stringify({ model, chunk })}\n\n`);
      res.flush();
    })
      .then(async () => {
        const response = chunks.join('');
        const latencyMs = performance.now() - startTime;
        const accuracy = await evaluateAccuracy(prompt, response);
        
        modelResults.push({
          model,
          response,
          latencyMs,
          accuracy,
          cost: Math.random().toFixed(4)
        });

        res.write(`event: model-done\ndata: ${JSON.stringify({ model, latencyMs, accuracy })}\n\n`);
        res.flush();

        finishedModels++;
        if (finishedModels === models.length) sendDone();
      })
      .catch((err) => {
        modelResults.push({ model, error: err.message });

        res.write(`event: model-error\ndata: ${JSON.stringify({ model, error: err.message })}\n\n`);
        res.flush();

        finishedModels++;
        if (finishedModels === models.length) sendDone();
      });
  });
  
  async function sendDone() {
    const successful = modelResults.filter((r) => !r.error);
  const evaluationTime = (performance.now() - startTime).toFixed(2);

  const bestModel = successful.length > 0
    ? successful.reduce((best, current) => (current.accuracy > best.accuracy ? current : best))
    : null;

  res.write(`event: done\ndata: ${JSON.stringify({
    prompt,
    evaluations: successful,
    bestModel,
    errors: modelResults.filter((r) => r.error),
    metadata: { taskType, priority, evaluationTime }
  })}\n\n`);

  res.flush();
  res.end();
  }
});

// Accuracy evaluator using another LLM

  async function evaluateAccuracy(prompt, response) {
  // const evalPrompt = `Given this prompt:\n"${prompt}"\nand the following response:\n"${response}"\nRate the accuracy of the response from 0 to 1:`;

  // const chunks = [];
  // await ollamaAnalysis(evalPrompt, 'mistral', (chunk) => chunks.push(chunk));
  // const raw = chunks.join('').trim();

  // // Extract first float between 0 and 1
  // const match = raw.match(/([0]\.\d+|1(?:\.0+)?)/);
  // const score = match ? parseFloat(match[1]) : 0;

  // console.log(`🔍 Raw judge response: "${raw}"`);
 
  const score = await judgeAccuracyWithOpenAI(prompt,response);
  console.log(`✅ Extracted score: ${score}`);
  typeof(score)
  return score;
}


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
