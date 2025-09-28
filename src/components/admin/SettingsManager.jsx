// src/components/admin/SettingsManager.jsx

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

const SettingsManager = () => {
    // State for all settings
    const [signupsEnabled, setSignupsEnabled] = useState(true);
    const [aiSearchEnabled, setAiSearchEnabled] = useState(true);
    const [voiceSearchEnabled, setVoiceSearchEnabled] = useState(true);
    const [loading, setLoading] = useState(true);

    // Fetch all settings from Firestore
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [signupDoc, searchDoc] = await Promise.all([
                    getDoc(doc(db, 'settings', 'signup')),
                    getDoc(doc(db, 'settings', 'search'))
                ]);

                if (signupDoc.exists()) {
                    setSignupsEnabled(signupDoc.data().isEnabled);
                }
                if (searchDoc.exists()) {
                    setAiSearchEnabled(searchDoc.data().isAIEnabled);
                    setVoiceSearchEnabled(searchDoc.data().isVoiceEnabled);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                toast.error("Could not load app settings.");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // Generic handler to update a setting in Firestore
    const handleSettingChange = async (docId, field, value) => {
        try {
            const settingsRef = doc(db, 'settings', docId);
            await setDoc(settingsRef, { [field]: value }, { merge: true });
            toast.success(`Setting updated successfully.`);
        } catch (error) {
            toast.error("Failed to update setting.");
            console.error("Error updating setting:", error);
        }
    };

    // Specific handler for AI Search toggle to enforce dependency
    const handleAiSearchToggle = (value) => {
        setAiSearchEnabled(value);
        handleSettingChange('search', 'isAIEnabled', value);
        
        // If AI Search is turned OFF, Voice Search must also be turned OFF
        if (!value) {
            setVoiceSearchEnabled(false);
            handleSettingChange('search', 'isVoiceEnabled', false);
        }
    };

    const handleVoiceSearchToggle = (value) => {
        setVoiceSearchEnabled(value);
        handleSettingChange('search', 'isVoiceEnabled', value);
    };

    const handleSignupToggle = (value) => {
        setSignupsEnabled(value);
        handleSettingChange('signup', 'isEnabled', value);
    };

    if (loading) return <p>Loading settings...</p>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>Manage global settings and features for the store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* --- Signup Toggle --- */}
                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                    <Label htmlFor="signup-toggle" className="flex flex-col space-y-1">
                        <span>Enable User Signups</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Allow new users to create accounts.
                        </span>
                    </Label>
                    <Switch
                        id="signup-toggle"
                        checked={signupsEnabled}
                        onCheckedChange={handleSignupToggle}
                    />
                </div>

                {/* --- AI Search Toggle --- */}
                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                    <Label htmlFor="ai-search-toggle" className="flex flex-col space-y-1">
                        <span>Enable AI-Powered Search</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Uses AI to understand natural language search queries.
                        </span>
                    </Label>
                    <Switch
                        id="ai-search-toggle"
                        checked={aiSearchEnabled}
                        onCheckedChange={handleAiSearchToggle}
                    />
                </div>

                {/* --- Voice Search Toggle (with dependency) --- */}
                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                    <Label htmlFor="voice-search-toggle" className="flex flex-col space-y-1">
                        <span>Enable Voice Search</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Allows users to search with their voice. Requires AI Search.
                        </span>
                    </Label>
                    <Switch
                        id="voice-search-toggle"
                        checked={voiceSearchEnabled}
                        onCheckedChange={handleVoiceSearchToggle}
                        disabled={!aiSearchEnabled} // <-- THIS ENFORCES THE DEPENDENCY
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default SettingsManager;