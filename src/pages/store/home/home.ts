import "../../../styles/store.css";

import { PRODUCTS, getCategories } from "../../../data/data";
import type { Product } from "../../../types/product";
import { addToCart, getCart, getCartCount } from "../../../utils/cartStorage";

console.log("home.ts del catálogo ejecutado correctamente");

const categoriesContainer = document.querySelector<HTMLDivElement>(
  "#categories-container"
);

const productsContainer =
  document.querySelector<HTMLDivElement>("#products-container");

const searchInput = document.querySelector<HTMLInputElement>("#search-input");

const searchForm = document.querySelector<HTMLFormElement>("#search-form");

const activeFilter =
  document.querySelector<HTMLParagraphElement>("#active-filter");

const feedback = document.querySelector<HTMLParagraphElement>("#feedback");

let selectedCategory = "Todas";

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
};

const normalizeText = (text: string): string => {
  return text.toLowerCase().trim();
};

const getProductImage = (product: Product): string => {
  return `/assets/${product.imagen}`;
};

const updateCartCounter = (): void => {
  const cart = getCart();
  const count = getCartCount(cart);

  document.querySelectorAll<HTMLElement>("#cart-count").forEach((element) => {
    element.textContent = String(count);
  });
};

const renderCategories = (): void => {
  if (!categoriesContainer) return;

  categoriesContainer.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.textContent = "Todos";
  allButton.className =
    selectedCategory === "Todas" ? "category-btn active" : "category-btn";

  allButton.addEventListener("click", () => {
    selectedCategory = "Todas";
    renderCategories();
    renderProducts();
  });

  categoriesContainer.appendChild(allButton);

  getCategories().forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category.nombre;
    button.className =
      selectedCategory === category.nombre
        ? "category-btn active"
        : "category-btn";

    button.addEventListener("click", () => {
      selectedCategory = category.nombre;
      renderCategories();
      renderProducts();
    });

    categoriesContainer.appendChild(button);
  });
};

const getFilteredProducts = (): Product[] => {
  const searchTerm = normalizeText(searchInput?.value ?? "");

  return PRODUCTS.filter((product) => {
    const isNotDeleted = !product.eliminado;
    const isAvailable = product.disponible;
    const hasStock = product.stock > 0;

    const matchesSearch = normalizeText(product.nombre).includes(searchTerm);

    const matchesCategory =
      selectedCategory === "Todas" ||
      product.categorias.some(
        (category) => category.nombre === selectedCategory
      );

    return (
      isNotDeleted &&
      isAvailable &&
      hasStock &&
      matchesSearch &&
      matchesCategory
    );
  });
};

const renderProducts = (): void => {
  if (!productsContainer || !activeFilter || !feedback) return;

  const filteredProducts = getFilteredProducts();
  const cart = getCart();

  productsContainer.innerHTML = "";

  activeFilter.textContent =
    selectedCategory === "Todas"
      ? "Mostrando todos los productos"
      : `Filtrando por categoría: ${selectedCategory}`;

  if (filteredProducts.length === 0) {
    feedback.textContent =
      "No se encontraron productos que coincidan con la búsqueda o el filtro seleccionado.";
    return;
  }

  feedback.textContent = "";

  filteredProducts.forEach((product) => {
    const itemInCart = cart.find(
      (cartItem) => cartItem.product.id === product.id
    );

    const quantityInCart = itemInCart?.cantidad ?? 0;
    const availableStock = product.stock - quantityInCart;
    const hasAvailableStock = availableStock > 0;

    const article = document.createElement("article");
    article.className = "product-card";

    article.innerHTML = `
      <img src="${getProductImage(product)}" alt="${product.nombre}" />
      <h3>${product.nombre}</h3>
      <p>${product.descripcion}</p>
      <p class="price">Precio: ${formatPrice(product.precio)}</p>
      <p class="stock">Stock disponible: ${availableStock}</p>
      <button type="button" ${!hasAvailableStock ? "disabled" : ""}>
        ${hasAvailableStock ? "Agregar" : "Sin stock"}
      </button>
    `;

    const addButton = article.querySelector<HTMLButtonElement>("button");

    addButton?.addEventListener("click", () => {
      addToCart(product);
      updateCartCounter();
      renderProducts();

      feedback.textContent = `Agregaste "${product.nombre}" al carrito.`;

      setTimeout(() => {
        if (feedback) {
          feedback.textContent = "";
        }
      }, 1800);
    });

    productsContainer.appendChild(article);
  });
};

searchInput?.addEventListener("input", () => {
  renderProducts();
});

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  renderProducts();
});

renderCategories();
renderProducts();
updateCartCounter();

window.addEventListener("pageshow", () => {
  renderProducts();
  updateCartCounter();
});

window.addEventListener("focus", () => {
  renderProducts();
  updateCartCounter();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    renderProducts();
    updateCartCounter();
  }
});