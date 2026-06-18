import { useEffect, useState, useMemo } from "react";

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [boletaSeleccionada, setBoletaSeleccionada] = useState(null);

  const obtenerToken = () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (!usuarioGuardado) return null;
      const usuario = JSON.parse(usuarioGuardado);
      return usuario?.token || null;
    } catch (error) {
      console.error("Error obteniendo token:", error);
      return null;
    }
  };

  const headersAuth = () => {
    const token = obtenerToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const cargarOrdenes = async () => {
    setCargando(true);
    try {
      const res = await fetch("https://backend-pago.onrender.com/api/pagos", {
        headers: headersAuth(),
      });

      if (!res.ok) throw new Error("Error al obtener las órdenes");

      const data = await res.json();

      const ordenesFormateadas = data.map((p) => ({
        idPago: p.idPago,
        idBoleta: p.boleta?.idBoleta,
        nombre: p.boleta?.nombreCliente || "Cliente Anónimo",
        correo: p.boleta?.correoCliente || "Sin correo",
        fecha: p.fechaPago,
        subtotal: p.subtotal,
        iva: p.iva,
        total: p.total,
        detalles: p.boleta?.detalles || [],
      }));

      setOrdenes(ordenesFormateadas);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  // Normalizador para que las búsquedas ignoren mayúsculas y tildes
  const normalizarTexto = (valor) => {
    return String(valor || "")
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Filtro en tiempo real por Nombre, Correo o N° de Boleta
  const ordenesFiltradas = useMemo(() => {
    const texto = normalizarTexto(filtroTexto);
    if (!texto) return ordenes;

    return ordenes.filter((o) => {
      const nombreOk = normalizarTexto(o.nombre).includes(texto);
      const correoOk = normalizarTexto(o.correo).includes(texto);
      const boletaOk = String(o.idBoleta).includes(texto);

      return nombreOk || correoOk || boletaOk;
    });
  }, [ordenes, filtroTexto]);

  const abrirModal = (orden) => {
    setBoletaSeleccionada(orden);
    const modal = new window.bootstrap.Modal(
      document.getElementById("modalDetallesBoleta")
    );
    modal.show();
  };

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
              Órdenes de compra
            </h1>
            <p className="text-muted mb-0">
              Revisa el historial de ventas y los detalles de cada boleta.
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn rounded-pill px-4 py-2"
              style={{
                backgroundColor: "#fff",
                color: "#7a3f4b",
                fontWeight: "700",
                border: "1px solid #e8b8c2",
              }}
              onClick={cargarOrdenes}
            >
              Actualizar
            </button>

            <button
              className="btn rounded-pill px-4 py-2"
              style={{
                backgroundColor: "#c46a7a",
                color: "white",
                fontWeight: "800",
              }}
              onClick={() => window.history.back()}
            >
              Volver al Panel
            </button>
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA */}
        <div className="row mb-4">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control rounded-pill px-4 py-2 shadow-sm border-0"
              placeholder="🔍 Buscar por nombre, correo o N° boleta..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </div>
          {filtroTexto && (
            <div className="col-md-2 d-flex align-items-center">
              <button 
                className="btn btn-link text-muted text-decoration-none p-0" 
                onClick={() => setFiltroTexto("")}
              >
                Limpiar filtro
              </button>
            </div>
          )}
        </div>

        {/* TABLA DE ÓRDENES */}
        <div className="card border-0 rounded-4 shadow-sm">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>N° Orden</th>
                    <th>Cliente</th>
                    <th>Correo</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th className="text-center">Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {cargando ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        Cargando historial de órdenes...
                      </td>
                    </tr>
                  ) : ordenesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        {filtroTexto 
                          ? "No se encontraron resultados para tu búsqueda." 
                          : "No hay órdenes registradas en el sistema."}
                      </td>
                    </tr>
                  ) : (
                    ordenesFiltradas.map((o) => (
                      <tr key={o.idPago}>
                        <td>
                          <span className="badge bg-light text-dark border px-2 py-1">
                            #{o.idBoleta}
                          </span>
                        </td>
                        <td className="fw-bold">{o.nombre}</td>
                        <td>{o.correo}</td>
                        <td>{new Date(o.fecha).toLocaleString("es-CL")}</td>
                        <td className="text-success fw-bold">
                          ${Number(o.total).toLocaleString("es-CL")}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                            onClick={() => abrirModal(o)}
                          >
                            Ver detalles
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MODAL DETALLES */}
        <div className="modal fade" id="modalDetallesBoleta" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div 
              className="modal-content border-0 rounded-4 shadow-lg"
              style={{ background: "linear-gradient(180deg, #ffffff 0%, #fff7f9 100%)" }}
            >
              <div className="modal-header border-0 px-4 pt-4">
                <h4 className="modal-title" style={{ color: "#4b2b32", fontWeight: "900" }}>
                  Detalles de la Orden #{boletaSeleccionada?.idBoleta}
                </h4>
                <button className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body px-4">
                {boletaSeleccionada ? (
                  <>
                    <h5 className="fw-bold mb-3" style={{ color: "#7a3f4b" }}>Productos comprados</h5>

                    <div className="table-responsive">
                      <table className="table align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Imagen</th>
                            <th>Producto</th>
                            <th className="text-center">Cantidad</th>
                            <th className="text-end">Precio unit.</th>
                            <th className="text-end">Subtotal</th>
                          </tr>
                        </thead>

                        <tbody>
                          {boletaSeleccionada.detalles.map((d, i) => (
                            <tr key={i}>
                              <td>
                                <img
                                  src={d.imagenUrl || "/sin-imagen.png"}
                                  alt={d.producto}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    border: "1px solid #eee",
                                  }}
                                />
                              </td>
                              <td className="fw-semibold">{d.producto}</td>
                              <td className="text-center">{d.cantidad}</td>
                              <td className="text-end">
                                ${Number(d.precioUnitario).toLocaleString("es-CL")}
                              </td>
                              <td className="text-end fw-bold">
                                ${Number(
                                  d.subtotal ?? d.cantidad * d.precioUnitario
                                ).toLocaleString("es-CL")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <hr className="my-4" style={{ borderColor: "#e8b8c2" }} />

                    <div className="d-flex justify-content-end">
                      <div style={{ width: "250px" }}>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Subtotal:</span>
                          <span className="fw-semibold">${Number(boletaSeleccionada.subtotal).toLocaleString("es-CL")}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                          <span className="text-muted">IVA (19%):</span>
                          <span className="fw-semibold">${Number(boletaSeleccionada.iva).toLocaleString("es-CL")}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: "#f7dbe2" }}>
                          <span className="fw-bold" style={{ color: "#7a3f4b" }}>Total pagado:</span>
                          <span className="fs-5 fw-bold text-success">${Number(boletaSeleccionada.total).toLocaleString("es-CL")}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">Cargando detalles de la orden...</p>
                  </div>
                )}
              </div>

              <div className="modal-footer border-0 px-4 pb-4">
                <button 
                  className="btn rounded-pill px-4" 
                  data-bs-dismiss="modal"
                  style={{
                    backgroundColor: "#fff",
                    color: "#7a3f4b",
                    fontWeight: "700",
                    border: "1px solid #e8b8c2",
                  }}
                >
                  Cerrar detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}