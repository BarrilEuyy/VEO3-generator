
import React from 'react';

interface LoadingIndicatorProps {
    message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 text-indigo-300">
             <div className="w-16 h-16 border-4 border-t-4 border-gray-600 border-t-indigo-400 rounded-full animate-spin"></div>
             <p className="text-lg font-semibold animate-pulse">{message}</p>
        </div>
    );
};

export default LoadingIndicator;
