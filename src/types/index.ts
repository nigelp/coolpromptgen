export type AIModel = 'openai';

export type OpenAIModel = 
  | 'gpt-4-turbo-preview'
  | 'gpt-4'
  | 'gpt-3.5-turbo';

export interface ApiConfig {
  model: AIModel;
  apiKey: string;
  openAIModel?: OpenAIModel;
}

export interface PromptResult {
  enhancedPrompt: string;
  negativePrompt: string;
}

export interface FormData {
  basePrompt: string;
  model: AIModel;
  apiKey: string;
  openAIModel: OpenAIModel;
}