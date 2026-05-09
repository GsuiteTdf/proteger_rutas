import { PRODUCTS, getCategories } from "../../../data/data";
import type { Product } from "../../../types/product";
import { addToCart, getCart, getCartCount } from "../../../utils/cartStorage";

console.log("home.ts del catÃ¡logo ejecutado correctamente");

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

const cartCount = document.querySelector<HTMLSpanElement>("#cart-count");

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
  const imageByProductName: Record<string, string> = {
    "Pizza Muzzarella": "pizza-muzzarella.jpg",
    "Pizza Napolitana": "pizza-muzzarella.jpg",
    "Pizza Especial 4 Quesos": "pizza-muzzarella.jpg",
    "Pizza Fugazzeta": "pizza-muzzarella.jpg",

    "Hamburguesa ClÃ¡sica": "burger-crispy.jpg",
    "Hamburguesa BBQ Bacon": "hamburguesa-triple.jpg",
    "Hamburguesa Veggie": "hamburguesa-triple.jpg",
    "Hamburguesa Crispy Chicken": "burger-crispy.jpg",

    "Coca-Cola 500ml": "limonada-fresh.jpg",
    "Jugo de Naranja Natural": "limonada-fresh.jpg",
    "Agua Mineral 500ml": "limonada-fresh.jpg",

    "Torta Rogel": "pizza-pepperoni.jpg",
    "Helado Artesanal 2 gustos": "pizza-pepperoni.jpg",
    "Brownie con Helado": "pizza-pepperoni.jpg",

    "Empanadas de Carne x6": "papas-cheddar.jpg",
    "Empanadas de Pollo x6": "papas-cheddar.jpg",
    "Empanadas de JamÃ³n y Queso x6": "papas-cheddar.jpg",

    "Ensalada CÃ©sar": "limonada-fresh.jpg",
    "Ensalada Caprese": "limonada-fresh.jpg",
    "Ensalada Mixta": "limonada-fresh.jpg",
  };

  const imageName = imageByProductName[product.nombre] ?? "pizza-muzzarella.jpg";

  return `/assets/${imageName}`;
};

const updateCartCounter = (): void => {
  if (!cartCount) return;

  const cart = getCart();
  cartCount.textContent = String(getCartCount(cart));
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

  productsContainer.innerHTML = "";

  activeFilter.textContent =
    selectedCategory === "Todas"
      ? "Mostrando todos los productos"
      : `Filtrando por categorÃ­a: ${selectedCategory}`;

  if (filteredProducts.length === 0) {
    feedback.textContent =
      "No se encontraron productos que coincidan con la bÃºsqueda o el filtro seleccionado.";
    return;
  }

  feedback.textContent = "";

  filteredProducts.forEach((product) => {
    const article = document.createElement("article");
    article.className = "product-card";

    article.innerHTML = `
      <img src="${getProductImage(product)}" alt="${product.nombre}" />
      <h3>${product.nombre}</h3>
      <p>${product.descripcion}</p>
      <p class="price">Precio: ${formatPrice(product.precio)}</p>
      <p class="stock">Stock disponible: ${product.stock}</p>
      <button type="button">Agregar</button>
    `;

    const addButton = article.querySelector<HTMLButtonElement>("button");

    addButton?.addEventListener("click", () => {
      addToCart(product);
      updateCartCounter();

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

