
import React, { useState, useEffect } from 'react';
import { BookNotes, NoteEntry } from '../types';
import { NEVILLE_BOOKS } from '../constants';

const STORAGE_KEY = 'neville_notes_data';

const Notes: React.FC = () => {
  const [books, setBooks] = useState<BookNotes[]>([]);
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'book' | 'favorites'>('book');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [entryType, setEntryType] = useState<'note' | 'fragment'>('note');
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [customBookTitle, setCustomBookTitle] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBooks(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading notes", e);
      }
    }
  }, []);

  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }, [books]);

  const addBook = (title: string) => {
    const newBook: BookNotes = {
      id: Date.now().toString(),
      title,
      entries: []
    };
    setBooks(prev => [...prev, newBook]);
    setActiveBookId(newBook.id);
    setViewMode('book');
    setIsAddingBook(false);
    setCustomBookTitle('');
  };

  const addEntry = () => {
    if (!newEntryContent.trim() || !activeBookId) return;

    const newEntry: NoteEntry = {
      id: Date.now().toString(),
      content: newEntryContent.trim(),
      type: entryType,
      createdAt: Date.now(),
      isFavorite: false
    };

    setBooks(prev => prev.map(book => {
      if (book.id === activeBookId) {
        return { ...book, entries: [newEntry, ...book.entries] };
      }
      return book;
    }));

    setNewEntryContent('');
  };

  const toggleFavorite = (bookId: string, entryId: string) => {
    setBooks(prev => prev.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          entries: book.entries.map(entry => 
            entry.id === entryId ? { ...entry, isFavorite: !entry.isFavorite } : entry
          )
        };
      }
      return book;
    }));
  };

  const deleteEntry = (bookId: string, entryId: string) => {
    if (confirm('Usunąć ten wpis?')) {
      setBooks(prev => prev.map(book => {
        if (book.id === bookId) {
          return { ...book, entries: book.entries.filter(e => e.id !== entryId) };
        }
        return book;
      }));
    }
  };

  const deleteBook = (bookId: string) => {
    if (confirm('Czy na pewno chcesz usunąć całą książkę wraz ze wszystkimi notatkami?')) {
      setBooks(prev => prev.filter(b => b.id !== bookId));
      if (activeBookId === bookId) setActiveBookId(null);
    }
  };

  const activeBook = books.find(b => b.id === activeBookId);
  
  const allFavorites = books.flatMap(book => 
    book.entries
      .filter(e => e.isFavorite)
      .map(e => ({ ...e, bookTitle: book.title, bookId: book.id }))
  ).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="container mx-auto px-4 max-w-6xl pt-6 pb-24">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Biblioteka Sidebar */}
        <aside className="md:w-1/3 lg:w-1/4 w-full glass rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-amber-200 serif">Biblioteka</h2>
            <button 
              onClick={() => setIsAddingBook(!isAddingBook)}
              className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-200 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all transform hover:rotate-90"
              title="Dodaj nową książkę"
            >
              <span className="text-xl">{isAddingBook ? '×' : '+'}</span>
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => { setViewMode('favorites'); setActiveBookId(null); }}
              className={`w-full p-4 rounded-2xl transition-all border flex items-center space-x-3 group ${
                viewMode === 'favorites' 
                ? 'bg-red-500/20 border-red-500/50 text-red-200 shadow-lg shadow-red-500/10' 
                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-gray-300'
              }`}
            >
              <span className={`text-xl transition-transform group-hover:scale-125 ${viewMode === 'favorites' ? 'scale-110' : ''}`}>❤️</span>
              <span className="font-bold">Ulubione Cytaty</span>
              {allFavorites.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
                  {allFavorites.length}
                </span>
              )}
            </button>
          </div>

          <hr className="border-white/5" />

          {isAddingBook && (
            <div className="bg-black/20 p-4 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-4 border border-amber-500/10">
              <p className="text-[10px] text-amber-100/60 font-bold uppercase tracking-widest">Wybierz klasykę:</p>
              <div className="max-h-40 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                {NEVILLE_BOOKS.filter(title => !books.some(b => b.title === title)).map(title => (
                  <button 
                    key={title}
                    onClick={() => addBook(title)}
                    className="w-full text-left text-sm text-gray-400 hover:text-amber-200 py-2 px-2 hover:bg-white/5 rounded-lg transition-all truncate"
                  >
                    {title}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-white/5">
                <p className="text-[10px] text-amber-100/60 font-bold uppercase tracking-widest mb-2">Lub własny tytuł:</p>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={customBookTitle}
                    onChange={e => setCustomBookTitle(e.target.value)}
                    placeholder="Tytuł książki..."
                    className="flex-grow bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-white"
                  />
                  <button 
                    onClick={() => customBookTitle.trim() && addBook(customBookTitle)}
                    className="bg-amber-500 hover:bg-amber-400 text-white px-3 rounded-xl text-xs font-bold transition-colors"
                  >
                    Dodaj
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2 flex-grow overflow-y-auto max-h-[400px] pr-1 custom-scrollbar">
            <h3 className="text-[10px] text-gray-500 uppercase tracking-widest px-2 mb-2 font-bold">Moje Książki</h3>
            {books.length === 0 && !isAddingBook && (
              <p className="text-gray-500 text-xs italic py-4 px-2 text-center opacity-50">Twoja półka jest pusta.</p>
            )}
            {books.map(book => (
              <div 
                key={book.id}
                onClick={() => { setActiveBookId(book.id); setViewMode('book'); }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border group relative flex justify-between items-center ${
                  activeBookId === book.id && viewMode === 'book'
                  ? 'bg-amber-500/20 border-amber-500/50 shadow-lg shadow-amber-500/5' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span className={`font-medium truncate pr-4 transition-colors ${activeBookId === book.id ? 'text-amber-100' : 'text-gray-300'}`}>
                  {book.title}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteBook(book.id); }}
                  className="opacity-0 group-hover:opacity-100 text-red-400/50 hover:text-red-500 transition-all px-2 scale-150"
                  title="Usuń książkę"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Notes Content */}
        <main className="flex-grow w-full">
          {viewMode === 'favorites' ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <h1 className="text-4xl font-bold text-red-200 serif">❤️ Ulubione Cytaty</h1>
                <span className="text-xs text-gray-500 uppercase tracking-widest">{allFavorites.length} wpisów</span>
              </div>
              
              <div className="space-y-6">
                {allFavorites.map(entry => (
                  <div 
                    key={entry.id} 
                    className={`p-6 md:p-8 rounded-3xl border transition-all hover:scale-[1.01] flex flex-col space-y-4 ${
                      entry.type === 'fragment' 
                      ? 'bg-amber-900/10 border-amber-500/20 shadow-xl shadow-amber-500/5' 
                      : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                         <span className="text-[10px] text-amber-500/80 uppercase font-bold tracking-widest bg-amber-500/10 px-2 py-1 rounded-lg">
                           {entry.bookTitle}
                         </span>
                         <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest border border-white/10 px-2 py-1 rounded-lg">
                           Cytat
                         </span>
                      </div>
                      <button 
                        onClick={() => toggleFavorite(entry.bookId, entry.id)}
                        className="text-red-500 hover:scale-125 transition-all text-2xl shrink-0"
                        title="Usuń z ulubionych"
                      >
                        ❤️
                      </button>
                    </div>
                    
                    <div className="relative group">
                      {entry.type === 'fragment' && <span className="text-amber-500/30 text-6xl leading-none font-serif absolute -left-4 -top-6 pointer-events-none select-none">"</span>}
                      <div className={`whitespace-pre-wrap leading-relaxed text-gray-200 ${entry.type === 'fragment' ? 'italic serif text-xl md:text-2xl pl-2' : 'text-base md:text-lg'}`}>
                        {entry.content}
                      </div>
                    </div>
                    
                    <div className="pt-2 text-[10px] text-gray-600 font-mono flex justify-between items-center opacity-50">
                      <span>DATA ZAPISU: {new Date(entry.createdAt).toLocaleDateString('pl-PL')}</span>
                    </div>
                  </div>
                ))}
                {allFavorites.length === 0 && (
                  <div className="text-center py-24 opacity-30 glass rounded-3xl border-dashed border-2 border-white/10">
                    <span className="text-6xl block mb-4">⭐</span>
                    <p className="serif text-2xl mb-2">Twoja kolekcja pereł jest pusta.</p>
                    <p className="text-sm max-w-xs mx-auto leading-relaxed">Aby dodać cytat tutaj, przejdź do dowolnej książki i kliknij ikonę serca przy wybranej notatce.</p>
                  </div>
                )}
              </div>
            </div>
          ) : activeBook ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white serif">{activeBook.title}</h1>
                  <p className="text-[10px] text-amber-500/60 uppercase font-bold tracking-widest mt-1">Dziennik Świadomości</p>
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{activeBook.entries.length} WPISÓW</span>
              </div>

              {/* Add Entry Form */}
              <div className="glass p-6 md:p-8 rounded-3xl space-y-6 border border-amber-500/20 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
                <div className="flex flex-wrap gap-2 relative z-10">
                  <button 
                    onClick={() => setEntryType('note')}
                    className={`text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-xl border transition-all ${entryType === 'note' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    Moja Notatka
                  </button>
                  <button 
                    onClick={() => setEntryType('fragment')}
                    className={`text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-xl border transition-all ${entryType === 'fragment' ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-600/20' : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    Cytat / Fragment
                  </button>
                </div>
                <textarea 
                  value={newEntryContent}
                  onChange={e => setNewEntryContent(e.target.value)}
                  placeholder={entryType === 'note' ? "Co dziś odkryłeś w swojej wyobraźni?..." : "Wklej tutaj inspirujący fragment z książki..."}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-gray-200 focus:outline-none focus:border-amber-500/50 min-h-[140px] transition-all relative z-10 placeholder:text-gray-600 text-base"
                />
                <button 
                  onClick={addEntry}
                  disabled={!newEntryContent.trim()}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl w-full sm:w-auto transform active:scale-95 relative z-10 text-sm md:text-base"
                >
                  Dodaj do Biblioteki
                </button>
              </div>

              {/* List of Entries */}
              <div className="space-y-6">
                {activeBook.entries.map(entry => (
                  <div 
                    key={entry.id} 
                    className={`p-6 md:p-8 rounded-3xl border transition-all group flex flex-col space-y-4 hover:bg-white/[0.07] ${
                      entry.type === 'fragment' 
                      ? 'bg-amber-900/5 border-amber-500/10' 
                      : 'bg-white/5 border-white/5'
                    }`}
                  >
                    {/* Header Row - No overlap */}
                    <div className="flex justify-between items-center gap-4 border-b border-white/5 pb-3">
                       <div className="flex items-center gap-3">
                         <span className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg border ${
                           entry.type === 'fragment' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-white/5 border-white/10 text-gray-500'
                         }`}>
                           {entry.type === 'fragment' ? 'Cytat' : 'Notatka'}
                         </span>
                         <span className="text-[9px] text-gray-600 font-mono tracking-tighter opacity-70 hidden sm:inline">
                           {new Date(entry.createdAt).toLocaleString('pl-PL')}
                         </span>
                       </div>
                       
                       <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => deleteEntry(activeBook.id, entry.id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-all text-[11px] font-bold uppercase tracking-widest pr-2 border-r border-white/5"
                          >
                            Usuń
                          </button>
                          <button 
                            onClick={() => toggleFavorite(activeBook.id, entry.id)}
                            className={`transition-all text-2xl ${entry.isFavorite ? 'text-red-500 scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'text-gray-500/20 hover:text-red-400/50 group-hover:opacity-100'}`}
                            title={entry.isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                          >
                            {entry.isFavorite ? '❤️' : '🤍'}
                          </button>
                       </div>
                    </div>
                    
                    {/* Content Row */}
                    <div className="relative pt-2">
                      {entry.type === 'fragment' && <span className="text-amber-500/20 text-6xl leading-none font-serif absolute -left-3 -top-6 pointer-events-none select-none">"</span>}
                      <div className={`whitespace-pre-wrap leading-relaxed text-gray-200 ${entry.type === 'fragment' ? 'italic serif text-xl md:text-2xl pl-2' : 'text-base md:text-lg'}`}>
                        {entry.content}
                      </div>
                    </div>

                    {/* Footer Row - Mobile Date */}
                    <div className="sm:hidden text-[9px] text-gray-700 font-mono opacity-50 pt-2">
                      {new Date(entry.createdAt).toLocaleString('pl-PL')}
                    </div>
                  </div>
                ))}
                {activeBook.entries.length === 0 && (
                  <div className="text-center py-24 opacity-20 border-2 border-dashed border-white/5 rounded-3xl">
                    <span className="text-7xl block mb-6">🖋️</span>
                    <p className="serif text-2xl">Czysta karta czeka na Twoje odkrycia.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 md:p-12 glass rounded-3xl border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <span className="text-7xl md:text-9xl mb-8 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">📖</span>
              <h3 className="text-3xl md:text-4xl font-bold serif text-amber-100 mb-4 px-4">Wybierz Księgę Mądrości</h3>
              <p className="text-gray-400 mt-2 max-w-sm text-base md:text-lg leading-relaxed px-4">
                Zapisuj swoje notatki, przemyślenia i najcenniejsze cytaty. Kliknij ikonę serca <span className="text-red-400">🤍</span> przy wpisie, aby trafił do Twojej złotej kolekcji.
              </p>
              <div className="mt-8 flex space-x-4 opacity-50">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-200"></div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Notes;