"use client";

import { createContext, useContext, useMemo, useReducer } from "react";

type CartMap = Record<string, number>;

interface CartState {
  cart: CartMap;
  isOpen: boolean;
}

type CartAction =
  | { type: "add"; id: string }
  | { type: "remove"; id: string }
  | { type: "open" }
  | { type: "close" }
  | { type: "clear" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add":
      return {
        ...state,
        cart: { ...state.cart, [action.id]: (state.cart[action.id] ?? 0) + 1 },
      };
    case "remove": {
      const nextQty = (state.cart[action.id] ?? 0) - 1;
      const cart = { ...state.cart };
      if (nextQty <= 0) delete cart[action.id];
      else cart[action.id] = nextQty;
      const isEmpty = Object.keys(cart).length === 0;
      return { cart, isOpen: isEmpty ? false : state.isOpen };
    }
    case "open":
      return { ...state, isOpen: true };
    case "close":
      return { ...state, isOpen: false };
    case "clear":
      return { cart: {}, isOpen: false };
    default:
      return state;
  }
}

interface CartContextValue {
  cart: CartMap;
  isOpen: boolean;
  count: number;
  addOne: (id: string) => void;
  removeOne: (id: string) => void;
  open: () => void;
  close: () => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// Deliberately not persisted (no localStorage/cookie) — matches the original
// app's ephemeral, in-memory-only cart that resets on reload.
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { cart: {}, isOpen: false });

  const value = useMemo<CartContextValue>(
    () => ({
      cart: state.cart,
      isOpen: state.isOpen,
      count: Object.values(state.cart).reduce((sum, qty) => sum + qty, 0),
      addOne: (id) => dispatch({ type: "add", id }),
      removeOne: (id) => dispatch({ type: "remove", id }),
      open: () => dispatch({ type: "open" }),
      close: () => dispatch({ type: "close" }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [state],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
