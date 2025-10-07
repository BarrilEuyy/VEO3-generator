import React from 'react';
import { GenerationType } from '../types';
import LoadingIndicator from './LoadingIndicator';

interface ResultDisplayProps {
    isLoading: boolean;
    resultUrl: string | null;
    generationType: GenerationType;
    loadingMessage: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, resultUrl, generationType, loadingMessage }) => {
    
    const WelcomePlaceholder: React.FC = () => (
        <div className="text-center text-gray-500 flex flex-col items-center justify-center space-y-4 h-full">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.079.079 0 0 1 .079.079v.008a.079.079 0 0 1-.079.079h-.008a.079.079 0 0 1-.079-.079v-.008a.079.079 0 0 1 .079-.079h.008Z" />
            </svg>
            <h3 className="text-xl font-semibold">Your creations will appear here</h3>
            <p className="max-w-md">Once you provide a prompt and click generate, your masterpiece will be revealed in this space.</p>
        </div>
    );
    
    return (
        <div className="bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-2xl w-full aspect-video flex items-center justify-center p-2 min-h-[200px] sm:min-h-[300px] md:min-h-[400px]">
            {isLoading ? (
                <LoadingIndicator message={loadingMessage} />
            ) : resultUrl ? (
                generationType === GenerationType.Image ? (
                    <img src={resultUrl} alt="Generated content" className="max-w-full max-h-full object-contain rounded-lg" />
                ) : (
                    <video key={resultUrl} src={resultUrl} controls autoPlay loop className="max-w-full max-h-full object-contain rounded-lg">
                        Your browser does not support the video tag.
                    </video>
                )
            ) : (
                <WelcomePlaceholder />
            )}
        </div>
    );
};

export default ResultDisplay;