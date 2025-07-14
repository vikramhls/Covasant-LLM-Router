#  Dynamic LLM Router

<div align="center">
  <img src="https://img.shields.io/badge/Accuracy-99%25-brightgreen?style=for-the-badge&logo=target" alt="Accuracy">
  <img src="https://img.shields.io/badge/F1--Score-0.84-blue?style=for-the-badge&logo=chart-line" alt="F1-Score">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white" alt="FastAPI">
</div>

<div align="center">
  <h3>🎯 Intelligent AI Model Selection for Optimal Performance</h3>
  <p><em>Automate model selection, deliver real-time responses, and provide performance metrics to enhance efficiency in AI interactions.</em></p>
</div>

---

##  Overview

The **Dynamic LLM Router** is a sophisticated full-stack system that intelligently routes prompts to the most suitable AI model based on advanced classification algorithms. Built for the **COVASANT Hackathon**, this project combines modern web technologies with machine learning to deliver optimal AI responses.

###  The Challenge
Different AI models (Gemma, Claude, Mistral, etc.) excel in different areas. Manual model selection is inefficient and suboptimal. Our solution automatically identifies the best model for each prompt type.

###  Our Solution
A real-time, intelligent routing system that:
- **Classifies prompts** using advanced ML algorithms
- **Routes to optimal models** automatically
- **Streams responses** in real-time
- **Tracks performance** with detailed metrics

---

##  System Architecture

```mermaid
graph TB
    A[Frontend<br/>HTML/CSS/JavaScript] --> B[Backend<br/>Express.js Server]
    B --> C[Classifier<br/>ML Models]
    B --> D[AI Models<br/>Ollama Execution]
    
    C --> E[Logistic Regression]
    C --> F[K-Nearest Neighbors]
    C --> G[Decision Trees]
    C --> H[Support Vector Machine]
    C --> I[XGBoost]
    
    D --> J[Gemma 3]
    D --> K[Mistral]
    D --> L[DeepSeek R1]
```

### 🔧 Component Breakdown

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | HTML/CSS/JavaScript + SSE | Real-time streaming chat interface |
| **Backend** | Express.js (Node.js) | API management and data coordination |
| **Classifier** | Python + FastAPI | Prompt analysis and model selection |
| **AI Models** | Ollama | Local model execution and streaming |

---

##  Key Features

###  **Smart Prompt Routing**
- Automatically matches prompts to optimal AI models
- Uses advanced classification algorithms
- Achieved **99% accuracy** with SBERT embeddings

###  **Performance Metrics**
- Real-time latency tracking (milliseconds)
- Cost analysis per model
- Transparency in model performance

###  **Modern Chat Interface**
- Responsive UI with real-time streaming
- Error handling and navigation
- Performance insights displayed inline

###  **Scalability**
- Support for multiple AI models
- Future-ready architecture
- Easy integration of new models

---

##  Technology Stack

### Frontend
- **HTML5/CSS3** - Modern responsive design
- **JavaScript** - Interactive functionality
- **Font Awesome** - Beautiful icons
- **EventSource** - Real-time streaming

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client
- **Compression & CORS** - Optimization

### Machine Learning
- **Python** - Core ML development
- **FastAPI** - Lightweight API framework
- **SBERT** - Semantic embeddings
- **Scikit-learn** - ML algorithms

### AI Models
- **Ollama** - Local model execution
- **Gemma 3** - Google's language model
- **Mistral** - Efficient language model
- **DeepSeek R1** - Advanced reasoning model

---

##  Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Ollama installed locally

##  Performance Results

###  Model Performance
- **Accuracy**: 99%
- **F1-Score**: 0.84
- **Best Combination**: SBERT + Support Vector Machine

###  Algorithm Comparison
| Algorithm | Accuracy | F1-Score | Speed |
|-----------|----------|----------|--------|
| SBERT + SVM | 99% | 0.84 | Fast |
| SBERT + Logistic Regression | 97% | 0.82 | Very Fast |
| TF-IDF + SVM | 92% | 0.78 | Fast |
| BoW + Random Forest | 88% | 0.75 | Medium |

###  Optimizations Implemented
- **Embedding Caching** - Reduced computation time
- **ONNX Export** - Faster model inference
- **Model Distillation** - Lightweight deployment
- **Process Management** - Stable resource handling

---

##  Usage Examples

### Basic Chat Interaction
```javascript
// Frontend streaming example
const eventSource = new EventSource('/api/chat/stream');
eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    displayMessage(data.content, data.model, data.latency);
};
```

### API Integration
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain quantum computing"}'
```

---

##  Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

##  Future Enhancements

- [ ] **Analytics Dashboard** - Comprehensive usage statistics
- [ ] **Model Fine-tuning** - Custom model training
- [ ] **Multi-language Support** - International accessibility
- [ ] **Cloud Deployment** - Scalable infrastructure
- [ ] **Advanced Metrics** - Quality scoring and feedback loops

---

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

##  Acknowledgments

- **COVASANT Hackathon** - For providing the platform
- **Ollama Team** - For excellent local AI model execution
- **Open Source Community** - For the amazing tools and libraries

---

<div align="center">
  <h3>🌟 Star this repo if you found it helpful! 🌟</h3>
  <p>Built with ❤️ for the AI community</p>
</div>

---

##  Contact

For questions, suggestions, or collaborations, feel free to reach out:

- **GitHub Issues** - For bug reports and feature requests
- **Discussions** - For general questions and community chat

<div align="center">
  <sub>Made with ❤️ by the Team FBI</sub>
</div>
