
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CONCEPTS, QUOTES, PRACTICES } from './constants';
import { Concept, Practice, Message } from './types';
import ConceptSection, { ConceptSkeleton } from './components/ConceptSection';
import PracticeSection from './components/PracticeSection';
import AIMentor from './components/AIMentor';
import Settings from './components/Settings';
import Notes from './components/Notes';
import GratitudeJournal from './components/GratitudeJournal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

const Home: React.FC = () => {
  const [randomQuote, setRandomQuote] = useState(QUOTES[0]);
  const [isLoadingConcepts, setIsLoadingConcepts] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, 10000);

    // Artificial loading for perceived smoothness
    const timer = setTimeout(() => {
      setIsLoadingConcepts(false);
    }, 800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  // Handle hash scrolling on home page
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-section').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [isLoadingConcepts]);

  return (
    <div className="space-y-12 pb-20 overflow-x-hidden">
      <Hero quote={randomQuote} />

      <section id="wiedza" className="container mx-auto px-4 scroll-mt-24 reveal-section">
        <h2 className="text-4xl font-bold text-center mb-10 text-amber-200 gold-text-glow">Podstawowe Nauki</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoadingConcepts
            ? Array.from({ length: 4 }).map((_, i) => <ConceptSkeleton key={i} />)
            : CONCEPTS.map(concept => (
              <ConceptSection key={concept.id} concept={concept} />
            ))
          }
        </div>
      </section>

      <section id="praktyka" className="container mx-auto px-4 scroll-mt-24 reveal-section">
        <h2 className="text-4xl font-bold text-center mb-10 text-amber-200 gold-text-glow">Narzędzia Praktyczne</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {PRACTICES.map(practice => (
            <PracticeSection key={practice.id} practice={practice} />
          ))}
        </div>
      </section>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mentor" element={<AIMentor />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/gratitude" element={<GratitudeJournal />} />
          </Routes>
        </main>

        <Link
          to="/mentor"
          className="fixed bottom-6 right-6 w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-3xl shadow-lg hover:bg-amber-400 transition-all z-50 transform hover:scale-110 active:scale-95 gold-glow"
          title="Zapytaj Mentora AI"
        >
          💬
        </Link>
      </div>
    </HashRouter>
  );
};

export default App;
