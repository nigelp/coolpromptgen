import type { OllamaResponse } from './types';

interface OllamaListResponse {
  models: Array<{ name: string }>;
}

export class OllamaAPI {
  private baseUrl: string;

  getBaseUrl(): string {
    return this.baseUrl;
  }

  constructor(host: string) {
    this.baseUrl = `http://${host.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '')}/api`;
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tags`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json() as OllamaListResponse;
      
      if (!data.models) {
        throw new Error('No models found in Ollama response');
      }
      
      return data.models.map(model => model.name);
    } catch (error) {
      console.error('Ollama connection error:', error);
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new Error('Could not connect to Ollama. Please check if it\'s running at 127.0.0.1:11434');
      }
      throw new Error(`Failed to fetch models: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async chat(model: string, messages: Array<{ role: string; content: string }>): Promise<OllamaResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: messages[messages.length - 1].content,
          options: {
            temperature: 0.7,
            top_k: 50,
            top_p: 0.95,
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        model,
        created_at: new Date().toISOString(),
        message: {
          role: 'assistant',
          content: data.response
        }
      };
    } catch (error) {
      throw new Error(`Failed to chat with Ollama: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  }