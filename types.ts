export enum GenerationType {
    Image = 'image',
    Video = 'video',
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface FileInfo {
    base64: string;
    mimeType: string;
    name: string;
}

export interface HistoryItem {
    id: string;
    name: string;
    url: string;
    type: GenerationType;
    createdAt: string;
}