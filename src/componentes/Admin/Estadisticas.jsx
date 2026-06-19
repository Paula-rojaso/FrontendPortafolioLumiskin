import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export function Estadisticas() {
  const navigate = useNavigate();
  const [boletas, setBoletas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [diasFiltro, setDiasFiltro] = useState(7); // 7, 15 o 30 días

  // Paleta de colores contrastantes y elegantes
  const COLORES_TORTA = ["#c46a7a", "#2a9d8f", "#e9c46a", "#264653", "#e76f51"];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Volvemos a hacer solo 1 petición rápida
      const res = await fetch("https://backend-pago.onrender.com/api/pagos");
      if (res.ok) {
        const data = await res.json();
        setBoletas(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error cargando boletas:", error);
    } finally {
      setCargando(false);
    }
  };

  const formatearPrecio = (valor) => {
    return Number(valor || 0).toLocaleString("es-CL");
  };

  // =======================================================
  // LÓGICA GRÁFICO DE BARRAS: Ventas por día
  // =======================================================
  const datosBarras = useMemo(() => {
    if (boletas.length === 0) return [];

    const historial = [];
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);

    for (let i = diasFiltro - 1; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(d.getDate() - i);
      const fechaStr = d.toISOString().split("T")[0]; 
      
      historial.push({
        fechaPura: fechaStr,
        dia: d.toLocaleDateString("es-CL", { day: "2-digit", month: "short" }),
        ventas: 0,
      });
    }

    boletas.forEach((b) => {
      const fechaBoleta = new Date(b.fechaPago || b.fecha);
      if (isNaN(fechaBoleta)) return;

      const fechaStr = fechaBoleta.toISOString().split("T")[0];
      const diaObjetivo = historial.find((h) => h.fechaPura === fechaStr);
      
      if (diaObjetivo) {
        diaObjetivo.ventas += Number(b.total || 0);
      }
    });

    return historial;
  }, [boletas, diasFiltro]);

  // =======================================================
  // LÓGICA GRÁFICO DE TORTA: Top 5 Productos
  // =======================================================
  const datosTorta = useMemo(() => {
    if (boletas.length === 0) return [];

    const conteoProductos = {};
    const limiteFecha = new Date();
    limiteFecha.setDate(limiteFecha.getDate() - diasFiltro);
    limiteFecha.setHours(0, 0, 0, 0);

    boletas.forEach((b) => {
      const fechaBoleta = new Date(b.fechaPago || b.fecha);
      
      if (fechaBoleta >= limiteFecha) {
        b.boleta?.detalles?.forEach((det) => {
          const nombre = det.producto || "Desconocido";
          conteoProductos[nombre] = (conteoProductos[nombre] || 0) + Number(det.cantidad);
        });
      }
    });

    const ranking = Object.keys(conteoProductos).map((key) => ({
      name: key,
      value: conteoProductos[key],
    }));

    ranking.sort((a, b) => b.value - a.value);
    return ranking.slice(0, 5);
  }, [boletas, diasFiltro]);

  // =======================================================
  // RESUMEN RÁPIDO SUPERIOR Y TICKET PROMEDIO
  // =======================================================
  const totalRango = datosBarras.reduce((acc, curr) => acc + curr.ventas, 0);
  const totalProductosVendidos = datosTorta.reduce((acc, curr) => acc + curr.value, 0);
  
  // Cálculo instantáneo en el frontend sin llamar al backend
  const cantidadBoletasRango = boletas.filter(b => {
    const fecha = new Date(b.fechaPago || b.fecha);
    const limite = new Date();
    limite.setDate(limite.getDate() - diasFiltro);
    limite.setHours(0,0,0,0);
    return fecha >= limite;
  }).length;

  const ticketPromedio = cantidadBoletasRango > 0 ? Math.round(totalRango / cantidadBoletasRango) : 0;

  return (
    <main
      className="py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff7f9 0%, #f8eef2 45%, #fffdfb 100%)",
      }}
    >
      <div className="container">
        {/* ENCABEZADO Y CONTROLES */}
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <div>
            <h1 style={{ color: "#4b2b32", fontWeight: "900" }}>Estadísticas</h1>
            <p className="text-muted mb-0">Rendimiento de la tienda en tiempo real.</p>
          </div>

          <div className="d-flex align-items-center gap-3">
            <select
              className="form-select rounded-pill shadow-sm border-0"
              style={{ width: "auto", fontWeight: "600", color: "#4b2b32" }}
              value={diasFiltro}
              onChange={(e) => setDiasFiltro(Number(e.target.value))}
            >
              <option value={7}>Últimos 7 días</option>
              <option value={15}>Últimos 15 días</option>
              <option value={30}>Último mes</option>
            </select>

            <button
              className="btn rounded-pill px-4 py-2"
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

        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: "#c46a7a" }}></div>
            <p className="mt-3 text-muted">Procesando gráficos...</p>
          </div>
        ) : (
          <>
            {/* MINI RESUMEN DE 3 TARJETAS */}
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card border-0 rounded-4 shadow-sm p-4 d-flex flex-row align-items-center gap-3 h-100">
                  <div className="p-3 rounded-circle" style={{ backgroundColor: "#f7dbe2", color: "#9b4d5d" }}>
                    💰
                  </div>
                  <div>
                    <p className="text-muted mb-0 small fw-bold text-uppercase">Ingresos ({diasFiltro}d)</p>
                    <h3 className="m-0" style={{ color: "#c46a7a", fontWeight: "900" }}>
                      ${formatearPrecio(totalRango)}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 rounded-4 shadow-sm p-4 d-flex flex-row align-items-center gap-3 h-100">
                  <div className="p-3 rounded-circle" style={{ backgroundColor: "#e2f2e9", color: "#2a9d8f" }}>
                    🧾
                  </div>
                  <div>
                    <p className="text-muted mb-0 small fw-bold text-uppercase">Boleta Promedio</p>
                    <h3 className="m-0" style={{ color: "#264653", fontWeight: "900" }}>
                      ${formatearPrecio(ticketPromedio)}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 rounded-4 shadow-sm p-4 d-flex flex-row align-items-center gap-3 h-100">
                  <div className="p-3 rounded-circle" style={{ backgroundColor: "#fdf3d8", color: "#e9c46a" }}>
                    📦
                  </div>
                  <div>
                    <p className="text-muted mb-0 small fw-bold text-uppercase">Unidades Vendidas</p>
                    <h3 className="m-0" style={{ color: "#4b2b32", fontWeight: "900" }}>
                      {totalProductosVendidos} u.
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* GRÁFICOS */}
            <div className="row g-4">
              {/* BARRAS: VENTAS EN EL TIEMPO */}
              <div className="col-lg-7">
                <div className="card border-0 rounded-4 shadow-sm h-100 p-4">
                  <h4 className="mb-4" style={{ color: "#4b2b32", fontWeight: "800" }}>
                    Ingresos diarios
                  </h4>
                  <div style={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer>
                      <BarChart data={datosBarras} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="dia" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis 
                          tickFormatter={(val) => `$${(val / 1000)}k`} 
                          tick={{ fill: "#888", fontSize: 12 }} 
                          axisLine={false} 
                          tickLine={false} 
                        />
                        <Tooltip 
                          formatter={(value) => [`$${formatearPrecio(value)}`, "Ventas"]}
                          cursor={{ fill: "#fcf4f6" }}
                          contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        />
                        <Bar dataKey="ventas" fill="#c46a7a" radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* TORTA: TOP PRODUCTOS */}
              <div className="col-lg-5">
                <div className="card border-0 rounded-4 shadow-sm h-100 p-4">
                  <h4 className="mb-4" style={{ color: "#4b2b32", fontWeight: "800" }}>
                    Top 5 Productos
                  </h4>
                  {datosTorta.length === 0 ? (
                    <div className="d-flex h-100 align-items-center justify-content-center">
                      <p className="text-muted">No hay ventas en este rango de tiempo.</p>
                    </div>
                  ) : (
                    <div style={{ width: "100%", height: 350 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={datosTorta}
                            cx="50%"
                            cy="45%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {datosTorta.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORES_TORTA[index % COLORES_TORTA.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value} unidades`, "Vendidos"]}
                            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                          />
                          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "12px", color: "#4b2b32" }}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}