import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CompraExitosa() {
  const [boleta, setBoleta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idBoleta = params.get("idBoleta");

    if (idBoleta) {
      fetch(`https://backend-pago.onrender.com/api/pagos/boleta/${idBoleta}`)
        .then(res => res.json())
        .then(data => {
          setBoleta(data);
          localStorage.setItem("boleta", JSON.stringify(data));

          const yaDescontado = localStorage.getItem("stock_descontado");
          if (!yaDescontado) {
            data.detalles.forEach((item) => {
              fetch(
                `https://backend-inventario.onrender.com/api/productos/${item.idProducto}/descontar?cantidad=${item.cantidad}`,
                { method: "PATCH" }
              );
            });
            localStorage.setItem("stock_descontado", "true");
          }
        })
        .finally(() => {
          setCargando(false);
        });
    } else {
      const guardada = localStorage.getItem("boleta");
      if (guardada) setBoleta(JSON.parse(guardada));
      setCargando(false);
    }
  }, []);

  if (cargando) {
    return (
      <main
        className="py-5 d-flex align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #fff7f9 0%, #f8eef2 45%, #fffdfb 100%)",
        }}
      >
        <div className="container text-center">
          <div className="spinner-border mb-4" style={{ color: "#c46a7a", width: "3rem", height: "3rem" }} role="status"></div>
          <p className="text-muted fs-5">Cargando tu boleta...</p>
        </div>
      </main>
    );
  }

  if (!boleta) {
    return (
      <main
        className="py-5 d-flex align-items-center"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #fff7f9 0%, #f8eef2 45%, #fffdfb 100%)",
        }}
      >
        <div className="container text-center">
          <div
            className="mx-auto p-5 rounded-4 shadow-sm"
            style={{
              maxWidth: "600px",
              backgroundColor: "rgba(255,255,255,0.95)",
              border: "1px solid #f1d4dc",
            }}
          >
            <h2 style={{ color: "#4b2b32", fontWeight: "800" }}>
              No se encontró la boleta de la compra
            </h2>

            <p className="text-muted mt-3">
              Es posible que aún no hayas realizado una compra o que la boleta haya sido eliminada.
            </p>

            <Link
              to="/"
              className="btn mt-4 px-4 py-3 rounded-pill"
              style={{
                backgroundColor: "#c46a7a",
                color: "white",
                fontWeight: "700",
              }}
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const subtotal = boleta.subtotal;
  const iva = boleta.iva;
  const total = boleta.total;

  return (
    <main
      className="py-5"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff7f9 0%, #f8eef2 45%, #fffdfb 100%)",
      }}
    >
      <div className="container">

        {/* ENCABEZADO */}
        <div className="text-center mb-5">
          <div
            className="mx-auto mb-4 d-flex align-items-center justify-content-center"
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              backgroundColor: "#f7dbe2",
              color: "#9b4d5d",
              fontSize: "42px",
              boxShadow: "0 12px 30px rgba(196, 106, 122, 0.18)",
            }}
          >
            ✓
          </div>

          <span
            className="px-4 py-2 rounded-pill"
            style={{
              backgroundColor: "#f7dbe2",
              color: "#9b4d5d",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            Compra confirmada
          </span>

          <h1
            className="mt-4 mb-2"
            style={{
              color: "#4b2b32",
              fontWeight: "900",
              letterSpacing: "-0.5px",
            }}
          >
            ¡Tu pago ha sido exitoso!
          </h1>

          <p className="text-muted fs-5">
            Gracias por tu compra. Aquí tienes el detalle de tu pedido.
          </p>

          <div
            className="mt-4 mx-auto p-3 rounded-4 shadow-sm"
            style={{
              maxWidth: "520px",
              backgroundColor: "rgba(255,255,255,0.95)",
              border: "1px solid #f1d4dc",
            }}
          >
            <p className="text-muted mb-1">Número de orden</p>
            <h2 className="m-0" style={{ color: "#c46a7a", fontWeight: "900" }}>
              #{boleta.idBoleta}
            </h2>
          </div>
        </div>

        <div className="row g-4">
          {/* COLUMNA IZQUIERDA */}
          <div className="col-lg-8">

            {/* INFORMACIÓN DEL CLIENTE */}
            <div
              className="card border-0 rounded-4 shadow-sm mb-4"
              style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
            >
              <div className="card-body p-4">
                <h2 className="mb-1" style={{ color: "#4b2b32", fontWeight: "800" }}>
                  Información del cliente
                </h2>

                <p className="text-muted mb-4">
                  Datos registrados para el envío de tu pedido.
                </p>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 rounded-4" style={{ backgroundColor: "#fff7f9" }}>
                      <small className="text-muted">Nombre</small>
                      <p className="mb-0 fw-bold" style={{ color: "#4b2b32" }}>{boleta.nombreCliente}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-3 rounded-4" style={{ backgroundColor: "#fff7f9" }}>
                      <small className="text-muted">Correo</small>
                      <p className="mb-0 fw-bold" style={{ color: "#4b2b32" }}>{boleta.correoCliente}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-3 rounded-4" style={{ backgroundColor: "#fff7f9" }}>
                      <small className="text-muted">Teléfono</small>
                      <p className="mb-0 fw-bold" style={{ color: "#4b2b32" }}>{boleta.telefonoCliente}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-3 rounded-4" style={{ backgroundColor: "#fff7f9" }}>
                      <small className="text-muted">Dirección</small>
                      <p className="mb-0 fw-bold" style={{ color: "#4b2b32" }}>{boleta.direccionCliente}</p>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 rounded-4" style={{ backgroundColor: "#fff7f9" }}>
                      <small className="text-muted">Indicaciones</small>
                      <p className="mb-0 fw-bold" style={{ color: "#4b2b32" }}>{boleta.indicacionesEnvio || "Sin indicaciones"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCTOS */}
            <div
              className="card border-0 rounded-4 shadow-sm mb-4"
              style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h2 className="mb-1" style={{ color: "#4b2b32", fontWeight: "800" }}>
                      Productos comprados
                    </h2>
                    <p className="text-muted mb-0">Detalle de los productos incluidos en tu pedido.</p>
                  </div>

                  <span
                    className="badge rounded-pill px-3 py-2"
                    style={{ backgroundColor: "#f7dbe2", color: "#9b4d5d" }}
                  >
                    {boleta.detalles?.length || 0} producto(s)
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr style={{ color: "#8a5a64" }}>
                        <th>Producto</th>
                        <th className="text-center">Cantidad</th>
                        <th className="text-center">Precio</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>

                    <tbody>
                      {boleta.detalles.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.imagenUrl || item.imagen || "/sin-imagen.png"}
                                alt={item.nombre}
                                style={{
                                  width: 78,
                                  height: 78,
                                  objectFit: "cover",
                                  borderRadius: "18px",
                                  border: "1px solid #f1d4dc",
                                  backgroundColor: "#fff7f9",
                                }}
                              />
                              <div>
                                <h6 className="mb-1" style={{ color: "#4b2b32", fontWeight: "800" }}>{item.nombre}</h6>
                                <small className="text-muted">Producto Lumiskin</small>
                              </div>
                            </div>
                          </td>

                          <td className="text-center">
                            <span
                              className="px-3 py-2 rounded-pill"
                              style={{ backgroundColor: "#fff1f4", color: "#7a3f4b", fontWeight: "800" }}
                            >
                              {item.cantidad}
                            </span>
                          </td>

                          <td className="text-center">${formatearPrecio(item.precioUnitario)}</td>
                          <td className="text-end" style={{ color: "#4b2b32", fontWeight: "800" }}>${formatearPrecio(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="col-lg-4">
            <div
              className="card border-0 rounded-4 shadow sticky-top"
              style={{
                top: "20px",
                background: "linear-gradient(180deg, #ffffff 0%, #fff7f9 100%)",
                border: "1px solid #f1d4dc",
              }}
            >
              <div className="card-body p-4">
                <h3 className="mb-4" style={{ color: "#4b2b32", fontWeight: "900" }}>
                  Resumen de pago
                </h3>

                <div className="rounded-4 p-3 mb-4" style={{ backgroundColor: "#fff1f4" }}>
                  <small className="text-muted">Método de compra</small>
                  <p className="mb-0 fw-bold" style={{ color: "#7a3f4b" }}>{boleta.metodoPago}</p>
                </div>

                <div className="rounded-4 p-3 mb-4" style={{ backgroundColor: "#fff1f4" }}>
                  <small className="text-muted">Fecha de compra</small>
                  <p className="mb-0 fw-bold" style={{ color: "#7a3f4b" }}>{boleta.fechaPago}</p>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Subtotal</span>
                  <strong>${formatearPrecio(subtotal)}</strong>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">IVA 19%</span>
                  <strong>${formatearPrecio(iva)}</strong>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span style={{ color: "#4b2b32", fontWeight: "900", fontSize: "20px" }}>Total</span>
                  <span style={{ color: "#c46a7a", fontWeight: "900", fontSize: "30px" }}>${formatearPrecio(total)}</span>
                </div>

                <button
                  className="btn w-100 py-3 rounded-pill mb-3"
                  style={{
                    backgroundColor: "#c46a7a",
                    color: "white",
                    fontWeight: "600",
                    boxShadow: "0 10px 20px rgba(196, 106, 122, 0.25)",
                  }}
                  onClick={() => window.print()}
                >
                  Descargar comprobante
                </button>

                <button
                  className="btn w-100 py-3 rounded-pill"
                  onClick={() => {
                    localStorage.removeItem("boleta");
                    localStorage.removeItem("stock_descontado");
                    navigate("/");
                  }}
                  style={{
                    backgroundColor: "#fff",
                    color: "#7a3f4b",
                    fontWeight: "700",
                    border: "1px solid #e8b8c2",
                  }}
                >
                  Volver al inicio
                </button>

                <p className="text-muted text-center small mt-4 mb-0">
                  Guarda este comprobante como respaldo de tu compra.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MENSAJE FINAL */}
        <div className="text-center mt-5 mb-4">
          <h3 className="fst-italic" style={{ color: "#7a3f4b", fontWeight: "600" }}>
            Gracias por confiar en Lumiskin.
          </h3>
          <p className="text-muted">
            Estamos trabajando para ofrecerte la mejor experiencia de cuidado personal.
          </p>
        </div>
      </div>
    </main>
  );
}