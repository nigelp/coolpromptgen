import React from 'react';
import { OpenAIModel } from '../types';

interface OpenAIModelSelectorProps {
  value: OpenAIModel;
  onChange: (model: OpenAIModel) => void;
}

export const OpenAIModelSelector: React.FC<OpenAIModelSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="openAIModel" className="block text-sm font-medium text-gray-700">
        OpenAI Model
      </label>
      <select
        id="openAIModel"
        value={value}
        onChange={(e) => onChange(e.target.value as OpenAIModel)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
        <option value="gpt-4">GPT-4</option>
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
      </select>
      <p className="text-xs text-gray-500">
        Select the OpenAI model to use for prompt enhancement
      </p>
    </div>
  );
};