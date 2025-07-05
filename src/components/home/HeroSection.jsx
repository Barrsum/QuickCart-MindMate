// src/components/home/HeroSection.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover -z-10"
                poster="https://images.pexels.com/photos/4046317/pexels-photo-4046317.jpeg" // A fallback poster image
            >
                {/* Find a suitable royalty-free video from Pexels, Coverr, etc. */}
                <source src="https://videos.pexels.com/video-files/4046317/4046317-hd_1920_1080_25fps.mp4" type="video/mp4" />
            </video>
            
            {/* Dark Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/60 -z-10"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="container px-4"
            >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4">
                    Shop Smarter, <br />
                    <span className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Not Harder.
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                    Your entire shopping list, delivered. Just type what you need and let us do the rest.
                </p>
                <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                    <Input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g., milk, bread, eggs, soap..."
                        className="pl-12 pr-4 h-14 text-md rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:ring-2 focus:ring-white"
                    />
                </form>
            </motion.div>
        </section>
    );
};

export default HeroSection;