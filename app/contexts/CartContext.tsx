import { createContext, useEffect, useState, type ReactNode } from "react";
import { getProductPriceById } from "~/data/products";

type Cart = Record<string, number>;

export interface CartContextType {
  cart: Cart;
  total: number;
  totalQuantity: number;
  incrementItem: (id: string, price: number) => void;
  decrementItem: (id: string, price: number) => void;
  setItemQuantity: (id: string, price: number, quantity: number) => void;
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [total, setTotal] = useState<number>(0);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      setCart(parsed);

      recalculateTotals(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  async function recalculateTotals(newCart: Cart) {
    let newTotal = 0;
    let newTotalQuantity = 0;

    for (const id in newCart) {
      const quantity = newCart[id];
      const price = await getProductPriceById(id);
      if (price) {
        newTotal += price * quantity;
        newTotalQuantity += quantity;
      }
    }

    setTotal(newTotal);
    setTotalQuantity(newTotalQuantity);
  }

  function incrementItem(id: string, price: number): void {
    setCart((current) => ({
      ...current,
      [id]: (current[id] ?? 0) + 1,
    }));

    setTotal((current) => current + price);
    setTotalQuantity((current) => current + 1);
  }

  function decrementItem(id: string, price: number): void {
    setCart((current) => {
      const currentQuantity = current[id] ?? 0;
      if (currentQuantity <= 1) {
        const { [id]: _, ...rest } = current;
        return rest;
      }
      return {
        ...current,
        [id]: currentQuantity - 1,
      };
    });

    setTotal((current) => Math.max(0, current - price));
    setTotalQuantity((current) => Math.max(0, current - 1));
  }

  function setItemQuantity(id: string, price: number, quantity: number): void {
    setCart((current) => {
      if (quantity <= 0) {
        const { [id]: _, ...rest } = current;
        return rest;
      }

      return {
        ...current,
        [id]: quantity,
      };
    });

    setTotal((current) => {
      const currentQuantity = cart[id] ?? 0;
      return Math.max(0, current - currentQuantity * price + quantity * price);
    });

    setTotalQuantity((current) => {
      const currentQuantity = cart[id] ?? 0;
      return Math.max(0, current - currentQuantity + quantity);
    });
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        totalQuantity,
        incrementItem,
        decrementItem,
        setItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
