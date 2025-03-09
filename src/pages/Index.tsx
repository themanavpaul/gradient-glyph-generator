
import React from 'react';
import Header from '../components/Header';
import PromptInput from '../components/PromptInput';
import GenerationOptions from '../components/GenerationOptions';
import ImageDisplay from '../components/ImageDisplay';
import { GenerationProvider } from '../context/GenerationContext';

const Index = () => {
  return (
    <GenerationProvider>
      <div className="flex flex-col min-h-screen bg-dark-bg">
        <Header />
        
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 relative">
          <div className="absolute inset-0 bg-purple-glow opacity-30 pointer-events-none"></div>
          
          <h1 className="text-4xl font-bold text-center text-gradient animate-fadeIn mb-2">
            Transform Text into Imagination
          </h1>
          <p className="text-white/60 text-center mb-8 max-w-2xl mx-auto animate-fadeIn animate-delay-100">
            Generate stunning, high-quality images using cutting-edge AI from Nebius Studio.
            Simply describe what you want to see.
          </p>
          
          <div className="space-y-6 animate-fadeIn animate-delay-200">
            <PromptInput />
            <GenerationOptions />
            <ImageDisplay />
          </div>
        </main>
        
        <footer className="w-full py-4 border-t border-white/5 text-center text-white/40 text-sm">
          <p>Created with NebulaVision AI • Powered by Nebius AI Studio</p>
        </footer>
      </div>
    </GenerationProvider>
  );
};

export default Index;
