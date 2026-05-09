import type { CartItem, Product } from "../types/product";

const CART_KEY = "food-store-cart";

export function getCart(): CartItem[] {
  const cartFromStorage = localStorage.getItem(CART_KEY);

  if (!cartFromStorage) {
    return [];
  }

  try {
    return JSON.parse(cartFromStorage) as CartItem[];
  } catch {
    localStorage.removeItem(CART_KEY);
    return [];
  }
}

function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product: Product): CartItem[] {
  const cart = getCart();

  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    existingItem.cantidad += 1;
  } else {
    cart.push({
      product,
      cantidad: 1,
    });
  }

  saveCart(cart);
  return cart;
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.cantidad, 0);
}