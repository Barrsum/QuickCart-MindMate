// src/context/SettingsContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    // Default settings
    const [settings, setSettings] = useState({
        isAIEnabled: true,
        isVoiceEnabled: true,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const settingsRef = doc(db, 'settings', 'search');
        
        // Use onSnapshot for real-time updates
        const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                setSettings(docSnap.data());
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching settings in real-time:", error);
            // In case of error, fall back to defaults
            setLoading(false);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    const value = {
        settings,
        loading,
    };

    return (
        <SettingsContext.Provider value={value}>
            {!loading && children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    return useContext(SettingsContext);
};