
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const nebiusApiKey = Deno.env.get('NEBIUS_API_KEY');
    if (!nebiusApiKey) {
      throw new Error('Missing Nebius API key');
    }

    const { prompt, negativePrompt, width, height, numInferenceSteps, seed } = await req.json();

    console.log('Generating image with prompt:', prompt);
    
    const response = await fetch('https://api.studio.nebius.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nebiusApiKey}`
      },
      body: JSON.stringify({
        model: "stability-ai/sdxl",
        response_format: "b64_json",
        extra_body: {
          response_extension: "webp",
          width: width || 1024,
          height: height || 1024,
          num_inference_steps: numInferenceSteps || 30,
          negative_prompt: negativePrompt || "",
          seed: seed || -1
        },
        prompt: prompt
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Nebius API error:', errorData);
      throw new Error(`Nebius API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    const generatedImage = {
      id: `img-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      b64Image: `data:image/webp;base64,${data.data[0].b64_json}`,
      prompt: prompt,
      timestamp: Date.now(),
      width: width || 1024,
      height: height || 1024
    };

    return new Response(JSON.stringify(generatedImage), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
