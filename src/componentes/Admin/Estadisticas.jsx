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
  const [diasFiltro, setDiasFiltro] = useState(30);

  const COLORES_TORTA = ["#c46a7a", "#2a9d8f", "#e9c46a", "#264653", "#e76f51"];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
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
  // LÓGICA GRÁFICO DE BARRAS: Agrupación dinámica inteligente
  // =======================================================
  const datosBarras = useMemo(() => {
    if (boletas.length === 0) return [];

    const historial = [];
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);

    if (diasFiltro <= 30) {
      for (let i = diasFiltro - 1; i >= 0; i--) {
        const d = new Date(hoy);
        d.setDate(d.getDate() - i);
        historial.push({
          fechaInicio: new Date(d.setHours(0, 0, 0, 0)).getTime(),
          fechaFin: new Date(d.setHours(23, 59, 59, 999)).getTime(),
          etiqueta: d.toLocaleDateString("es-CL", { day: "2-digit", month: "short" }),
          ventas: 0,
        });
      }
    } else if (diasFiltro === 90) {
      for (let i = 11; i >= 0; i--) {
        const fin = new Date(hoy);
        fin.setDate(fin.getDate() - (i * 7));
        fin.setHours(23, 59, 59, 999);
        const inicio = new Date(fin);
        inicio.setDate(inicio.getDate() - 6);
        inicio.setHours(0, 0, 0, 0);
        
        historial.push({
          fechaInicio: inicio.getTime(),
          fechaFin: fin.getTime(),
          etiqueta: `${inicio.getDate()} ${inicio.toLocaleDateString("es-CL", { month: "short" })}`,
          ventas: 0,
        });
      }
    } else {
      const meses = diasFiltro === 180 ? 6 : 12;
      for (let i = meses - 1; i >= 0; i--) {
        const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
        const fin = new Date(hoy.getFullYear(), hoy.getMonth() - i + 1, 0, 23, 59, 59, 999);
        historial.push({
          fechaInicio: d.getTime(),
          fechaFin: fin.getTime(),
          etiqueta: d.toLocaleDateString("es-CL", { month: "short", year: "2-digit" }),
          ventas: 0,
        });
      }
    }

    boletas.forEach((b) => {
      const fechaBoleta = new Date(b.fechaPago || b.fecha).getTime();
      if (isNaN(fechaBoleta)) return;

      const periodoCorrespondiente = historial.find(
        (h) => fechaBoleta >= h.fechaInicio && fechaBoleta <= h.fechaFin
      );

      if (periodoCorrespondiente) {
        periodoCorrespondiente.ventas += Number(b.total || 0);
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
  // RESUMEN RÁPIDO SUPERIOR Y MÉTRICAS EXACTAS
  // =======================================================
  const totalRango = datosBarras.reduce((acc, curr) => acc + curr.ventas, 0);
  
  // Calcula TODAS las unidades vendidas en el periodo, no solo el top 5
  const totalProductosVendidos = boletas.reduce((acc, b) => {
    const fecha = new Date(b.fechaPago || b.fecha);
    const limite = new Date();
    limite.setDate(limite.getDate() - diasFiltro);
    limite.setHours(0,0,0,0);
    
    if (fecha >= limite && b.boleta?.detalles) {
      return acc + b.boleta.detalles.reduce((sum, det) => sum + Number(det.cantidad || 0), 0);
    }
    return acc;
  }, 0);
  
  const cantidadBoletasRango = boletas.filter(b => {
    const fecha = new Date(b.fechaPago || b.fecha);
    const limite = new Date();
    limite.setDate(limite.getDate() - diasFiltro);
    limite.setHours(0,0,0,0);
    return fecha >= limite;
  }).length;

  const ticketPromedio = cantidadBoletasRango > 0 ? Math.round(totalRango / cantidadBoletasRango) : 0;

  // =======================================================
  // ICONOS SVG
  // =======================================================
  const IconoIngresos = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );

  const IconoTicket = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path>
      <line x1="16" y1="8" x2="16" y2="8.01"></line>
      <line x1="8" y1="8" x2="12" y2="8"></line>
      <line x1="16" y1="16" x2="16" y2="16.01"></line>
      <line x1="8" y1="16" x2="12" y2="16"></line>
      <line x1="16" y1="12" x2="16" y2="12.01"></line>
      <line x1="8" y1="12" x2="12" y2="12"></line>
    </svg>
  );

  const IconoPaquete = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );

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
            <p className="text-muted mb-0">Rendimiento de la tienda y flujos de venta.</p>
          </div>

          <div className="d-flex align-items-center gap-3">
            <select
              className="form-select rounded-pill shadow-sm border-0"
              style={{ width: "auto", fontWeight: "600", color: "#4b2b32", cursor: "pointer" }}
              value={diasFiltro}
              onChange={(e) => setDiasFiltro(Number(e.target.value))}
            >
              <option value={7}>Últimos 7 días</option>
              <option value={15}>Últimos 15 días</option>
              <option value={30}>Último mes</option>
              <option value={90}>Últimos 3 meses</option>
              <option value={180}>Últimos 6 meses</option>
              <option value={365}>Último año</option>
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
            <p className="mt-3 text-muted">Procesando métricas...</p>
          </div>
        ) : (
          <>
            {/* MINI RESUMEN DE 3 TARJETAS */}
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card border-0 rounded-4 shadow-sm p-4 d-flex flex-row align-items-center gap-3 h-100">
                  <div className="p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: "#f7dbe2", color: "#9b4d5d", width: "60px", height: "60px" }}>
                    <IconoIngresos />
                  </div>
                  <div>
                    <p className="text-muted mb-0 small fw-bold text-uppercase">Ingresos Totales</p>
                    <h3 className="m-0" style={{ color: "#c46a7a", fontWeight: "900" }}>
                      ${formatearPrecio(totalRango)}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 rounded-4 shadow-sm p-4 d-flex flex-row align-items-center gap-3 h-100">
                  <div className="p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: "#e2f2e9", color: "#2a9d8f", width: "60px", height: "60px" }}>
                    <IconoTicket />
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
                  <div className="p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: "#fdf3d8", color: "#e9c46a", width: "60px", height: "60px" }}>
                    <IconoPaquete />
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
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="m-0" style={{ color: "#4b2b32", fontWeight: "800" }}>
                      Flujo de ingresos
                    </h4>
                    <span className="badge rounded-pill bg-light text-muted border">
                      {diasFiltro <= 30 ? "Diario" : diasFiltro === 90 ? "Semanal" : "Mensual"}
                    </span>
                  </div>
                  
                  <div style={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer>
                      <BarChart data={datosBarras} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="etiqueta" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis 
                          tickFormatter={(val) => `$${(val / 1000)}k`} 
                          tick={{ fill: "#888", fontSize: 12 }} 
                          axisLine={false} 
                          tickLine={false} 
                          dx={-10}
                        />
                        <Tooltip 
                          formatter={(value) => [`$${formatearPrecio(value)}`, "Ventas"]}
                          cursor={{ fill: "#fcf4f6" }}
                          contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        />
                        <Bar dataKey="ventas" fill="#c46a7a" radius={[6, 6, 0, 0]} barSize={diasFiltro > 30 ? 50 : 30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* TORTA: TOP PRODUCTOS */}
              <div className="col-lg-5">
                <div className="card border-0 rounded-4 shadow-sm h-100 p-4">
                  <h4 className="mb-4" style={{ color: "#4b2b32", fontWeight: "800" }}>
                    Productos más vendidos
                  </h4>
                  {datosTorta.length === 0 ? (
                    <div className="d-flex h-100 align-items-center justify-content-center">
                      <p className="text-muted">No hay ventas en este rango de tiempo.</p>
                    </div>
                  ) : (
                    <div style={{ width: "100%", height: 420 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={datosTorta}
                            cx="50%"
                            cy="35%"
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
                            formatter={(value, name) => [`${value} unidades`, name]}
                            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                          />
                          <Legend 
                            layout="vertical"
                            verticalAlign="bottom"
                            align="center"
                            height={150}
                            wrapperStyle={{ 
                              fontSize: "13px", 
                              color: "#4b2b32", 
                              lineHeight: "1.8",
                              paddingTop: "20px"
                            }}
                          />
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