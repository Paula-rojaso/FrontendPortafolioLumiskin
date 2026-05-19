import { useEffect, useState } from "react";
import { useCarrito } from "../Carrito/ContextCarrito";
import "../UltimosProductos/UltimosProductos.css";

export function UltimosProductos() {
  const { agregarProducto } = useCarrito();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mensaje, setMensaje] = useState(null); 
  // mensaje = { texto: "...", tipo: "ok" | "error" }

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

        const ultimos = dataProd
          .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
          .slice(0, 4);

        setProductos(ultimos);

      } catch (error) {
        console.error("❌ Error al cargar productos o categorías:", error);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, []);

  const mostrarMensaje = (texto, tipo = "ok") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 2000);
  };

  if (cargando)
    return <div className="text-center mt-5">🕐 Cargando productos...</div>;

  const obtenerNombreCategoria = (categoriaId) => {
    const categoria = categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nombre : "Sin categoría";
  };

  return (
    <div className="container my-5">
      <h1>Conoce los nuevos productos</h1>
      <h2>Descubre nuestros productos y encuentra los artículos que están marcando tendencia.</h2>

      {/* MENSAJE FLASH */}
      {mensaje && (
        <div
          className="toast-mensaje"
          style={{
            backgroundColor: mensaje.tipo === "error" ? "#ffe5e5" : "",
            color: mensaje.tipo === "error" ? "#d30000" : "",
            borderLeft:
              mensaje.tipo === "error" ? "6px solid #d30000" : "",
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
              <div
                className="card"
                role="button"
                data-bs-toggle="modal"
                data-bs-target={`#modal${p.id}`}
              >
                {p.imagenUrl ? (
                  <img src={p.imagenUrl} alt={p.nombre} className="card-img-top" />
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
                  <h5 className="fw-bold">
                    ${Number(p.precio).toLocaleString()} CLP
                  </h5>

                  {/* ALERTA DE STOCK CRÍTICO */}
                  {p.stock < 5 && p.stock > 0 && (
                    <p className="text-danger fw-bold mt-2">
                      ⚠️ Quedan solo {p.stock} unidades
                    </p>
                  )}

                  {/* SIN STOCK */}
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
                      mostrarMensaje(`${p.nombre} agregado al carrito ✅`);
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>

              {/* MODAL DETALLE */}
              <div
                className="modal fade"
                id={`modal${p.id}`}
                tabIndex="-1"
                aria-labelledby={`tituloModal${p.id}`}
                aria-hidden="true"
              >
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h2 className="modal-title" id={`tituloModal${p.id}`}>
                        {p.nombre}
                      </h2>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                      ></button>
                    </div>

                    <div className="modal-body text-center">
                      <img
                        src={p.imagenUrl}
                        alt={p.nombre}
                        className="img-fluid rounded mb-3"
                      />
                      <p><strong>Descripción:</strong> {p.descripcion}</p>
                      <p><strong>Precio:</strong> ${Number(p.precio).toLocaleString()} CLP</p>
                      <p><strong>Stock:</strong> {p.stock}</p>

                      {p.stock === 0 && (
                        <p className="text-danger fw-bold">❌ Producto sin stock</p>
                      )}

                      {p.stock < 5 && p.stock > 0 && (
                        <p className="text-danger fw-bold">
                          ⚠️ Quedan pocas unidades
                        </p>
                      )}

                      <p>
                        <strong>Categoría:</strong>{" "}
                        {p.categoria?.nombre || obtenerNombreCategoria(p.categoria_id) || "-"}
                      </p>
                    </div>

                    <div className="modal-footer d-flex justify-content-between">
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
