
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GeneratedImage, GenerationOptions, DEFAULT_OPTIONS } from '../services/nebiusApi';

interface GenerationContextType {
  images: GeneratedImage[];
  isGenerating: boolean;
  generationProgress: { current: number, total: number } | null;
  currentOptions: GenerationOptions;
  selectedImage: GeneratedImage | null;
  numImagesOption: number;
  setCurrentOptions: (options: Partial<GenerationOptions>) => void;
  addGeneratedImage: (image: GeneratedImage) => void;
  selectImage: (image: GeneratedImage | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setNumImagesOption: (num: number) => void;
  setGenerationProgress: (progress: { current: number, total: number } | null) => void;
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

// Separate the provider component definition from its export
const GenerationProviderComponent = ({ children }: { children: ReactNode }) => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [numImagesOption, setNumImagesOption] = useState<number>(1);
  const [generationProgress, setGenerationProgress] = useState<{ current: number, total: number } | null>(null);
  const [currentOptions, setOptions] = useState<GenerationOptions>({
    prompt: '',
    ...DEFAULT_OPTIONS
  });

  const setCurrentOptions = (options: Partial<GenerationOptions>) => {
    setOptions(prev => ({ ...prev, ...options }));
  };

  const addGeneratedImage = (image: GeneratedImage) => {
    setImages(prev => [image, ...prev]);
  };

  const selectImage = (image: GeneratedImage | null) => {
    setSelectedImage(image);
  };

  return (
    <GenerationContext.Provider
      value={{
        images,
        isGenerating,
        generationProgress,
        currentOptions,
        selectedImage,
        numImagesOption,
        setCurrentOptions,
        addGeneratedImage,
        selectImage,
        setIsGenerating,
        setNumImagesOption,
        setGenerationProgress
      }}
    >
      {children}
    </GenerationContext.Provider>
  );
};

// Export the provider separately from its definition for Fast Refresh compatibility
export const GenerationProvider = GenerationProviderComponent;

// Export the hook separately for Fast Refresh compatibility
export function useGeneration() {
  const context = useContext(GenerationContext);
  if (context === undefined) {
    throw new Error('useGeneration must be used within a GenerationProvider');
  }
  return context;
}
