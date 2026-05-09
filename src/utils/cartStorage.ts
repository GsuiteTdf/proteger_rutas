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
    if (existingItem.cantidad < product.stock) {
      existingItem.cantidad += 1;
    }
  } else {
    cart.push({
      product,
      cantidad: 1,
    });
  }

  saveCart(cart);
  return cart;
}

export function increaseQuantity(productId: number): CartItem[] {
  const cart = getCart();

  const item = cart.find((cartItem) => cartItem.product.id === productId);

  if (item && item.cantidad < item.product.stock) {
    item.cantidad += 1;
  }

  saveCart(cart);
  return cart;
}

export function decreaseQuantity(productId: number): CartItem[] {
  const cart = getCart();

  const item = cart.find((cartItem) => cartItem.product.id === productId);

  if (!item) {
    return cart;
  }

  if (item.cantidad > 1) {
    item.cantidad -= 1;
    saveCart(cart);
    return cart;
  }

  const updatedCart = cart.filter(
    (cartItem) => cartItem.product.id !== productId
  );

  saveCart(updatedCart);
  return updatedCart;
}

export function removeFromCart(productId: number): CartItem[] {
  const cart = getCart();

  const updatedCart = cart.filter(
    (cartItem) => cartItem.product.id !== productId
  );

  saveCart(updatedCart);
  return updatedCart;
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.cantidad, 0);
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce(
    (total, item) => total + item.product.precio * item.cantidad,
    0
  );
}