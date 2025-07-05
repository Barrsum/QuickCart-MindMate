// src/components/home/ProductCard.jsx

import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react"; // Add Minus icon
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCard = ({ product }) => {
    // Get all the actions and state we need from the cart store
    const { addToCart, increaseQuantity, decreaseQuantity, cart } = useCartStore();

    // Check if this specific product is in the cart
    const cartItem = cart.find(item => item.id === product.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const handleInitialAddToCart = () => {
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <motion.div
            className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:border-primary"
            layout // Add layout prop for smooth size changes
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Image Container */}
            <div className="aspect-square overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
            </div>

            {/* Content Container */}
            <div className="p-4">
                <h3 className="font-semibold text-base truncate" title={product.name}>
                    {product.name}
                </h3>
                <p className="text-sm text-muted-foreground capitalize mt-1">
                    {product.category}
                </p>

                {/* Price and Action Button Container */}
                <div className="flex items-center justify-between mt-4">
                    <p className="text-xl font-bold text-primary">
                        ₹{product.price.toFixed(2)}
                    </p>
                    
                    {/* This is the key: Conditionally render the button or the quantity controls */}
                    <div className="w-[100px] h-[36px] flex items-center justify-end">
                        <AnimatePresence mode="wait">
                            {quantityInCart === 0 ? (
                                // If not in cart, show the "Add" button
                                <motion.div
                                    key="add"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <Button 
                                        onClick={handleInitialAddToCart} 
                                        size="icon" 
                                        className="h-9 w-9 shrink-0 rounded-full"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="sr-only">Add to Cart</span>
                                    </Button>
                                </motion.div>
                            ) : (
                                // If in cart, show the quantity controls
                                <motion.div
                                    key="quantity"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="flex items-center gap-2 bg-muted p-1 rounded-full"
                                >
                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => decreaseQuantity(product.id)}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-4 text-center font-bold text-sm">{quantityInCart}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => increaseQuantity(product.id)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;