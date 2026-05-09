import "../../../styles/admin.css";
import { PRODUCTS } from "../../../data/data";

const adminProductsBody =
  document.querySelector<HTMLTableSectionElement>("#admin-products-body");

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
};

const renderAdminProducts = (): void => {
  if (!adminProductsBody) return;

  adminProductsBody.innerHTML = "";

  PRODUCTS.forEach((product) => {
    const categories = product.categorias
      .map((category) => category.nombre)
      .join(", ");

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${product.id}</td>
      <td>
        <img
          src="/assets/${product.imagen}"
          alt="${product.nombre}"
          width="80"
        />
      </td>
      <td>${product.nombre}</td>
      <td>${categories}</td>
      <td>${formatPrice(product.precio)}</td>
      <td>${product.stock}</td>
      <td>
        <span class="badge ${product.disponible ? "available" : "unavailable"}">
          ${product.disponible ? "Disponible" : "No disponible"}
        </span>
      </td>
      <td>
        <button type="button">Editar</button>
        <button type="button" class="danger">Eliminar</button>
      </td>
    `;

    adminProductsBody.appendChild(row);
  });
};

renderAdminProducts();