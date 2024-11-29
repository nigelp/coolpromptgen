export interface AIService {
  enhancePrompt(basePrompt: string): Promise<{
    enhancedPrompt: string;
    negativePrompt: string;
  }>;
}

export interface AIServiceConfig {
  apiKey: string;
  openAIModel?: string;
}