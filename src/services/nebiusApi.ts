
// We'll implement a frontend service that will call our API endpoint

export interface GenerationOptions {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  numInferenceSteps?: number;
  seed?: number;
}

export interface GeneratedImage {
  id: string;
  b64Image: string;
  prompt: string;
  timestamp: number;
  width: number;
  height: number;
}

export const DEFAULT_OPTIONS = {
  width: 1024,
  height: 1024,
  numInferenceSteps: 30,
  negativePrompt: "",
  seed: -1
};

class NebiusApiService {
  private apiUrl = '/api/generate-image';

  async generateImage(options: GenerationOptions): Promise<GeneratedImage> {
    try {
      console.log("Generating image with options:", options);
      
      const response = await fetch(`${window.location.origin}/api/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API error:', errorData);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to generate image:", error);
      throw error;
    }
  }
}

export const nebiusApi = new NebiusApiService();
