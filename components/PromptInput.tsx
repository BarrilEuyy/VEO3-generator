
import React from 'react';

interface PromptInputProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onGenerate, isLoading }) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && !isLoading) {
            event.preventDefault();
            onGenerate();
        }
    };
    
    return (
        <div className="relative">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., A cinematic shot of a raccoon astronaut discovering a new planet..."
                className="w-full h-28 p-4 pr-36 bg-gray-700/50 rounded-xl border-2 border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none placeholder-gray-400"
                disabled={isLoading}
            />
            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 rounded-lg font-semibold shadow-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 disabled:scale-100"
            >
                {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l2.067-9.022H4.5a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
                    </svg>
                )}
                <span>Generate</span>
            </button>
        </div>
    );
};

export default PromptInput;
