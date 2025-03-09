
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
      
      const fullOptions = {
        ...DEFAULT_OPTIONS,
        ...options
      };
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullOptions)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        
        try {
          // Try to parse as JSON
          const errorData = JSON.parse(errorText);
          throw new Error(`API error: ${errorData.message || response.statusText}`);
        } catch (e) {
          // If not JSON, return the raw error
          throw new Error(`API error: ${response.status} ${response.statusText}. Check console for details.`);
        }
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to generate image:", error);
      throw error;
    }
  }
}

export const nebiusApi = new NebiusApiService();
