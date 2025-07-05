// src/pages/SearchPage.jsx

import { useEffect, useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import Header from '@/components/home/Header';
import ProductCarousel from '@/components/home/ProductCarousel';
import { Button } from '@/components/ui/button';

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const SearchPage = () => {
    const queryParams = useQuery();
    const searchQuery = queryParams.get('q');
    
    // We'll have two state arrays now
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

                // Promise.allSettled is better here. It waits for all promises to
                // finish, regardless of whether they succeed or fail.
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
                    // Check if the promise was fulfilled and if it returned any documents
                    if (result.status === 'fulfilled' && result.value.docs.length > 0) {
                        found.push({
                            category: categoryName,
                            products: result.value.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                        });
                    } else {
                        // If promise failed or returned no docs, it's a "not found"
                        notFound.push(categoryName);
                    }
                });

                setFoundResults(found);
                setNotFoundCategories(notFound);

            } catch (err) {
                // This will now only catch critical errors, not individual query failures
                console.error("Critical error fetching search results:", err);
                setError("Sorry, a critical error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    const renderContent = () => {
        if (loading) {
            return <p className="mt-8 text-center">Searching...</p>;
        }
        if (error) {
            return <p className="mt-8 text-center text-red-500">{error}</p>;
        }
        if (foundResults.length === 0) {
            return (
                <div className="text-center mt-16">
                    <h2 className="text-2xl font-semibold">No products found.</h2>
                    <p className="text-muted-foreground mt-2">We couldn't find any products for the categories you searched for.</p>
                    <Button asChild className="mt-6">
                        <Link to="/">Back to Home</Link>
                    </Button>
                </div>
            );
        }
        return (
            <>
                {notFoundCategories.length > 0 && (
                    <div className="mb-8 p-4 bg-yellow-900/50 text-yellow-200 border border-yellow-700 rounded-md">
                        <p className="font-semibold">Note:</p>
                        <p>We couldn't find any products for the following categories: {notFoundCategories.join(', ')}.</p>
                    </div>
                )}
                <div className="space-y-12">
                    {foundResults.map(result => (
                        <ProductCarousel
                            key={result.category}
                            title={result.category.charAt(0).toUpperCase() + result.category.slice(1)}
                            products={result.products}
                        />
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-6">Search Results for: <span className="text-primary">{searchQuery}</span></h1>
                {renderContent()}
            </main>
        </div>
    );
};

export default SearchPage;