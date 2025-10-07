

import { AspectRatio } from './types';

export const ASPECT_RATIOS: AspectRatio[] = ['16:9', '9:16', '1:1', '4:3', '3:4'];

export const VIDEO_GENERATION_MESSAGES: string[] = [
    "Warming up the AI director...",
    "Storyboarding your vision...",
    "Setting up the virtual cameras...",
    "Rendering the first few frames...",
    "Applying cinematic color grading...",
    "Adding high-fidelity soundscapes...",
    "This is a complex scene, adding extra detail...",
    "Finalizing the full HD export...",
    "Almost ready to roll the credits!",
];

// Since the user wants to select a model, we'll define lists of models for each category.
// For now, each list has one model, but this structure allows for easy expansion.
export const IMAGE_GEN_MODELS: string[] = ['imagen-4.0-generate-001'];
export const IMAGE_EDIT_MODELS: string[] = ['gemini-2.5-flash-image'];
export const VIDEO_GEN_MODELS: string[] = ['veo-2.0-generate-001', 'veo-3.0-generate-preview'];