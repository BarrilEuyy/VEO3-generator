
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import OptionsSelector from './components/OptionsSelector';
import ResultDisplay from './components/ResultDisplay';
import ImageUploader from './components/ImageUploader';
import ApiKeyInput from './components/ApiKeyInput';
import SupabaseCredentialsInput from './components/SupabaseCredentialsInput';
import HistoryPanel from './components/HistoryPanel';
import { generateImage, generateVideo, checkVideoStatus } from './services/geminiService';
import { supabase, uploadToHistory, getHistory } from './services/supabaseService';
import { GenerationType, AspectRatio, FileInfo, HistoryItem } from './types';
import { VIDEO_GENERATION_MESSAGES } from './constants';

const App: React.FC = () => {
    const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('geminiApiKey') || '');
    const [supabaseUrl, setSupabaseUrl] = useState<string>(() => localStorage.getItem('supabaseUrl') || '');
    const [supabaseServiceKey, setSupabaseServiceKey] = useState<string>(() => localStorage.getItem('supabaseServiceKey') || '');
    
    const [prompt, setPrompt] = useState<string>('');
    const [generationType, setGenerationType] = useState<GenerationType>(GenerationType.Image);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultType, setResultType] = useState<GenerationType>(GenerationType.Image);
    const [referenceImage, setReferenceImage] = useState<FileInfo | null>(null);
    
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [displayedHistoryCount, setDisplayedHistoryCount] = useState<number>(6);
    const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
    const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);

    useEffect(() => {
        if (apiKey) localStorage.setItem('geminiApiKey', apiKey); else localStorage.removeItem('geminiApiKey');
    }, [apiKey]);
    
    useEffect(() => {
        if (supabaseUrl) localStorage.setItem('supabaseUrl', supabaseUrl); else localStorage.removeItem('supabaseUrl');
        if (supabaseServiceKey) localStorage.setItem('supabaseServiceKey', supabaseServiceKey); else localStorage.removeItem('supabaseServiceKey');
        if(supabaseUrl && supabaseServiceKey) {
            supabase.initialize(supabaseUrl, supabaseServiceKey);
            loadHistory();
        } else {
            setHistoryItems([]);
        }
    }, [supabaseUrl, supabaseServiceKey]);

    const loadHistory = useCallback(async () => {
        if (!supabase.isInitialized()) return;
        setIsHistoryLoading(true);
        try {
            const items = await getHistory();
            setHistoryItems(items);
            setDisplayedHistoryCount(6); // Reset count on every refresh
        } catch (err: any) {
            console.error("Failed to load history:", err);
            setError("Could not load history from Supabase. Check your credentials.");
        } finally {
            setIsHistoryLoading(false);
        }
    }, []);

    useEffect(() => {
        let interval: number;
        if (isLoading && generationType === GenerationType.Video) {
            setLoadingMessage(VIDEO_GENERATION_MESSAGES[0]);
            let messageIndex = 1;
            interval = window.setInterval(() => {
                setLoadingMessage(VIDEO_GENERATION_MESSAGES[messageIndex % VIDEO_GENERATION_MESSAGES.length]);
                messageIndex++;
            }, 4000);
        }
        return () => clearInterval(interval);
    }, [isLoading, generationType]);
    
    const isAspectRatioDisabled = generationType === GenerationType.Image && !!referenceImage;

    const handleGenerate = useCallback(async () => {
        if (!apiKey.trim()) {
            setError('Please enter your Gemini API Key.');
            return;
        }
        if (!prompt.trim() && !referenceImage) {
            setError('Please enter a prompt or provide a reference image.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResultUrl(null);

        try {
            let generatedBlob: Blob;
            let generatedResultUrl: string;

            if (generationType === GenerationType.Image) {
                setLoadingMessage('Creating your visual masterpiece...');
                generatedResultUrl = await generateImage(prompt, aspectRatio, referenceImage, apiKey);
                const response = await fetch(generatedResultUrl);
                generatedBlob = await response.blob();
            } else { // Video
                let operation = await generateVideo(prompt, aspectRatio, referenceImage, apiKey);
                while (!operation.done) {
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    operation = await checkVideoStatus(operation, apiKey);
                }

                if (operation.response?.generatedVideos?.[0]?.video?.uri) {
                     const downloadLink = operation.response.generatedVideos[0].video.uri;
                     const response = await fetch(`${downloadLink}&key=${apiKey}`);
                     generatedBlob = await response.blob();
                     generatedResultUrl = URL.createObjectURL(generatedBlob);
                } else {
                    throw new Error('Video generation finished but no video URI was found.');
                }
            }
            
            setResultUrl(generatedResultUrl);
            setResultType(generationType);

            if (supabase.isInitialized()) {
                setLoadingMessage('Saving to history...');
                await uploadToHistory(generatedBlob, generationType, prompt || 'Untitled');
                await loadHistory();
            }

        } catch (err: any) {
            console.error(err);
            setError(`An error occurred: ${err.message}. Please check your prompt and API key.`);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [prompt, generationType, aspectRatio, referenceImage, apiKey, loadHistory]);
    
    const handleSelectHistoryItem = (item: HistoryItem) => {
        setResultUrl(item.url);
        setResultType(item.type);
    };

    const handleLoadMoreHistory = () => {
        setDisplayedHistoryCount(prev => prev + 6);
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
            <Header onToggleHistory={() => setIsHistoryVisible(!isHistoryVisible)} isHistoryVisible={isHistoryVisible}/>
            <div className="flex-grow container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <main className="flex-grow lg:w-2/3">
                        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-8">
                            <p className="text-center text-lg text-gray-300">
                                Bring your ideas to life. Describe the image or full HD video you want to create.
                            </p>
                            <OptionsSelector
                                generationType={generationType}
                                setGenerationType={setGenerationType}
                                aspectRatio={aspectRatio}
                                setAspectRatio={setAspectRatio}
                                isDisabled={isLoading}
                                isAspectRatioDisabled={isAspectRatioDisabled}
                            />
                            <ImageUploader 
                                onImageUpload={setReferenceImage}
                                isDisabled={isLoading}
                            />
                            <PromptInput
                                prompt={prompt}
                                setPrompt={setPrompt}
                                onGenerate={handleGenerate}
                                isLoading={isLoading}
                            />

                            {error && (
                                <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
                                    {error}
                                </div>
                            )}
                            
                            <ResultDisplay
                                isLoading={isLoading}
                                resultUrl={resultUrl}
                                generationType={resultType}
                                loadingMessage={loadingMessage}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-700/50">
                                <ApiKeyInput 
                                    apiKey={apiKey}
                                    setApiKey={setApiKey}
                                    isDisabled={isLoading}
                                />
                                <SupabaseCredentialsInput
                                    supabaseUrl={supabaseUrl}
                                    setSupabaseUrl={setSupabaseUrl}
                                    supabaseServiceKey={supabaseServiceKey}
                                    setSupabaseServiceKey={setSupabaseServiceKey}
                                    isDisabled={isLoading}
                                />
                            </div>
                        </div>
                    </main>
                     <HistoryPanel 
                        isVisible={isHistoryVisible}
                        items={historyItems.slice(0, displayedHistoryCount)}
                        isLoading={isHistoryLoading}
                        onSelectItem={handleSelectHistoryItem}
                        hasCredentials={!!(supabaseUrl && supabaseServiceKey)}
                        totalItemCount={historyItems.length}
                        onLoadMore={handleLoadMoreHistory}
                    />
                </div>
            </div>
            <footer className="text-center py-6 text-gray-500 text-sm">
                <p>Powered by Google Gemini. UI designed for creativity.</p>
            </footer>
        </div>
    );
};

export default App;
