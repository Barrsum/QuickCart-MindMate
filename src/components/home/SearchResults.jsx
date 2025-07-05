// src/components/home/SearchResults.jsx

import ProductCarousel from './ProductCarousel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { SearchX, Info } from 'lucide-react';
import { motion } from 'framer-motion';

// This is a pure presentation component
const SearchResults = ({ loading, error, foundResults, notFoundCategories }) => {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    if (loading) {
        return (
            <div className="mt-8 space-y-12">
                {/* Skeleton for the "Not Found" note */}
                <Skeleton className="h-16 w-full" />
                {/* Skeleton for a Carousel */}
                <div>
                    <Skeleton className="h-10 w-1/4 mb-8" />
                    <div className="flex -mx-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex-shrink-0 flex-grow-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 px-4">
                                <div className="space-y-3">
                                    <Skeleton className="h-48 w-full rounded-lg" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <p className="mt-8 text-center text-destructive">{error}</p>;
    }

    if (foundResults.length === 0) {
        return (
            <div className="text-center mt-24 flex flex-col items-center">
                <SearchX className="h-20 w-20 text-muted-foreground mb-4" />
                <h2 className="text-3xl font-bold">No Products Found</h2>
                <p className="text-muted-foreground mt-2 max-w-md">
                    We couldn't find any products matching your search. Try different categories or check your spelling.
                </p>
                <Button asChild className="mt-8">
                    <Link to="/">Back to Home</Link>
                </Button>
            </div>
        );
    }

    return (
        <motion.div
            className="mt-8 space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {notFoundCategories.length > 0 && (
                <motion.div 
                    variants={itemVariants} 
                    className="flex items-start gap-4 p-4 bg-muted/40 border border-border rounded-lg"
                >
                    <Info className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    <div>
                        <p className="font-semibold">Just a heads-up:</p>
                        <p className="text-sm text-muted-foreground">
                            We couldn't find any products for these categories: {notFoundCategories.join(', ')}.
                        </p>
                    </div>
                </motion.div>
            )}

            {foundResults.map(result => (
                 <motion.div key={result.category} variants={itemVariants}>
                    <ProductCarousel
                        title={result.category.charAt(0).toUpperCase() + result.category.slice(1)}
                        products={result.products}
                    />
                 </motion.div>
            ))}
        </motion.div>
    );
};

export default SearchResults;