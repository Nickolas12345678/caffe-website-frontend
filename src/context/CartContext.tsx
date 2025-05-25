import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface CartItem {
    id: number;
    dish: {
        id: number;
        name: string;
        price: number;
        imageUrl: string;
    };
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    cartItemsCount: number;
    fetchCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartItemsCount, setCartItemsCount] = useState<number>(0);

    const fetchCart = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await axios.get("https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartItems(response.data.items);
            setCartItemsCount(response.data.items.length);
        } catch (error) {
            console.error("Помилка при оновленні кошика", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, cartItemsCount, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
