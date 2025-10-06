import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio, FileInfo } from '../types';

export const generateImage = async (
    prompt: string, 
    aspectRatio: AspectRatio, 
    referenceImage: FileInfo | null,
    apiKey: string
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey });
    if (referenceImage) {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: referenceImage.base64,
                            mimeType: referenceImage.mimeType,
                        },
                    },
                    {
                        text: prompt || 'Improve this image, keeping the original subject.',
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        if (imagePart?.inlineData) {
            const base64ImageBytes = imagePart.inlineData.data;
            return `data:${imagePart.inlineData.mimeType};base64,${base64ImageBytes}`;
        } else {
            throw new Error("Image generation with reference failed, no image data received in response.");
        }

    } else {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });

        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        if (!base64ImageBytes) {
            throw new Error("Image generation failed, no image data received.");
        }
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
};

export const generateVideo = async (
    prompt: string, 
    aspectRatio: AspectRatio,
    referenceImage: FileInfo | null,
    apiKey: string
) => {
    const ai = new GoogleGenAI({ apiKey });
    const videoParams: any = {
        model: 'veo-3.0-generate-preview',
        prompt: `A full HD, cinematic, high quality video of: ${prompt}`,
        config: {
            numberOfVideos: 1,
            aspectRatio: aspectRatio
        }
    };

    if (referenceImage) {
        videoParams.image = {
            imageBytes: referenceImage.base64,
            mimeType: referenceImage.mimeType,
        };
    }

    const operation = await ai.models.generateVideos(videoParams);
    return operation;
};

export const checkVideoStatus = async (operation: any, apiKey: string) => {
    const ai = new GoogleGenAI({ apiKey });
    const updatedOperation = await ai.operations.getVideosOperation({ operation: operation });
    return updatedOperation;
};