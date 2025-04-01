import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../lib/AppContext';

export default function LogsPanel() {
  const { logs, clearLogs } = useAppContext();
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const renderLogContent = (content: string) => {
    // Simple display of the content without URL parsing or formatting
    // Just handle special cases for specific log types
    
    // Check if the log entry indicates an error
    if (content.includes('Error:')) {
      return <span className="text-red-500">{content}</span>;
    }
    
    // Check if the log entry indicates success
    if (content.includes('successfully')) {
      return <span className="text-green-500">{content}</span>;
    }
    
    // Handle contract code block
    if (content === 'Contract code:') {
      return <span className="font-semibold text-yellow-400">{content}</span>;
    }
    
    // Handle ellipsis for code truncation
    if (content === '...') {
      return <span className="text-gray-500 block my-1 text-center">···</span>;
    }
    
    // Check if this is JSON content
    if (content.startsWith('{') && content.endsWith('}') && (content.includes('"') || content.includes('\n'))) {
      try {
        // Try to parse and pretty-print JSON
        const json = JSON.parse(content);
        return (
          <pre className="bg-gray-800 p-2 rounded my-1 overflow-x-auto text-xs">
            {JSON.stringify(json, null, 2)}
          </pre>
        );
      } catch (e) {
        // If parsing fails, just render as code
        return (
          <pre className="bg-gray-800 p-2 rounded my-1 overflow-x-auto text-xs">
            {content}
          </pre>
        );
      }
    }
    
    // Check if this is likely code (multiple lines, contains symbols like {})
    if (content.includes('{') && content.includes('}') && content.includes('\n')) {
      return (
        <pre className="bg-gray-800 p-2 rounded my-1 overflow-x-auto text-xs">
          {content}
        </pre>
      );
    }
    
    return content;
  };

  const renderLog = (log: string) => {
    // Check if the log has a timestamp prefix [HH:MM:SS]
    const timestampRegex = /^\[(\d{1,2}:\d{2}:\d{2}(?:\s?[APap][Mm])?)\]/;
    const match = log.match(timestampRegex);
    
    if (match) {
      const timestamp = match[0];
      const content = log.substring(match[0].length).trim();
      
      return (
        <div className="flex">
          <span className="text-gray-500 mr-2 flex-shrink-0">{timestamp}</span>
          <div className="flex-grow">{renderLogContent(content)}</div>
        </div>
      );
    }
    
    return <div>{renderLogContent(log)}</div>;
  };

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Logs & Results</h2>
        {logs.length > 0 && (
          <button 
            onClick={clearLogs}
            className="btn btn-secondary text-sm py-1 px-3"
          >
            Clear Logs
          </button>
        )}
      </div>
      
      <div className="logs-container">
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>No logs yet. Run a prompt to see results.</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-1">
              {renderLog(log)}
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}