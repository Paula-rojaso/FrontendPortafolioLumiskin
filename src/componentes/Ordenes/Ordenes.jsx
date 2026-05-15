import { useEffect, useState } from "react";

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [boletaSeleccionada, setBoletaSeleccionada] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch("https://backend-pago.onrender.com/api/pagos");
        const data = await res.json();

        const ordenesFormateadas = data.map((p) => ({
          idPago: p.idPago,
          idBoleta: p.boleta?.idBoleta,
          nombre: p.boleta?.nombreCliente,
          correo: p.boleta?.correoCliente,
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
    }

    cargar();
  }, []);

  const abrirModal = (orden) => {
    setBoletaSeleccionada(orden);

    const modal = new window.bootstrap.Modal(
      document.getElementById("modalDetallesBoleta")
    );
    modal.show();
  };

  if (cargando) {
    return (
      <div className="container mt-5 text-center">
        <h2>Cargando órdenes...</h2>
      </div>
    );
  }

  return (
    <main className="container mt-5">
      <h1 className="mb-4 text-start">
        <strong>Órdenes de compra</strong>
      </h1>

      {ordenes.length === 0 ? (
        <h3 className="text-muted text-center">No hay órdenes registradas.</h3>
      ) : (
        <table className="table table-hover align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>N° Orden</th>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {ordenes.map((o) => (
              <tr key={o.idPago}>
                <td><strong>#{o.idBoleta}</strong></td>
                <td>{o.nombre}</td>
                <td>{o.correo}</td>
                <td>{new Date(o.fecha).toLocaleString("es-CL")}</td>
                <td className="text-success fw-bold">
                  ${Number(o.total).toLocaleString("es-CL")}
                </td>
                <td className="text-end">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => abrirModal(o)}
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL DETALLES */}
      <div className="modal fade" id="modalDetallesBoleta" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                Detalles de la Orden #{boletaSeleccionada?.idBoleta}
              </h4>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {boletaSeleccionada ? (
                <>
                  <h5 className="fw-bold mb-3">Productos</h5>

                  <table className="table table-striped">
                    <thead className="table-light">
                      <tr>
                        <th>Imagen</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
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
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                              }}
                            />
                          </td>

                          <td>{d.producto}</td>
                          <td>{d.cantidad}</td>

                          <td>
                            ${Number(d.precioUnitario).toLocaleString("es-CL")}
                          </td>

                          <td>
                            ${Number(
                              d.subtotal ?? d.cantidad * d.precioUnitario
                            ).toLocaleString("es-CL")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <hr />

                  <div className="text-end">
                    <p className="fs-5">
                      <strong>Subtotal:</strong>{" "}
                      ${Number(boletaSeleccionada.subtotal).toLocaleString("es-CL")}
                    </p>

                    <p className="fs-6 text-muted">
                      <strong>IVA (19%):</strong>{" "}
                      ${Number(boletaSeleccionada.iva).toLocaleString("es-CL")}
                    </p>

                    <h3 className="text-success fw-bold mt-3">
                      Total: ${Number(boletaSeleccionada.total).toLocaleString("es-CL")}
                    </h3>
                  </div>
                </>
              ) : (
                <p>Cargando detalles...</p>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
