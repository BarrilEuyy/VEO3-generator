import React, { useRef, useState, useCallback } from 'react';
import { FileInfo } from '../types';

interface ImageUploaderProps {
    onImageUpload: (fileInfo: FileInfo | null) => void;
    isDisabled: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]); // remove data:mime/type;base64, part
        reader.onerror = error => reject(error);
    });
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isDisabled }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit for inline data
                alert('File size exceeds 4MB limit.');
                return;
            }
            try {
                const base64 = await fileToBase64(file);
                const fileInfo: FileInfo = {
                    base64,
                    mimeType: file.type,
                    name: file.name
                };
                onImageUpload(fileInfo);
                setImagePreview(URL.createObjectURL(file));
                setFileName(file.name);
            } catch (error) {
                console.error("Error converting file to base64:", error);
                alert('Failed to process image.');
            }
        }
    }, [onImageUpload]);

    const handleRemoveImage = useCallback(() => {
        onImageUpload(null);
        setImagePreview(null);
        setFileName(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
        }
    }, [onImageUpload]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <label className="font-semibold text-lg text-gray-300">Reference Image (Optional):</label>
                 <button 
                    onClick={handleUploadClick}
                    disabled={isDisabled}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Upload Image</span>
                </button>
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    disabled={isDisabled}
                />
            </div>
            {imagePreview && (
                <div className="relative w-48 mx-auto p-2 border-2 border-dashed border-gray-600 rounded-lg">
                    <img src={imagePreview} alt="Reference preview" className="rounded-md w-full h-auto object-cover" />
                    <p className="text-xs text-center text-gray-400 mt-1 truncate" title={fileName ?? ''}>{fileName}</p>
                    <button 
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors duration-200"
                        aria-label="Remove image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
