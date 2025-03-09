
import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useGeneration } from '../context/GenerationContext';
import { DEFAULT_OPTIONS } from '../services/nebiusApi';
import NumImagesSelector from './NumImagesSelector';

const GenerationOptions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentOptions, setCurrentOptions } = useGeneration();

  const dimensionOptions = [
    { label: "1:1", width: 1024, height: 1024 },
    { label: "3:4", width: 768, height: 1024 },
    { label: "4:3", width: 1024, height: 768 },
    { label: "16:9", width: 1024, height: 576 },
    { label: "9:16", width: 576, height: 1024 },
  ];

  const handleDimensionChange = (width: number, height: number) => {
    setCurrentOptions({ width, height });
  };

  const handleStepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setCurrentOptions({ numInferenceSteps: value });
  };

  const handleNegativePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentOptions({ negativePrompt: e.target.value });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 glass-morphism rounded-xl overflow-hidden transition-all duration-300">
      <div 
        className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="flex items-center space-x-2 text-white/80">
          <Settings size={16} />
          <span className="text-sm font-medium">Generation Settings</span>
        </div>
        {isExpanded ? <ChevronUp size={18} className="text-white/60" /> : <ChevronDown size={18} className="text-white/60" />}
      </div>
      
      {isExpanded && (
        <div className="px-4 py-3 border-t border-white/5 animate-slideUp">
          <NumImagesSelector />
          
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Dimensions</label>
            <div className="flex flex-wrap gap-2">
              {dimensionOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleDimensionChange(option.width, option.height)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200
                    ${currentOptions.width === option.width && currentOptions.height === option.height
                      ? 'bg-nebula-600 text-white' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                >
                  {option.label} ({option.width}×{option.height})
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">
              Inference Steps: {currentOptions.numInferenceSteps}
            </label>
            <input
              type="range"
              min="10"
              max="50"
              step="1"
              value={currentOptions.numInferenceSteps}
              onChange={handleStepsChange}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-nebula-500"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>10</span>
              <span>50</span>
            </div>
          </div>
          
          <div className="mb-2">
            <label className="block text-sm text-white/70 mb-2">Negative Prompt</label>
            <textarea
              value={currentOptions.negativePrompt}
              onChange={handleNegativePromptChange}
              placeholder="What to exclude from the image..."
              className="w-full px-3 py-2 glass-morphism rounded-lg text-white/80 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-nebula-500/50 resize-none h-20"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationOptions;
