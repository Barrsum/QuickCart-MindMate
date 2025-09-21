// src/hooks/useVoiceSearch.js

import { useState, useRef, useCallback } from 'react';

const ASR_SERVER_URL = "wss://rt-asr-840737680536.asia-south1.run.app/ws";

export const useVoiceSearch = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const webSocketRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordingIntervalRef = useRef(null);
    const audioStreamRef = useRef(null);

    const disconnect = useCallback(() => {
        if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
        if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
        if (audioStreamRef.current) audioStreamRef.current.getTracks().forEach(track => track.stop());
        if (webSocketRef.current) {
            console.log("🔌 Closing WebSocket connection.");
            webSocketRef.current.close();
            webSocketRef.current = null;
        }
        setIsListening(false);
        setIsConnected(false);
    }, []);

    const start = useCallback(async () => {
        if (isListening) return;

        setError(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;
            
            webSocketRef.current = new WebSocket(ASR_SERVER_URL);
            
            webSocketRef.current.onopen = () => {
                console.log("✅ WebSocket connection established.");
                setIsConnected(true);
                setIsListening(true);
                
                mediaRecorderRef.current = new MediaRecorder(audioStreamRef.current);

                mediaRecorderRef.current.ondataavailable = event => {
                    if (event.data.size > 0 && webSocketRef.current?.readyState === WebSocket.OPEN) {
                        webSocketRef.current.send(event.data);
                    }
                };

                mediaRecorderRef.current.start();
                
                recordingIntervalRef.current = setInterval(() => {
                    if (mediaRecorderRef.current?.state === "recording") {
                        mediaRecorderRef.current.stop();
                        mediaRecorderRef.current.start();
                    }
                }, 3000);
            };

            // --- THIS IS THE FIX ---
            webSocketRef.current.onmessage = event => { // Added opening curly brace
                const newText = event.data;
                setTranscript(prev => {
                    const updated = (prev + newText).trim();
                    console.log("🎤 Transcript Updated:", `"${updated}"`);
                    return updated;
                });
            }; // Added closing curly brace
            // --- END OF FIX ---
            
            webSocketRef.current.onerror = (err) => {
                console.error("❌ WebSocket Error:", err);
                setError("Connection to service failed.");
                disconnect();
            };
            
            webSocketRef.current.onclose = () => {
                console.log("WebSocket connection was closed.");
                setIsConnected(false);
                setIsListening(false);
            };

        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Could not access microphone.");
        }
    }, [isListening, disconnect]);

    const stop = useCallback(() => {
        if (!isListening) return;
        if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
        if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
        if (audioStreamRef.current) audioStreamRef.current.getTracks().forEach(track => track.stop());
        setIsListening(false);
    }, [isListening]);
    
    return { 
        isConnected, isListening, transcript, error, 
        start, stop, disconnect, setTranscript
    };
};