import { create } from 'zustand';
import { Cart } from '../types';
import { cartApi } from '../api/cart';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearLocal: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const { data } = await cartApi.get();
      set({ cart: data });
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    const { data } = await cartApi.addItem(productId, quantity);
    set({ cart: data });
  },

  updateItem: async (itemId, quantity) => {
    if (quantity < 1) {
      await cartApi.removeItem(itemId);
      const { data } = await cartApi.get();
      set({ cart: data });
      return;
    }
    await cartApi.updateItem(itemId, quantity);
    const { data } = await cartApi.get();
    set({ cart: data });
  },

  removeItem: async (itemId) => {
    await cartApi.removeItem(itemId);
    const { data } = await cartApi.get();
    set({ cart: data });
  },

  clearLocal: () => set({ cart: null }),
}));
