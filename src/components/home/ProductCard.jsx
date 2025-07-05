// src/components/home/ProductCard.jsx

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = (e) => {
        e.stopPropagation(); 
        e.preventDefault();
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <a href="#" className="group block overflow-hidden">
            <div className="relative aspect-square">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
            </div>
            <div className="relative pt-3 bg-background">
                <h3 className="text-sm text-foreground group-hover:underline group-hover:underline-offset-4 truncate">
                    {product.name}
                </h3>
                <div className="mt-1.5 flex items-center justify-between text-foreground">
                    <p className="tracking-wide font-semibold">₹{product.price.toFixed(2)}</p>
                    <Button 
                        onClick={handleAddToCart} 
                        size="icon" 
                        variant="secondary"
                        className="h-8 w-8 shrink-0 rounded-full"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add to Cart</span>
                    </Button>
                </div>
            </div>
        </a>
    );
};

export default ProductCard;