// src/pages/LoginPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from '@/lib/firebase'; // Import auth
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import the login function

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect to home on successful login
        } catch (err) {
            setError("Failed to login. Please check your credentials."); // More user-friendly error
            console.error("Login failed:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="grid gap-4">
                            {/* Email Input */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {/* Password Input */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {/* Error Message Display */}
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            {/* Login Button */}
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                    </form>
                    {/* Link to Signup Page */}
                    <div className="mt-4 text-center text-sm">
                        Don't have an account?{" "}
                        <Link to="/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;