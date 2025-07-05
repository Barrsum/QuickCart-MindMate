// src/components/admin/SettingsManager.jsx

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

const SettingsManager = () => {
    const [signupsEnabled, setSignupsEnabled] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            const settingsRef = doc(db, 'settings', 'signup');
            const docSnap = await getDoc(settingsRef);
            if (docSnap.exists()) {
                setSignupsEnabled(docSnap.data().isEnabled);
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleToggle = async (value) => {
        setSignupsEnabled(value);
        const settingsRef = doc(db, 'settings', 'signup');
        try {
            await setDoc(settingsRef, { isEnabled: value });
            toast.success(`Signups are now ${value ? 'ENABLED' : 'DISABLED'}.`);
        } catch (error) {
            toast.error("Failed to update settings.");
            console.error("Error updating settings:", error);
        }
    };

    if (loading) return <p>Loading settings...</p>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>Manage global settings for the store.</CardDescription>
            </CardHeader>
            <CardContent>
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
                        onCheckedChange={handleToggle}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default SettingsManager;