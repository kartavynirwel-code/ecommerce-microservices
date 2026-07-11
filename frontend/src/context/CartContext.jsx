import { createContext, useContext, useState, useCallback } from 'react';
import { cartApi } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });

  const refreshCart = useCallback(async () => {
    if (!user) return;
    const { data } = await cartApi.get('/api/cart');
    setCart(data);
  }, [user]);

  const addToCart = useCallback(
    async (product) => {
      if (!user) throw new Error('Must be logged in to add to cart');
      const { data } = await cartApi.post('/api/cart/items', {
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price,
        quantity: 1,
      });
      setCart(data);
    },
    [user]
  );

  const updateQuantity = useCallback(async (itemId, quantity) => {
    const { data } = await cartApi.put(`/api/cart/items/${itemId}`, { quantity });
    setCart(data);
  }, []);

  const removeItem = useCallback(async (itemId) => {
    const { data } = await cartApi.delete(`/api/cart/items/${itemId}`);
    setCart(data);
  }, []);

  const clearCart = useCallback(async () => {
    const { data } = await cartApi.delete('/api/cart');
    setCart(data);
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, refreshCart, addToCart, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
