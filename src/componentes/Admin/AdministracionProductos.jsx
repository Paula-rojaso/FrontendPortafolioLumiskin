import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ModalProducto } from "./ModalProducto";

export function AdministracionProductos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [criterioOrden, setCriterioOrden] = useState("nombre"); // "nombre", "categoria", "id", "stock"
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [modo, setModo] = useState("crear");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  async function cargarProductos() {
    setCargando(true);
    setMensaje(null);
    try {
      const res = await fetch("https://backendportafolio-635z.onrender.com/api/productos");
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setMensaje({
        tipo: "error",
        texto: "No se pudieron cargar los productos.",
      });
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  const normalizarTexto = (valor) => {
    return String(valor || "")
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // =======================================================
  // LÓGICA DE FILTRADO Y ORDENAMIENTO DINÁMICO
  // =======================================================
  const filtradosYOrdenados = useMemo(() => {
    const texto = normalizarTexto(filtroTexto);
    const cat = normalizarTexto(filtroCategoria);

    // 1. Filtrar los productos primero
    let resultado = productos.filter((p) => {
      const categoriaProducto = normalizarTexto(
        p.categoria?.nombre || p.categoriaNombre || p.categoria || ""
      );
      const nombreProducto = normalizarTexto(p.nombre);
      const descripcionProducto = normalizarTexto(p.descripcion);

      const okCat = !cat || categoriaProducto === cat;
      const okTxt = !texto || nombreProducto.includes(texto) || descripcionProducto.includes(texto);

      return okCat && okTxt;
    });

    // 2. Aplicar el criterio de ordenamiento seleccionado
    if (criterioOrden === "nombre") {
      resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (criterioOrden === "categoria") {
      resultado.sort((a, b) => {
        const catA = a.categoria?.nombre || a.categoriaNombre || a.categoria || "";
        const catB = b.categoria?.nombre || b.categoriaNombre || b.categoria || "";
        return catA.localeCompare(catB);
      });
    } else if (criterioOrden === "id") {
      resultado.sort((a, b) => b.id - a.id); // Más recientes primero
    } else if (criterioOrden === "stock") {
      resultado.sort((a, b) => (a.stock || 0) - (b.stock || 0)); // Menor stock primero (quiebres de inventario)
    }

    return resultado;
  }, [productos, filtroTexto, filtroCategoria, criterioOrden]);

  function abrirModalCrear() {
    if (guardando) return;
    setModo("crear");
    setProductoSeleccionado(null);
    const modal = new bootstrap.Modal(document.getElementById("modalProducto"));
    modal.show();
  }

  function abrirModalEditar(prod) {
    if (guardando) return;
    setModo("editar");
    setProductoSeleccionado(prod);
    const modal = new bootstrap.Modal(document.getElementById("modalProducto"));
    modal.show();
  }

  async function eliminarProducto(id) {
    if (guardando) return;
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    
    setGuardando(true);
    try {
      const res = await fetch(`https://backendportafolio-635z.onrender.com/api/productos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      setMensaje({
        tipo: "exito",
        texto: "Producto eliminado correctamente.",
      });
      await cargarProductos();
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMensaje({
        tipo: "error",
        texto: "Error al eliminar producto.",
      });
    } finally {
      setGuardando(false);
    }
  }

  function onGuardar() {
    cargarProductos();
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalProducto"));
    if (modal) modal.hide();
  }

  return (
    <main
      className="py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff7f9 0%, #f8eef2 45%, #fffdfb 100%)",
      }}
    >
      <div className="container">
        {/* ENCABEZADO */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 style={{ color: "#4b2b32", fontWeight: "900" }}>
              Administración de productos
            </h1>
            <p className="text-muted mb-0">
              Gestiona el catálogo de la tienda, controla existencias y actualiza precios.
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn rounded-pill px-4 py-2 shadow-sm"
              style={{ backgroundColor: "#c46a7a", color: "white", fontWeight: "800" }}
              onClick={abrirModalCrear}
              disabled={guardando}
            >
              ＋ Agregar producto
            </button>

            <button
              className="btn rounded-pill px-4 py-2 shadow-sm"
              style={{
                backgroundColor: "#fff",
                color: "#7a3f4b",
                fontWeight: "700",
                border: "1px solid #e8b8c2",
              }}
              onClick={() => navigate("/admin")}
            >
              Volver al Panel
            </button>
          </div>
        </div>

        {/* CONTROLES: FILTROS Y ORDENAMIENTO */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <input
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="form-control rounded-pill px-4 py-2 shadow-sm border-0"
              placeholder="🔍 Buscar por nombre o descripción..."
              disabled={guardando}
            />
          </div>
          
          <div className="col-md-3">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="form-select rounded-pill px-4 py-2 shadow-sm border-0"
              style={{ color: "#4b2b32", fontWeight: "600" }}
              disabled={guardando}
            >
              <option value="">Todas las categorías</option>
              <option>Cuidado Capilar</option>
              <option>Cuidado Facial</option>
              <option>Cuidado Corporal</option>
              <option>Perfumes y fragancias</option>
              <option>Cuidado Personal</option>
            </select>
          </div>

          {/* NUEVO SELECTOR DE ORDENAMIENTO DINÁMICO */}
          <div className="col-md-3">
            <select
              value={criterioOrden}
              onChange={(e) => setCriterioOrden(e.target.value)}
              className="form-select rounded-pill px-4 py-2 shadow-sm border-0"
              style={{ color: "#7a3f4b", fontWeight: "600" }}
              disabled={guardando}
            >
              <option value="nombre">Ordenar por: Nombre (A-Z)</option>
              <option value="categoria">Ordenar por: Categoría</option>
              <option value="id">Ordenar por: Más recientes</option>
              <option value="stock">Ordenar por: Stock crítico primero</option>
            </select>
          </div>

          {(filtroTexto || filtroCategoria) && (
            <div className="col-md-2 d-flex align-items-center">
              <button
                className="btn btn-link text-muted text-decoration-none p-0"
                onClick={() => {
                  setFiltroTexto("");
                  setFiltroCategoria("");
                  setCriterioOrden("nombre");
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {mensaje && (
          <div className={`alert ${mensaje.tipo === "error" ? "alert-danger" : "alert-success"} rounded-4 shadow-sm border-0 mb-4`}>
            {mensaje.texto}
          </div>
        )}

        {/* TABLA DE PRODUCTOS */}
        <div className="card border-0 rounded-4 shadow-sm">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr style={{ color: "#8a5a64" }}>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cargando ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        <div className="spinner-border spinner-border-sm me-2" style={{ color: "#c46a7a" }}></div>
                        Cargando catálogo de productos...
                      </td>
                    </tr>
                  ) : filtradosYOrdenados.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        No se encontraron productos coincidentes.
                      </td>
                    </tr>
                  ) : (
                    filtradosYOrdenados.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <span className="badge bg-light text-dark border px-2 py-1">
                            #{p.id}
                          </span>
                        </td>
                        <td>
                          {p.imagenUrl ? (
                            <img
                              src={p.imagenUrl}
                              alt={p.nombre}
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: 8,
                                border: "1px solid #f0f0f0",
                              }}
                            />
                          ) : (
                            <div className="bg-light rounded-3 d-flex align-items-center justify-content-center text-muted" style={{ width: 50, height: 50, fontSize: "11px" }}>
                              Sin foto
                            </div>
                          )}
                        </td>
                        <td className="fw-bold" style={{ color: "#4b2b32", maxWidth: "250px" }}>{p.nombre}</td>
                        <td>
                          <span className="badge bg-opacity-10 text-dark border px-2 py-1" style={{ backgroundColor: "#fcf4f6", borderColor: "#e8b8c2" }}>
                            {p.categoria?.nombre || p.categoriaNombre || p.categoria || "Genérico"}
                          </span>
                        </td>
                        <td className="fw-semibold text-secondary">
                          ${Number(p.precio || 0).toLocaleString("es-CL")} CLP
                        </td>

                        <td>
                          {typeof p.stock === "number" ? (
                            p.stock <= 0 ? (
                              <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1 rounded-pill">
                                Agotado
                              </span>
                            ) : p.stock < 5 ? (
                              <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1 rounded-pill" style={{ color: "#b98600" }}>
                                Crítico: {p.stock} u.
                              </span>
                            ) : (
                              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 rounded-pill">
                                {p.stock} unidades
                              </span>
                            )
                          ) : (
                            "—"
          )}
                        </td>

                        <td className="text-center">
                          {/* =======================================================
                              OPCIÓN 2: ICONOS SÓLIDOS CON TEXTO EXPLÍCITO DEBAJO
                              ======================================================= */}
                          <div className="d-flex justify-content-center gap-3">
                            {/* Botón Editar */}
                            <button
                              type="button"
                              title="Editar producto"
                              className="btn btn-link text-decoration-none d-flex flex-column align-items-center p-0 border-0"
                              style={{ color: "#264653" }}
                              onClick={() => abrirModalEditar(p)}
                              disabled={guardando}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 17.25V21h3.25L17.81 9.94l-3.25-3.25L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.25 3.25 1.83-1.83z"/>
                              </svg>
                              <span style={{ fontSize: "11px", fontWeight: "700", marginTop: "2px", color: "#264653" }}>Editar</span>
                            </button>

                            {/* Botón Eliminar */}
                            <button
                              type="button"
                              title="Eliminar producto"
                              className="btn btn-link text-decoration-none d-flex flex-column align-items-center p-0 border-0"
                              style={{ color: "#e76f51" }}
                              onClick={() => eliminarProducto(p.id)}
                              disabled={guardando}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                              </svg>
                              <span style={{ fontSize: "11px", fontWeight: "700", marginTop: "2px", color: "#e76f51" }}>Eliminar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ModalProducto
        modo={modo}
        producto={productoSeleccionado}
        onGuardar={onGuardar}
      />
    </main>
  );
}