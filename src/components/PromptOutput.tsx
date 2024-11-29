import React from 'react';
import { Copy } from 'lucide-react';

interface PromptOutputProps {
  enhancedPrompt: string;
  negativePrompt: string;
}

export const PromptOutput: React.FC<PromptOutputProps> = ({
  enhancedPrompt,
  negativePrompt,
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Enhanced Prompt</h3>
        <div className="relative">
          <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
            <p className="text-gray-800 whitespace-pre-wrap">{enhancedPrompt}</p>
          </div>
          <button
            onClick={() => copyToClipboard(enhancedPrompt)}
            className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Negative Prompt</h3>
        <div className="relative">
          <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
            <p className="text-gray-800 whitespace-pre-wrap">{negativePrompt}</p>
          </div>
          <button
            onClick={() => copyToClipboard(negativePrompt)}
            className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};