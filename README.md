# Food Store - Parcial 1 Programación III

## Descripción

Food Store es una aplicación frontend desarrollada con HTML5, CSS3, JavaScript, TypeScript y Vite.

El proyecto fue realizado para la primera evaluación parcial de Programación III. La aplicación permite visualizar un catálogo dinámico de productos, buscar productos por nombre, filtrar por categorías y agregar productos a un carrito de compras con persistencia en `localStorage`.

El desarrollo se realizó sobre el repositorio base provisto por la cátedra, el cual incluía una estructura previa de autenticación y protección de rutas con roles de usuario.

## Funcionalidades implementadas

- Catálogo dinámico de productos.
- Renderizado de productos desde `src/data/data.ts`.
- Búsqueda de productos por nombre.
- Filtrado de productos por categoría.
- Agregado de productos al carrito.
- Persistencia del carrito en `localStorage`.
- Contador de productos agregados al carrito.
- Vista de panel de administración.
- Organización del código en carpetas `pages`, `types`, `utils`, `data` y `styles`.

## Tecnologías utilizadas

- HTML5
- CSS3
- TypeScript
- JavaScript
- Vite
- pnpm
- localStorage

## Estructura principal del proyecto

```txt
src/
├── data/
│   └── data.ts
├── pages/
│   ├── admin/
│   │   └── home/
│   │       ├── home.html
│   │       └── home.ts
│   ├── auth/
│   │   ├── login/
│   │   └── registro/
│   ├── client/
│   └── store/
│       ├── home/
│       │   ├── home.html
│       │   └── home.ts
│       └── cart/
│           ├── cart.html
│           └── cart.ts
├── styles/
│   ├── admin.css
│   └── store.css
├── types/
│   ├── categoria.ts
│   ├── product.ts
│   ├── IUser.ts
│   └── Rol.ts
└── utils/
    ├── auth.ts
    ├── cartStorage.ts
    ├── localStorage.ts
    └── navigate.ts
Instalación

Para instalar las dependencias del proyecto, ejecutar:

pnpm install

Si pnpm no está instalado, puede instalarse con:

npm install -g pnpm
Ejecución del proyecto

Para iniciar el servidor de desarrollo, ejecutar:

pnpm dev

Luego abrir en el navegador la URL indicada por la terminal, normalmente:

http://localhost:5173/

Página principal del catálogo:

http://localhost:5173/src/pages/store/home/home.html

Página del carrito:

http://localhost:5173/src/pages/store/cart/cart.html

Panel de administración:

http://localhost:5173/src/pages/admin/home/home.html
Configuración de Vite

Las páginas principales del parcial fueron registradas en vite.config.ts dentro de build.rollupOptions.input, especialmente:

storeHome: resolve(__dirname, "src/pages/store/home/home.html"),
storeCart: resolve(__dirname, "src/pages/store/cart/cart.html"),

Esto permite que Vite incluya correctamente dichas páginas al momento de construir el proyecto.

Datos del proyecto

Los productos y categorías se encuentran definidos en:

src/data/data.ts

El archivo exporta:

PRODUCTS
getCategories()

Estos datos son consumidos por el catálogo y por el panel de administración.

Carrito de compras

La lógica del carrito se encuentra en:

src/utils/cartStorage.ts

El carrito utiliza localStorage para mantener los productos agregados incluso si el usuario recarga la página.

Nota sobre autenticación

El repositorio base incluye una lógica educativa de autenticación y protección de rutas basada en localStorage.

Esta implementación no debe considerarse segura para producción, ya que los datos guardados en localStorage pueden ser modificados desde las herramientas de desarrollador del navegador.

Para una aplicación real, la autenticación y autorización deberían implementarse desde un backend seguro.

Autor

Gastón A. Cejas

Tecnicatura Universitaria en Programación
Programación III
Primer Parcial