import React from 'react';
import { GenerationType, AspectRatio } from '../types';
import { ASPECT_RATIOS } from '../constants';

interface OptionsSelectorProps {
    generationType: GenerationType;
    setGenerationType: (type: GenerationType) => void;
    aspectRatio: AspectRatio;
    setAspectRatio: (ratio: AspectRatio) => void;
    isDisabled: boolean;
    isAspectRatioDisabled: boolean;
}

const OptionsSelector: React.FC<OptionsSelectorProps> = ({
    generationType,
    setGenerationType,
    aspectRatio,
    setAspectRatio,
    isDisabled,
    isAspectRatioDisabled,
}) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <label className="font-semibold text-lg text-gray-300">I want to create a:</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-700/60 rounded-lg">
                    <button
                        onClick={() => setGenerationType(GenerationType.Image)}
                        disabled={isDisabled}
                        className={`px-6 py-2 rounded-md transition-colors duration-300 text-sm font-medium ${
                            generationType === GenerationType.Image ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-gray-600/50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        Image
                    </button>
                    <button
                        onClick={() => setGenerationType(GenerationType.Video)}
                        disabled={isDisabled}
                        className={`px-6 py-2 rounded-md transition-colors duration-300 text-sm font-medium ${
                            generationType === GenerationType.Video ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-gray-600/50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        Video
                    </button>
                </div>
            </div>

            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-opacity duration-300 ${isAspectRatioDisabled ? 'opacity-50' : ''}`}>
                 <label className="font-semibold text-lg text-gray-300">Aspect Ratio:</label>
                 <div className="flex flex-wrap justify-center gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                        <button
                            key={ratio}
                            onClick={() => setAspectRatio(ratio)}
                            disabled={isDisabled || isAspectRatioDisabled}
                            className={`px-4 py-2 rounded-md transition-colors duration-300 text-sm font-medium border-2 ${
                                aspectRatio === ratio 
                                ? 'bg-indigo-500 border-indigo-400 text-white' 
                                : 'border-gray-600 hover:bg-gray-700/50 hover:border-gray-500'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {ratio}
                        </button>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default OptionsSelector;