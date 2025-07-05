// src/pages/OrderConfirmationPage.jsx

import { Link, useParams } from 'react-router-dom';
import Header from '@/components/home/Header';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const OrderConfirmationPage = () => {
    const { orderId } = useParams();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <div className="container mx-auto flex flex-col items-center justify-center text-center py-24">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-3xl font-bold">Thank you for your order!</h1>
                <p className="text-muted-foreground mt-2">Your order has been placed successfully.</p>
                <p className="mt-4">
                    Your Order ID is: <span className="font-mono bg-muted px-2 py-1 rounded">{orderId}</span>
                </p>
                <Button asChild className="mt-8">
                    <Link to="/">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;