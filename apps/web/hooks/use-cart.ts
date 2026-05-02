'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  attributes?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  get subtotal(): number;
  get count(): number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing
                  ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: item.quantity ?? 1 }] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),

      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => !(i.productId === productId && i.variantId === variantId)
                )
              : state.items.map((i) =>
                  i.productId === productId && i.variantId === variantId
                    ? { ...i, quantity }
                    : i
                ),
        })),

      clearCart: () => set({ items: [], couponCode: null, discount: 0 }),

      applyCoupon: (code, discount) => set({ couponCode: code, discount }),
      removeCoupon: () => set({ couponCode: null, discount: 0 }),

      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    { name: 'nanocms-cart' }
  )
);
