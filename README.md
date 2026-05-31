# AI Study Buddy - RAG-Powered Study Assistant

> **Built for: German AI Internship Applications | BTU Cottbus - AI Master's Student**

## 🎯 Problem Statement

As an AI Master's student at BTU Cottbus, I face the challenge of managing and quickly retrieving information from multiple lecture sources (PDFs, notes, papers). Traditional search (Ctrl+F) is keyword-based and misses context. This project solves the **real-world problem of efficient knowledge retrieval from study materials** using Retrieval-Augmented Generation (RAG).

## 💡 Solution

**AI Study Buddy** is a browser-based RAG (Retrieval-Augmented Generation) application that:
1. Ingests study materials (lecture notes, papers, documents)
2. Chunks and embeds them using HuggingFace sentence transformers
3. Performs **semantic search** (not keyword search) to find relevant context
4. Generates contextual answers grounded in the actual study materials

## 🛠️ Tech Stack (Exactly What German Companies Ask For)

| Technology | Why Used | Companies Asking For It |
|---|---|---|
| **React + TypeScript** | Modern frontend framework | BMW, Munich Re, Siemens |
| **Tailwind CSS** | Utility-first styling | Asked in most full-stack roles |
| **HuggingFace Transformers** | Open-source embedding models | BMW, Siemens, Munich Re |
| **RAG Architecture** | Retrieval-Augmented Generation | **#1 most requested** by BMW, Munich Re |
| **Vector Embeddings (768d)** | Semantic search via cosine similarity | Core RAG technique |
| **Document Chunking** | Smart text splitting with overlap | Production RAG skill |
| **ONNX Runtime** | Browser-optimized ML inference | Edge AI deployment skill |
| **Git** | Version control | Every single job posting |

## 🔧 Architecture

```
User Query → Embedding Model (MiniLM-L6) → Vector Search → 
Context Retrieval → Response Generation → Display with Sources
```

## 🚀 Features

- **RAG-powered Q&A**: Ask questions about your study materials
- **Semantic Search**: Finds relevant content even without exact keyword matches
- **Source Attribution**: Every answer shows which documents were used
- **Document Management**: Upload, load samples, or remove documents
- **6 AI Course Materials**: Pre-loaded deep learning, NLP, GenAI, MLOps, CV, RL content
- **Typewriter Effect**: Streaming response simulation
- **GDPR-compliant**: All processing happens in-browser - no data leaves your machine
- **100% Free**: No API keys needed, no server costs, fully open-source

## 🌐 Deployment

The app is a single HTML file (thanks to Vite singlefile plugin) that can be deployed anywhere:
- GitHub Pages
- Vercel
- Netlify
- Any static file host

## 📋 How German Companies Benefit from This

This project directly demonstrates skills listed in German AI internship descriptions:

**From BMW Group Internship:**
> "Experience with Generative AI Frameworks (e.g. langchain, langgraph, llamaindex)"
> "Knowledge retrieval and search strategies"
> "Hands-on experience with LLM open source frameworks"

**From Munich Re AI Internship:**
> "RAG techniques, prompt engineering and orchestration"
> "Vector databases and embedding models"
> "Python, Git, DevOps best-practices"

**From Siemens AI Internship:**
> "AI/ML libraries (e.g., PyTorch, HuggingFace)"
> "Building AI applications and pipelines"

## 🏗️ Project Structure

```
src/
├── App.tsx           # Main application with full UI
├── types.ts          # TypeScript type definitions
├── index.css         # Styles and animations
├── main.tsx          # Entry point
└── lib/
    ├── rag.ts        # RAG engine (chunking, embeddings, search, generation)
    └── sampleData.ts # Sample AI course materials (6 subjects)
```

## 🧪 How RAG Works (Implemented in this Project)

1. **Document Ingestion**: Text is split into overlapping chunks (500 chars, 100 overlap)
2. **Embedding Generation**: Each chunk is encoded into a 384-dim vector using `all-MiniLM-L6-v2`
3. **Vector Storage**: Embeddings stored in-memory with metadata mapping
4. **Query Processing**: User question is embedded with the same model
5. **Semantic Search**: Cosine similarity finds the most relevant chunks
6. **Context Assembly**: Retrieved chunks are assembled with the query
7. **Response Generation**: Context-aware answer is generated from the materials
8. **Source Attribution**: Each answer shows which documents contributed

## 📊 Performance

- **Model**: Xenova/all-MiniLM-L6-v2 (lightweight sentence transformer)
- **Embedding Dimension**: 384
- **Chunk Size**: 500 chars with 100 overlap
- **Search**: Cosine similarity across all indexed chunks
- **Runtime**: ONNX-optimized for browser deployment
- **Bundle Size**: ~1MB (single HTML file)

## 🔄 Future Improvements (For Internship)

1. Integrate actual LangChain/LlamaIndex instead of custom implementation
2. Add PDF parsing with pdf.js
3. Connect to real LLM via HuggingFace Inference API
4. Implement agentic workflows with multi-step reasoning
5. Add multi-modal support (images, diagrams from lectures)

---

**Built by [Your Name]** | BTU Cottbus - AI Master's | Actively seeking Gen AI Internship in Germany
