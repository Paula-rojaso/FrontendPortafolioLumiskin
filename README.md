# LumiSkin – Tienda Online de Cuidado Personal 🧴✨

LumiSkin es una plataforma de comercio electrónico moderna dedicada a la venta de productos de cuidado personal, como cremas, sérums, shampoo y perfumes. Este repositorio contiene el **Frontend** de la aplicación, el cual se comunica de forma asíncrona con una arquitectura de microservicios en el backend para gestionar el catálogo, los usuarios y el proceso de pago.

La interfaz fue diseñada para ser completamente responsiva, modular y rápida, ofreciendo una experiencia de usuario fluida durante todo el flujo de compra.

---

## 🚀 Características Principales

* **Catálogo Interactivo:** Visualización de productos por categorías (fragancias, cremas, etc.) con stock en tiempo real.
* **Carrito de Compras:** Gestión dinámica de productos (agregar, quitar, vaciar) con persistencia de estado global.
* **Flujo de Checkout Seguro:** Integración visual para simular el proceso de pago y confirmación de compra exitosa.
* **Diseño Responsivo:** Interfaz adaptada a dispositivos móviles y escritorio utilizando componentes limpios y estilizados.

---

## 🛠️ Tecnologías Utilizadas

* **Core:** [React](https://react.dev/) (Vite como entorno de desarrollo rápido)
* **Estilos & Layout:** [Bootstrap 5](https://getbootstrap.com/) mediante gestión de paquetes NPM
* **Enrutamiento:** [React Router DOM](https://reactrouter.com/) para la navegación SPA (Single Page Application)
* **Hosting & Despliegue:** [Vercel](https://vercel.com/)

---

## 📂 Estructura del Código Fuente

La carpeta principal `src/` se organiza bajo patrones de diseño que separan la lógica de negocio de la interfaz de usuario:

* `📁 src/componentes/`: Componentes modulares y reutilizables de la interfaz (Navbar, Footer, tarjetas de producto) y Custom Hooks para la lógica de consumo de APIs.
* `📁 src/pages/`: Vistas completas de la aplicación vinculadas al enrutador (Home, Login, Catálogo).
* `📁 src/compra-exitosa/`: Módulo especializado en el flujo de término y confirmación de la orden de compra.
* `📄 App.jsx`: Componente raíz que centraliza las rutas y los contextos globales de estado (`Context API`) para el carrito y la sesión.

---

## 💻 Instalación y Configuración Local

Si quieres clonar este proyecto y ejecutarlo en tu entorno local, puedes copiar y pegar la siguiente secuencia de comandos en tu terminal:


git clone [https://github.com/CatPino/FrontendPortafolio.git](https://github.com/CatPino/FrontendPortafolio.git) && cd FrontendPortafolio && npm install && npm run dev


npm install


npm run dev


npm run build

---

## 🌐 Demo en Vivo
El proyecto se encuentra desplegado y listo para ser probado en producción gracias al hosting de Vercel. Puedes acceder a la demo interactiva haciendo clic en el siguiente enlace:

🔗 Visitar la Demo en Vivo de LumiSkin : https://frontend-portafolio-lumiskin-yebo.vercel.app/

