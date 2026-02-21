
import React, { useState, useEffect } from 'react';
import { GratitudeEntry } from '../types';

const GRATITUDE_KEY = 'neville_gratitude_journal';

const GratitudeJournal: React.FC = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(GRATITUDE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load gratitude entries", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(GRATITUDE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newEntry: GratitudeEntry = {
      id: Date.now().toString(),
      text: inputText.trim(),
      createdAt: Date.now(),
    };

    setEntries([newEntry, ...entries]);
    setInputText('');
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // Group entries by date
  const groupedEntries = entries.reduce((groups: { [key: string]: GratitudeEntry[] }, entry) => {
    const date = new Date(entry.createdAt).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {});

  return (
    <div className="container mx-auto px-4 max-w-3xl py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-amber-200 serif mb-2">Dziennik Wdzięczności</h1>
        <p className="text-gray-400 italic">"Wdzięczność jest najkrótszą drogą do spełnienia marzeń."</p>
      </div>

      <form onSubmit={handleAddEntry} className="mb-12">
        <div className="glass p-6 rounded-3xl border border-amber-500/20 shadow-xl">
          <label className="block text-amber-100 font-medium mb-3">Za co jesteś dzisiaj wdzięczny/a?</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Np. Jestem wdzięczny za spokój w sercu..."
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition text-white placeholder:text-gray-600"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg whitespace-nowrap"
            >
              Dodaj
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-12">
        {Object.keys(groupedEntries).length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border border-white/5">
            <span className="text-5xl block mb-4">✨</span>
            <p className="text-gray-400">Twój dziennik jest jeszcze pusty. Zacznij od zapisania pierwszej rzeczy, za którą czujesz wdzięczność.</p>
          </div>
        ) : (
          Object.keys(groupedEntries).map(date => (
            <div key={date} className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-amber-500/30"></div>
                <h3 className="text-amber-200/80 text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap serif italic">{date}</h3>
                <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-amber-500/30"></div>
              </div>
              
              <div className="grid gap-4">
                {groupedEntries[date].map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className="relative group"
                  >
                    <div className="glass p-5 rounded-2xl border border-white/5 flex justify-between items-center group-hover:border-amber-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-amber-500/5 bg-gradient-to-r from-white/[0.02] to-transparent">
                      <div className="flex items-start space-x-4">
                        <div className="mt-1 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] flex-shrink-0"></div>
                        <p className="text-gray-200 leading-relaxed font-light italic">
                          {entry.text}
                        </p>
                      </div>
                      <button 
                        onClick={() => deleteEntry(entry.id)}
                        className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all px-2 text-xl"
                        title="Usuń"
                      >
                        &times;
                      </button>
                    </div>
                    {/* Subtle numbering or index indicator */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1a1a2e] border border-amber-500/20 flex items-center justify-center text-[10px] text-amber-500/50 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {groupedEntries[date].length - index}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GratitudeJournal;
