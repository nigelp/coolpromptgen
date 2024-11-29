import React from 'react';
import { RefreshCw } from 'lucide-react';

interface UpdatePromptProps {
  onUpdate: () => void;
}

export const UpdatePrompt: React.FC<UpdatePromptProps> = ({ onUpdate }) => {
  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={onUpdate}
        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Update Available</span>
      </button>
    </div>
  );
};