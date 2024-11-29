import OpenAI from 'openai';
import type { AIService, AIServiceConfig } from './types';
import { AIServiceError } from '../../utils/error';

export class OpenAIService implements AIService {
  private client: OpenAI;
  private model: string;

  constructor(config: AIServiceConfig) {
    if (!config.apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.client = new OpenAI({ 
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true
    });
    this.model = config.openAIModel || 'gpt-4-turbo-preview';
  }

  async enhancePrompt(basePrompt: string) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert at improving image generation prompts. For the given prompt, return two things:\n\n1. An enhanced version with specific details, artistic style, lighting, composition, and technical parameters\n2. A negative prompt to avoid common issues\n\nFormat your response exactly like this example:\n\nEnhanced prompt: A majestic lion in a savanna at golden hour, volumetric lighting through dust particles, ultra-detailed fur texture, shot with telephoto lens, professional wildlife photography, 8K resolution, hyperrealistic\n\nNegative prompt: blurry, oversaturated, low quality, distorted features, unrealistic anatomy, overexposed'
          },
          {
            role: 'user',
            content: `Please enhance this prompt: "${basePrompt}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new AIServiceError('Empty response received', 'OpenAI');
      }

      const enhancedMatch = content.match(/Enhanced prompt:(.*?)(?=\n\nNegative prompt:|$)/s);
      const negativeMatch = content.match(/Negative prompt:(.*?)$/s);

      if (!enhancedMatch || !negativeMatch) {
        throw new AIServiceError('Invalid response format', 'OpenAI');
      }

      return {
        enhancedPrompt: enhancedMatch[1].trim(),
        negativePrompt: negativeMatch[1].trim()
      };
    } catch (error) {
      if (error instanceof AIServiceError) {
        throw error;
      }
      throw new AIServiceError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        'OpenAI'
      );
    }
  }
}