// src/components/home/Header.jsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, LogOut, Shield, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn for conditional classes

const Header = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const cart = useCartStore((state) => state.cart);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };
    
    return (
        <header className={cn(
            "p-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled ? "border-b bg-background/80 backdrop-blur-sm" : "border-b border-transparent"
        )}>
            <div className="container mx-auto flex justify-between items-center">
                <h1 
                    className="text-2xl font-bold cursor-pointer text-white drop-shadow-md"
                    onClick={() => navigate('/')}
                >
                    QuickCart - MindMate
                </h1>
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                        <Link to="/orders">
                            <ScrollText className="h-5 w-5" />
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
                        <Link to="/cart">
                            <ShoppingCart className="h-5 w-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </Button>
                    {isAdmin && (
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" onClick={() => navigate('/admin')}>
                            <Shield className="h-5 w-5" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" onClick={handleLogout}>
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}

export default Header;