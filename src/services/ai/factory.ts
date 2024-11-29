import { AIModel } from '../../types';
import type { AIService, AIServiceConfig } from './types';
import { OpenAIService } from './openai';

export function createAIService(model: AIModel, config: AIServiceConfig): AIService {
  switch (model) {
    case 'openai':
      return new OpenAIService(config);
    default:
      throw new Error(`Unsupported AI model: ${model}`);
  }
}