// src/pages/SearchPage.jsx

import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import Header from '@/components/home/Header';
import SearchResults from '@/components/home/SearchResults';
import SearchBar from '@/components/home/SearchBar';

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const SearchPage = () => {
    const queryParams = useQuery();
    const searchQuery = queryParams.get('q') || '';
    
    const [foundResults, setFoundResults] = useState([]);
    const [notFoundCategories, setNotFoundCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!searchQuery) {
            setLoading(false);
            return;
        };

        const fetchSearchResults = async () => {
            setLoading(true);
            setError('');
            setFoundResults([]);
            setNotFoundCategories([]);

            try {
                const requestedCategories = searchQuery
                    .toLowerCase()
                    .split(',')
                    .map(cat => cat.trim())
                    .filter(cat => cat.length > 0);

                if (requestedCategories.length === 0) {
                    setLoading(false);
                    return;
                }

                const searchPromises = requestedCategories.map(categoryName => {
                    const q = query(
                        collection(db, "products"),
                        where("category", "==", categoryName)
                    );
                    return getDocs(q);
                });

                const results = await Promise.allSettled(searchPromises);
                
                const found = [];
                const notFound = [];

                results.forEach((result, index) => {
                    const categoryName = requestedCategories[index];
                    if (result.status === 'fulfilled' && result.value.docs.length > 0) {
                        found.push({
                            category: categoryName,
                            products: result.value.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                        });
                    } else {
                        notFound.push(categoryName);
                    }
                });

                setFoundResults(found);
                setNotFoundCategories(notFound);

            } catch (err) {
                console.error("Critical error fetching search results:", err);
                setError("Sorry, a critical error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto p-4 md:p-8 pt-24 md:pt-28">
                <div className="border-b pb-6">
                    <p className="text-sm text-muted-foreground">Showing results for</p>
                    <h1 className="text-4xl font-bold tracking-tight text-primary break-words">
                        “{searchQuery}”
                    </h1>
                        <SearchBar initialQuery={searchQuery} />
                </div>

                <SearchResults 
                    loading={loading}
                    error={error}
                    foundResults={foundResults}
                    notFoundCategories={notFoundCategories}
                />
            </main>
        </div>
    );
};

export default SearchPage;