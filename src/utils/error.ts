export class AIServiceError extends Error {
  constructor(message: string, public readonly provider: string) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export const handleAIServiceError = (error: unknown, provider: string): string => {
  if (error instanceof AIServiceError) {
    if (error.message.includes('API key')) {
      return `${error.provider} Error: Please provide a valid API key`;
    }
    if (error.message.includes('Rate limit')) {
      return `${error.provider} Error: Too many requests. Please try again later`;
    }
    return `${error.provider} Error: ${error.message}`;
  }
  
  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
      return `${provider} Error: Connection failed. Please check your internet connection`;
    }
    return `${provider} Error: ${error.message}`;
  }
  
  return `${provider} Error: An unexpected error occurred`;
};