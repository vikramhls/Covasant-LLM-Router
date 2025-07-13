const axios = require('axios');

async function ollamaAnalysis(prompt, model, onChunk, maxTokens = 100) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(
                'http://localhost:11434/api/generate',
                {
                    model,
                    prompt,
                    stream: true // Let the model flow naturally
                },
                {
                    responseType: 'stream'
                }
            );

            let buffer = '';
            let fullResponse = '';

            response.data.on('data', (chunk) => {
                buffer += chunk.toString();
                const lines = buffer.split('\n');
                buffer = lines.pop(); // handle incomplete line

                for (const line of lines) {
                    if (!line.trim()) continue;

                    try {
                        const json = JSON.parse(line);
                        if (json.response) {
                            fullResponse += json.response;
                            onChunk(json.response); // stream to user
                        }
                    } catch (err) {
                        console.warn('⚠️ JSON parse error (ignored line):', line);
                    }
                }
            });

            response.data.on('end', () => {
                // After full response, process it sentence-wise
                const sentences = fullResponse.match(/[^.!?]+[.!?]+/g) || [fullResponse];

                let output = '';
                let tokenCount = 0;

                for (const sentence of sentences) {
                    const sentenceTokens = sentence.trim().split(/\s+/).length;
                    if (tokenCount + sentenceTokens > maxTokens) break;
                    output += sentence;
                    tokenCount += sentenceTokens;
                }

                // Call onChunk with final trimmed coherent result
                onChunk('\n\n--- Final Trimmed Response ---\n' + output.trim());
                resolve();
            });

            response.data.on('error', (err) => {
                reject(err);
            });

        } catch (error) {
            reject(error);
        }
    });
}

module.exports = ollamaAnalysis;
