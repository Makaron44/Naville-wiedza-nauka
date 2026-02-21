
import React, { useState } from 'react';
import { Practice } from '../types';

interface PracticeProps {
  practice: Practice;
}

const PracticeSection: React.FC<PracticeProps> = ({ practice }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="glass p-8 rounded-3xl border border-white/5">
      <h3 className="text-3xl font-bold mb-4 text-amber-200 serif">{practice.name}</h3>
      <p className="text-gray-400 mb-6 italic">{practice.description}</p>
      
      <div className="space-y-4">
        {practice.steps.map((step, index) => (
          <div 
            key={index}
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              activeStep === index 
                ? 'bg-amber-500/20 border-amber-500/50 border scale-102' 
                : 'bg-white/5 border border-transparent'
            }`}
            onClick={() => setActiveStep(index)}
          >
            <div className="flex items-start space-x-4">
              <span className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold shrink-0">
                {index + 1}
              </span>
              <p className={activeStep === index ? 'text-white' : 'text-gray-400'}>
                {step}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {activeStep !== null && (
        <button 
          onClick={() => setActiveStep(null)}
          className="mt-6 text-amber-400 hover:text-amber-300 transition text-sm underline"
        >
          Resetuj kroki
        </button>
      )}
    </div>
  );
};

export default PracticeSection;
