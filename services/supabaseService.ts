import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GenerationType, HistoryItem } from '../types';

const BUCKET_NAME = 'veo3';

class SupabaseService {
    private client: SupabaseClient | null = null;

    initialize(url: string, anonKey: string) {
        this.client = createClient(url, anonKey);
    }
    
    isInitialized(): boolean {
        return !!this.client;
    }

    private getClient(): SupabaseClient {
        if (!this.client) {
            throw new Error('Supabase client is not initialized. Call initialize() first.');
        }
        return this.client;
    }

    async uploadFile(blob: Blob, type: GenerationType, prompt: string): Promise<any> {
        const client = this.getClient();
        const folder = type === GenerationType.Image ? 'foto' : 'video';
        const fileExtension = type === GenerationType.Image ? 'jpg' : 'mp4';
        
        // Sanitize prompt for filename
        const sanitizedPrompt = prompt.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 50);
        const fileName = `${Date.now()}-${sanitizedPrompt || 'untitled'}.${fileExtension}`;
        const filePath = `${folder}/${fileName}`;

        const { data, error } = await client.storage
            .from(BUCKET_NAME)
            .upload(filePath, blob);

        if (error) {
            throw error;
        }
        return data;
    }
    
    async listFiles(): Promise<HistoryItem[]> {
        const client = this.getClient();
        const { data: photoData, error: photoError } = await client.storage.from(BUCKET_NAME).list('foto', { sortBy: { column: 'created_at', order: 'desc' } });
        const { data: videoData, error: videoError } = await client.storage.from(BUCKET_NAME).list('video', { sortBy: { column: 'created_at', order: 'desc' } });

        if (photoError) throw photoError;
        if (videoError) throw videoError;
        
        const SIGNED_URL_EXPIRATION_SECONDS = 60 * 60; // 1 hour

        const createHistoryItem = async (file: { id: string; name: string; created_at: string; }, type: GenerationType, folder: string): Promise<HistoryItem | null> => {
            const filePath = `${folder}/${file.name}`;
            const { data, error } = await client.storage
                .from(BUCKET_NAME)
                .createSignedUrl(filePath, SIGNED_URL_EXPIRATION_SECONDS);

            if (error || !data) {
                console.error(`Error creating signed URL for ${filePath}:`, error);
                return null;
            }

            return {
                id: file.id,
                name: file.name,
                url: data.signedUrl,
                type: type,
                createdAt: file.created_at,
            };
        };
        
        const photoPromises = (photoData || []).map(file => createHistoryItem(file, GenerationType.Image, 'foto'));
        const videoPromises = (videoData || []).map(file => createHistoryItem(file, GenerationType.Video, 'video'));

        const allItems = await Promise.all([...photoPromises, ...videoPromises]);

        return allItems
            .filter((item): item is HistoryItem => item !== null) // Filter out any items that failed to get a URL
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
}

const supabase = new SupabaseService();

const uploadToHistory = async (blob: Blob, type: GenerationType, prompt: string) => {
    return supabase.uploadFile(blob, type, prompt);
};

const getHistory = async (): Promise<HistoryItem[]> => {
    return supabase.listFiles();
};

export { supabase, uploadToHistory, getHistory };