
import React from 'react';
import { Concept } from '../types';

interface ConceptProps {
  concept: Concept;
}

export const ConceptSkeleton: React.FC = () => (
  <div className="glass p-8 rounded-2xl border border-white/5 flex flex-col items-center text-center animate-pulse">
    <div className="w-16 h-16 bg-white/10 rounded-full mb-6"></div>
    <div className="w-3/4 h-6 bg-white/10 rounded mb-4"></div>
    <div className="w-full h-4 bg-white/10 rounded mb-2"></div>
    <div className="w-5/6 h-4 bg-white/10 rounded"></div>
  </div>
);

const ConceptSection: React.FC<ConceptProps> = ({ concept }) => {
  return (
    <div className="group glass p-8 rounded-3xl hover:bg-white/15 transition-all duration-400 border border-amber-500/10 hover:border-amber-500/40 hover:scale-[1.03] flex flex-col items-center text-center cursor-default hover:shadow-2xl hover:shadow-amber-500/10 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
      
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-400/20 to-amber-600/10 rounded-2xl flex items-center justify-center text-5xl shadow-inner border border-white/5 group-hover:rotate-6 transition-all duration-500 gold-glow">
          <span className="drop-shadow-lg">{concept.icon}</span>
        </div>
        {/* Particle-like glow */}
        <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      </div>

      <h3 className="text-2xl font-bold mb-4 text-amber-200 serif group-hover:text-amber-100 transition-colors tracking-wide">
        {concept.title}
      </h3>
      <p className="text-gray-300 leading-relaxed text-sm md:text-base font-light">
        {concept.description}
      </p>
    </div>
  );
};

export default ConceptSection;
