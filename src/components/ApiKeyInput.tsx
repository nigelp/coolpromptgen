import React from 'react';
import { AIModel } from '../types';

interface ApiKeyInputProps {
  model: AIModel;
  apiKey: string;
  onChange: (apiKey: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ model, apiKey, onChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
        API Key for {model.charAt(0).toUpperCase() + model.slice(1)}
      </label>
      <input
        type="password"
        id="apiKey"
        value={apiKey}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter your API key"
      />
      <p className="text-xs text-gray-500">
        Your API key is stored locally and never sent to our servers
      </p>
    </div>
  );
};