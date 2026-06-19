import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function PanelAdministracion() {
  const navigate = useNavigate();
  const [totalVendido, setTotalVendido] = useState(0);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      // Solo traemos los pagos para sacar el total rápido en el panel
      const resPagos = await fetch("https://backend-pago.onrender.com/api/pagos");

      if (resPagos.ok) {
        const dataPagos = await resPagos.json();

        const total = (Array.isArray(dataPagos) ? dataPagos : []).reduce(
          (acc, boleta) => acc + Number(boleta.total || 0),
          0
        );

        setTotalVendido(total);
      }
    } catch (error) {
      console.error("Error cargando datos del panel:", error);
    } finally {
      setCargando(false);
    }
  };

  const formatearPrecio = (valor) => {
    return Number(valor || 0).toLocaleString("es-CL");
  };

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
        <div className="text-center mb-5">
          <span
            className="px-4 py-2 rounded-pill"
            style={{
              backgroundColor: "#f7dbe2",
              color: "#9b4d5d",
              fontWeight: "700",
            }}
          >
            Administración Lumiskin
          </span>

          <h1
            className="mt-4"
            style={{
              color: "#4b2b32",
              fontWeight: "900",
            }}
          >
            Panel de Administración
          </h1>

          <p className="text-muted">
            Gestiona productos, usuarios y analiza el rendimiento de tu tienda.
          </p>
        </div>

        {cargando && (
          <div className="text-center mb-4">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="text-muted mt-2">Cargando panel...</p>
          </div>
        )}

        {/* TARJETAS PRINCIPALES */}
        <div className="row g-4 justify-content-center">
          {/* TARJETA PRODUCTOS */}
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 rounded-4 shadow-sm h-100">
              <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                <div>
                  <h3 style={{ color: "#61333d", fontWeight: "800" }}>
                    Productos
                  </h3>
                  <p className="text-muted small">
                    Crea, edita, elimina y revisa el stock de la tienda.
                  </p>
                </div>

                <button
                  className="btn w-100 py-2 rounded-pill mt-3"
                  style={{
                    backgroundColor: "#c46a7a",
                    color: "white",
                    fontWeight: "700",
                  }}
                  onClick={() => navigate("/inventario")}
                >
                  Ir a productos
                </button>
              </div>
            </div>
          </div>

          {/* TARJETA USUARIOS */}
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 rounded-4 shadow-sm h-100">
              <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                <div>
                  <h3 style={{ color: "#4b2b32", fontWeight: "800" }}>
                    Usuarios
                  </h3>
                  <p className="text-muted small">
                    Ver clientes, asignar roles y administrar estados.
                  </p>
                </div>

                <button
                  className="btn w-100 py-2 rounded-pill mt-3"
                  style={{
                    backgroundColor: "#fff",
                    color: "#c46a7a",
                    fontWeight: "700",
                    border: "1px solid #e8b8c2",
                  }}
                  onClick={() => navigate("/admin/usuarios")}
                >
                  Administrar usuarios
                </button>
              </div>
            </div>
          </div>

          {/* TARJETA ÓRDENES */}
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 rounded-4 shadow-sm h-100">
              <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                <div>
                  <h3 style={{ color: "#4b2b32", fontWeight: "800" }}>
                    Órdenes
                  </h3>
                  <p className="text-muted small">
                    Revisa el historial de compras y detalles de boletas.
                  </p>
                </div>

                <button
                  className="btn w-100 py-2 rounded-pill mt-3"
                  style={{
                    backgroundColor: "#fff",
                    color: "#c46a7a",
                    fontWeight: "700",
                    border: "1px solid #e8b8c2",
                  }}
                  onClick={() => navigate("/admin/ordenes")}
                >
                  Ver órdenes
                </button>
              </div>
            </div>
          </div>

          {/* TARJETA ESTADÍSTICAS */}
          <div className="col-md-6 col-lg-3">
            <div
              className="card border-0 rounded-4 shadow-sm h-100"
              style={{ border: "2px solid #f7dbe2" }}
            >
              <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                <div>
                  <h3 style={{ color: "#4b2b32", fontWeight: "800" }}>
                    Estadísticas
                  </h3>

                  <p className="text-muted small mb-1">
                    Métricas y gráficos de la tienda.
                  </p>

                  <span className="badge bg-light text-success border px-2 py-1 mb-2 fs-6">
                    Total: ${formatearPrecio(totalVendido)}
                  </span>
                </div>

                <button
                  className="btn w-100 py-2 rounded-pill mt-3"
                  style={{
                    backgroundColor: "#c46a7a",
                    color: "white",
                    fontWeight: "700",
                  }}
                  onClick={() => navigate("/admin/estadisticas")}
                >
                  Ver gráficos
                </button>
              </div>
            </div>
          </div>

          {/* TARJETA FORMULARIO DE CONTACTO */}
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 rounded-4 shadow-sm h-100">
              <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                <div>
                  <h3 style={{ color: "#4b2b32", fontWeight: "800" }}>
                    Contacto
                  </h3>

                  <p className="text-muted small">
                    Revisa los mensajes enviados desde el formulario de contacto.
                  </p>
                </div>

                <button
                  className="btn w-100 py-2 rounded-pill mt-3"
                  style={{
                    backgroundColor: "#fff",
                    color: "#c46a7a",
                    fontWeight: "700",
                    border: "1px solid #e8b8c2",
                  }}
                  onClick={() => navigate("/admin/contactos")}
                >
                  Ver formularios
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}