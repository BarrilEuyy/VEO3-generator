
import React from 'react';

interface SupabaseCredentialsInputProps {
    supabaseUrl: string;
    setSupabaseUrl: (url: string) => void;
    supabaseServiceKey: string;
    setSupabaseServiceKey: (key: string) => void;
    isDisabled: boolean;
}

const SupabaseCredentialsInput: React.FC<SupabaseCredentialsInputProps> = ({ 
    supabaseUrl, setSupabaseUrl, supabaseServiceKey, setSupabaseServiceKey, isDisabled 
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
                id="supabaseServiceKey"
                type="password"
                value={supabaseServiceKey}
                onChange={(e) => setSupabaseServiceKey(e.target.value)}
                placeholder="Supabase Service Role Key"
                className="w-full p-3 bg-gray-700/50 rounded-lg border-2 border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                disabled={isDisabled}
            />
             <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-xs mt-2">
                <p className="font-bold mb-1">Security Warning:</p>
                <p>Using a Service Role Key in the browser is extremely insecure and should ONLY be done for local testing. Do not deploy this to a public website.</p>
            </div>
        </div>
    );
};

export default SupabaseCredentialsInput;
