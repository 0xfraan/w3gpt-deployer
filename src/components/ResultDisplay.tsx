import React from 'react';
import { useAppContext } from '../lib/AppContext';

export default function ResultDisplay() {
  const { result, loading } = useAppContext();

  // Parse result to display in a structured way if it's JSON
  const renderResult = () => {
    try {
      // If result is a JSON string, parse it and format it nicely
      if (result.startsWith('{') || result.startsWith('[')) {
        const parsedResult = JSON.parse(result);
        
        if (parsedResult.contract) {
          return (
            <div className="space-y-4">
              {parsedResult.address && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">Contract Address:</h3>
                  <div className="bg-gray-800 p-2 rounded overflow-x-auto">
                    <a 
                      href={`https://sepolia-optimism.etherscan.io/address/${parsedResult.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {parsedResult.address}
                    </a>
                  </div>
                </div>
              )}
              
              {parsedResult.tx && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">Transaction Hash:</h3>
                  <div className="bg-gray-800 p-2 rounded overflow-x-auto">
                    <a 
                      href={`https://sepolia-optimism.etherscan.io/tx/${parsedResult.tx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {parsedResult.tx}
                    </a>
                  </div>
                </div>
              )}
              
              <h3 className="text-lg font-semibold mb-1">Contract Code:</h3>
              <div className="bg-gray-800 p-4 rounded overflow-x-auto">
                <pre>{parsedResult.contract}</pre>
              </div>
            </div>
          );
        }
        
        // Generic JSON display if it doesn't have the expected structure
        return <pre>{JSON.stringify(parsedResult, null, 2)}</pre>;
      }
      
      // If not JSON, just return as-is
      return result;
    } catch (e) {
      // If parsing fails, just return the raw result
      return result;
    }
  };

  return (
    <div className="card p-4">
      <h2 className="text-xl font-bold mb-4">AI-Generated Smart Contract</h2>
      
      {loading ? (
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : result ? (
        <div className="result-container p-4 rounded-md">
          {renderResult()}
        </div>
      ) : (
        <div className="text-center text-gray-500 p-10">
          <p>No results yet. Run a prompt to generate a smart contract.</p>
        </div>
      )}
    </div>
  );
}