import Anthropic from '@anthropic-ai/sdk';
import type { AIService, AIServiceConfig } from './types';
import { AIServiceError } from '../../utils/error';

export class AnthropicService implements AIService {
  private client: Anthropic;

  constructor(config: AIServiceConfig) {
    if (!config.apiKey) {
      throw new AIServiceError('API key is required', 'Anthropic');
    }
    this.client = new Anthropic({ 
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async enhancePrompt(basePrompt: string) {
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        system: 'You are an expert at improving image generation prompts. You will enhance the given prompt with specific details, artistic style, lighting, composition, and technical parameters. You will also provide a negative prompt to avoid common issues.',
        messages: [{
          role: 'user',
          content: `Please enhance this prompt: "${basePrompt}"

Format your response exactly like this:

Enhanced prompt: A majestic lion in a savanna at golden hour, volumetric lighting through dust particles, ultra-detailed fur texture, shot with telephoto lens, professional wildlife photography, 8K resolution, hyperrealistic

Negative prompt: blurry, oversaturated, low quality, distorted features, unrealistic anatomy, overexposed`
        }],
        temperature: 0.7
      });

      const content = response.content[0].text;
      if (!content) {
        throw new AIServiceError('Empty response received', 'Anthropic');
      }

      const enhancedMatch = content.match(/Enhanced prompt:(.*?)(?=\n\nNegative prompt:|$)/s);
      const negativeMatch = content.match(/Negative prompt:(.*?)$/s);

      if (!enhancedMatch || !negativeMatch) {
        throw new AIServiceError('Invalid response format', 'Anthropic');
      }

      return {
        enhancedPrompt: enhancedMatch[1].trim(),
        negativePrompt: negativeMatch[1].trim()
      };
    } catch (error) {
      if (error instanceof AIServiceError) {
        throw error;
      }
      
      if (error instanceof Anthropic.APIError) {
        if (error.status === 401) {
          throw new AIServiceError('Invalid API key', 'Anthropic');
        }
        if (error.status === 429) {
          throw new AIServiceError('Rate limit exceeded', 'Anthropic');
        }
        if (error.status === 500) {
          throw new AIServiceError('Service temporarily unavailable', 'Anthropic');
        }
        throw new AIServiceError(error.message, 'Anthropic');
      }

      throw new AIServiceError(
        'Failed to connect to Anthropic API. Please check your internet connection and try again.',
        'Anthropic'
      );
    }
  }
}