// src/pages/SignupPage.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const SignupPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [signupsAllowed, setSignupsAllowed] = useState(false);
    const [loadingSettings, setLoadingSettings] = useState(true);

    useEffect(() => {
        const checkSignupStatus = async () => {
            const settingsRef = doc(db, 'settings', 'signup');
            try {
                const docSnap = await getDoc(settingsRef);
                // If doc exists and isEnabled is explicitly true, allow signups.
                // If doc doesn't exist, default to allowing signups for first-time setup.
                if (docSnap.exists()) {
                    setSignupsAllowed(docSnap.data().isEnabled);
                    if (!docSnap.data().isEnabled) {
                         setError("Account creation is currently disabled by the administrator.");
                    }
                } else {
                    setSignupsAllowed(true);
                }
            } catch (error) {
                console.error("Error fetching signup settings:", error);
                // Default to disabled on error for security
                setSignupsAllowed(false);
                setError("Could not verify signup status. Please try again later.");
            }
            setLoadingSettings(false);
        };
        checkSignupStatus();
    }, []);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (!signupsAllowed) {
            setError("Account creation is currently disabled.");
            return;
        }

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            // Step 1: Create the user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Step 2: Create a document for the user in the 'users' collection
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                createdAt: serverTimestamp(),
            });

            navigate('/');
        } catch (err) {
            setError(err.message);
            console.error("Signup failed:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Create an account to start shopping.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <Button type="submit" className="w-full" disabled={loadingSettings || !signupsAllowed}>
                                {loadingSettings ? 'Loading...' : 'Create Account'}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignupPage;