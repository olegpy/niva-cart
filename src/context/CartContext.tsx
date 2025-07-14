'use client';
import {Product} from "@/types";
import {createContext, ReactNode, use, useCallback, useMemo, useState} from "react";

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    incrementQuantity: (productId: number) => void;
    decrementQuantity: (productId: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
    getItemQuantity: (productId: number) => number;
    canAddToCart: (product: Product) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({children}: {children: ReactNode}) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = useCallback((product: Product) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.product.id === product.id);
            if (existingItem) {
                return currentItems.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...currentItems, { product, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((productId: number) => {
        setItems((currentItems) => 
            currentItems.filter((item) => item.product.id !== productId)
        );
    }, []);

    const incrementQuantity = useCallback((productId: number) => {
        setItems((currentItems) =>
            currentItems.map((item) =>
                item.product.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    }, []);

    const decrementQuantity = useCallback((productId: number) => {
        setItems((currentItems) => {
            const updatedItems = currentItems.map((item) =>
                item.product.id === productId
                    ? { ...item, quantity: Math.max(0, item.quantity - 1) }
                    : item
            );
            // Remove item if quantity becomes 0
            return updatedItems.filter((item) => item.quantity > 0);
        });
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const getCartTotal = useCallback(() => {
        return items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      }, [items]);
    
    const getCartCount = useCallback(() => {
        return items.reduce((count, item) => count + item.quantity, 0);
    }, [items]);

    const getItemQuantity = useCallback((productId: number) => {
        const item = items.find((item) => item.product.id === productId);
        return item ? item.quantity : 0;
    }, [items]);

    const canAddToCart = useCallback((product: Product) => {
        if (product.quantity === 0) return false;
        const item = items.find((item) => item.product.id === product.id);
        if (item && item.quantity >= product.quantity) return false;
        return true;
    }, [items]);

    const value = useMemo(
        () => ({
            items,
            addToCart,
            removeFromCart,
            incrementQuantity,
            decrementQuantity,
            clearCart,
            getCartTotal,
            getCartCount,
            getItemQuantity,
            canAddToCart,
        }),
        [items, addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart, getCartTotal, getCartCount, getItemQuantity, canAddToCart]
    );
    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = use(CartContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
}
