
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
      return new Response(JSON.stringify({ error: 'Missing Nebius API key' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse JSON body - add error handling
    let requestData;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error('Failed to parse request JSON:', error);
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { prompt, negativePrompt, width, height, numInferenceSteps, seed } = requestData;
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating image with prompt:', prompt);
    console.log('Request payload:', { prompt, negativePrompt, width, height, numInferenceSteps, seed });
    
    try {
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

      const responseText = await response.text();
      console.log('Raw Nebius API response:', responseText.substring(0, 200) + '...');
      
      if (!response.ok) {
        console.error('Nebius API error:', responseText);
        
        try {
          const errorData = JSON.parse(responseText);
          return new Response(JSON.stringify({ error: errorData }), {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: `Nebius API error: ${response.status} ${response.statusText}` }), {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      try {
        const data = JSON.parse(responseText);
        
        if (!data.data || !data.data[0] || !data.data[0].b64_json) {
          console.error('Unexpected API response format:', data);
          return new Response(JSON.stringify({ error: 'Unexpected API response format' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
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
      } catch (e) {
        console.error('Failed to parse Nebius API response:', e);
        return new Response(JSON.stringify({ error: 'Invalid JSON response from Nebius API' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (fetchError) {
      console.error('Fetch error to Nebius API:', fetchError);
      return new Response(JSON.stringify({ error: `Error calling Nebius API: ${fetchError.message}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
