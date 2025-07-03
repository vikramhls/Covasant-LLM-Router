const axios = require('axios');

async function ollamaAnalysis(prompt, model, onChunk) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(
                'http://localhost:11434/api/generate',
                {
                    model,
                    prompt,
                    stream: true
                },
                {
                    responseType: 'stream'
                }
            );

            response.data.on('data', (chunk) => {
                const lines = chunk.toString().split('\n').filter(Boolean);
                for (const line of lines) {
                    try {
                        const json = JSON.parse(line);
                        if (json.response) {
                            onChunk(json.response); // ✅ send text back to caller
                        }
                    } catch (err) {
                        console.warn('⛔ JSON parse error:', err);
                    }
                }
            });

            response.data.on('end', () => {
                resolve(); // ✅ model finished streaming
            });

            response.data.on('error', (err) => {
                reject(err); // will be caught in /evaluate route
            });

        } catch (error) {
            reject(error); // catch fetch errors
        }
    });
}

module.exports = ollamaAnalysis;
