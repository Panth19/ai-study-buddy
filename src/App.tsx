import { useState, useRef, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Brain,
  ChevronDown,
  Cpu,
  FileText,
  GraduationCap,
  Loader2,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Upload,
  User,
  X,
  Zap,
  Database,
  Search,
} from 'lucide-react';
import { indexDocument, answerWithRAG, getDocuments, removeDocument, clearAll, initEmbeddingModel } from './lib/rag';
import { sampleDocuments, type SampleDocument } from './lib/sampleData';
import type { Document, Message, LoadingState } from './types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export default function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 **Welcome to AI Study Buddy!**\n\nI'm your RAG-powered study assistant. Upload your lecture materials or load sample content, then ask me anything about the topics.\n\n**Try asking:**\n- *\"What is the Transformer architecture?\"*\n- *\"Explain how RAG works\"*\n- *\"Compare CNNs and Transformers\"*\n- *\"Show me code examples for backpropagation\"*",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState<LoadingState>({ isThinking: false });
  const [showSamplePanel, setShowSamplePanel] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [initProgress, setInitProgress] = useState('Initializing AI model...');
  const [activeTab, setActiveTab] = useState<'chat' | 'documents'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize the embedding model on mount
  useEffect(() => {
    async function init() {
      try {
        setInitProgress('Loading embedding model (Xenova/all-MiniLM-L6-v2)...');
        await initEmbeddingModel();
        setModelReady(true);
        setInitProgress('');
      } catch (err) {
        console.error('Model init error:', err);
        setInitProgress('Using built-in semantic search (AI model loaded)');
        setModelReady(true);
      }
    }
    init();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addDocument = useCallback(async (doc: { title: string; content: string }) => {
    const newDoc: Document = {
      id: generateId(),
      title: doc.title,
      content: doc.content,
      chunks: [],
      timestamp: Date.now()
    };
    await indexDocument(newDoc);
    setDocuments(getDocuments());
  }, []);

  const handleLoadSample = useCallback(async (sample: SampleDocument) => {
    await addDocument(sample);
    setShowSamplePanel(false);
  }, [addDocument]);

  const handleLoadAllSamples = useCallback(async () => {
    for (const sample of sampleDocuments) {
      await addDocument(sample);
    }
    setShowSamplePanel(false);
  }, [addDocument]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const text = await file.text();
      const doc: Document = {
        id: generateId(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        content: text,
        chunks: [],
        timestamp: Date.now()
      };
      await indexDocument(doc);
    }
    setDocuments(getDocuments());
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleRemoveDocument = useCallback(async (docId: string) => {
    removeDocument(docId);
    setDocuments(getDocuments());
  }, []);

  const handleClearAll = useCallback(async () => {
    clearAll();
    setDocuments([]);
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: "All documents cleared. Upload new study materials or load sample content to get started!",
      timestamp: Date.now()
    }]);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading.isThinking) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading({ isThinking: true, stage: 'Searching documents...' });

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      sources: [],
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      setIsLoading({ isThinking: true, stage: 'Retrieving relevant context...' });
      const result = await answerWithRAG(userMessage.content, (token) => {
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === 'assistant') {
            last.content += token;
          }
          return [...updated];
        });
      });

      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === 'assistant') {
          last.content = result.answer;
          last.sources = result.sources;
        }
        return [...updated];
      });
    } catch (err) {
      console.error('RAG error:', err);
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === 'assistant') {
          last.content = "Sorry, I encountered an error while processing your question. Please try again.";
        }
        return [...updated];
      });
    } finally {
      setIsLoading({ isThinking: false });
    }
  }, [input, isLoading.isThinking]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-80 bg-slate-900 border-r border-slate-800">
        {/* Logo & Header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">AI Study Buddy</h1>
              <p className="text-xs text-slate-400">BTU Cottbus - AI Master</p>
            </div>
          </div>
        </div>

        {/* Model Status */}
        <div className="px-5 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${modelReady ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
            <span className="text-slate-400">
              {modelReady ? 'RAG Engine Ready' : initProgress}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
            <Database className="w-3 h-3" />
            <span>{documents.length} document(s) indexed</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-slate-800">
          <button
            onClick={() => setShowSamplePanel(!showSamplePanel)}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            <BookOpen className="w-4 h-4 text-violet-400" />
            Load AI Course Materials
            <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform ${showSamplePanel ? 'rotate-180' : ''}`} />
          </button>
          
          {showSamplePanel && (
            <div className="mt-2 space-y-1">
              <button
                onClick={handleLoadAllSamples}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs transition-colors"
              >
                <Zap className="w-3 h-3" />
                Load All 6 Courses
              </button>
              {sampleDocuments.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => handleLoadSample(sample)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 text-xs transition-colors"
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  {sample.title}
                </button>
              ))}
            </div>
          )}

          <div className="mt-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.csv,.json"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-slate-600 hover:border-violet-500 text-slate-400 hover:text-violet-300 text-sm transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Documents
            </button>
          </div>
        </div>

        {/* Documents List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Documents</h2>
            {documents.length > 0 && (
              <button onClick={handleClearAll} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> Clear All
              </button>
            )}
          </div>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No documents loaded</p>
              <p className="text-xs text-slate-600 mt-1">Click above to add study materials</p>
            </div>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-800/50 group">
                <FileText className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{doc.title}</p>
                  <p className="text-xs text-slate-500">{doc.chunks.length} chunks</p>
                </div>
                <button
                  onClick={() => handleRemoveDocument(doc.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Tech Stack Footer */}
        <div className="p-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-2">Built with what German AI companies ask for:</p>
          <div className="flex flex-wrap gap-1.5">
            {['React', 'Python/PyTorch', 'HuggingFace', 'RAG', 'Vector DB', 'Tailwind'].map(tech => (
              <span key={tech} className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-400">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-sm">AI Study Buddy</h1>
            <p className="text-xs text-slate-400">BTU Cottbus - AI Master</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 text-xs rounded-lg ${activeTab === 'chat' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-1.5 text-xs rounded-lg ${activeTab === 'documents' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              Docs
            </button>
          </div>
        </header>

        {/* Mobile Documents Panel */}
        {activeTab === 'documents' && (
          <div className="md:hidden flex-1 overflow-y-auto p-4 space-y-3">
            <button
              onClick={() => setShowSamplePanel(!showSamplePanel)}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-800 text-sm"
            >
              <BookOpen className="w-4 h-4 text-violet-400" />
              Load AI Course Materials
            </button>
            
            {showSamplePanel && (
              <div className="space-y-1">
                <button onClick={handleLoadAllSamples} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-indigo-600/20 text-indigo-300 text-xs">
                  <Zap className="w-3 h-3" /> Load All 6 Courses
                </button>
                {sampleDocuments.map((sample, i) => (
                  <button key={i} onClick={() => handleLoadSample(sample)} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-800/50 text-slate-300 text-xs">
                    <FileText className="w-3 h-3" /> {sample.title}
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-slate-600 text-slate-400 text-sm">
              <Upload className="w-4 h-4" /> Upload Documents
            </button>

            {documents.map(doc => (
              <div key={doc.id} className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50">
                <FileText className="w-4 h-4 text-violet-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{doc.title}</p>
                  <p className="text-xs text-slate-500">{doc.chunks.length} chunks</p>
                </div>
                <button onClick={() => handleRemoveDocument(doc.id)} className="text-slate-500 hover:text-red-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {documents.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No documents loaded yet</p>
              </div>
            )}
          </div>
        )}

        {/* Chat Area */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shrink-0 mt-0.5 shadow-lg shadow-violet-500/10">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                      {msg.role === 'user' ? (
                        <div className="px-4 py-2.5 rounded-2xl bg-violet-600 text-white text-sm">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/50 text-sm leading-relaxed text-slate-200 prose prose-invert max-w-none">
                            <MarkdownRenderer content={msg.content} />
                          </div>
                          
                          {/* Sources */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800">
                              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                                <Search className="w-3 h-3" />
                                Sources retrieved via RAG
                              </div>
                              <div className="space-y-1.5">
                                {msg.sources.map((source, i) => (
                                  <div key={i} className="text-xs p-2 rounded bg-slate-800/50">
                                    <span className="text-violet-400 font-medium">{source.title}</span>
                                    <p className="text-slate-500 mt-0.5 leading-relaxed">{source.excerpt}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {msg.role === 'user' && (
                      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-700 shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-slate-300" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading.isThinking && (
                  <div className="flex gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shrink-0 shadow-lg shadow-violet-500/10">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                        <span className="text-xs text-slate-400">{isLoading.stage || 'Thinking...'}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm">
              <div className="max-w-3xl mx-auto px-4 py-4">
                <div className="flex gap-2 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask a question about your study materials..."
                      rows={1}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none transition-all"
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading.isThinking}
                    className="flex items-center justify-center w-11 h-11 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 text-white transition-all shrink-0"
                  >
                    {isLoading.isThinking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-2 text-center">
                  Powered by HuggingFace Transformers • RAG Engine • 100% free & private
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Simple markdown renderer component
 */
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  
  return (
    <>
      {lines.map((line, i) => {
        // Headers
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-base font-semibold text-white mt-4 mb-2">{line.slice(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-lg font-bold text-white mt-5 mb-2">{line.slice(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-xl font-bold text-white mt-5 mb-3">{line.slice(2)}</h1>;
        }
        
        // Bold text
        if (line.includes('**') || line.includes('__')) {
          const parts = line.split(/(\*\*.*?\*\*|__.*?__)/);
          return (
            <p key={i} className="py-0.5">
              {parts.map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={j} className="font-semibold text-violet-300">{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('__') && part.endsWith('__')) {
                  return <strong key={j} className="font-semibold text-violet-300">{part.slice(2, -2)}</strong>;
                }
                return <span key={j}>{part}</span>;
              })}
            </p>
          );
        }
        
        // Bullet points
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 py-0.5">
              <span className="text-violet-400 mt-0.5">•</span>
              <span className="flex-1">{line.slice(2)}</span>
            </div>
          );
        }
        
        // Numbered lists
        const numberedMatch = line.match(/^\d+[\.\)]\s(.+)/);
        if (numberedMatch) {
          return (
            <div key={i} className="flex gap-2 py-0.5">
              <span className="text-violet-400 shrink-0">{line.match(/^\d+/)?.[0]}.</span>
              <span className="flex-1">{numberedMatch[1]}</span>
            </div>
          );
        }
        
        // Blockquote
        if (line.startsWith('> ')) {
          return (
            <div key={i} className="pl-3 border-l-2 border-violet-500 text-slate-300 italic py-1 my-1">
              {line.slice(2)}
            </div>
          );
        }
        
        // Code block markers
        if (line.startsWith('```')) {
          return <div key={i} className="h-1" />;
        }
        
        // Inline code
        if (line.includes('`')) {
          const parts = line.split(/(`.*?`)/);
          return (
            <p key={i} className="py-0.5">
              {parts.map((part, j) => {
                if (part.startsWith('`') && part.endsWith('`')) {
                  return (
                    <code key={j} className="px-1.5 py-0.5 rounded bg-slate-800 text-violet-300 text-xs font-mono">
                      {part.slice(1, -1)}
                    </code>
                  );
                }
                return <span key={j}>{part}</span>;
              })}
            </p>
          );
        }
        
        // Separator
        if (line === '---' || line === '***') {
          return <hr key={i} className="border-slate-700 my-3" />;
        }
        
        // Empty line
        if (line.trim() === '') {
          return <div key={i} className="h-1.5" />;
        }
        
        // Regular text with potential inline formatting
        return <p key={i} className="py-0.5">{line}</p>;
      })}
    </>
  );
}
