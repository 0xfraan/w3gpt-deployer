import React from 'react';
import { useAppContext } from '../lib/AppContext';

export default function SettingsPanel() {
  const { 
    apiKey, 
    setApiKey, 
    chainId, 
    setChainId, 
    autoRunDelay,
    setAutoRunDelay,
    isAutoRunning,
    startAutoRun,
    stopAutoRun,
    loading 
  } = useAppContext();

  // Specific supported chain IDs
  const chains = [
    { id: '59902', name: 'Phantom Testnet' },
    { id: '11155420', name: 'Optimism Sepolia' },
    { id: '421614', name: 'Arbitrum Sepolia' },
    { id: '84532', name: 'Base Sepolia' },
    { id: '5003', name: 'Mantle Testnet' },
    { id: '80002', name: 'Polygon Amoy' },
    { id: '11155111', name: 'Ethereum Sepolia' }
  ];

  return (
    <div className="card p-4">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
            API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2"
            placeholder="Enter your API key"
          />
          {!apiKey && (
            <p className="mt-1 text-sm text-red-500">
              API key is required to run prompts
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="chainId" className="block text-sm font-medium mb-1">
            Chain ID
          </label>
          <select
            id="chainId"
            value={chainId}
            onChange={(e) => setChainId(e.target.value)}
            className="w-full p-2"
          >
            {chains.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name} (ID: {chain.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="autoRunDelay" className="block text-sm font-medium mb-1">
          Auto-Run Delay (seconds)
        </label>
        <div className="flex items-center">
          <input
            type="number"
            id="autoRunDelay"
            value={autoRunDelay}
            onChange={(e) => setAutoRunDelay(Math.max(1, parseInt(e.target.value) || 600))}
            className="w-32 p-2 mr-2"
            min="1"
            disabled={!apiKey}
          />
          {isAutoRunning ? (
            <button
              onClick={stopAutoRun}
              className="btn bg-red-600 text-white hover:bg-red-700 ml-2"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
              </svg>
              Stop
            </button>
          ) : (
            <button
              onClick={startAutoRun}
              className="btn btn-primary ml-2"
              disabled={loading || !apiKey}
              title={!apiKey ? "API key required" : ""}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
              </svg>
              Auto-Run
            </button>
          )}
        </div>
      </div>
    </div>
  );
}