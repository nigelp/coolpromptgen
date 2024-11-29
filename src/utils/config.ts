import { AIModel, ApiConfig } from '../types';

export const validateConfig = (config: ApiConfig): string[] => {
  const errors: string[] = [];

  if (!config.apiKey) {
    errors.push('API key is required');
  }

  return errors;
};