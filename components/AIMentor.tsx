
import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse, DEFAULT_SYSTEM_INSTRUCTION } from '../services/geminiService';
import { Message, ChatSession, AppSettings } from '../types';

const SESSIONS_KEY = 'neville_chat_sessions';
const SETTINGS_KEY = 'neville_app_settings';
const AUTO_SAVE_INTERVAL = 15000;

const AIMentor: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionsRef = useRef<ChatSession[]>([]);

  // Load everything on mount
  useEffect(() => {
    // Load sessions
    const savedSessions = localStorage.getItem(SESSIONS_KEY);
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
        sessionsRef.current = parsed;
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id);
        } else {
          createNewSession();
        }
      } catch (e) {
        createNewSession();
      }
    } else {
      createNewSession();
    }

    // Auto-save interval
    const interval = setInterval(() => {
      if (sessionsRef.current.length > 0) {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessionsRef.current));
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Update ref when state changes
  useEffect(() => {
    sessionsRef.current = sessions;
    if (sessions.length > 0) {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSessionId, sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'Nowa rozmowa ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [{ role: 'model', text: 'Witaj, Twórco. Jakie nowe założenie dzisiaj wspólnie zbudujemy? Pamiętaj, że wyobraźnia to jedyna rzeczywistość.' }],
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setShowHistory(false);
  };

  const handleClearAll = () => {
    if (window.confirm("Czy na pewno chcesz usunąć CAŁĄ historię wszystkich rozmów?")) {
      localStorage.removeItem(SESSIONS_KEY);
      setSessions([]);
      createNewSession();
    }
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Usunąć tę rozmowę?')) {
      const filtered = sessions.filter(s => s.id !== id);
      setSessions(filtered);
      if (activeSessionId === id) {
        if (filtered.length > 0) {
          setActiveSessionId(filtered[0].id);
        } else {
          createNewSession();
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !activeSessionId) return;

    const userMessageText = input.trim();
    setInput('');
    
    // Update active session locally
    const updatedSessions = sessions.map(s => {
      if (s.id === activeSessionId) {
        const newMsgs = [...s.messages, { role: 'user' as const, text: userMessageText }];
        return { 
          ...s, 
          messages: newMsgs, 
          updatedAt: Date.now(),
          title: s.messages.length === 1 ? userMessageText.substring(0, 30) + '...' : s.title
        };
      }
      return s;
    });
    setSessions(updatedSessions);
    setIsLoading(true);

    // Get current settings
    const settingsRaw = localStorage.getItem(SETTINGS_KEY);
    const settings: AppSettings = settingsRaw ? JSON.parse(settingsRaw) : { 
      temperature: 0.7, 
      systemInstruction: DEFAULT_SYSTEM_INSTRUCTION 
    };

    // Prepare history for API
    const currentSession = updatedSessions.find(s => s.id === activeSessionId)!;
    const history = currentSession.messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await getAIResponse(
        userMessageText, 
        history, 
        settings.systemInstruction, 
        settings.temperature,
        settings.apiKey
      );
      
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, { role: 'model', text: responseText || "Wyobraźnia milczy..." }] };
        }
        return s;
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-5xl h-[85vh] flex flex-col md:flex-row pt-4 gap-6">
      
      {/* Sidebar - History (Desktop) */}
      <aside className={`md:w-1/4 glass rounded-3xl p-4 flex flex-col overflow-hidden ${showHistory ? 'fixed inset-0 z-50 md:relative' : 'hidden md:flex'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-amber-200 serif">Historia</h3>
          <button onClick={() => setShowHistory(false)} className="md:hidden text-gray-400 text-2xl">&times;</button>
        </div>
        
        <button 
          onClick={createNewSession}
          className="w-full bg-amber-600/20 hover:bg-amber-600/40 text-amber-100 border border-amber-500/30 py-3 rounded-xl mb-4 transition flex items-center justify-center space-x-2 font-bold"
        >
          <span>+</span> <span>Nowy Czat</span>
        </button>

        <div className="flex-grow overflow-y-auto space-y-2 pr-2">
          {sessions.map(s => (
            <div 
              key={s.id}
              onClick={() => { setActiveSessionId(s.id); setShowHistory(false); }}
              className={`p-3 rounded-xl cursor-pointer transition-all border group relative ${
                activeSessionId === s.id ? 'bg-amber-500/20 border-amber-500/50' : 'bg-white/5 border-transparent hover:bg-white/10'
              }`}
            >
              <p className="text-sm text-gray-200 truncate pr-6">{s.title}</p>
              <p className="text-[10px] text-gray-500">{new Date(s.updatedAt).toLocaleDateString()}</p>
              <button 
                onClick={(e) => deleteSession(e, s.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={handleClearAll}
          className="mt-4 text-xs text-red-400/50 hover:text-red-400 transition uppercase tracking-widest text-center"
        >
          Usuń wszystko
        </button>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col h-full relative">
        <div className="flex justify-between items-center mb-2 md:hidden">
          <button onClick={() => setShowHistory(true)} className="text-amber-200 font-bold border border-amber-200/20 px-3 py-1 rounded-lg">☰ Historia</button>
          <button onClick={createNewSession} className="text-amber-200 font-bold border border-amber-200/20 px-3 py-1 rounded-lg">+ Nowy</button>
        </div>

        <div className="flex-grow glass rounded-3xl overflow-hidden flex flex-col">
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {activeSession?.messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl ${
                  m.role === 'user' 
                    ? 'bg-amber-600 text-white rounded-tr-none shadow-lg' 
                    : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-2xl flex space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 bg-black/20">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Napisz o swoim założeniu..."
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition text-white"
            />
            <div className="flex items-center space-x-2">
              {isLoading && (
                <span className="text-amber-400 text-sm animate-pulse hidden sm:inline">Myślę...</span>
              )}
              <button
                type="submit"
                disabled={isLoading || !activeSessionId}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Wyślij</span>
              </button>
            </div>
          </form>
        </div>
        
        <p className="text-center text-[10px] text-gray-500 mt-2">
          Rozmowy są zapisywane lokalnie. Możesz je wyeksportować w Ustawieniach.
        </p>
      </div>
    </div>
  );
};

export default AIMentor;
