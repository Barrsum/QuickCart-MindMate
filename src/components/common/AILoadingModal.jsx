// src/components/common/AILoadingModal.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- NEW, MORE ENGAGING TEXT ---
const loadingTexts = [
    "Receiving your shopping list...",
    "Dispatching our QuickBots to the warehouse...",
    "Bots are zipping through the aisles...",
    "Scanning shelves for the freshest items...",
    "Loading your items onto the conveyor...",
    "Finalizing your personalized results...",
];
// --- END OF NEW TEXT ---

const AILoadingModal = ({ isOpen }) => {
    const [textIndex, setTextIndex] = useState(0);

    useEffect(() => {
        if (isOpen) {
            // I've slightly reduced the interval to make the text change a bit faster,
            // which fits the "zipping bots" theme better.
            const interval = setInterval(() => {
                setTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
            }, 1800); // Change text every 1.8 seconds

            return () => clearInterval(interval);
        }
    }, [isOpen]);


    const dotVariants = {
        initial: { y: "0%" },
        animate: { y: "-100%" },
    };

    const dotTransition = {
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: "easeInOut",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Custom Animated Spinner */}
                    <div className="flex items-end justify-center h-12 gap-2">
                        <motion.span 
                            className="block w-4 h-4 bg-primary rounded-full"
                            variants={dotVariants}
                            transition={{...dotTransition, delay: 0}}
                            animate="animate"
                            initial="initial"
                        />
                        <motion.span 
                            className="block w-4 h-4 bg-primary rounded-full"
                            variants={dotVariants}
                            transition={{...dotTransition, delay: 0.2}}
                            animate="animate"
                            initial="initial"
                        />
                        <motion.span 
                            className="block w-4 h-4 bg-primary rounded-full"
                            variants={dotVariants}
                            transition={{...dotTransition, delay: 0.4}}
                            animate="animate"
                            initial="initial"
                        />
                    </div>
                    
                    {/* Animated Text */}
                    <div className="relative mt-8 text-lg font-medium text-center w-72 h-6 overflow-hidden">
                       <AnimatePresence mode="wait">
                            <motion.p
                                key={textIndex}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ ease: 'easeInOut', duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                {loadingTexts[textIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AILoadingModal;