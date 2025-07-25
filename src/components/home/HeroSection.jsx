// src/components/home/HeroSection.jsx

import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';

const HeroSection = ({ scrollRef }) => {
    const navigate = useNavigate();

    const handleScrollDown = () => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover -z-10"
                poster="https://images.pexels.com/photos/4046317/pexels-photo-4046317.jpeg"
            >
                <source src="https://videos.pexels.com/video-files/4046317/4046317-hd_1920_1080_25fps.mp4" type="video/mp4" />
            </video>
            
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
                
                <SearchBar 
                    inputClassName="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:ring-2 focus:ring-white"
                />
            </motion.div>

            <motion.div
                onClick={handleScrollDown}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer p-2"
                animate={{ y: [0, 10, 0] }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                }}
            >
                <ChevronDown className="h-10 w-10 text-white/50" />
            </motion.div>
        </section>
    );
};

export default HeroSection;