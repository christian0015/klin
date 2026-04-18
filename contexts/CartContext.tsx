"use client";

import { createContext, useContext, useReducer, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CartItem = {
  id: number;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: number; size: string; color: string } }
  | { type: "UPDATE_QTY"; payload: { id: number; size: string; color: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_CART"; payload: CartItem[] };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = (i: CartItem) => `${i.id}-${i.size}-${i.color}`;
      const exists = state.items.find((i) => key(i) === key(action.payload));
      const items = exists
        ? state.items.map((i) =>
            key(i) === key(action.payload)
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          )
        : [...state.items, action.payload];
      return { ...state, items };
    }

    case "REMOVE_ITEM": {
      const { id, size, color } = action.payload;
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.id === id && i.size === size && i.color === color)
        ),
      };
    }

    case "UPDATE_QTY": {
      const { id, size, color, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !(i.id === id && i.size === size && i.color === color)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === id && i.size === size && i.color === color
            ? { ...i, quantity }
            : i
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "SET_CART":
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, size: string, color: string) => void;
  updateQty: (id: number, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "klin_cart";

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        dispatch({ type: "SET_CART", payload: parsed });
      }
    } catch {
      // silent — corrupt storage
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // silent — storage full or blocked
    }
  }, [state.items]);

  const addToCart = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeFromCart = useCallback((id: number, size: string, color: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, size, color } });
  }, []);

  const updateQty = useCallback(
    (id: number, size: string, color: string, quantity: number) => {
      dispatch({ type: "UPDATE_QTY", payload: { id, size, color, quantity } });
    },
    []
  );

  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}