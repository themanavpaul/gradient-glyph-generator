
import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full px-6 py-4 flex justify-between items-center border-b border-white/5 bg-darker-bg/80 backdrop-blur-md z-10">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-glow opacity-70 animate-pulse"></div>
          <Sparkles className="relative h-6 w-6 text-nebula-400" />
        </div>
        <h1 className="text-xl font-bold text-gradient-purple tracking-tight">Nebula<span className="text-white ml-1">Vision</span></h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-white/70 hover:text-white transition-colors duration-200"
        >
          About
        </a>
        <a 
          href="#"
          className="px-4 py-1.5 text-sm font-medium text-white bg-nebula-600 hover:bg-nebula-500 rounded-full transition-all duration-200 ease-in-out hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
        >
          Sign In
        </a>
      </div>
    </header>
  );
};

export default Header;
