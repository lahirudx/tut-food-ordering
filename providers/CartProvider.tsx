import { CartItem, Product } from "@/types";
import { randomUUID } from "expo-crypto";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem["size"]) => void;
  updateQuantity: (itemId: string, quantity: -1 | 1) => void;
  total: number;
};

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
});

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, size: CartItem["size"]) => {
    const existingItem = items.find(
      (item) => item.product_id === product.id && item.size === size
    );

    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    const newCartItem: CartItem = {
      product,
      size,
      quantity: 1,
      product_id: product.id,
      id: randomUUID(),
    };

    setItems([...items, newCartItem]);
  };

  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  const updateQuantity = (itemId: string, quantity: -1 | 1) => {
    const updateItemQuantity = (item: CartItem) => {
      return item.id === itemId
        ? { ...item, quantity: item.quantity + quantity }
        : item;
    };

    setItems((items) =>
      items.map(updateItemQuantity).filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
