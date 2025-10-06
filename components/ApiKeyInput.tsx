import React from 'react';

interface ApiKeyInputProps {
    apiKey: string;
    setApiKey: (key: string) => void;
    isDisabled: boolean;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey, isDisabled }) => {
    return (
        <div className="space-y-3 pt-4 border-t border-gray-700/50">
            <div className="flex items-center justify-between">
                 <label htmlFor="apiKey" className="font-semibold text-lg text-gray-300">
                    Gemini API Key
                </label>
                <a 
                   href="https://aistudio.google.com/app/apikey" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-sm text-indigo-400 hover:underline"
                >
                    Get your key here
                </a>
            </div>
            <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google Gemini API key"
                className="w-full p-3 bg-gray-700/50 rounded-lg border-2 border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                disabled={isDisabled}
                aria-required="true"
            />
        </div>
    );
};

export default ApiKeyInput;