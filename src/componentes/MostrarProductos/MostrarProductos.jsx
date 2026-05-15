import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCarrito } from "../Carrito/ContextCarrito";
import "../MostrarProductos/MostrarProductos.css";

export function ModalProductos({ categoriaNombre }) {
  const { agregarProducto } = useCarrito();
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // 🟣 Función para formatear precios al estilo chileno
  const formatoCLP = (v) => `$${Number(v).toLocaleString("es-CL")}`;

  useEffect(() => {
    async function cargar() {
      try {
        const [resProd, resCat] = await Promise.all([
          fetch("https://backendportafolio-635z.onrender.com/api/productos"),
          fetch("https://backendportafolio-635z.onrender.com/api/categorias"),
        ]);

        const dataProd = await resProd.json();
        const dataCat = await resCat.json();

        setCategorias(dataCat);
        const params = new URLSearchParams(location.search);
        const textoBusqueda = params.get("search")?.toLowerCase().trim() || "";

       let productosFiltrados = dataProd;

// Filtrar por categoría si viene categoriaNombre
          if (categoriaNombre) {
            const categoria = dataCat.find(
              (c) => c.nombre.toLowerCase() === categoriaNombre.toLowerCase()
            );

            if (categoria) {
              productosFiltrados = productosFiltrados.filter(
                (p) =>
                  p.categoria?.id === categoria.id ||
                  p.categoriaId === categoria.id ||
                  p.categoria_id === categoria.id
              );
            } else {
              productosFiltrados = [];
  }
}

// Filtrar por búsqueda si viene ?search=
if (textoBusqueda) {
  productosFiltrados = productosFiltrados.filter((p) =>
    p.nombre.toLowerCase().includes(textoBusqueda) ||
    p.descripcion.toLowerCase().includes(textoBusqueda)
  );
}

setProductos(productosFiltrados);

      } catch (error) {
        console.error("❌ Error al cargar productos o categorías:", error);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [categoriaNombre, location.search]);

  const mostrarMensaje = (texto, tipo = "ok") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(""), 2000);
  };

  if (cargando) {
    return <div className="text-center mt-5">🕐 Cargando productos...</div>;
  }

  const obtenerNombreCategoria = (categoriaId) => {
    const categoria = categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nombre : "Sin categoría";
  };

  return (
    <div className="container my-5">
      {/* MENSAJE FLASH */}
      {mensaje && (
        <div
          className="toast-mensaje"
          style={{
            backgroundColor: mensaje.tipo === "error" ? "#ffe5e5" : "",
            color: mensaje.tipo === "error" ? "#d30000" : "",
            borderLeft: mensaje.tipo === "error" ? "6px solid #d30000" : "",
          }}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="row g-4">
        {productos.length === 0 ? (
          <p className="text-center">No hay productos disponibles.</p>
        ) : (
          productos.map((p) => (
            <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              
              {/* CARD */}
              <div
                className="card"
                role="button"
                data-bs-toggle="modal"
                data-bs-target={`#modal${p.id}`}
              >
                {p.imagen_url ? (
                  <img
                    src={p.imagen_url}
                    alt={p.nombre}
                    className="card-img-top"
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-light"
                    style={{ height: "200px" }}
                  >
                    <span className="text-muted">Sin imagen</span>
                  </div>
                )}

                <div className="card-body">
                  <h5 className="card-title">{p.nombre}</h5>
                  <p className="card-text text-muted">{p.descripcion}</p>

                  {/* 🟢 PRECIO CHILENO */}
                  <h5 className="fw-bold">{formatoCLP(p.precio)} CLP</h5>

                  {p.stock < 5 && p.stock > 0 && (
                    <p className="text-danger fw-bold mt-2">
                      ⚠️ Quedan solo {p.stock} unidades
                    </p>
                  )}

                  {p.stock === 0 && (
                    <p className="text-danger fw-bold mt-2">
                      ❌ Sin stock disponible
                    </p>
                  )}
                </div>

                <div className="card-footer bg-transparent border-0 text-center p-2">
                  <button
                    className="button2 w-100"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (p.stock === 0) {
                        mostrarMensaje("❌ No hay stock disponible", "error");
                        return;
                      }

                      agregarProducto(p);
                      mostrarMensaje(`${p.nombre} agregado al carrito ✅`, "ok");
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>

              {/* MODAL DE DETALLE */}
                <div
                  className="modal fade"
                  id={`modal${p.id}`}
                  tabIndex="-1"
                  aria-labelledby={`tituloModal${p.id}`}
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header py-2">
                        <h5 className="modal-title" id={`tituloModal${p.id}`}>
                          {p.nombre}
                        </h5>

                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                        ></button>
                      </div>

                      <div className="modal-body text-center py-3">
                        <img
                          src={p.imagen_url}
                          alt={p.nombre}
                          className="img-fluid rounded mb-3"
                          style={{
                            maxHeight: "260px",
                            objectFit: "contain",
                          }}
                        />

                        <p className="mb-2">
                          <strong>Descripción:</strong> {p.descripcion}
                        </p>

                        <p className="mb-2">
                          <strong>Precio:</strong> {formatoCLP(p.precio)} CLP
                        </p>

                        <p className="mb-2">
                          <strong>Stock:</strong> {p.stock}
                        </p>

                        {p.stock === 0 && (
                          <p className="text-danger fw-bold mb-2">
                            ❌ Producto sin stock
                          </p>
                        )}

                        {p.stock < 5 && p.stock > 0 && (
                          <p className="text-danger fw-bold mb-2">
                            ⚠️ Quedan pocas unidades
                          </p>
                        )}

                        <p className="mb-0">
                          <strong>Categoría:</strong>{" "}
                          {p.categoria?.nombre ||
                            obtenerNombreCategoria(p.categoria_id) ||
                            "-"}
                        </p>
                      </div>

                      <div className="modal-footer d-flex justify-content-between py-2">
                        <button className="button1" data-bs-dismiss="modal">
                          Cerrar
                        </button>

                        <button
                          className="button2"
                          onClick={() => {
                            if (p.stock === 0) {
                              mostrarMensaje("❌ No hay stock disponible", "error");
                              return;
                            }

                            agregarProducto(p);
                            mostrarMensaje(`${p.nombre} agregado al carrito ✅`);
                          }}
                        >
                          Agregar al carrito
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
