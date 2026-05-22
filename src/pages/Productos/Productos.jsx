import { Footer } from "../../componentes/Footer/Footer";
import { ModalProductos } from "../../componentes/MostrarProductos/MostrarProductos";

export function Productos() {
  return (
    <>
      <div className="container my-5">
        <h1>Conoce todos nuestros productos</h1>
        <h2 className="mb-4">
          Descubre nuestra selección de productos de cuidado personal, facial,
          corporal y fragancias, pensados para acompañarte en tu rutina diaria.
        </h2>

        <ModalProductos categoriaNombre="Cuidado capilar" />
        <ModalProductos categoriaNombre="Cuidado facial" />
        <ModalProductos categoriaNombre="Cuidado corporal" />
        <ModalProductos categoriaNombre="Cuidado personal" />
        <ModalProductos categoriaNombre="Fragancias" />
      </div>
      <Footer />
    </>
  );
}