
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
      
      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw API response:', responseText);
      
      if (!response.ok) {
        console.error('API error response:', responseText);
        
        try {
          // Try to parse as JSON if possible
          const errorData = JSON.parse(responseText);
          throw new Error(`API error: ${errorData.message || response.statusText}`);
        } catch (e) {
          // If not JSON, return the raw error text for debugging
          throw new Error(`API error: ${response.status} ${response.statusText}. Response was not valid JSON.`);
        }
      }
      
      try {
        // Parse the response text as JSON
        const data = JSON.parse(responseText);
        return data;
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        throw new Error("Received invalid JSON response from server");
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
      throw error;
    }
  }
}

export const nebiusApi = new NebiusApiService();
