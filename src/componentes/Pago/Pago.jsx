import { useEffect, useState } from "react";
import { useCarrito } from "../Carrito/ContextCarrito";
import { useNavigate } from "react-router-dom";

export default function Pago() {
  const { carrito, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: "",
    email: "",
    telefono: "",
    region: "",
    comuna: "",
    direccion: "",
    departamento: "",
    infoEnvio: "",
  });

  const [errores, setErrores] = useState({});
  const [comunas, setComunas] = useState([]);
  const [procesando, setProcesando] = useState(false);
  const [advertencia, setAdvertencia] = useState("");

  const [subtotalBackend] = useState(null);
  const [ivaBackend] = useState(null);
  const [totalBackend] = useState(null);

  const comunasPorRegion = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    Tarapacá: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    Antofagasta: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    Atacama: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Huasco", "Freirina", "Alto del Carmen"],
    Coquimbo: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    Valparaíso: ["Valparaíso", "Viña del Mar", "Concón", "Quintero", "Puchuncaví", "Casablanca", "Juan Fernández", "Isla de Pascua", "San Antonio", "Cartagena", "El Quisco", "El Tabo", "Algarrobo", "Santo Domingo", "San Felipe", "Llaillay", "Catemu", "Panquehue", "Putaendo", "Santa María", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "Quillota", "La Cruz", "La Calera", "Hijuelas", "Nogales", "Petorca", "La Ligua", "Cabildo", "Zapallar", "Papudo", "Quilpué", "Villa Alemana", "Limache", "Olmué"],
    "Región Metropolitana": ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Colina", "Lampa", "Tiltil", "Puente Alto", "Pirque", "San José de Maipo", "San Bernardo", "Buin", "Paine", "Calera de Tango", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
    "O'Higgins": ["Rancagua", "Machalí", "Graneros", "Mostazal", "Codegua", "Requínoa", "Rengo", "Malloa", "San Vicente", "Pichidegua", "Peumo", "Las Cabras", "San Fernando", "Chimbarongo", "Nancagua", "Placilla", "Santa Cruz", "Lolol", "Palmilla", "Peralillo", "Paredones", "Pichilemu", "Marchigüe", "Navidad", "Litueche", "La Estrella"],
    Maule: ["Talca", "San Clemente", "Pelarco", "Pencahue", "Maule", "San Rafael", "Curepto", "Constitución", "Empedrado", "Curicó", "Teno", "Romeral", "Molina", "Sagrada Familia", "Hualañé", "Licantén", "Vichuquén", "Linares", "San Javier", "Villa Alegre", "Yerbas Buenas", "Colbún", "Longaví", "Parral", "Retiro"],
    Ñuble: ["Chillán", "Chillán Viejo", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás", "Pemuco", "El Carmen", "Pinto", "Quillón", "Bulnes", "San Ignacio", "Yungay", "Treguaco", "Cobquecura", "Ninhue", "Quirihue", "Portezuelo", "Coelemu", "Ránquil"],
    Biobío: ["Concepción", "Talcahuano", "Hualpén", "Chiguayante", "San Pedro de la Paz", "Coronel", "Lota", "Hualqui", "Santa Juana", "Tomé", "Penco", "Los Ángeles", "Mulchén", "Nacimiento", "Negrete", "Santa Bárbara", "Quilaco", "Quilleco", "Antuco", "Cabrero", "Yumbel", "Tucapel", "Alto Biobío", "Arauco", "Curanilahue", "Lebu", "Los Álamos", "Tirúa", "Cañete", "Contulmo"],
    "La Araucanía": ["Temuco", "Padre Las Casas", "Cunco", "Melipeuco", "Vilcún", "Curacautín", "Lonquimay", "Freire", "Pitrufquén", "Gorbea", "Loncoche", "Villarrica", "Pucón", "Toltén", "Teodoro Schmidt", "Saavedra", "Carahue", "Nueva Imperial", "Galvarino", "Lautaro", "Perquenco", "Victoria", "Traiguén", "Angol", "Purén", "Renaico"],
    "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Río Bueno", "Futrono", "Lago Ranco"],
    "Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Maullín", "Puerto Varas", "Llanquihue", "Fresia", "Frutillar", "Los Muermos", "Osorno", "Río Negro", "Purranque", "San Juan de la Costa", "San Pablo", "Castro", "Ancud", "Quellón", "Dalcahue", "Curaco de Vélez", "Quinchao", "Chonchi"],
    Aysén: ["Coyhaique", "Puerto Aysén", "Cisnes", "Guaitecas", "Aysén", "Lago Verde", "Chile Chico", "Río Ibáñez", "Cochrane", "O'Higgins", "Tortel"],
    Magallanes: ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos", "Laguna Blanca", "Río Verde", "San Gregorio", "Primavera", "Timaukel"],
  };

  const total = carrito.reduce(
    (acc, item) => acc + Number(item.precio || 0) * Number(item.cantidad || 0),
    0
  );
  const iva = Math.round(total * (19 / 119));
  const subtotal = total - iva;

  const validarCampo = (name, value) => {
    let error = "";
    if (name === "nombre" && (!value || value.trim().length < 4))
      error = "El nombre debe tener al menos 4 letras.";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@(gmail\.com|duoc\.cl|profesor\.duoc\.cl)$/i;
      if (!emailRegex.test(value.trim()))
        error = "Correo inválido. Usa gmail.com, duoc.cl o profesor.duoc.cl.";
    }
    if (name === "telefono") {
      const telRegex = /^\d{9,11}$/;
      if (!telRegex.test(value.trim()))
        error = "Teléfono inválido. Debe tener entre 9 y 11 números.";
    }
    if (name === "direccion" && (!value || value.trim().length < 4))
      error = "Completa tu dirección para continuar.";
    if (name === "region" && !value) error = "Selecciona una región.";
    if (name === "comuna" && !value) error = "Selecciona una comuna.";
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdvertencia("");
    setUsuario((prev) => ({ ...prev, [name]: value }));
    const errorMsg = validarCampo(name, value);
    setErrores((prev) => ({ ...prev, [name]: errorMsg }));
    if (name === "region") {
      setComunas(comunasPorRegion[value] || []);
      setUsuario((prev) => ({ ...prev, comuna: "" }));
      setErrores((prev) => ({ ...prev, comuna: "Selecciona una comuna." }));
    }
  };

  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) {
      try {
        const user = JSON.parse(guardado);
        setUsuario((prev) => ({ ...prev, ...user }));
        if (user.region) setComunas(comunasPorRegion[user.region] || []);
      } catch (error) {
        console.error("Error leyendo usuario desde localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const email = localStorage.getItem("email");
        if (!email) return;
        const res = await fetch(`https://backend-usuario.onrender.com/api/usuarios/email/${email}`);
        if (!res.ok) return;
        const user = await res.json();
        setUsuario((prev) => ({ ...prev, ...user }));
        if (user.region) setComunas(comunasPorRegion[user.region] || []);
      } catch (err) {
        console.error("Error cargando usuario:", err);
      }
    }
    cargarDatos();
  }, []);

  const validarTodo = () => {
    const nuevosErrores = {};
    const camposObligatorios = ["nombre", "email", "telefono", "direccion", "region", "comuna"];
    camposObligatorios.forEach((campo) => {
      const error = validarCampo(campo, usuario[campo] || "");
      if (error) nuevosErrores[campo] = error;
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const procesarPago = async () => {
    setAdvertencia("");

    if (carrito.length === 0) {
      setAdvertencia("Agrega productos al carrito antes de confirmar la compra.");
      return;
    }

    if (!validarTodo()) {
      setAdvertencia("Completa tus datos de envío antes de continuar.");
      return;
    }

    try {
      setProcesando(true);

      const user = JSON.parse(localStorage.getItem("usuario"));
      const tokenUsuario = user?.token;

      const headers = { "Content-Type": "application/json" };
      if (tokenUsuario) headers["Authorization"] = `Bearer ${tokenUsuario}`;

      const body = {
        nombreCliente: usuario.nombre,
        correoCliente: usuario.email,
        telefonoCliente: usuario.telefono,
        direccionCliente: usuario.direccion + (usuario.departamento ? " " + usuario.departamento : ""),
        regionCliente: usuario.region,
        comunaCliente: usuario.comuna,
        indicacionesEnvio: usuario.infoEnvio,
        total: total,
        metodoPago: "WEBPAY",
        detalles: carrito.map((item) => ({
          idProducto: item.id,
          producto: item.nombre,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          subtotal: item.precio * item.cantidad,
          imagenUrl: item.imagenUrl || item.foto,
        })),
      };

      const res = await fetch("https://backend-pago.onrender.com/api/webpay/crear", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.url) {
        setAdvertencia("❌ Error creando transacción Webpay");
        setProcesando(false);
        return;
      }

      localStorage.setItem("jwt_pago", data.jwt);
      window.location.href = data.url;

    } catch (err) {
      console.error(err);
      setAdvertencia("Hubo un error procesando el pago. Intenta nuevamente.");
      setProcesando(false);
    }
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
        {procesando && (
          <div
            className="text-center mx-auto p-5 rounded-4 shadow"
            style={{
              maxWidth: "600px",
              background: "rgba(255,255,255,0.92)",
              border: "1px solid #f3d8df",
            }}
          >
            <div
              className="spinner-border mb-4"
              style={{ color: "#c46a7a", width: "3rem", height: "3rem" }}
              role="status"
            ></div>
            <h2 style={{ fontWeight: "bold", color: "#7a3f4b" }}>Procesando pago…</h2>
            <p className="text-muted mt-2">Serás redirigido a WebPay en un momento.</p>
          </div>
        )}

        {!procesando && (
          <>
            <div className="text-center mb-5">
              <span
                className="px-4 py-2 rounded-pill"
                style={{ backgroundColor: "#f7dbe2", color: "#9b4d5d", fontWeight: "600", fontSize: "14px" }}
              >
                Finaliza tu compra
              </span>
              <h1 className="mt-4 mb-2" style={{ fontWeight: "800", color: "#4b2b32", letterSpacing: "-0.5px" }}>
                Checkout Lumiskin
              </h1>
              <p className="text-muted">Revisa tus productos, completa tus datos y confirma tu pedido.</p>
            </div>

            <div className="row g-4">
              <div className="col-lg-8">

                {/* CARRITO */}
                <div className="card border-0 rounded-4 shadow-sm mb-4" style={{ backgroundColor: "rgba(255,255,255,0.95)" }}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h2 className="mb-1" style={{ color: "#4b2b32", fontWeight: "800" }}>Carrito de compra</h2>
                        <p className="text-muted mb-0">Productos seleccionados para tu rutina.</p>
                      </div>
                      <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "#f7dbe2", color: "#9b4d5d" }}>
                        {carrito.length} producto(s)
                      </span>
                    </div>

                    {carrito.length === 0 ? (
                      <div className="text-center py-5">
                        <h5 style={{ color: "#7a3f4b" }}>Tu carrito está vacío</h5>
                        <p className="text-muted">Agrega productos antes de continuar.</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table align-middle">
                          <thead>
                            <tr style={{ color: "#8a5a64" }}>
                              <th>Producto</th>
                              <th className="text-center">Precio</th>
                              <th className="text-center">Cantidad</th>
                              <th className="text-end">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {carrito.map((item) => (
                              <tr key={item.id}>
                                <td>
                                  <div className="d-flex align-items-center gap-3">
                                    <img
                                      src={item.imagenUrl || item.foto}
                                      alt={item.nombre}
                                      style={{ width: 78, height: 78, borderRadius: "18px", objectFit: "cover", border: "1px solid #f1d4dc", backgroundColor: "#fff7f9" }}
                                    />
                                    <div>
                                      <h6 className="mb-1" style={{ fontWeight: "700", color: "#4b2b32" }}>{item.nombre}</h6>
                                      <small className="text-muted">{item.categoria}</small>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-center">${Number(item.precio).toLocaleString("es-CL")}</td>
                                <td className="text-center">
                                  <span className="px-3 py-2 rounded-pill" style={{ backgroundColor: "#fff1f4", color: "#7a3f4b", fontWeight: "700" }}>
                                    {item.cantidad}
                                  </span>
                                </td>
                                <td className="text-end" style={{ fontWeight: "700", color: "#4b2b32" }}>
                                  ${Number(item.precio * item.cantidad).toLocaleString("es-CL")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* INFORMACIÓN DEL CLIENTE */}
                <div className="card border-0 rounded-4 shadow-sm mb-4" style={{ backgroundColor: "rgba(255,255,255,0.95)" }}>
                  <div className="card-body p-4">
                    <h2 className="mb-1" style={{ color: "#4b2b32", fontWeight: "800" }}>Información del cliente</h2>
                    <p className="text-muted mb-4">Estos datos serán utilizados para el envío de tu compra.</p>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Nombre</label>
                        <input
                          className={`form-control rounded-3 ${errores.nombre ? "is-invalid" : usuario.nombre ? "is-valid" : ""}`}
                          name="nombre" value={usuario.nombre} onChange={handleChange} placeholder="Tu nombre"
                        />
                        <div className="invalid-feedback">{errores.nombre}</div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Correo</label>
                        <input
                          className={`form-control rounded-3 ${errores.email ? "is-invalid" : usuario.email ? "is-valid" : ""}`}
                          name="email" value={usuario.email} onChange={handleChange} placeholder="correo@gmail.com"
                        />
                        <div className="invalid-feedback">{errores.email}</div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Teléfono</label>
                        <input
                          className={`form-control rounded-3 ${errores.telefono ? "is-invalid" : usuario.telefono ? "is-valid" : ""}`}
                          name="telefono" value={usuario.telefono} onChange={handleChange} placeholder="912345678"
                        />
                        <div className="invalid-feedback">{errores.telefono}</div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Calle</label>
                        <input
                          className={`form-control rounded-3 ${errores.direccion ? "is-invalid" : usuario.direccion ? "is-valid" : ""}`}
                          name="direccion" value={usuario.direccion} onChange={handleChange} placeholder="Ej: Avenida Siempre Viva 123"
                        />
                        <div className="invalid-feedback">{errores.direccion}</div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Departamento / Casa</label>
                        <input className="form-control rounded-3" name="departamento" value={usuario.departamento} onChange={handleChange} placeholder="Opcional" />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Región</label>
                        <select
                          className={`form-select rounded-3 ${errores.region ? "is-invalid" : usuario.region ? "is-valid" : ""}`}
                          name="region" value={usuario.region} onChange={handleChange}
                        >
                          <option value="">Selecciona región</option>
                          {Object.keys(comunasPorRegion).map((r) => (<option key={r} value={r}>{r}</option>))}
                        </select>
                        <div className="invalid-feedback">{errores.region}</div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Comuna</label>
                        <select
                          className={`form-select rounded-3 ${errores.comuna ? "is-invalid" : usuario.comuna ? "is-valid" : ""}`}
                          name="comuna" value={usuario.comuna} onChange={handleChange}
                        >
                          <option value="">Selecciona comuna</option>
                          {comunas.map((c) => (<option key={c} value={c}>{c}</option>))}
                        </select>
                        <div className="invalid-feedback">{errores.comuna}</div>
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label fw-semibold">Indicaciones adicionales</label>
                        <textarea className="form-control rounded-3" name="infoEnvio" value={usuario.infoEnvio} onChange={handleChange} rows="3" placeholder="Ej: Dejar en conserjería, llamar antes de llegar..." />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RESUMEN */}
              <div className="col-lg-4">
                <div
                  className="card border-0 rounded-4 shadow sticky-top"
                  style={{ top: "20px", background: "linear-gradient(180deg, #ffffff 0%, #fff7f9 100%)", border: "1px solid #f1d4dc" }}
                >
                  <div className="card-body p-4">
                    <h3 className="mb-4" style={{ color: "#4b2b32", fontWeight: "800" }}>Resumen del pedido</h3>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Subtotal</span>
                      <strong>${Number(subtotalBackend !== null ? subtotalBackend : subtotal).toLocaleString("es-CL")}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">IVA 19%</span>
                      <strong>${Number(ivaBackend !== null ? ivaBackend : iva).toLocaleString("es-CL")}</strong>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span style={{ color: "#4b2b32", fontWeight: "800", fontSize: "20px" }}>Total</span>
                      <span style={{ color: "#c46a7a", fontWeight: "900", fontSize: "28px" }}>
                        ${Number(totalBackend !== null ? totalBackend : total).toLocaleString("es-CL")}
                      </span>
                    </div>

                    <div className="rounded-4 p-3 mb-4" style={{ backgroundColor: "#fff1f4" }}>
                      <small className="text-muted">Método de pago</small>
                      <p className="mb-0 fw-bold" style={{ color: "#7a3f4b" }}>WebPay</p>
                    </div>

                    {advertencia && (
                      <div
                        className="alert alert-warning rounded-4 mb-3"
                        style={{ fontWeight: "600", color: "#7a3f4b", backgroundColor: "#fff3cd", border: "1px solid #ffe69c" }}
                      >
                        {advertencia}
                      </div>
                    )}

                    <button
                      className="btn w-100 py-3 rounded-pill mb-3"
                      onClick={procesarPago}
                      style={{ backgroundColor: "#c46a7a", color: "white", fontWeight: "800", boxShadow: "0 10px 20px rgba(196, 106, 122, 0.25)" }}
                    >
                      Confirmar compra
                    </button>

                    <button
                      className="btn w-100 py-3 rounded-pill"
                      onClick={() => navigate("/")}
                      style={{ backgroundColor: "#fff", color: "#7a3f4b", fontWeight: "700", border: "1px solid #e8b8c2" }}
                    >
                      Volver al inicio
                    </button>

                    <p className="text-muted text-center small mt-4 mb-0">
                      Tus datos serán usados solo para gestionar tu compra.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}