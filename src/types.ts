export interface Document {
  id: string;
  title: string;
  content: string;
  chunks: string[];
  timestamp: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; excerpt: string }[];
  timestamp: number;
}

export interface EmbeddingModel {
  id: string;
  name: string;
  description: string;
}

export interface LoadingState {
  isThinking: boolean;
  stage?: string;
}
