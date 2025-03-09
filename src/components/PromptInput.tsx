
import React, { useState } from 'react';
import { Sparkles, Send, Wand2 } from 'lucide-react';
import { useGeneration } from '../context/GenerationContext';
import { nebiusApi } from '../services/nebiusApi';

const PromptInput = () => {
  const [prompt, setPrompt] = useState('');
  const { setCurrentOptions, addGeneratedImage, setIsGenerating, isGenerating } = useGeneration();

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
    setCurrentOptions({ prompt: e.target.value });
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    try {
      setIsGenerating(true);
      const options = { prompt: prompt.trim() };
      setCurrentOptions(options);
      
      const generatedImage = await nebiusApi.generateImage(options);
      addGeneratedImage(generatedImage);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleGenerate();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative glass-morphism rounded-xl p-1 focus-within:ring-1 focus-within:ring-nebula-500/50 transition-all duration-200">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
          <Wand2 size={18} />
        </div>
        <input
          value={prompt}
          onChange={handlePromptChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe the image you want to generate..."
          className="w-full py-3 pl-10 pr-24 bg-transparent rounded-lg text-white/90 placeholder:text-white/40 focus:outline-none"
          disabled={isGenerating}
        />
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className={`absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1 px-3 py-1.5 rounded-lg 
            ${prompt.trim() && !isGenerating 
              ? 'bg-nebula-600 hover:bg-nebula-500 text-white' 
              : 'bg-white/5 text-white/30 cursor-not-allowed'} 
            transition-all duration-200`}
        >
          {isGenerating ? (
            <>
              <div className="animate-pulse mr-1">Generating</div>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse animate-delay-100"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse animate-delay-200"></div>
              </div>
            </>
          ) : (
            <>
              <span>Generate</span>
              <Sparkles size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptInput;
