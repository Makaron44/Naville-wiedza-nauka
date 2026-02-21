
import React from 'react';
import { Quote } from '../types';

interface HeroProps {
  quote: Quote;
}

const Hero: React.FC<HeroProps> = ({ quote }) => {
  return (
    <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <img 
          src="https://picsum.photos/seed/nebula/1920/1080" 
          alt="Cosmic background" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-wide">
            Wyobraźnia jest Bogiem w Akcji
        </h1>
        <div className="glass p-8 rounded-2xl transform transition-all duration-1000">
            <p className="text-2xl md:text-3xl italic serif text-amber-100 mb-4 transition-opacity">
                "{quote.text}"
            </p>
            <p className="text-amber-400 font-semibold">— {quote.source}</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
