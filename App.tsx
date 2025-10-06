import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import OptionsSelector from './components/OptionsSelector';
import ResultDisplay from './components/ResultDisplay';
import ImageUploader from './components/ImageUploader';
import ApiKeyInput from './components/ApiKeyInput';
import { generateImage, generateVideo, checkVideoStatus } from './services/geminiService';
import { GenerationType, AspectRatio, FileInfo } from './types';
import { VIDEO_GENERATION_MESSAGES } from './constants';

const App: React.FC = () => {
    const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('geminiApiKey') || '');
    const [prompt, setPrompt] = useState<string>('');
    const [generationType, setGenerationType] = useState<GenerationType>(GenerationType.Image);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [referenceImage, setReferenceImage] = useState<FileInfo | null>(null);

    useEffect(() => {
        if (apiKey) {
            localStorage.setItem('geminiApiKey', apiKey);
        } else {
            localStorage.removeItem('geminiApiKey');
        }
    }, [apiKey]);

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
            if (generationType === GenerationType.Image) {
                setLoadingMessage('Creating your visual masterpiece...');
                const imageUrl = await generateImage(prompt, aspectRatio, referenceImage, apiKey);
                setResultUrl(imageUrl);
            } else {
                let operation = await generateVideo(prompt, aspectRatio, referenceImage, apiKey);
                while (!operation.done) {
                    await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
                    operation = await checkVideoStatus(operation, apiKey);
                }

                if (operation.response?.generatedVideos?.[0]?.video?.uri) {
                     const downloadLink = operation.response.generatedVideos[0].video.uri;
                     const response = await fetch(`${downloadLink}&key=${apiKey}`);
                     const videoBlob = await response.blob();
                     const videoUrl = URL.createObjectURL(videoBlob);
                     setResultUrl(videoUrl);
                } else {
                    throw new Error('Video generation finished but no video URI was found.');
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(`An error occurred: ${err.message}. Please check your prompt and API key.`);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [prompt, generationType, aspectRatio, referenceImage, apiKey]);

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
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

                    <ApiKeyInput 
                        apiKey={apiKey}
                        setApiKey={setApiKey}
                        isDisabled={isLoading}
                    />

                    {error && (
                        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                    
                    <ResultDisplay
                        isLoading={isLoading}
                        resultUrl={resultUrl}
                        generationType={generationType}
                        loadingMessage={loadingMessage}
                    />
                </div>
            </main>
            <footer className="text-center py-6 text-gray-500 text-sm">
                <p>Powered by Google Gemini. UI designed for creativity.</p>
            </footer>
        </div>
    );
};

export default App;