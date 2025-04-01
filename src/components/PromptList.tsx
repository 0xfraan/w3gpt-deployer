import React, { useState } from "react";
import { useAppContext } from "../lib/AppContext";

export default function PromptList() {
  const { prompts, setPrompts, runPrompt, loading, apiKey, setSelectedPrompt } = useAppContext();

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [newPrompt, setNewPrompt] = useState<string>("");

  const handleEditClick = (index: number) => {
    setEditIndex(index);
    setEditText(prompts[index]);
  };

  const handleSaveEdit = (index: number) => {
    const updatedPrompts = [...prompts];
    updatedPrompts[index] = editText;
    setPrompts(updatedPrompts);
    setEditIndex(null);
  };

  const handleDeletePrompt = (index: number) => {
    const updatedPrompts = prompts.filter((_, i) => i !== index);
    setPrompts(updatedPrompts);
  };

  const handleAddPrompt = () => {
    if (newPrompt.trim()) {
      setPrompts([...prompts, newPrompt]);
      setNewPrompt("");
    }
  };

  return (
    <div className="card p-4">
      <h2 className="text-xl font-bold mb-4">Prompts</h2>
      <div className="mb-4">
        <div className="flex mb-2">
          <input
            type="text"
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            className="flex-grow p-2 mr-2 font-mono"
            placeholder="Add new prompt..."
          />
          <button
            onClick={handleAddPrompt}
            className="btn btn-primary"
            disabled={!newPrompt.trim()}
          >
            Add
          </button>
        </div>
      </div>
      <div className="prompt-list">
        {prompts.map((prompt, index) => (
          <div key={index} className="prompt-item">
            {editIndex === index ? (
              <div className="flex flex-col">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="mb-2 font-mono"
                  rows={6}
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveEdit(index)}
                    className="btn btn-primary text-sm py-1 px-2 mr-2"
                    disabled={!editText.trim()}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditIndex(null)}
                    className="btn btn-secondary text-sm py-1 px-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-3 font-mono whitespace-pre-wrap">
                  {prompt}
                </div>
                <div className="flex justify-end items-center">
                  <button
                    onClick={() => {
                      setSelectedPrompt(prompt);
                      runPrompt(prompt);
                    }}
                    className={`mr-3 ${loading || !apiKey ? "opacity-40 cursor-not-allowed" : "hover:opacity-80"}`}
                    disabled={loading || !apiKey}
                    title={
                      !apiKey
                        ? "API key required"
                        : loading
                          ? "Processing..."
                          : "Run this prompt"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-green-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEditClick(index)}
                    className="mr-3 hover:opacity-80"
                    title="Edit prompt"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-blue-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeletePrompt(index)}
                    className="hover:opacity-80"
                    title="Delete prompt"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
