// src/components/common/VoiceSearchModal.jsx

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Search, AlertTriangle, RefreshCw, Square } from 'lucide-react';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // We will use a Textarea for editing

const VoiceSearchModal = ({ isOpen, onClose, onSearch }) => {
    const { 
        isConnected, isListening, transcript, error, 
        start, stop, disconnect, setTranscript
    } = useVoiceSearch();
    
    const transcriptBoxRef = useRef(null);

    // Effect to start the connection and listening when the modal opens.
    useEffect(() => {
        if (isOpen) {
            start();
        }
    }, [isOpen]); // We remove `start` from dep array to only run on open.

    // Effect to auto-scroll the textarea
    useEffect(() => {
        if (transcriptBoxRef.current) {
            transcriptBoxRef.current.scrollTop = transcriptBoxRef.current.scrollHeight;
        }
    }, [transcript]);

    const handleMicClick = () => {
        if (isListening) {
            stop(); // Just stop listening. The text remains.
        } else if (isConnected) {
            setTranscript(''); // Clear text before starting a new recording.
            start();
        }
    };

    const handleTryAgain = () => {
        stop();
        setTranscript('');
        start();
    };

    const handleSearch = () => {
        disconnect(); // Forcefully stop and disconnect everything.
        onSearch(transcript);
        onClose();
    };
    
    const handleClose = () => {
        disconnect();
        onClose();
    };

    // Handler for manual text editing.
    const handleTextChange = (e) => {
        if (!isListening) { // Only allow editing if not listening
            setTranscript(e.target.value);
        }
    };

    const hasContent = transcript.trim().length > 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative bg-muted/30 border rounded-2xl shadow-xl w-full max-w-2xl flex flex-col overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        {/* --- Header and Close Button --- */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">Voice Search</h2>
                            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleClose}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        
                        {/* --- Main Content Area --- */}
                        <div className="flex flex-col p-6 gap-6 items-center flex-grow">
                            {/* --- EDITABLE TEXTAREA --- */}
                            <Textarea
                                ref={transcriptBoxRef}
                                className="w-full bg-background/50 rounded-lg p-4 min-h-[100px] max-h-[250px] overflow-y-auto border text-lg"
                                value={transcript}
                                onChange={handleTextChange}
                                readOnly={isListening} // Textarea is read-only while listening
                                placeholder={isListening ? "Listening..." : "Start speaking, or type here to edit..."}
                            />

                            <div className="relative">
                                <Button 
                                    size="icon" 
                                    className="w-20 h-20 rounded-full shadow-lg"
                                    onClick={handleMicClick}
                                    disabled={!isConnected}
                                >
                                    {isListening ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                                </Button>
                                {isListening && (
                                    <motion.div
                                        className="absolute inset-0 border-2 border-primary rounded-full -z-10"
                                        animate={{ scale: [1, 1.4], opacity: [1, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                                    />
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground -mt-2">
                                {isListening ? "Press the square to stop" : (isConnected ? "Press the mic to speak" : "Connecting...")}
                            </p>
                        </div>
                        
                        {/* --- Footer with Action Buttons --- */}
                        <div className="flex items-center justify-between p-4 border-t bg-background/20">
                            <Button 
                                variant="outline" 
                                onClick={handleTryAgain}
                                disabled={!isConnected}
                            >
                                <RefreshCw className="mr-2 h-4 w-4"/>
                                Try Again
                            </Button>
                            
                            {error && (
                                <div className="flex items-center gap-2 text-destructive text-sm mx-4">
                                    <AlertTriangle className="h-4 w-4" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <Button 
                                size="lg" 
                                className="ml-auto"
                                onClick={handleSearch}
                                // --- THIS IS THE "ALWAYS ACTIVE" LOGIC ---
                                disabled={!hasContent}
                            >
                                <Search className="mr-2 h-5 w-5" />
                                Search
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VoiceSearchModal;