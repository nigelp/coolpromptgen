import React, { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { ModelSelector } from './components/ModelSelector';
import { OpenAIModelSelector } from './components/OpenAIModelSelector';
import { PromptInput } from './components/PromptInput';
import { PromptOutput } from './components/PromptOutput';
import { UpdatePrompt } from './components/UpdatePrompt';
import { validateConfig } from './utils/config';
import { handleAIServiceError } from './utils/error';
import { createAIService } from './services/ai/factory';
import { usePWA } from './hooks/usePWA';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { AIModel, FormData, OpenAIModel } from './types';

function App() {
  const { isUpdateAvailable, update } = usePWA();
  const [storedApiKey, setStoredApiKey] = useLocalStorage<string>('apiKey', '');
  const [formData, setFormData] = useState<FormData>({
    basePrompt: '',
    model: 'openai',
    apiKey: storedApiKey,
    openAIModel: 'gpt-4-turbo-preview',
  });

  const [output, setOutput] = useState({
    enhancedPrompt: '',
    negativePrompt: '',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Update formData when storedApiKey changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      apiKey: storedApiKey,
    }));
  }, [storedApiKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateConfig({
      model: formData.model,
      apiKey: formData.apiKey,
      openAIModel: formData.openAIModel,
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setIsLoading(true);

    try {
      const aiService = createAIService(formData.model, {
        apiKey: formData.apiKey,
        openAIModel: formData.openAIModel,
      });

      const result = await aiService.enhancePrompt(formData.basePrompt);
      setOutput(result);
    } catch (error) {
      setErrors([handleAIServiceError(error, formData.model)]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (model: AIModel) => {
    setFormData(prev => ({
      ...prev,
      model,
      apiKey: '',
    }));
    setStoredApiKey('');
  };

  const handleApiKeyChange = (apiKey: string) => {
    setFormData(prev => ({
      ...prev,
      apiKey,
    }));
    setStoredApiKey(apiKey);
  };

  const handleOpenAIModelChange = (openAIModel: OpenAIModel) => {
    setFormData(prev => ({
      ...prev,
      openAIModel,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Wand2 className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="mt-4 text-4xl font-bold text-gray-900">Cool Prompt Generator</h1>
          <p className="mt-2 text-lg text-gray-600">
            Transform your basic prompts into detailed, AI-optimized masterpieces
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <PromptInput
              value={formData.basePrompt}
              onChange={(prompt) => setFormData(prev => ({ ...prev, basePrompt: prompt }))}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModelSelector
                value={formData.model}
                onChange={handleModelChange}
              />
              <ApiKeyInput
                model={formData.model}
                apiKey={formData.apiKey}
                onChange={handleApiKeyChange}
              />
            </div>

            <OpenAIModelSelector
              value={formData.openAIModel}
              onChange={handleOpenAIModelChange}
            />

            {errors.length > 0 && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Please fix the following errors:
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enhancing...' : 'Enhance Prompt'}
            </button>
          </form>

          {output.enhancedPrompt && (
            <PromptOutput
              enhancedPrompt={output.enhancedPrompt}
              negativePrompt={output.negativePrompt}
            />
          )}
        </div>
      </div>
      {isUpdateAvailable && <UpdatePrompt onUpdate={update} />}
    </div>
  );
}

export default App;