// src/components/home/SearchBar.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import { Search, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import AILoadingModal from '@/components/common/AILoadingModal';
import VoiceSearchModal from '@/components/common/VoiceSearchModal';
import { useSettings } from '@/context/SettingsContext'; // <-- IMPORT OUR NEW HOOK

const processSearchQuery = httpsCallable(functions, 'processSearchQuery');

const SearchBar = ({ initialQuery = '', className, inputClassName }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
    
    const { settings } = useSettings(); // <-- GET THE GLOBAL SETTINGS

    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);

    const executeSearch = async (queryToSearch) => {
        const userQuery = queryToSearch.trim();
        if (!userQuery) return;

        // --- THIS IS THE KEY CONDITIONAL LOGIC ---
        if (settings.isAIEnabled) {
            // AI-Powered Search Flow
            setIsProcessingAI(true);
            try {
                const response = await processSearchQuery({ text: userQuery });
                const { result: processedQuery } = response.data;
                toast.success('AI analysis complete!'); 
                navigate(`/search?q=${encodeURIComponent(processedQuery)}&oq=${encodeURIComponent(userQuery)}`);
            } catch (error) {
                console.error("Error calling cloud function:", error);
                toast.error('AI assistant is busy, please try another search.');
            } finally {
                setIsProcessingAI(false);
            }
        } else {
            // Manual, Comma-Separated Search Flow
            navigate(`/search?q=${encodeURIComponent(userQuery)}&oq=${encodeURIComponent(userQuery)}`);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        executeSearch(searchQuery);
    };
    
    const handleVoiceSearch = (transcript) => {
        if (transcript) {
            setSearchQuery(transcript);
            executeSearch(transcript);
        }
    };

    return (
        <>
            <AILoadingModal isOpen={isProcessingAI} />
            <VoiceSearchModal 
                isOpen={isVoiceModalOpen} 
                onClose={() => setIsVoiceModalOpen(false)}
                onSearch={handleVoiceSearch}
            />
            
            <form onSubmit={handleFormSubmit} className={cn("relative w-full max-w-xl mx-auto", className)}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                
                <Input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={settings.isAIEnabled ? "Ask for 'milk, bread and soap'..." : "Search categories, e.g., milk,soap"}
                    className={cn(
                        "pl-12 pr-12 h-12 text-md rounded-full w-full",
                        inputClassName
                    )}
                    disabled={isProcessingAI}
                />
                
                {/* --- CONDITIONAL RENDERING FOR MIC ICON --- */}
                {settings.isVoiceEnabled && (
                    <button 
                        type="button" 
                        onClick={() => setIsVoiceModalOpen(true)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted"
                        aria-label="Start voice search"
                    >
                        <Mic className="h-5 w-5 text-muted-foreground" />
                    </button>
                )}
            </form>
        </>
    );
};

export default SearchBar;