import React from 'react';

interface HeaderProps {
    onShowKeyInput: () => void;
    isKeySet: boolean;
}

const Header: React.FC<HeaderProps> = ({ onShowKeyInput, isKeySet }) => {
    return (
        <header className="py-6">
            <div className="container mx-auto px-4 flex items-center justify-center relative">
                <div className="flex items-center justify-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-purple-400">
                        <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
                    </svg>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
                        VEO HD Media Generator
                    </h1>
                </div>
                {isKeySet && (
                     <button 
                        onClick={onShowKeyInput} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                        aria-label="Change API Key"
                        title="Change API Key"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.784-.284 1.082s-.632.48-1.03.546A3.75 3.75 0 0 0 4.5 15.75v3a3 3 0 0 0 3 3h.512c.38.344.822.614 1.3.796V21a.75.75 0 0 0 1.5 0v-.941a4.502 4.502 0 0 0 2.39-1.654 4.5 4.5 0 0 0-1.2-6.329 6.75 6.75 0 0 0 4.25-5.826A6.75 6.75 0 0 0 15.75 1.5Zm-3 10.5a4.5 4.5 0 0 1 4.5-4.5a.75.75 0 0 0 0-1.5 6 6 0 0 0-6 6 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;