// src/hooks/useVoiceSearch.js

import { useState, useRef, useCallback } from 'react';

const ASR_SERVER_URL = 'ws://localhost:8080';

export const useVoiceSearch = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);

    const mediaRecorderRef = useRef(null);
    const webSocketRef = useRef(null);
    const audioContextRef = useRef(null);

    const startRecording = useCallback(async () => {
        if (isListening) return;
        setTranscript('');
        setError(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            webSocketRef.current = new WebSocket(ASR_SERVER_URL);
            
            webSocketRef.current.onopen = () => {
                console.log('WebSocket connection opened.');
                setIsListening(true);
            };

            webSocketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'final_transcript') {
                    setTranscript(prev => (prev ? prev + ' ' : '') + data.text);
                } else if (data.type === 'error') {
                    setError(data.message);
                    console.error('WebSocket error message:', data.message);
                }
            };
            
            webSocketRef.current.onerror = (err) => {
                setError('WebSocket connection error. Is the local ASR server running?');
                console.error('WebSocket Error:', err);
                setIsListening(false);
            };

            webSocketRef.current.onclose = () => {
                console.log('WebSocket connection closed.');
                setIsListening(false);
            };

            audioContextRef.current = new AudioContext({ sampleRate: 16000 }); // Corrected Sample Rate
            const source = audioContextRef.current.createMediaStreamSource(stream);
            const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
                if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
                    const inputData = e.inputBuffer.getChannelData(0);
                    const buffer = new Int16Array(inputData.length);
                    for (let i = 0; i < inputData.length; i++) {
                        buffer[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
                    }
                    webSocketRef.current.send(buffer.buffer);
                }
            };

            source.connect(processor);
            processor.connect(audioContextRef.current.destination);
            mediaRecorderRef.current = { stream, processor, source };

        } catch (err) {
            setError('Microphone access was denied. Please allow access and try again.');
            console.error('Error accessing microphone:', err);
        }
    }, [isListening]);

    const stopRecording = useCallback(() => {
        if (!isListening) return;
        if (webSocketRef.current) webSocketRef.current.close();
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            mediaRecorderRef.current.processor.disconnect();
            mediaRecorderRef.current.source.disconnect();
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
        setIsListening(false);
    }, [isListening]);

    return { isListening, transcript, error, startRecording, stopRecording };
};