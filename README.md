# AI Study Buddy - RAG-Powered Study Assistant



## 🎯 Problem Statement

As an AI Master's student at BTU Cottbus, I face the challenge of managing and quickly retrieving information from multiple lecture sources (PDFs, notes, papers). Traditional search (Ctrl+F) is keyword-based and misses context. This project solves the **real-world problem of efficient knowledge retrieval from study materials** using Retrieval-Augmented Generation (RAG).

## 💡 Solution

**AI Study Buddy** is a browser-based RAG (Retrieval-Augmented Generation) application that:
1. Ingests study materials (lecture notes, papers, documents)
2. Chunks and embeds them using HuggingFace sentence transformers
3. Performs **semantic search** (not keyword search) to find relevant context
4. Generates contextual answers grounded in the actual study materials

## 🛠️ Tech Stack (Exactly What German Companies Ask For)

| Technology 
|---|---|---|
| **React + TypeScript** | Modern frontend framework |
| **Tailwind CSS** | Utility-first styling | 
| **HuggingFace Transformers** | Open-source embedding models |
| **RAG Architecture** | Retrieval-Augmented Generation |
| **Vector Embeddings (768d)** | Semantic search via cosine similarity |
| **Document Chunking** | Smart text splitting with overlap | 
| **ONNX Runtime** | Browser-optimized ML inference | 
| **Git** | Version control | 

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

## 🔄 Future Improvements

1. Integrate actual LangChain/LlamaIndex instead of custom implementation
2. Add PDF parsing with pdf.js
3. Connect to real LLM via HuggingFace Inference API
4. Implement agentic workflows with multi-step reasoning
5. Add multi-modal support (images, diagrams from lectures)

---

**Built by Panth Patel** | BTU Cottbus - AI Master's | Actively seeking Gen AI Internship in Germany
