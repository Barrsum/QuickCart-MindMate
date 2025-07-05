// src/pages/HomePage.jsx

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import ProductCarousel from '@/components/home/ProductCarousel';
import { Skeleton } from "@/components/ui/skeleton";

// Refined skeleton loader for the new design
const CarouselSkeleton = ({ title }) => (
    <section className="py-12 container mx-auto">
        <Skeleton className="h-10 w-1/3 mb-8" />
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
    </section>
);

const HomePage = () => {
    const [newArrivals, setNewArrivals] = useState([]);
    const [hotDeals, setHotDeals] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const [featuredSnapshot, hotDealsSnapshot, newArrivalsSnapshot] = await Promise.all([
                    getDocs(query(collection(db, "products"), where("isFeatured", "==", true), limit(10))),
                    getDocs(query(collection(db, "products"), where("isHotDeal", "==", true), limit(10))),
                    getDocs(query(collection(db, "products"), orderBy("createdAt", "desc"), limit(10)))
                ]);

                setFeatured(featuredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setHotDeals(hotDealsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setNewArrivals(newArrivalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="bg-background text-foreground">
            <Header />
            
            <main>
                <HeroSection />

                <div className="container mx-auto px-4 md:px-0">
                    {loading ? (
                        <div className="space-y-8">
                            <CarouselSkeleton title="Featured Products" />
                            <CarouselSkeleton title="Hot Deals" />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <ProductCarousel title="Featured Products" products={featured} />
                            <ProductCarousel title="Hot Deals" products={hotDeals} />
                            <ProductCarousel title="New Arrivals" products={newArrivals} />
                        </div>
                    )}
                </div>
            </main>

            <footer className="py-12 mt-16 border-t bg-muted/30">
                <div className="container mx-auto text-center text-muted-foreground">
                    <p className="font-bold text-lg mb-2">QuickCart</p>
                    <p>© {new Date().getFullYear()} Walmart Hackathon Project. A new era of digital shopping.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;