import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Users,
  ReceiptText,
  BarChart3,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react";
import "./PanelAdministracion.css";

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
      const resPagos = await fetch("https://backend-pago.onrender.com/api/pagos");

      if (resPagos.ok) {
        const dataPagos = await resPagos.json();

        const pagos = Array.isArray(dataPagos) ? dataPagos : [];

const hoy = new Date();
const limite = new Date();
limite.setDate(hoy.getDate() - 7);
limite.setHours(0, 0, 0, 0);

const totalUltimos7Dias = pagos
  .filter((pago) => {
    const fecha = new Date(
      pago.fechaPago ||
      pago.fecha ||
      pago.fechaEmision ||
      pago.boleta?.fechaEmision
    );

    return !isNaN(fecha) && fecha >= limite;
  })
  .reduce((acc, pago) => {
    const totalPago =
      Number(pago.total || 0) ||
      Number(pago.monto || 0) ||
      Number(pago.totalPago || 0) ||
      Number(pago.boleta?.total || 0);

    return acc + totalPago;
  }, 0);

setTotalVendido(totalUltimos7Dias);
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

  const opcionesPanel = [
    {
      titulo: "Productos",
      descripcion: "Crea, edita, elimina y revisa el stock de la tienda.",
      boton: "Ir a productos",
      ruta: "/inventario",
      icono: <Package size={28} />,
      destacado: true,
    },
    {
      titulo: "Usuarios",
      descripcion: "Ver clientes, asignar roles y administrar estados.",
      boton: "Administrar usuarios",
      ruta: "/admin/usuarios",
      icono: <Users size={28} />,
    },
    {
      titulo: "Órdenes",
      descripcion: "Revisa el historial de compras y detalles de boletas.",
      boton: "Ver órdenes",
      ruta: "/admin/ordenes",
      icono: <ReceiptText size={28} />,
    },
    {
      titulo: "Estadísticas",
      descripcion: "Métricas, ventas y gráficos de la tienda.",
      boton: "Ver gráficos",
      ruta: "/admin/estadisticas",
      icono: <BarChart3 size={28} />,
      destacado: true,
      extra: `Total vendido: $${formatearPrecio(totalVendido)}`,
    },
    {
      titulo: "Contacto",
      descripcion: "Revisa los mensajes enviados desde el formulario de contacto.",
      boton: "Ver formularios",
      ruta: "/admin/contactos",
      icono: <Mail size={28} />,
    },
  ];

  return (
    <main className="admin-page">
      <div className="container py-5">
        <section className="admin-hero">
          <div>
            <span className="admin-badge">Administración Lumiskin</span>

            <h1>Panel de Administración</h1>

            <p>
              Gestiona productos, usuarios, órdenes, formularios y estadísticas
              generales de tu tienda.
            </p>
          </div>

          <div className="admin-total-card">
            <span>Ingresos últimos 7 días</span>

            {cargando ? (
              <div className="admin-loading">
                <Loader2 size={22} className="spin" />
                Cargando...
              </div>
            ) : (
              <strong>${formatearPrecio(totalVendido)}</strong>
            )}
          </div>
        </section>

        <section className="row g-4 mt-2">
          {opcionesPanel.map((item) => (
            <div className="col-md-6 col-lg-4" key={item.titulo}>
              <article
                className={`admin-card ${item.destacado ? "destacada" : ""}`}
              >
                <div>
                  <div className="admin-icon">{item.icono}</div>

                  <h3>{item.titulo}</h3>

                  <p>{item.descripcion}</p>

                  {item.extra && <span className="admin-extra">{item.extra}</span>}
                </div>

                <button
                  className={item.destacado ? "admin-btn primary" : "admin-btn"}
                  onClick={() => navigate(item.ruta)}
                >
                  {item.boton}
                  <ArrowRight size={18} />
                </button>
              </article>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}