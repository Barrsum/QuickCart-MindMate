// src/components/home/SearchBar.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import AILoadingModal from '@/components/common/AILoadingModal';

const processSearchQuery = httpsCallable(functions, 'processSearchQuery');

const SearchBar = ({ initialQuery = '', className, inputClassName }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const originalUserQuery = searchQuery.trim(); // Capture original query

        if (!originalUserQuery) {
            navigate('/');
            return;
        }

        setIsProcessing(true);
        
        try {
            const response = await processSearchQuery({ text: originalUserQuery });
            const { result: processedQuery } = response.data;
            
            toast.success('AI analysis complete!'); 
            
            // --- THIS IS THE KEY CHANGE ---
            // We now pass both the processed query (q) and the original query (oq)
            navigate(
              `/search?q=${encodeURIComponent(processedQuery)}&oq=${encodeURIComponent(originalUserQuery)}`
            );
            // --- END OF CHANGE ---

        } catch (error) {
            console.error("Error calling cloud function:", error);
            toast.error('AI assistant is busy, please try a manual search.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <AILoadingModal isOpen={isProcessing} />
            
            <form onSubmit={handleSearch} className={cn("relative w-full max-w-xl mx-auto", className)}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                
                <Input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask for 'milk, bread and some soap'..."
                    className={cn(
                        "pl-12 pr-4 h-12 text-md rounded-full w-full",
                        inputClassName
                    )}
                    disabled={isProcessing}
                />
            </form>
        </>
    );
};

export default SearchBar;