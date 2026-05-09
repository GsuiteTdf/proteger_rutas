import "../../../styles/store.css";

import {
  clearCart,
  decreaseQuantity,
  getCart,
  getCartCount,
  getCartTotal,
  increaseQuantity,
  removeFromCart,
} from "../../../utils/cartStorage";

import type { CartItem } from "../../../types/product";

console.log("cart.ts ejecutado correctamente");

const cartContainer = document.querySelector<HTMLDivElement>("#cart-container");

const cartFeedback =
  document.querySelector<HTMLParagraphElement>("#cart-feedback");

const cartCount = document.querySelector<HTMLSpanElement>("#cart-count");

const summaryCount =
  document.querySelector<HTMLElement>("#summary-count");

const summaryTotal =
  document.querySelector<HTMLElement>("#summary-total");

const clearCartButton =
  document.querySelector<HTMLButtonElement>("#clear-cart-button");

const checkoutButton =
  document.querySelector<HTMLButtonElement>("#checkout-button");

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
};

const renderSummary = (cart: CartItem[]): void => {
  const count = getCartCount(cart);
  const total = getCartTotal(cart);

  if (cartCount) {
    cartCount.textContent = String(count);
  }

  if (summaryCount) {
    summaryCount.textContent = String(count);
  }

  if (summaryTotal) {
    summaryTotal.textContent = formatPrice(total);
  }

  if (checkoutButton) {
    checkoutButton.disabled = cart.length === 0;
  }

  if (clearCartButton) {
    clearCartButton.disabled = cart.length === 0;
  }
};

const renderCart = (): void => {
  if (!cartContainer || !cartFeedback) return;

  const cart = getCart();

  cartContainer.innerHTML = "";

  renderSummary(cart);

  if (cart.length === 0) {
    cartFeedback.textContent = "El carrito está vacío.";
    cartContainer.innerHTML = `
      <article class="empty-cart">
        <p>No agregaste productos todavía.</p>
        <a href="../home/home.html">Volver al catálogo</a>
      </article>
    `;
    return;
  }

  cartFeedback.textContent = "";

  cart.forEach((item) => {
    const article = document.createElement("article");
    article.className = "cart-item";

    article.innerHTML = `
      <img src="/assets/${item.product.imagen}" alt="${item.product.nombre}" />

      <div class="cart-item-info">
        <h3>${item.product.nombre}</h3>
        <p>${item.product.descripcion}</p>
        <p>Precio unitario: <strong>${formatPrice(item.product.precio)}</strong></p>
        <p>Subtotal: <strong>${formatPrice(item.product.precio * item.cantidad)}</strong></p>
      </div>

      <div class="cart-item-controls">
        <button type="button" class="decrease-button">-</button>
        <span>${item.cantidad}</span>
        <button type="button" class="increase-button">+</button>
        <button type="button" class="remove-button">Eliminar</button>
      </div>
    `;

    const decreaseButton =
      article.querySelector<HTMLButtonElement>(".decrease-button");

    const increaseButton =
      article.querySelector<HTMLButtonElement>(".increase-button");

    const removeButton =
      article.querySelector<HTMLButtonElement>(".remove-button");

    decreaseButton?.addEventListener("click", () => {
      decreaseQuantity(item.product.id);
      renderCart();
    });

    increaseButton?.addEventListener("click", () => {
      increaseQuantity(item.product.id);
      renderCart();
    });

    removeButton?.addEventListener("click", () => {
      removeFromCart(item.product.id);
      renderCart();
    });

    cartContainer.appendChild(article);
  });
};

clearCartButton?.addEventListener("click", () => {
  clearCart();
  renderCart();
});

checkoutButton?.addEventListener("click", () => {
  alert("La función finalizar compra está deshabilitada para este parcial.");
});

renderCart();

window.addEventListener("pageshow", () => {
  renderCart();
});

window.addEventListener("focus", () => {
  renderCart();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    renderCart();
  }
});