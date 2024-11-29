import type { AIService } from '../types';
import type { OllamaModel } from '../../../types';
import { OllamaAPI } from './api';
import { SYSTEM_PROMPT, createPromptRequest } from './prompts';
import { ResponseParser } from './parser';

export class OllamaService implements AIService {
  private api: OllamaAPI;
  private model: OllamaModel;

  constructor(config: { ollamaHost?: string; ollamaModel?: OllamaModel }) {
    if (!config.ollamaHost) {
      throw new Error('Ollama host is required');
    }
    if (!config.ollamaModel) {
      throw new Error('Ollama model is required');
    }

    this.api = new OllamaAPI(config.ollamaHost);
    this.model = config.ollamaModel;
  }

  async listModels(): Promise<string[]> {
    try {
      return await this.api.listModels();
    } catch (error) {
      console.error('Error fetching models:', error);
      throw new Error(
        'Failed to fetch models. Please ensure Ollama is running and accessible at ' +
        `${this.api.getBaseUrl()}. Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async enhancePrompt(basePrompt: string) {
    try {
      const response = await this.api.chat(
        this.model,
        [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: createPromptRequest(basePrompt) }
        ]
      );
      
      if (!response.message?.content) {
        throw new Error('Received empty response from Ollama');
      }
      
      return ResponseParser.parseJSON(response.message.content);
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      throw new Error(
        'Failed to enhance prompt. Please ensure Ollama is running and accessible. ' +
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}