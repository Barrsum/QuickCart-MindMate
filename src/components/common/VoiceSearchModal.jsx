// src/components/common/VoiceSearchModal.jsx

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Search, AlertTriangle } from 'lucide-react';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { Button } from '@/components/ui/button';

const VoiceSearchModal = ({ isOpen, onClose, onSearch }) => {
    const { isListening, transcript, error, startRecording, stopRecording } = useVoiceSearch();

    useEffect(() => {
        // Automatically start recording when the modal opens, if it's not already listening.
        if (isOpen && !isListening) {
            startRecording();
        }
        // Ensure we stop recording if the modal is closed unexpectedly.
        return () => {
            if (isListening) {
                stopRecording();
            }
        }
    }, [isOpen]);

    const handleSearchClick = () => {
        stopRecording();
        onSearch(transcript); // Send the final transcript to the SearchBar
        onClose();
    };

    const handleCloseClick = () => {
        stopRecording();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative bg-muted/50 border rounded-lg shadow-xl w-full max-w-lg p-8 flex flex-col items-center gap-6"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={handleCloseClick}>
                            <X className="h-5 w-5" />
                        </Button>

                        <div className="relative w-24 h-24 flex items-center justify-center">
                            {isListening && (
                                <motion.div
                                    className="absolute inset-0 bg-primary/20 rounded-full"
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            )}
                            <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-primary' : 'bg-secondary'}`}>
                                <Mic className={`h-10 w-10 transition-colors ${isListening ? 'text-primary-foreground' : 'text-secondary-foreground'}`} />
                            </div>
                        </div>

                        <div className="w-full min-h-[100px] text-center">
                            <h2 className="text-xl font-semibold text-foreground">
                                {isListening ? "Listening..." : "Voice Search"}
                            </h2>
                            <p className="text-muted-foreground mt-4 text-lg min-h-[60px]">
                                {transcript || (isListening ? "Start speaking now..." : "Click the search button when you're done.")}
                            </p>
                        </div>
                        
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                                <AlertTriangle className="h-5 w-5" />
                                <p>{error}</p>
                            </div>
                        )}

                        <Button
                            size="lg"
                            className="w-full h-12 text-lg"
                            onClick={handleSearchClick}
                            disabled={!transcript || isListening}
                        >
                            <Search className="mr-2 h-5 w-5" />
                            Search
                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VoiceSearchModal;