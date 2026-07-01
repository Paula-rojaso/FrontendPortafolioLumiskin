import { useEffect, useState } from "react";
import { useCarrito } from "../Carrito/ContextCarrito";
import "./UltimosProductos.css";

// ------------------------------------------------------------------
// COMPONENTE SECUNDARIO: TARJETA INDIVIDUAL
// ------------------------------------------------------------------
function TarjetaProducto({ p, categorias, mostrarMensaje }) {
  const { agregarProducto } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const [estadoBoton, setEstadoBoton] = useState("normal"); 

  const categoria = categorias.find((c) => c.id === (p.categoria?.id || p.categoria_id));
  const nombreCategoria = categoria ? categoria.nombre : "Destacado";

  const handleSumar = () => { if (cantidad < p.stock) setCantidad(c => c + 1); };
  const handleRestar = () => { if (cantidad > 1) setCantidad(c => c - 1); };

  const handleAgregar = (e, desdeModal = false) => {
    if (e) e.stopPropagation();

    if (p.stock === 0) {
      mostrarMensaje("❌ Producto agotado temporalmente", "error");
      return;
    }

    const cantAAgregar = desdeModal ? cantidad : 1;
    setEstadoBoton("cargando");

    setTimeout(() => {
      agregarProducto(p, cantAAgregar);
      
      setEstadoBoton("exito");
      mostrarMensaje(`🛒 ${cantAAgregar} unid. de ${p.nombre} por $${(p.precio * cantAAgregar).toLocaleString()} CLP`);

      setTimeout(() => {
        setEstadoBoton("normal");
        if (desdeModal) {
          const modalEl = document.getElementById(`modal${p.id}`);
          const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
          setCantidad(1); 
        }
      }, 1000);
    }, 600);
  };

  const IconoCarrito = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
  );

  const IconoCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="me-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
  );

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      {/* TARJETA PRINCIPAL EN VITRINA */}
      <div className="card product-card h-100 border-0 shadow-sm d-flex flex-column">
        
        <div 
          className="clickable-area"
          data-bs-toggle="modal"
          data-bs-target={`#modal${p.id}`}
        >
          <div className="img-container">
            {p.imagenUrl ? (
              <img src={p.imagenUrl} alt={p.nombre} />
            ) : (
              <span className="text-muted small">Sin imagen</span>
            )}
          </div>

          <div className="card-body pb-0 text-center">
            {/* Color de categoría igualado al modal (#c46a7a) */}
            <span className="text-uppercase fw-bold mb-1 d-block" style={{ fontSize: "10px", letterSpacing: "1px", color: "#c46a7a" }}>
              {nombreCategoria}
            </span>
            
            <h6 className="card-title text-dark fw-bold mb-2" style={{ height: "40px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {p.nombre}
            </h6>
          </div>
        </div>

        {/* Zona inferior de la tarjeta */}
        <div className="card-body pt-2 mt-auto d-flex flex-column align-items-center">
          {/* Precio SIN el CLP, manteniendo color verde */}
          <div className="mb-3">
            <span className="fs-5 fw-bolder" style={{ color: "#2a9d8f" }}>
              ${Number(p.precio).toLocaleString()}
            </span>
          </div>

          <button
            className={`btn w-100 fw-bold rounded-3 d-flex align-items-center justify-content-center shadow-sm ${estadoBoton === 'exito' ? 'btn-success' : ''}`}
            style={{ 
              backgroundColor: estadoBoton === 'exito' ? '#2a9d8f' : '#c46a7a',
              color: '#fff',
              transition: 'all 0.3s ease'
            }}
            onClick={(e) => handleAgregar(e, false)}
            disabled={estadoBoton !== "normal" || p.stock === 0}
          >
            {estadoBoton === "cargando" ? (
              <><span className="spinner-border spinner-border-sm me-2"></span> Agregando...</>
            ) : estadoBoton === "exito" ? (
              <><IconoCheck /> ¡Agregado!</>
            ) : p.stock === 0 ? (
              "Agotado"
            ) : (
              <><IconoCarrito /> Agregar</>
            )}
          </button>
        </div>
      </div>

      {/* MODAL DETALLE PREMIUM (Dos columnas) */}
      <div className="modal fade" id={`modal${p.id}`} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
            <button type="button" className="btn-close position-absolute top-0 end-0 m-3 z-3" data-bs-dismiss="modal" style={{ backgroundColor: "#fff", padding: "10px", borderRadius: "50%", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}></button>
            
            <div className="row g-0">
              <div className="col-md-5 bg-white d-flex align-items-center justify-content-center p-4 border-end" style={{ minHeight: "350px" }}>
                <img src={p.imagenUrl || "/sin-imagen.png"} alt={p.nombre} className="img-fluid" style={{ maxHeight: "300px", objectFit: "contain" }} />
              </div>

              <div className="col-md-7 p-4 p-md-5 d-flex flex-column justify-content-center" style={{ background: "linear-gradient(135deg, #fffcfd 0%, #fff 100%)" }}>
                
                <span className="text-uppercase fw-bold mb-2" style={{ fontSize: "12px", letterSpacing: "1px", color: "#c46a7a" }}>
                  {nombreCategoria}
                </span>
                
                <h3 className="fw-bolder mb-3" style={{ color: "#4b2b32", lineHeight: "1.2" }}>
                  {p.nombre}
                </h3>
                
                <h4 className="fw-bold mb-4" style={{ color: "#2a9d8f" }}>
                  ${Number(p.precio).toLocaleString()} CLP
                </h4>
                
                <p className="text-secondary mb-4" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                  {p.descripcion}
                </p>

                <div className="mt-auto">
                  {p.stock === 0 ? (
                    <div className="alert alert-danger fw-bold border-0 text-center rounded-3">
                      ❌ Producto agotado temporalmente
                    </div>
                  ) : (
                    <>
                      <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                        <span className="text-muted fw-semibold small">Cantidad:</span>
                        
                        <div className="qty-selector shadow-sm">
                          <button type="button" className="qty-btn" onClick={handleRestar} disabled={cantidad <= 1}>-</button>
                          <input type="text" className="qty-input bg-white" value={cantidad} readOnly />
                          <button type="button" className="qty-btn" onClick={handleSumar} disabled={cantidad >= p.stock}>+</button>
                        </div>
                        
                        <span className="text-muted small ms-2">
                          (Disponibles: {p.stock})
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-3" style={{ backgroundColor: "#f9f1f3" }}>
                        <span className="fw-bold text-secondary">Subtotal:</span>
                        <span className="fs-5 fw-bolder" style={{ color: "#4b2b32" }}>
                          ${(p.precio * cantidad).toLocaleString()}
                        </span>
                      </div>

                      <button
                        className={`btn w-100 py-3 fw-bold fs-6 rounded-3 d-flex align-items-center justify-content-center shadow-sm ${estadoBoton === 'exito' ? 'btn-success' : ''}`}
                        style={{ 
                          backgroundColor: estadoBoton === 'exito' ? '#2a9d8f' : '#c46a7a', 
                          color: '#fff',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={(e) => handleAgregar(e, true)}
                        disabled={estadoBoton !== "normal"}
                      >
                        {estadoBoton === "cargando" ? (
                          <><span className="spinner-border spinner-border-sm me-2"></span> Procesando...</>
                        ) : estadoBoton === "exito" ? (
                          <><IconoCheck /> ¡Agregado con éxito!</>
                        ) : (
                          <><IconoCarrito /> Agregar al carrito</>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------------
export function UltimosProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const [resProd, resCat] = await Promise.all([
          fetch("https://backendportafolio-635z.onrender.com/api/productos"),
          fetch("https://backendportafolio-635z.onrender.com/api/categorias"),
        ]);

        const dataProd = await resProd.json();
        const dataCat = await resCat.json();
        setCategorias(dataCat);

        const ultimos = dataProd
          .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
          .slice(0, 4);

        setProductos(ultimos);
      } catch (error) {
        console.error("❌ Error al cargar productos o categorías:", error);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const mostrarMensaje = (texto, tipo = "ok") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000);
  };

  if (cargando) {
    return (
      <div className="container text-center my-5 py-5">
        <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        <h5 className="mt-3 text-muted">Cargando la vitrina...</h5>
      </div>
    );
  }

  return (
    <div className="container my-5 py-4">
      <div className="text-center mb-5">
        <h2 className="fw-black mb-3" style={{ color: "#4b2b32", fontWeight: "900", letterSpacing: "-1px" }}>
          NUEVOS LANZAMIENTOS
        </h2>
        <p className="text-muted fs-5">
          Descubre nuestros productos y encuentra los artículos que están marcando tendencia.
        </p>
      </div>

      {mensaje && (
        <div
          className="toast-mensaje-centro"
          style={{
            backgroundColor: mensaje.tipo === "error" ? "#dc3545" : "#2a9d8f",
          }}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="row g-4 justify-content-center">
        {productos.length === 0 ? (
          <div className="col-12 text-center py-5">
            <h5 className="text-muted">No hay productos disponibles por el momento.</h5>
          </div>
        ) : (
          productos.map((p) => (
            <TarjetaProducto 
              key={p.id} 
              p={p} 
              categorias={categorias} 
              mostrarMensaje={mostrarMensaje} 
            />
          ))
        )}
      </div>
    </div>
  );
}