// src/components/home/SearchBar.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const SearchBar = ({ initialQuery = '', className, inputClassName }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    // This useEffect ensures that if the user navigates with browser buttons,
    // the search bar updates to the new query in the URL.
    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            // Optional: if the search is cleared, navigate back home
            navigate('/');
        }
    };

    return (
        <form onSubmit={handleSearch} className={cn("relative w-full max-w-xl mx-auto", className)}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by categories like soap, milk..."
                className={cn(
                    "pl-12 pr-4 h-12 text-md rounded-full w-full",
                    inputClassName
                )}
            />
        </form>
    );
};

export default SearchBar;