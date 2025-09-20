// src/components/home/SearchBar.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import { Search, Mic } from 'lucide-react'; // <-- Import Mic icon
import { cn } from '@/lib/utils';
import AILoadingModal from '@/components/common/AILoadingModal';
import VoiceSearchModal from '@/components/common/VoiceSearchModal'; // <-- Import the new voice modal

const processSearchQuery = httpsCallable(functions, 'processSearchQuery');

const SearchBar = ({ initialQuery = '', className, inputClassName }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false); // <-- State for the voice modal

    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);

    // This is our existing AI search function
    const executeSearch = async (queryToSearch) => {
        const originalUserQuery = queryToSearch.trim();
        if (!originalUserQuery) return;

        setIsProcessingAI(true);
        
        try {
            const response = await processSearchQuery({ text: originalUserQuery });
            const { result: processedQuery } = response.data;
            toast.success('AI analysis complete!'); 
            navigate(`/search?q=${encodeURIComponent(processedQuery)}&oq=${encodeURIComponent(originalUserQuery)}`);
        } catch (error) {
            console.error("Error calling cloud function:", error);
            toast.error('AI assistant is busy, please try a manual search.');
        } finally {
            setIsProcessingAI(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        executeSearch(searchQuery);
    };
    
    // This function is called by the VoiceSearchModal when it's done
    const handleVoiceSearch = (transcript) => {
        if (transcript) {
            setSearchQuery(transcript); // Update the input field with the transcript
            executeSearch(transcript);  // Immediately execute the search
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
                    placeholder="Ask for 'milk, bread and some soap'..."
                    className={cn(
                        "pl-12 pr-12 h-12 text-md rounded-full w-full", // Increased padding-right for mic
                        inputClassName
                    )}
                    disabled={isProcessingAI}
                />
                
                <button 
                    type="button" 
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted"
                    aria-label="Start voice search"
                >
                    <Mic className="h-5 w-5 text-muted-foreground" />
                </button>
            </form>
        </>
    );
};

export default SearchBar;