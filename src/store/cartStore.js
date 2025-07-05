// src/store/cartStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],
            addToCart: (product) => {
                const cart = get().cart;
                const findProduct = cart.find((p) => p.id === product.id);

                if (findProduct) {
                    const newCart = cart.map((p) =>
                        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                    );
                    set({ cart: newCart });
                } else {
                    set({ cart: [...cart, { ...product, quantity: 1 }] });
                }
            },
            removeFromCart: (productId) => {
                set({ cart: get().cart.filter((p) => p.id !== productId) });
            },
            increaseQuantity: (productId) => {
                const newCart = get().cart.map((p) =>
                    p.id === productId ? { ...p, quantity: p.quantity + 1 } : p
                );
                set({ cart: newCart });
            },
            decreaseQuantity: (productId) => {
                const cart = get().cart;
                const findProduct = cart.find((p) => p.id === productId);

                if (findProduct && findProduct.quantity > 1) {
                    const newCart = cart.map((p) =>
                        p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
                    );
                    set({ cart: newCart });
                } else {
                    get().removeFromCart(productId);
                }
            },
            clearCart: () => set({ cart: [] }),
        }),
        {
            name: 'cart-storage',
        }
    )
);