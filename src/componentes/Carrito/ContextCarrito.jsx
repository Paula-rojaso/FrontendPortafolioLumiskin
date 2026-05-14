import { createContext, useContext, useEffect, useState } from "react";

const CarritoContext = createContext();
const CARRITO_STORAGE_KEY = "contextcarrito";

export const CarritoProvider = ({ children }) => {

  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem(CARRITO_STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  const [errores, setErrores] = useState({});

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carrito));
  }, [carrito]);

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem(CARRITO_STORAGE_KEY);
  };

  const obtenerId = (producto) => {
    return Number(
      producto.id ?? producto.idProducto ?? producto.productoId ?? producto.ID ?? null
    );
  };


  const obtenerStockBackend = async (idProducto) => {
    try {
      const res = await fetch(`https://backendportafolio-635z.onrender.com/api/productos/${idProducto}`);
      const data = await res.json();
      return data.stock;
    } catch (e) {
      console.error("Error consultando stock:", e);
      return 0;
    }
  };

  const agregarProducto = async (producto) => {
    const idReal = obtenerId(producto);

    if (idReal == null || isNaN(idReal)) return;

    const productoEnCarrito = carrito.find((p) => p.id === idReal);

    const cantidadActual = productoEnCarrito ? productoEnCarrito.cantidad : 0;
    const cantidadNueva = cantidadActual + 1;

    const stockDisponible = await obtenerStockBackend(idReal);

    if (cantidadNueva > stockDisponible) {
      setErrores((prev) => ({
        ...prev,
        [idReal]: "No hay más stock disponible",
      }));
      return;
    }

    setErrores((prev) => ({ ...prev, [idReal]: null }));

    if (productoEnCarrito) {
      setCarrito((prev) =>
        prev.map((item) =>
          item.id === idReal ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else {
      setCarrito((prev) => [...prev, { ...producto, id: idReal, cantidad: 1 }]);
    }
  };


  const actualizarCantidad = async (idProducto, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    const stockDisponible = await obtenerStockBackend(idProducto);

    if (nuevaCantidad > stockDisponible) {
      setErrores((prev) => ({
        ...prev,
        [idProducto]: "No hay más stock disponible",
      }));
      return;
    }

    setErrores((prev) => ({ ...prev, [idProducto]: null }));

    setCarrito((prev) =>
      prev.map((item) =>
        item.id === idProducto ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  const eliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));

    setErrores((prev) => {
      const copia = { ...prev };
      delete copia[id];
      return copia;
    });
  };

  const totalProductos = () =>
    carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        actualizarCantidad,
        eliminarProducto,
        totalProductos,
        errores,
        vaciarCarrito, 
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);