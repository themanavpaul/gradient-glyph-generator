
import React from 'react';
import { Download, Share2, RotateCw } from 'lucide-react';
import { useGeneration } from '../context/GenerationContext';

const ImageDisplay = () => {
  const { images, isGenerating, generationProgress } = useGeneration();
  
  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isGenerating) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="max-w-md w-full flex flex-col justify-center items-center glass-morphism rounded-2xl p-8 animate-pulse">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-nebula-500/30 border-t-nebula-500 animate-spin"></div>
            <div className="absolute inset-0 bg-purple-glow opacity-30"></div>
          </div>
          <p className="mt-6 text-white/70 text-sm">
            {generationProgress 
              ? `Generating image ${generationProgress.current} of ${generationProgress.total}...` 
              : "Creating your masterpiece..."}
          </p>
          {generationProgress && (
            <div className="w-full max-w-xs mt-4">
              <div className="h-1.5 bg-white/10 rounded-full">
                <div 
                  className="h-1.5 bg-nebula-500 rounded-full transition-all duration-300"
                  style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  if (images.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="max-w-md aspect-square flex flex-col justify-center items-center glass-morphism rounded-2xl p-8">
          <div className="text-white/20 mb-4">
            <RotateCw size={48} strokeWidth={1} />
          </div>
          <h3 className="text-lg font-medium text-white/80 mb-2">No images yet</h3>
          <p className="text-white/50 text-sm text-center">
            Enter a prompt above and click Generate to create your first image
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
      {images.map((image) => (
        <div key={image.id} className="group relative overflow-hidden glass-morphism rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
          <img 
            src={image.b64Image} 
            alt={image.prompt} 
            className="w-full aspect-square object-cover"
            loading="lazy"
          />
          
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white/90 text-sm line-clamp-2">{image.prompt}</p>
            <div className="flex justify-end space-x-2 mt-2">
              <button 
                onClick={() => downloadImage(image.b64Image, `nebula-vision-${image.id}.png`)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Download size={16} />
              </button>
              <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageDisplay;
