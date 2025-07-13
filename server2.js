require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const { performance } = require('perf_hooks');
const OllamaAnalysis = require('./ollamaService');

const app = express();
const axios = require('axios')
const { judgeAccuracyWithOpenAI } = require('./utils/openaiJudge');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(compression({ threshold: 0 }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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


app.get('/', (req, res) => {
  res.render('index'); 
});
app.get('/evaluate', async (req, res) => {
  const { prompt } = req.query;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt must be a non-empty string.' });
  }

  const startTime = performance.now();
  


    const response = await axios.post('http://localhost:5001/classify', { prompt });

    const { type, model } = response.data;





  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const chunks = [];
  try {
    // Simulate streaming from mock LLM
    await OllamaAnalysis(prompt, model, (chunk) => {
  
  chunks.push(chunk);
  res.write(`data: ${JSON.stringify({ model, chunk })}\n\n`);
  res.flush();
});

    const responseText = chunks.join('');
    const latencyMs = performance.now() - startTime;
    const accuracy = 1.0 // Mock accuracy (0 to 1)
    //accuracy is random for now until shivam's work
    // Send model-done event
    res.write(`event: model-done\ndata: ${JSON.stringify({ model, latencyMs, accuracy })}\n\n`);
    res.flush();

    // Send done event
    const evaluationTime = (performance.now() - startTime).toFixed(2);
    res.write(`event: done\ndata: ${JSON.stringify({
      prompt,
      evaluations: [{ model, response: responseText, latencyMs, accuracy }],
      bestModel: { model, accuracy },
      errors: [],
      metadata: { type, evaluationTime }
    })}\n\n`);
    res.flush();

    res.end();
  } catch (err) {
    console.error('Error in streaming:', err);
    res.write(`event: model-error\ndata: ${JSON.stringify({ model, error: err.message })}\n\n`);
    res.flush();
    res.end();
  }
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
