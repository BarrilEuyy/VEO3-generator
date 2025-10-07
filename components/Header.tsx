import React from 'react';

interface HeaderProps {
    onToggleHistory: () => void;
    isHistoryVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleHistory, isHistoryVisible }) => {
    return (
        <header className="py-6 sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex items-center justify-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-purple-400">
                        <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
                    </svg>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
                        VEO HD Media Generator
                    </h1>
                </div>

                <button
                    onClick={onToggleHistory}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-300"
                    aria-label="Toggle history panel"
                >
                    <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                    </svg>
                    <span>{isHistoryVisible ? 'Hide' : 'Show'} History</span>
                </button>
            </div>
        </header>
    );
};

export default Header;