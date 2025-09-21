// src/hooks/useVoiceSearch.js

import { useState, useRef, useCallback } from 'react';

// --- THIS IS YOUR WORKING URL ---
// Make sure this is the correct URL for your new Cloud Run service.
// The '/ws' path is what our FastAPI server expects.
const ASR_SERVER_URL = "wss://rt-asr-840737680536.asia-south1.run.app/ws";

export const useVoiceSearch = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);

    const webSocketRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordingIntervalRef = useRef(null);
    const audioStreamRef = useRef(null);

    // This function will be called to stop everything and clean up.
    const stopRecording = useCallback(() => {
        if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
            recordingIntervalRef.current = null;
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
            webSocketRef.current.close();
        }
        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach(track => track.stop());
            audioStreamRef.current = null;
        }
        setIsListening(false);
    }, []);


    const startRecording = useCallback(async () => {
        if (isListening) return;

        setTranscript('');
        setError(null);

        try {
            audioStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            webSocketRef.current = new WebSocket(ASR_SERVER_URL);

            webSocketRef.current.onopen = () => {
                console.log("WebSocket connection established with custom Whisper server.");
                setIsListening(true);

                // Use MediaRecorder to capture audio as blobs
                mediaRecorderRef.current = new MediaRecorder(audioStreamRef.current);

                mediaRecorderRef.current.ondataavailable = event => {
                    if (event.data.size > 0 && webSocketRef.current.readyState === WebSocket.OPEN) {
                        webSocketRef.current.send(event.data);
                    }
                };

                // Start the first recording chunk
                mediaRecorderRef.current.start();
                
                // Every 3 seconds, stop and restart the recording to send a complete chunk.
                // This mimics the successful logic from your index.html.
                recordingIntervalRef.current = setInterval(() => {
                    if (mediaRecorderRef.current.state === "recording") {
                        mediaRecorderRef.current.stop(); // This triggers ondataavailable
                        mediaRecorderRef.current.start();
                    }
                }, 3000); // Send a chunk every 3 seconds
            };

            webSocketRef.current.onmessage = event => {
                // The server sends back the transcript for the last chunk.
                // We append it to our existing transcript.
                const newText = event.data;
                setTranscript(prev => prev + newText);
            };

            webSocketRef.current.onclose = () => {
                console.log("WebSocket connection closed.");
                // Ensure everything is stopped if the connection closes unexpectedly.
                if (isListening) {
                    stopRecording();
                }
            };
            
            webSocketRef.current.onerror = (err) => {
                console.error("WebSocket Error:", err);
                setError("Connection to transcription service failed.");
                stopRecording();
            };

        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Could not access microphone. Please grant permission.");
        }
    }, [isListening, stopRecording]);


    return { isListening, transcript, error, startRecording, stopRecording };
};