const { spawn } = require('child_process');
const path = require('path');

// ✅ Full path to Ollama executable on Windows
const OLLAMA_PATH = `"C:\\Users\\under\\AppData\\Local\\Programs\\Ollama\\ollama.exe"`;

// Track running models by name → process
const processes = {};

// 🧠 Run model if not already running
function runModel(modelName) {
    return new Promise((resolve) => {
        if (processes[modelName]) {
            console.log(`✅ ${modelName} already running`);
            return resolve();
        }

        console.log(`🧠 Starting model: ${modelName}`);

        const proc = spawn(OLLAMA_PATH, ['run', modelName], {
            shell: true,
            windowsHide: true,
            detached: true,       // 👈 Detach process from terminal
            stdio: 'ignore'       // 👈 No terminal popup/output
        });

        proc.unref();             // 👈 Allow parent process to exit independently
        processes[modelName] = proc;

        // Wait a few seconds to let the model warm up
        setTimeout(resolve, 5000);
    });
}

// 🧹 Kill all running models cleanly
function cleanup() {
    console.log('🧹 Cleaning up running models...');
    for (const [modelName, proc] of Object.entries(processes)) {
        try {
            if (proc && !proc.killed && proc.pid) {
                process.kill(proc.pid);
                console.log(`🛑 Killed model: ${modelName}`);
            }
        } catch (err) {
            if (err.code !== 'ESRCH') {
                console.warn(`⚠️ Could not kill model ${modelName}:`, err.message);
            }
        }
    }
}

module.exports = {
    runModel,
    cleanup
};
