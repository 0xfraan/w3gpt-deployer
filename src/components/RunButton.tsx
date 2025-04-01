import React from 'react';
import { useAppContext } from '../lib/AppContext';

export default function RunButton() {
  const { 
    selectedPrompt, 
    apiKey, 
    loading,
    runPrompt
  } = useAppContext();

  const handleRunPrompt = () => {
    runPrompt();
  };

  return (
    <button
      onClick={handleRunPrompt}
      disabled={loading || !selectedPrompt || !apiKey}
      className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
        loading || !selectedPrompt || !apiKey
          ? 'bg-gray-600 cursor-not-allowed'
          : 'btn btn-primary'
      }`}
    >
      {loading ? 'Generating...' : 'Generate Smart Contract'}
    </button>
  );
}