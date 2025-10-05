import React, { useState } from 'react';

interface ApiKeyInputProps {
    onSubmit: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(apiKey);
    };

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2 text-center">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
                            Enter Your Gemini API Key
                        </h2>
                        <p className="text-gray-400">
                            To use this application, please provide your Google Gemini API key.
                        </p>
                    </div>
                    <div>
                        <label htmlFor="apiKey" className="sr-only">Gemini API Key</label>
                        <input
                            id="apiKey"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your API key here"
                            className="w-full p-3 bg-gray-700/50 rounded-lg border-2 border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                            required
                        />
                    </div>
                     <p className="text-xs text-gray-500 text-center">
                        Your key is stored securely in your browser's local storage and is never shared.
                        <a 
                           href="https://aistudio.google.com/app/apikey" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="text-indigo-400 hover:underline ml-1"
                        >
                            Get your key here.
                        </a>
                    </p>
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-purple-600 rounded-lg font-semibold shadow-lg hover:bg-purple-700 disabled:bg-gray-500 transition-colors duration-300"
                    >
                        Save and Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApiKeyInput;
