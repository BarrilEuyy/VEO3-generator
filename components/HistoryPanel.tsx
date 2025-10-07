
import React, { useRef, useEffect } from 'react';
import { HistoryItem, GenerationType } from '../types';

interface HistoryPanelProps {
    isVisible: boolean;
    items: HistoryItem[];
    isLoading: boolean;
    onSelectItem: (item: HistoryItem) => void;
    hasCredentials: boolean;
    totalItemCount: number;
    onLoadMore: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isVisible, items, isLoading, onSelectItem, hasCredentials, totalItemCount, onLoadMore }) => {
    if (!isVisible) {
        return null;
    }

    const HistoryItemCard: React.FC<{ item: HistoryItem }> = ({ item }) => {
        const videoRef = useRef<HTMLVideoElement>(null);

        useEffect(() => {
            // This effect forces the browser to play the video, fixing the "audio only" bug.
            if (videoRef.current) {
                videoRef.current.muted = true; // Ensure it's muted for autoplay policies
                videoRef.current.play().catch(error => {
                    console.warn("History preview autoplay was prevented:", error);
                });
            }
        }, [item.url]);

        return (
            <button 
                onClick={() => onSelectItem(item)}
                className="w-full text-left bg-gray-700/50 hover:bg-gray-700 rounded-lg overflow-hidden transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
                <div className="relative aspect-video bg-gray-900">
                    {item.type === GenerationType.Video ? (
                        <video 
                            ref={videoRef}
                            src={item.url} 
                            className="w-full h-full object-cover" 
                            muted 
                            playsInline 
                            loop 
                        />
                    ) : (
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/80" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                    </div>
                     <a
                        href={item.url}
                        download={item.name}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-2 right-2 z-10 p-2 bg-gray-800/60 rounded-full hover:bg-purple-600 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        aria-label="Download"
                        title="Download"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </a>
                </div>
                <div className="p-3">
                    <p className="text-sm font-semibold truncate text-gray-200" title={item.name}>{item.name}</p>
                    <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
            </button>
        );
    }

    const Content = () => {
        if (!hasCredentials) {
            return (
                 <div className="text-center text-gray-400 p-4">
                    <h4 className="font-semibold text-white mb-2">History Disabled</h4>
                    <p className="text-sm">The history feature is not available. Supabase credentials are not configured in the application environment.</p>
                </div>
            )
        }

        if (isLoading) {
            return (
                <div className="flex justify-center items-center p-8">
                    <div className="w-8 h-8 border-2 border-t-2 border-gray-600 border-t-indigo-400 rounded-full animate-spin"></div>
                </div>
            )
        }
        if (items.length === 0) {
            return (
                 <div className="text-center text-gray-400 p-4">
                    <h4 className="font-semibold text-white mb-2">No History Yet</h4>
                    <p className="text-sm">Your generated images and videos will appear here once you create them.</p>
                </div>
            )
        }
        return (
            <div className="space-y-4">
                {items.map(item => <HistoryItemCard key={item.id} item={item} />)}
                {items.length < totalItemCount && (
                    <div className="pt-2">
                        <button 
                            onClick={onLoadMore} 
                            className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <aside className="lg:w-1/3 bg-gray-800/50 rounded-2xl p-4 lg:p-6 flex flex-col">
            <h3 className="text-xl font-bold mb-4 text-gray-200">Generation History</h3>
            <div className="overflow-y-auto flex-grow pr-2 -mr-2">
                <Content />
            </div>
        </aside>
    );
};

export default HistoryPanel;
