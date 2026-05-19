import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CompraExitosa() {
  const [boleta, setBoleta] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const guardada = localStorage.getItem("boleta");
    const yaDescontado = localStorage.getItem("stock_descontado");

    if (guardada) {
      const boletaData = JSON.parse(guardada);
      setBoleta(boletaData);

      if (!yaDescontado) {
        boletaData.detalles.forEach((item) => {
          fetch(
            `http://localhost:8081/api/productos/${item.idProducto}/descontar?cantidad=${item.cantidad}`,
            { method: "PATCH" }
          );
        });
        localStorage.setItem("stock_descontado", "true");
      }
    }
  }, []);

  if (!boleta) {
    return (
      <div className="container mt-5 text-center">
        <h2>No se encontró la boleta de la compra</h2>
        <Link to="/" className="btn btn-primary mt-4">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const subtotal = boleta.subtotal;
  const iva = boleta.iva;
  const total = boleta.total;

  return (
    <main className="container my-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ color: "#6f42c1" }}>
          ¡Tu pago ha sido exitoso!
        </h1>
        <h3 className="text-muted fs-5">
          Gracias por tu compra. Aquí tienes el detalle del pedido.
        </h3>

        <div
          className="mt-4 p-3 rounded shadow-sm"
          style={{ backgroundColor: "#f3e8ff", borderLeft: "6px solid #6f42c1" }}
        >
          <h2 className="m-0" style={{ color: "#6f42c1" }}>
            <strong>N° de orden:</strong> #{boleta.idBoleta}
          </h2>
        </div>
      </div>

      {/* INFORMACIÓN DEL CLIENTE */}
      <div className="card shadow-sm p-4 mb-4" style={{ borderTop: "4px solid #a16bd8" }}>
        <h2 className="fw-bold mb-3" style={{ color: "#6f42c1" }}>Información del Cliente</h2>

        <div className="row">
          <div className="col-md-12 mb-2"><strong>Nombre:</strong> {boleta.nombreCliente}</div>
          <div className="col-md-12 mb-2"><strong>Correo:</strong> {boleta.correoCliente}</div>
          <div className="col-md-12 mb-2"><strong>Teléfono:</strong> {boleta.telefonoCliente}</div>
          <div className="col-md-12 mb-2"><strong>Dirección:</strong> {boleta.direccionCliente}</div>
          <div className="col-12 mb-2">
            <strong>Indicaciones:</strong> {boleta.indicacionesEnvio || "Sin indicaciones"}
          </div>
        </div>
      </div>

      {/* PRODUCTOS */}
      <div className="card shadow-sm p-4 mb-4" style={{ borderTop: "4px solid #caa7ff" }}>
        <h2 className="fw-bold mb-4" style={{ color: "#6f42c1" }}>
          Productos Comprados
        </h2>

        <table className="table table-hover align-middle">
          <thead style={{ backgroundColor: "#f8f0ff", color: "#6f42c1" }}>
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {boleta.detalles.map((item, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={item.imagenUrl || item.imagen_url || item.imagen || "/sin-imagen.png"}
                    alt={item.nombre}
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 10,
                      border: "2px solid #e4d3ff",
                    }}
                  />
                </td>
                <td className="fw-bold">{item.nombre}</td>
                <td>{item.cantidad}</td>
                <td>${item.precioUnitario}</td>
                <td>${item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INFORMACIÓN DEL PAGO */}
      <div className="card shadow-sm p-4 mb-4" style={{ borderTop: "4px solid #b98cf7" }}>
        <h2 className="fw-bold mb-3" style={{ color: "#6f42c1" }}>
          Información del pago:
        </h2>

        <div><strong>Método de compra:</strong> {boleta.metodoPago}</div>
        <div className="col-12 mt-2"><strong>Fecha de compra:</strong> {boleta.fecha}</div>

        <hr />

        <p><strong>Subtotal:</strong> ${subtotal}</p>
        <p><strong>IVA (19%):</strong> ${iva}</p>

        <h2 className="fw-bold mt-3" style={{ color: "#28a745" }}>
          Monto total: ${total}
        </h2>
      </div>

      {/* BOTONES */}
      <div className="text-center mt-4">
        <button className="btn btn-lg px-4 me-3 button1">
          Descargar comprobante 🧾
        </button>

        <button
          className="btn button2"
          onClick={() => {
            localStorage.removeItem("boleta");
            localStorage.removeItem("stock_descontado");
            navigate("/");
          }}
        >
          Volver al inicio
        </button>
      </div>

      <div className="text-center mt-4 mb-5">
        <h3 className="text-muted fst-italic">
          Gracias por tu compra 💜 Estamos trabajando para ofrecerte la mejor experiencia.
        </h3>
      </div>
    </main>
  );
}