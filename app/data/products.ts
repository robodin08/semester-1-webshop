import type { LanguageKey, LanguageStrings } from "~/constants/languages";

export interface ProductBase {
  id: string;
  name: string;
  images: number;
  price: number;
}

export interface RawProduct extends ProductBase {
  description: LanguageStrings;
}

export interface Product extends ProductBase {
  description: string;
}

export const PRODUCTS: RawProduct[] = [
  {
    id: "0",
    name: "Headset",
    description: {
      en: "High-quality over-ear gaming headset with surround sound.",
      nl: "Hoogwaardige over-ear gaming headset met surround sound.",
    },
    images: 5,
    price: 9998,
  },
  {
    id: "1",
    name: "Gaming Mouse",
    description: {
      en: "Ergonomic gaming mouse with customizable DPI settings.",
      nl: "Ergonomische gaming muis met instelbare DPI-instellingen.",
    },
    images: 5,
    price: 4595,
  },
  {
    id: "2",
    name: "Monitor",
    description: {
      en: "27-inch 144Hz gaming monitor with 1ms response time.",
      nl: "27-inch 144Hz gaming monitor met 1ms reactietijd.",
    },
    images: 5,
    price: 25025,
  },
];

export async function getProductById(id?: string, lng?: LanguageKey | string): Promise<Product | undefined> {
  if (!id) return undefined;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return undefined;

  return {
    ...product,
    description: product.description[lng as LanguageKey] ?? product.description.en,
  };
}

export async function getProductPriceById(id?: string): Promise<number | undefined> {
  const product = await getProductById(id);
  return product?.price;
}
