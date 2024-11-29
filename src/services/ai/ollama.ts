import type { AIService, AIServiceConfig } from './types';
import type { OllamaModel } from '../../types';

export class OllamaService implements AIService {
  private host: string;
  private model: OllamaModel;

  constructor(config: AIServiceConfig) {
    if (!config.ollamaHost) {
      throw new Error('Ollama host is required');
    }
    if (!config.ollamaModel) {
      throw new Error('Ollama model is required');
    }
    this.host = config.ollamaHost;
    this.model = config.ollamaModel;
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`http://${this.host}/api/tags`);
      if (!response.ok) {
        throw new Error('Failed to fetch Ollama models');
      }
      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    } catch (error) {
      console.error('Error fetching Ollama models:', error);
      throw new Error('Failed to connect to Ollama. Please check your host configuration and ensure Ollama is running.');
    }
  }

  async enhancePrompt(basePrompt: string) {
    try {
      const response = await fetch(`http://${this.host}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{
            role: 'system',
            content: `You are an expert at improving image generation prompts. Format your responses as valid JSON objects with "enhancedPrompt" and "negativePrompt" fields.`
          }, {
            role: 'user',
            content: `Enhance this prompt: "${basePrompt}"

Create two things:
1. An enhanced version that includes:
   - Specific descriptive details about the subject
   - Appropriate artistic style and medium
   - Lighting and atmosphere specifications
   - Composition elements
   - Technical parameters
   - Natural language flow

2. A negative prompt that helps avoid common issues

Format your response exactly like this:
{
  "enhancedPrompt": "a majestic lion, detailed fur texture, dramatic lighting with golden hour glow, professional wildlife photography, sharp focus, ultra HD quality, rule of thirds composition",
  "negativePrompt": "blurry, oversaturated, low quality, distorted features, unrealistic anatomy, overexposed"
}`
          }],
          stream: false,
          options: {
            temperature: 0.7,
            top_k: 50,
            top_p: 0.95,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response from Ollama');
      }

      const data = await response.json();
      const text = data.message?.content || '';
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Ollama');
      }

      try {
        const result = JSON.parse(jsonMatch[0]);
        return {
          enhancedPrompt: result.enhancedPrompt || '',
          negativePrompt: result.negativePrompt || ''
        };
      } catch (parseError) {
        console.error('Error parsing Ollama response:', parseError);
        // Fallback: try to extract prompts using regex
        const enhancedMatch = text.match(/"enhancedPrompt":\s*"([^"]+)"/);
        const negativeMatch = text.match(/"negativePrompt":\s*"([^"]+)"/);
        
        return {
          enhancedPrompt: enhancedMatch ? enhancedMatch[1] : basePrompt,
          negativePrompt: negativeMatch ? negativeMatch[1] : 'blurry, low quality, distorted, deformed, ugly, bad anatomy'
        };
      }
    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw new Error('Failed to connect to Ollama. Please check your host configuration and ensure Ollama is running.');
    }
  }
}