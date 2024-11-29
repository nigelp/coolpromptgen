import React from 'react';
import { AIModel } from '../types';

interface ModelSelectorProps {
  value: AIModel;
  onChange: (model: AIModel) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="model" className="block text-sm font-medium text-gray-700">
        Select AI Model
      </label>
      <select
        id="model"
        value={value}
        onChange={(e) => onChange(e.target.value as AIModel)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="openai">OpenAI</option>
      </select>
    </div>
  );
}