import React from 'react';

interface SupabaseCredentialsInputProps {
    supabaseUrl: string;
    setSupabaseUrl: (url: string) => void;
    supabaseAnonKey: string;
    setSupabaseAnonKey: (key: string) => void;
    isDisabled: boolean;
}

const SupabaseCredentialsInput: React.FC<SupabaseCredentialsInputProps> = ({ 
    supabaseUrl, setSupabaseUrl, supabaseAnonKey, setSupabaseAnonKey, isDisabled 
}) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                 <label htmlFor="supabaseUrl" className="font-semibold text-gray-300">
                    Supabase (for History)
                </label>
                 <a 
                   href="https://supabase.com/dashboard" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-sm text-indigo-400 hover:underline"
                >
                    Get your credentials
                </a>
            </div>
            <input
                id="supabaseUrl"
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="Supabase Project URL"
                className="w-full p-3 bg-gray-700/50 rounded-lg border-2 border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                disabled={isDisabled}
            />
            <input
                id="supabaseAnonKey"
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="Supabase Anon (public) Key"
                className="w-full p-3 bg-gray-700/50 rounded-lg border-2 border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                disabled={isDisabled}
            />
        </div>
    );
};

export default SupabaseCredentialsInput;