
export interface Concept {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Quote {
  text: string;
  source: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface Practice {
  id: string;
  name: string;
  description: string;
  steps: string[];
}

export interface AppSettings {
  temperature: number;
  systemInstruction: string;
  apiKey?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export interface NoteEntry {
  id: string;
  content: string;
  type: 'note' | 'fragment';
  createdAt: number;
  isFavorite?: boolean;
}

export interface BookNotes {
  id: string;
  title: string;
  entries: NoteEntry[];
}

export interface GratitudeEntry {
  id: string;
  text: string;
  createdAt: number;
}
