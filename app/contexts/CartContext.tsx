import { createContext, useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { LanguageKey } from "~/constants/languages";
import { PRODUCTS, type Product } from "~/constants/products";
import { sleep } from "~/utils";

interface CartProduct extends Product {
  quantity: number;
}

type Cart = Record<string, CartProduct>;
type QuantityCart = Record<string, number>;

export type SortOption = "relevance" | "price-low" | "price-high" | "name-asc" | "name-desc";

export interface SearchFilters {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortOption;
}

export interface CartContextType {
  loaded: boolean;
  cart: Cart;
  total: number;
  totalQuantity: number;
  getProductById: (id: string) => Promise<Product | undefined>;
  searchProducts: (filters: SearchFilters) => Promise<Product[]>;
  incrementItemQuantity: (product: Product, quantity?: number) => void;
  decrementItemQuantity: (product: Product, quantity?: number) => void;
  setItemQuantity: (product: Product, quantity: number) => void;
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();

  const [cart, setCart] = useState<Cart>({});
  const [quantityCart, setQuantityCart] = useState<QuantityCart>({});
  const [total, setTotal] = useState<number>(0);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function loadCart() {
      setLoaded(false);

      const savedCart = localStorage.getItem("cart");
      if (!savedCart) {
        setCart({});
        setQuantityCart({});
        setTotal(0);
        setTotalQuantity(0);
        setLoaded(true);
        return;
      }

      const initialCart: QuantityCart = JSON.parse(savedCart);

      const products = await Promise.all(
        Object.entries(initialCart).map(async ([id, quantity]) => {
          const product = await getProductById(id);
          return product ? { id, product, quantity } : null;
        })
      );

      const entries: Cart = {};
      const quantityEntries: QuantityCart = {};
      let total = 0;
      let totalQuantity = 0;

      for (const item of products) {
        if (!item) continue;
        const { id, product, quantity } = item;

        const maxQuantity = product.maxQuantity ?? 999;
        const clampedQuantity = Math.min(quantity, maxQuantity);

        entries[id] = { ...product, quantity: clampedQuantity };
        quantityEntries[id] = clampedQuantity;

        total += product.price * clampedQuantity;
        totalQuantity += clampedQuantity;
      }

      setCart(entries);
      setQuantityCart(quantityEntries);
      setTotal(total);
      setTotalQuantity(totalQuantity);
      setLoaded(true);
    }

    loadCart();
  }, [t]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(quantityCart));
  }, [quantityCart]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === "cart" && event.newValue !== null) {
        const newQuantityCart: QuantityCart = JSON.parse(event.newValue);

        // Reload cart from the updated localStorage
        async function syncCart() {
          const products = await Promise.all(
            Object.entries(newQuantityCart).map(async ([id, quantity]) => {
              const product = await getProductById(id);
              return product ? { id, product, quantity } : null;
            })
          );

          const entries: Cart = {};
          const quantityEntries: QuantityCart = {};
          let total = 0;
          let totalQuantity = 0;

          for (const item of products) {
            if (!item) continue;
            const { id, product, quantity } = item;

            const maxQuantity = product.maxQuantity ?? 999;
            const clampedQuantity = Math.min(quantity, maxQuantity);

            entries[id] = { ...product, quantity: clampedQuantity };
            quantityEntries[id] = clampedQuantity;

            total += product.price * clampedQuantity;
            totalQuantity += clampedQuantity;
          }

          setCart(entries);
          setQuantityCart(quantityEntries);
          setTotal(total);
          setTotalQuantity(totalQuantity);
        }

        syncCart();
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [t]);

  // to api
  async function getProductById(id: string): Promise<Product | undefined> {
    await sleep(500);

    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return undefined;

    const lang: LanguageKey =
      i18n.resolvedLanguage && i18n.resolvedLanguage in product.description
        ? (i18n.resolvedLanguage as LanguageKey)
        : "en";

    return {
      ...product,
      name: product.name[lang],
      description: product.description[lang],
    };
  }

  // to api
  async function searchProducts(filters: SearchFilters): Promise<Product[]> {
    const loadedProducts = await Promise.all(
      Array.from({ length: PRODUCTS.length }, async (_, index) => {
        return await getProductById(String(index));
      })
    );

    const products = loadedProducts.filter((p): p is Product => p !== undefined);

    let filtered = products;

    if (filters.query) {
      const lowerQuery = filters.query.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(lowerQuery) || p.description.toLowerCase().includes(lowerQuery)
      );
    }

    const min = filters.minPrice ?? 0;
    const max = filters.maxPrice ?? Infinity;
    filtered = filtered.filter((p) => p.price >= min && p.price <= max);

    const sorted = [...filtered];
    switch (filters.sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "relevance":
      default:
        break;
    }

    return sorted;
  }

  function incrementItemQuantity(product: Product, quantity = 1) {
    const maxQuantity = product.maxQuantity ?? 999;

    setCart((current) => {
      const existing = current[product.id];
      const newQuantity = Math.min((existing?.quantity ?? 0) + quantity, maxQuantity);
      const actualQuantity = newQuantity - (existing?.quantity ?? 0);

      if (actualQuantity <= 0) return current;

      setQuantityCart((qCart) => ({
        ...qCart,
        [product.id]: newQuantity,
      }));

      setTotal((total) => total + product.price * actualQuantity);
      setTotalQuantity((totalQty) => totalQty + actualQuantity);

      return {
        ...current,
        [product.id]: {
          ...(existing ?? product),
          quantity: newQuantity,
        },
      };
    });
  }

  function decrementItemQuantity(product: Product, quantity = 1) {
    setCart((current) => {
      const existing = current[product.id];
      if (!existing) return current;

      if (existing.quantity <= quantity) {
        const { [product.id]: _, ...rest } = current;

        setQuantityCart((qCart) => {
          const { [product.id]: _, ...restQ } = qCart;
          return restQ;
        });

        setTotal((current) => Math.max(0, current - product.price * existing.quantity));
        setTotalQuantity((current) => Math.max(0, current - existing.quantity));

        return rest;
      }

      setQuantityCart((qCart) => ({
        ...qCart,
        [product.id]: existing.quantity - quantity,
      }));

      setTotal((current) => Math.max(0, current - product.price * quantity));
      setTotalQuantity((current) => Math.max(0, current - quantity));

      return {
        ...current,
        [product.id]: {
          ...existing,
          quantity: existing.quantity - quantity,
        },
      };
    });
  }

  function setItemQuantity(product: Product, quantity: number) {
    const maxQuantity = product.maxQuantity ?? 999;
    const clampedQuantity = Math.min(Math.max(0, quantity), maxQuantity);

    setCart((current) => {
      const existing = current[product.id];

      const oldQuantity = existing?.quantity ?? 0;

      if (clampedQuantity <= 0) {
        const { [product.id]: _, ...rest } = current;

        setQuantityCart((qCart) => {
          const { [product.id]: _, ...restQ } = qCart;
          return restQ;
        });

        setTotal((current) => Math.max(0, current - product.price * oldQuantity));
        setTotalQuantity((current) => Math.max(0, current - oldQuantity));

        return rest;
      }

      const diff = clampedQuantity - oldQuantity;

      setQuantityCart((qCart) => ({
        ...qCart,
        [product.id]: clampedQuantity,
      }));

      setTotal((current) => current + product.price * diff);
      setTotalQuantity((current) => current + diff);

      return {
        ...current,
        [product.id]: {
          ...(existing ?? product),
          quantity: clampedQuantity,
        },
      };
    });
  }

  if (!loaded) return null;

  return (
    <CartContext.Provider
      value={{
        loaded,
        cart,
        total,
        totalQuantity,
        getProductById,
        searchProducts,
        incrementItemQuantity,
        decrementItemQuantity,
        setItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
