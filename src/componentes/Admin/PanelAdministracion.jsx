import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function PanelAdministracion() {
  const navigate = useNavigate();

  const [boletas, setBoletas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);

    try {
      const resPagos = await fetch("https://backend-pago.onrender.com/api/pagos");
      if (resPagos.ok) {
        const dataPagos = await resPagos.json();
        setBoletas(Array.isArray(dataPagos) ? dataPagos : []);
      }

      const resUsuarios = await fetch("https://backend-usuario.onrender.com/api/usuarios");
      if (resUsuarios.ok) {
        const dataUsuarios = await resUsuarios.json();
        setUsuarios(Array.isArray(dataUsuarios) ? dataUsuarios : []);
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

  const ventasSemanaPorDia = () => {
    const dias = {
      lunes: 0,
      martes: 0,
      miercoles: 0,
      jueves: 0,
      viernes: 0,
      sabado: 0,
      domingo: 0,
    };

    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    const diaActual = hoy.getDay();
    const diferencia = diaActual === 0 ? 6 : diaActual - 1;
    inicioSemana.setDate(hoy.getDate() - diferencia);
    inicioSemana.setHours(0, 0, 0, 0);

    boletas.forEach((boleta) => {
      const fecha = new Date(boleta.fechaCreacion || boleta.fecha);
      if (isNaN(fecha)) return;

      if (fecha >= inicioSemana && fecha <= hoy) {
        const dia = fecha.getDay();

        const nombresDias = [
          "domingo",
          "lunes",
          "martes",
          "miercoles",
          "jueves",
          "viernes",
          "sabado",
        ];

        const nombreDia = nombresDias[dia];
        dias[nombreDia] += Number(boleta.total || 0);
      }
    });

    return dias;
  };

  const ventasPorAnio = () => {
    const resumen = {};

    boletas.forEach((boleta) => {
      const fecha = new Date(boleta.fechaCreacion || boleta.fecha);
      if (isNaN(fecha)) return;

      const anio = fecha.getFullYear();
      resumen[anio] = (resumen[anio] || 0) + Number(boleta.total || 0);
    });

    return resumen;
  };

  const totalVendido = boletas.reduce(
    (total, boleta) => total + Number(boleta.total || 0),
    0
  );

  const ventasSemana = ventasSemanaPorDia();
  const ventasAnuales = ventasPorAnio();

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
            Gestiona productos, usuarios y revisa las ventas de la tienda.
          </p>
        </div>

        {cargando && (
          <div className="alert alert-info text-center">
            Cargando información del panel...
          </div>
        )}

        {/* TARJETAS PRINCIPALES */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card border-0 rounded-4 shadow-sm h-100">
              <div className="card-body p-4 text-center">
                <h3 style={{ color: "#61333d", fontWeight: "800" }}>
                  Productos
                </h3>
                <p className="text-muted">
                  Crear, editar, eliminar y revisar stock.
                </p>

                <button
                  className="btn w-100 py-3 rounded-pill"
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

          <div className="col-md-4">
            <div className="card border-0 rounded-4 shadow-sm h-100">
              <div className="card-body p-4 text-center">
                <h3 style={{ color: "#4b2b32", fontWeight: "800" }}>
                  Usuarios
                </h3>
                <p className="text-muted">
                  Ver clientes, administradores y estados.
                </p>

                <button
                  className="btn w-100 py-3 rounded-pill"
                  style={{
                    backgroundColor: "#c46a7a",
                    color: "#ffffff",
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

        <div className="col-md-3">
            <div className="card border-0 rounded-4 shadow-sm h-100">
            <div className="card-body p-4 text-center">
                <h3 style={{ color: "#4b2b32", fontWeight: "800" }}>
                Órdenes
                </h3>
                <p className="text-muted">
                Revisar compras, pagos y boletas.
                </p>

                <button
                className="btn w-100 py-3 rounded-pill"
                style={{
                    backgroundColor: "#c46a7a",
                    color: "#ffffff",
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

          <div className="col-md-4">
            <div className="card border-0 rounded-4 shadow-sm h-100">
              <div className="card-body p-4 text-center">
                <h3 style={{ color: "#4b2b32", fontWeight: "800" }}>
                  Total vendido
                </h3>

                <h2 style={{ color: "#c46a7a", fontWeight: "900" }}>
                  ${formatearPrecio(totalVendido)}
                </h2>

                <p className="text-muted mb-0">
                  Total acumulado según boletas registradas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ESTADÍSTICAS SEMANALES */}
        <div className="card border-0 rounded-4 shadow-sm mb-4">
          <div className="card-body p-4">
            <h2 style={{ color: "#4b2b32", fontWeight: "800" }}>
              Ventas de la semana por día
            </h2>

            <p className="text-muted">
              Resumen de ventas desde lunes hasta hoy.
            </p>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Total vendido</th>
                    <th>Visual</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.entries(ventasSemana).map(([dia, totalDia]) => (
                    <tr key={dia}>
                      <td className="text-capitalize fw-bold">{dia}</td>
                      <td>${formatearPrecio(totalDia)}</td>
                      <td style={{ width: "45%" }}>
                        <div
                          style={{
                            height: "14px",
                            backgroundColor: "#f7dbe2",
                            borderRadius: "999px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${Math.min(
                                totalVendido > 0
                                  ? (totalDia / totalVendido) * 100
                                  : 0,
                                100
                              )}%`,
                              backgroundColor: "#c46a7a",
                              borderRadius: "999px",
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ESTADÍSTICAS ANUALES */}
        <div className="card border-0 rounded-4 shadow-sm mb-4">
          <div className="card-body p-4">
            <h2 style={{ color: "#4b2b32", fontWeight: "800" }}>
              Ventas por año
            </h2>

            <p className="text-muted">
              Resumen anual de ventas registradas.
            </p>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Año</th>
                    <th>Total vendido</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.keys(ventasAnuales).length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center text-muted">
                        No hay ventas registradas.
                      </td>
                    </tr>
                  ) : (
                    Object.entries(ventasAnuales).map(([anio, totalAnio]) => (
                      <tr key={anio}>
                        <td className="fw-bold">{anio}</td>
                        <td>${formatearPrecio(totalAnio)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}