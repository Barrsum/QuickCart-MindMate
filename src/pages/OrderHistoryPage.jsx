// src/pages/OrderHistoryPage.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import Header from '@/components/home/Header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const OrderHistoryPage = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!currentUser) return;
            setLoading(true);

            const q = query(
                collection(db, 'users', currentUser.uid, 'orders'),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const userOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(userOrders);
            setLoading(false);
        };
        fetchOrders();
    }, [currentUser]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            {/* THE OVERLAP FIX: Added top padding to this main element. */}
            <main className="container mx-auto p-4 md:p-8 pt-24 md:pt-28">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-20 w-full rounded-lg" />
                        <Skeleton className="h-20 w-full rounded-lg" />
                    </div>
                ) : orders.length === 0 ? (
                    <p className="text-center text-muted-foreground mt-16">You have not placed any orders yet.</p>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {orders.map(order => (
                                <motion.div key={order.id} variants={itemVariants}>
                                    <AccordionItem value={order.id} className="border-b-0">
                                        <div className="bg-muted/30 rounded-lg overflow-hidden border">
                                            <AccordionTrigger className="p-4 hover:no-underline">
                                                <div className='flex flex-col md:flex-row items-start md:items-center justify-between w-full pr-4 gap-4'>
                                                    <div className="text-left">
                                                        <p className="text-sm text-muted-foreground">Order ID</p>
                                                        <p className="font-mono text-sm md:text-base">#{order.id}</p>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-sm text-muted-foreground">Date</p>
                                                        <p>{new Date(order.createdAt?.toDate()).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="text-left md:text-right">
                                                        <p className="text-sm text-muted-foreground">Total</p>
                                                        <p className='text-xl font-bold'>₹{order.totalPrice.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="border-t border-border/50 p-4">
                                                    <h4 className="font-semibold mb-3">Items Purchased</h4>
                                                    <ul className="space-y-2">
                                                        {order.items.map((item, index) => (
                                                            <li key={index} className="flex justify-between text-sm">
                                                                <span>{item.name} <span className="text-muted-foreground">x {item.quantity}</span></span>
                                                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </AccordionContent>
                                        </div>
                                    </AccordionItem>
                                </motion.div>
                            ))}
                        </Accordion>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default OrderHistoryPage;