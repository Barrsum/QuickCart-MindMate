// src/components/home/SearchBar.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react'; // Import the loader icon
import { cn } from '@/lib/utils';

// Create a reference to our cloud function. This is how the frontend finds it.
const processSearchQuery = httpsCallable(functions, 'processSearchQuery');

const SearchBar = ({ initialQuery = '', className, inputClassName }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [isProcessing, setIsProcessing] = useState(false); // New state to track loading

    // This useEffect ensures that if the user navigates with browser buttons,
    // the search bar updates to the new query in the URL.
    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const query = searchQuery.trim();

        if (!query) {
            navigate('/');
            return;
        }

        setIsProcessing(true);
        const toastId = toast.loading('Asking our AI assistant...');

        try {
            // Call the cloud function with the user's text
            console.log(`Sending to AI: "${query}"`);
            const response = await processSearchQuery({ text: query });
            
            // Get the processed string from the function's response
            const { result: processedQuery } = response.data;
            console.log(`Received from AI: "${processedQuery}"`);
            
            toast.success('Here are your results!', { id: toastId });
            
            // Navigate to the search page with the AI-processed query
            navigate(`/search?q=${encodeURIComponent(processedQuery)}`);

        } catch (error) {
            console.error("Error calling cloud function:", error);
            toast.error('AI assistant is busy, please try a manual search.', { id: toastId });
        } finally {
            // This 'finally' block ensures the loader stops even if there's an error
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSearch} className={cn("relative w-full max-w-xl mx-auto", className)}>
            {/* Conditionally render the Loader or the Search icon */}
            {isProcessing ? (
                <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
            ) : (
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            )}
            
            <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask for 'milk, bread and some soap'..." // New placeholder
                className={cn(
                    "pl-12 pr-4 h-12 text-md rounded-full w-full",
                    inputClassName
                )}
                disabled={isProcessing} // Disable input while the AI is thinking
            />
        </form>
    );
};

export default SearchBar;