"use client";

import { MENU_IDS } from "@/data/menu";
import { cartReducer, EMPTY_CART, sanitizeLines, type CartAction, type CartState } from "@/lib/cart";

export const CART_STORAGE_KEY = "ff:cart:v1";

let state: CartState = EMPTY_CART;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    state = { lines: raw ? sanitizeLines(JSON.parse(raw), MENU_IDS) : [] };
  } catch {
    state = EMPTY_CART;
  }
}

export function subscribeCart(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function getCartSnapshot(): CartState {
  load();
  return state;
}

export function getServerCartSnapshot(): CartState {
  return EMPTY_CART;
}

export function dispatchCart(action: CartAction): void {
  load();
  state = cartReducer(state, action);
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.lines));
  } catch {
    // Storage unavailable (private mode, quota): the cart still works for this visit.
  }
  listeners.forEach((listener) => listener());
}
