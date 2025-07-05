// src/pages/CartPage.jsx

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/home/Header';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Minus, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

const CartPage = () => {
    const { cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCartStore();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [paymentStep, setPaymentStep] = useState(0);
    const paymentSteps = ["Connecting...", "Authorizing...", "Finalizing..."];

    useEffect(() => {
        let interval;
        if (isPlacingOrder) {
            interval = setInterval(() => {
                setPaymentStep((prevStep) => (prevStep + 1) % paymentSteps.length);
            }, 700);
        }
        return () => clearInterval(interval);
    }, [isPlacingOrder, paymentSteps.length]);

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        if (!currentUser) {
            toast.error("You must be logged in to place an order.");
            return;
        }
        setIsPlacingOrder(true);
        setPaymentStep(0);
        try {
            await new Promise(resolve => setTimeout(resolve, 2100));
            
            const orderData = {
                items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
                totalPrice: totalPrice,
                status: 'placed',
                createdAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, 'users', currentUser.uid, 'orders'), orderData);
            
            toast.success("Order placed successfully!");
            clearCart();
            navigate(`/order-confirmation/${docRef.id}`);
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <Header />
                <div className="container mx-auto text-center py-24">
                    <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
                    <p className="text-muted-foreground mt-2">Looks like you haven't added anything to your cart yet.</p>
                    <Button asChild className="mt-6"><Link to="/">Start Shopping</Link></Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 bg-muted/20 p-1 rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Product</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell><img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" /></TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => decreaseQuantity(item.id)}><Minus className="h-4 w-4" /></Button>
                                                <span>{item.quantity}</span>
                                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => increaseQuantity(item.id)}><Plus className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="lg:col-span-1 p-6 bg-muted/30 rounded-lg sticky top-24">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between"><span>Subtotal</span><span>₹{totalPrice.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span>FREE</span></div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total</span><span>₹{totalPrice.toFixed(2)}</span></div>
                        </div>
                        <Button className="w-full mt-6 h-12" size="lg" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                            {isPlacingOrder ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={paymentStep}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {paymentSteps[paymentStep]}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                            ) : (
                                'Place Order (Mock Payment)'
                            )}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CartPage;