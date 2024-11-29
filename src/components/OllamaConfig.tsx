import React, { useEffect, useState } from 'react';
import { OllamaModel } from '../types';
import { OllamaService } from '../services/ai/ollama';

interface OllamaConfigProps {
  host: string;
  model: OllamaModel;
  onHostChange: (host: string) => void;
  onModelChange: (model: OllamaModel) => void;
}

export const OllamaConfig: React.FC<OllamaConfigProps> = ({
  host,
  model,
  onHostChange,
  onModelChange,
}) => {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchModels = async () => {
      if (!host) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const service = new OllamaService({ ollamaHost: host, ollamaModel: model });
        const models = await service.listModels();
        if (mounted) {
          setAvailableModels(models);
          setError('');
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch models');
          console.error('Error fetching models:', err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchModels();
    return () => { mounted = false; };
  }, [host, model]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="ollamaHost" className="block text-sm font-medium text-gray-700">
          Ollama Host
        </label>
        <input
          type="text"
          id="ollamaHost"
          value={host}
          onChange={(e) => onHostChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="127.0.0.1:11434"
        />
        <p className="text-xs text-gray-500">
          The host address where your Ollama instance is running
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="ollamaModel" className="block text-sm font-medium text-gray-700">
          Ollama Model
        </label>
        <select
          id="ollamaModel"
          value={model}
          onChange={(e) => onModelChange(e.target.value as OllamaModel)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isLoading}
        >
          {availableModels.length > 0 ? (
            availableModels.map((modelName) => (
              <option key={modelName} value={modelName}>
                {modelName}
              </option>
            ))
          ) : (
            <>
              <option value="llama2">Llama 2</option>
              <option value="mistral">Mistral</option>
              <option value="codellama">CodeLlama</option>
              <option value="mixtral">Mixtral</option>
            </>
          )}
        </select>
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};