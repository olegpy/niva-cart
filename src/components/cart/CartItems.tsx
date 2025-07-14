'use client';

import { useCart } from "@/context/CartContext";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function CartItems() {
    const { items } = useCart();

    if (items.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">Your cart is empty</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 gap-6">
                {items.map((item) => (
                    <CartItem
                        key={item.product.id}
                        item={item}
                    />
                ))}
            </div>
            <div className="mt-8 flex justify-between items-center">
                <CartSummary showClearButton={true} />
            </div>
        </div>
    );
}