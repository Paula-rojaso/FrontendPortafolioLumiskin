import { Footer } from "../../componentes/Footer/Footer";
import { ModalProductos } from "../../componentes/MostrarProductos/MostrarProductos";

export function CuidadoCorporal() {
  return (
    <>
      <ModalProductos categoriaNombre="Cuidado corporal" />
      <Footer />
    </>
  );
}