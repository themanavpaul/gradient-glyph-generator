
import React from 'react';
import { useGeneration } from '../context/GenerationContext';
import { Grid2X2, Grid3X3 } from 'lucide-react';

const NumImagesSelector = () => {
  const { numImagesOption, setNumImagesOption } = useGeneration();
  
  const options = [1, 2, 4];
  
  return (
    <div className="mb-4">
      <label className="block text-sm text-white/70 mb-2">
        Number of Images
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((num) => (
          <button
            key={num}
            onClick={() => setNumImagesOption(num)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center space-x-1
              ${numImagesOption === num
                ? 'bg-nebula-600 text-white' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            {num === 1 && <span>{num} Image</span>}
            {num > 1 && (
              <>
                <span>{num} Images</span>
                {num === 4 && <Grid2X2 size={14} />}
                {num === 2 && <Grid3X3 size={14} />}
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumImagesSelector;
