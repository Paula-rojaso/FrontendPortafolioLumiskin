import { useEffect, useState } from "react";

// Mapeo geográfico oficial de LumiSkin
const comunasPorRegion = {
  "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
  "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
  "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
  "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Huasco", "Freirina", "Alto del Carmen"],
  "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quintero", "Puchuncaví", "Casablanca", "Juan Fernández", "Isla de Pascua", "San Antonio", "Cartagena", "El Quisco", "El Tabo", "Algarrobo", "Santo Domingo", "San Felipe", "Llaillay", "Catemu", "Panquehue", "Putaendo", "Santa María", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "Quillota", "La Cruz", "La Calera", "Hijuelas", "Nogales", "Petorca", "La Ligua", "Cabildo", "Zapallar", "Papudo", "Quilpué", "Villa Alemana", "Limache", "Olmué"],
  "Región Metropolitana": ["Santiago","Cerrillos","Cerro Navia","Conchalí","El Bosque","Estación Central","Huechuraba","Independencia","La Cisterna","La Florida","La Granja","La Pintana","La Reina","Las Condes","Lo Barnechea","Lo Espejo","Lo Prado","Macul","Maipú","Ñuñoa","Pedro Aguirre Cerda","Peñalolén","Providencia","Pudahuel","Quilicura","Quinta Normal","Recoleta","Renca","San Joaquín","San Miguel","San Ramón","Vitacura","Colina","Lampa","Tiltil","Puente Alto","Pirque","San José de Maipo","San Bernardo","Buin","Paine","Calera de Tango","Melipilla","Alhué","Curacaví","María Pinto","San Pedro","Talagante","El Monte","Isla de Maipo","Padre Hurtado","Peñaflor"],
  "O’Higgins": ["Rancagua","Machalí","Graneros","Mostazal","Codegua","Coinco","Coltauco","Doñihue","Las Cabras","Malloa","Olivar","Peumo","Pichidegua","Quinta de Tilcoco","Rengo","Requínoa","San Vicente","Pichilemu","Marchigüe","La Estrella","Litueche","Navidad","Paredones","San Fernando","Chimbarongo","Nancagua","Palmilla","Peralillo","Placilla","Pumanque","Santa Cruz"],
  "Maule": ["Talca","Constitución","Curepto","Empedrado","Maule","Pencahue","Río Claro","San Clemente","San Rafael","Linares","Colbún","Longaví","Parral","Retiro","Villa Alegre","Yerbas Buenas","Curicó","Hualañé","Licantén","Molina","Rauco","Romeral","Sagrada Familia","Teno","Vichuquén","Cauquenes","Chanco","Pelluhue"],
  "Ñuble": ["Chillán","Chillán Viejo","Coihueco","Pinto","San Ignacio","El Carmen","Pemuco","Yungay","Quillón","San Nicolás","Bulnes","Quirihue","Cobquecura","Ninhue","Portezuelo","Ránquil","Trehuaco","Coelemu"],
  "Biobío": ["Concepción","Talcahuano","Hualpén","San Pedro de la Paz","Chiguayante","Penco","Tomé","Florida","Hualqui","Santa Juana","Coronel","Lota","Los Ángeles","Cabrero","Laja","San Rosendo","Yumbel","Alto Biobío","Mulchén","Nacimiento","Negrete","Quilaco","Quilleco","Santa Bárbara","Tucapel","Antuco","Arauco","Cañete","Contulmo","Curanilahue","Lebu","Los Álamos","Tirúa"],
  "La Araucanía": ["Temuco","Padre Las Casas","Lautaro","Perquenco","Vilcún","Cunco","Melipeuco","Curarrehue","Pucón","Villarrica","Freire","Gorbea","Toltén","Loncoche","Teodoro Schmidt","Carahue","Nueva Imperial","Saavedra","Cholchol","Angol","Renaico","Collipulli","Ercilla","Los Sauces","Purén","Lumaco","Traiguén","Victoria","Lonquimay","Curacautín","Galvarino"],
  "Los Ríos": ["Valdivia","Corral","Lanco","Los Lagos","Máfil","Mariquina","Paillaco","Panguipulli","La Unión","Futrono","Lago Ranco","Río Bueno"],
  "Los Lagos": ["Puerto Montt","Puerto Varas","Llanquihue","Frutillar","Los Muermos","Calbuco","Maullín","Cochamó","Osorno","San Pablo","Puyehue","Río Negro","Purranque","San Juan de la Costa","Castro","Ancud","Chonchi","Dalcahue","Puqueldón","Queilén","Quellón","Quemchi","Quinchao","Chaitén","Futaleufú","Hualaihué","Palena"],
  "Aysén": ["Coyhaique","Aysén","Cisnes","Guaitecas","Lago Verde","Cochrane","O’Higgins","Tortel","Chile Chico","Río Ibáñez"],
  "Magallanes y la Antártica": ["Punta Arenas","Laguna Blanca","Río Verde","San Gregorio","Natales","Torres del Paine","Porvenir","Primavera","Timaukel","Cabo de Hornos","Antártica"]
};

export function AdministracionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const [modo, setModo] = useState("crear");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    region: "",
    comuna: "",
    direccion: "",
    departamento: "",
    infoEnvio: "",
    rol_id: 1,
    estado: 1,
  });

  const obtenerToken = () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (!usuarioGuardado) return null;
      const usuario = JSON.parse(usuarioGuardado);
      return usuario?.token || null;
    } catch (error) {
      console.error("Error obteniendo token:", error);
      return null;
    }
  };

  const headersAuth = () => {
    const token = obtenerToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    cargarUsuarios();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    setMensaje(null);

    try {
      const token = obtenerToken();
      if (!token) throw new Error("No hay token de sesión. Inicia sesión nuevamente.");

      const res = await fetch("https://backend-usuario.onrender.com/api/usuarios", {
        method: "GET",
        headers: headersAuth(),
      });

      if (!res.ok) throw new Error("No se pudieron cargar los usuarios");

      const data = await res.json();
      const listaUsuarios = Array.isArray(data) ? data : [];
      listaUsuarios.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setUsuarios(listaUsuarios);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setMensaje({
        tipo: "error",
        texto: error.message || "No se pudieron cargar los usuarios.",
      });
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setFormulario({
      nombre: "",
      email: "",
      password: "",
      telefono: "",
      region: "",
      comuna: "",
      direccion: "",
      departamento: "",
      infoEnvio: "",
      rol_id: 1,
      estado: 1,
    });
    setUsuarioSeleccionado(null);
    setModo("crear");
  };

  const abrirModalCrear = () => {
    limpiarFormulario();
    setModo("crear");
    const modal = new window.bootstrap.Modal(document.getElementById("modalUsuario"));
    modal.show();
  };

  const abrirModalEditar = (usuario) => {
    setModo("editar");
    setUsuarioSeleccionado(usuario);

    // Si el texto de la región viene abreviado como "RM", lo homologamos para que coincida con el selector
    let regionHomologada = usuario.region || "";
    if (regionHomologada === "RM") {
      regionHomologada = "Región Metropolitana";
    }

    setFormulario({
      nombre: usuario.nombre || "",
      email: usuario.email || "",
      password: "",
      telefono: usuario.telefono || "",
      region: regionHomologada,
      comuna: usuario.comuna || "",
      direccion: usuario.direccion || "",
      departamento: usuario.departamento || "",
      infoEnvio: usuario.info_envio || usuario.infoEnvio || "",
      rol_id: usuario.rol_id || usuario.rol?.id || 1,
      estado: usuario.estado === true || usuario.estado === 1 ? 1 : 0,
    });

    const modal = new window.bootstrap.Modal(document.getElementById("modalUsuario"));
    modal.show();
  };

  const cerrarModal = () => {
    const modal = window.bootstrap.Modal.getInstance(document.getElementById("modalUsuario"));
    if (modal) modal.hide();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: name === "rol_id" || name === "estado" ? Number(value) : value,
    }));
  };

  // Lógica específica para cuando cambia la región (limpia la comuna previa)
  const handleRegionChange = (e) => {
    const { value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      region: value,
      comuna: "", 
    }));
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    setMensaje(null);

    if (!formulario.nombre.trim() || !formulario.email.trim()) {
      setMensaje({ tipo: "error", texto: "El nombre y el correo son obligatorios." });
      return;
    }

    if (modo === "crear" && formulario.password.trim().length < 8) {
      setMensaje({ tipo: "error", texto: "La contraseña debe tener al menos 8 caracteres." });
      return;
    }

    setGuardando(true);

    try {
      const url = modo === "crear"
          ? "https://backend-usuario.onrender.com/api/usuarios"
          : `https://backend-usuario.onrender.com/api/usuarios/${usuarioSeleccionado.id}`;

      const metodo = modo === "crear" ? "POST" : "PUT";

      const body = {
        nombre: formulario.nombre,
        email: formulario.email,
        telefono: formulario.telefono,
        region: formulario.region,
        comuna: formulario.comuna,
        direccion: formulario.direccion,
        departamento: formulario.departamento,
        info_envio: formulario.infoEnvio,
        estado: formulario.estado === 1,
        rolNombre: formulario.rol_id === 2 ? "admin" : "cliente"
      };

      if (formulario.password.trim()) {
        body.password = formulario.password;
      }

      const res = await fetch(url, {
        method: metodo,
        headers: headersAuth(),
        body: JSON.stringify(body),
      });

      const texto = await res.text();
      let data = {};
      try { data = texto ? JSON.parse(texto) : {}; } catch (e) { /* ignored */ }

      if (!res.ok) {
        throw new Error(data.error || data.message || data.mensaje || `Error del servidor`);
      }

      setMensaje({
        tipo: "exito",
        texto: modo === "crear" ? "Usuario agregado correctamente." : "Usuario modificado correctamente.",
      });

      cerrarModal();
      limpiarFormulario();
      cargarUsuarios();
    } catch (error) {
      console.error("Excepción capturada:", error);
      setMensaje({ tipo: "error", texto: error.message || "Error fatal al guardar el usuario." });
    } finally {
      setGuardando(false);
    }
  };

  const desactivarUsuario = async (usuario) => {
    const confirmar = confirm(`¿Seguro que deseas desactivar a ${usuario.nombre}?`);
    if (!confirmar) return;

    try {
      const res = await fetch(`https://backend-usuario.onrender.com/api/usuarios/${usuario.id}/desactivar`, {
        method: "PATCH",
        headers: headersAuth(),
      });
      if (!res.ok) throw new Error("No se pudo desactivar el usuario");
      
      setMensaje({ tipo: "exito", texto: "Usuario desactivado correctamente." });
      cargarUsuarios();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message || "No se pudo desactivar." });
    }
  };

  const eliminarUsuario = async (usuario) => {
    const confirmar = confirm(`¿Seguro que deseas eliminar al usuario ${usuario.nombre}?`);
    if (!confirmar) return;

    try {
      const res = await fetch(`https://backend-usuario.onrender.com/api/usuarios/${usuario.id}`, {
        method: "DELETE",
        headers: headersAuth(),
      });
      if (!res.ok) throw new Error("No se pudo eliminar el usuario");

      setMensaje({ tipo: "exito", texto: "Usuario eliminado correctamente." });
      cargarUsuarios();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message || "No se pudo eliminar." });
    }
  };

  const formatearRol = (usuario) => {
    const rolId = usuario.rol_id || usuario.rol?.id;
    if (typeof usuario.rol === "string") return usuario.rol.toLowerCase();
    if (usuario.rol?.nombre) return usuario.rol.nombre.toLowerCase();
    if (rolId === 2) return "admin";
    return "cliente";
  };

  const obtenerEstadoActivo = (usuario) => {
    return usuario.estado === 1 || usuario.estado === true;
  };

  const IconoEditar = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );

  const IconoDesactivar = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  const IconoEliminar = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  return (
    <main
      className="py-5"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fff7f9 0%, #f8eef2 45%, #fffdfb 100%)" }}
    >
      <div className="container">
        {/* ENCABEZADO */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 style={{ color: "#4b2b32", fontWeight: "900" }}>Administración de usuarios</h1>
            <p className="text-muted mb-0">Agrega, modifica, desactiva o elimina usuarios del sistema.</p>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn rounded-pill px-4 py-2 shadow-sm"
              style={{ backgroundColor: "#fff", color: "#7a3f4b", fontWeight: "700", border: "1px solid #e8b8c2" }}
              onClick={cargarUsuarios}
            >
              Actualizar
            </button>
            <button
              className="btn rounded-pill px-4 py-2 shadow-sm"
              style={{ backgroundColor: "#c46a7a", color: "white", fontWeight: "800" }}
              onClick={abrirModalCrear}
            >
              + Agregar usuario
            </button>
            <button
              className="btn rounded-pill px-4 py-2 shadow-sm"
              style={{ backgroundColor: "#fff", color: "#7a3f4b", fontWeight: "700", border: "1px solid #e8b8c2" }}
              onClick={() => window.history.back()}
            >
              Volver al Panel
            </button>
          </div>
        </div>

        {mensaje && (
          <div className={`alert ${mensaje.tipo === "error" ? "alert-danger" : "alert-success"} rounded-4 shadow-sm border-0`}>
            {mensaje.texto}
          </div>
        )}

        {/* TABLA DE USUARIOS */}
        <div className="card border-0 rounded-4 shadow-sm">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table align-middle table-hover">
                <thead>
                  <tr style={{ color: "#8a5a64" }}>
                    <th className="ps-3">Nombre</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {cargando ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        <div className="spinner-border spinner-border-sm me-2" style={{ color: "#c46a7a" }}></div>
                        Cargando usuarios...
                      </td>
                    </tr>
                  ) : usuarios.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">No hay usuarios registrados.</td>
                    </tr>
                  ) : (
                    usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td className="ps-3 fw-bold" style={{ color: "#4b2b32" }}>
                          {usuario.nombre}
                          {usuario.id === 9 && <span className="ms-2 badge bg-danger opacity-75">Admin Principal</span>}
                        </td>
                        <td className="text-muted">{usuario.email}</td>
                        <td className="text-muted">{usuario.telefono || "—"}</td>
                        <td>
                          <span
                            className="badge rounded-pill px-3 py-2"
                            style={{
                              backgroundColor: formatearRol(usuario) === "admin" ? "#f7dbe2" : "#eef2ff",
                              color: formatearRol(usuario) === "admin" ? "#9b4d5d" : "#4f46e5",
                            }}
                          >
                            {formatearRol(usuario)}
                          </span>
                        </td>
                        <td>
                          {obtenerEstadoActivo(usuario) ? (
                            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 rounded-pill">
                              Activo
                            </span>
                          ) : (
                            <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1 rounded-pill">
                              Inactivo
                            </span>
                          )}
                        </td>

                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              title="Editar usuario"
                              className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "34px", height: "34px", color: "#264653", border: "1px solid #e9ecef" }}
                              onClick={() => abrirModalEditar(usuario)}
                            >
                              <IconoEditar />
                            </button>

                            <button
                              title={obtenerEstadoActivo(usuario) ? "Desactivar usuario" : "Usuario ya inactivo"}
                              className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "34px", height: "34px", color: obtenerEstadoActivo(usuario) ? "#e9c46a" : "#ccc", border: "1px solid #e9ecef" }}
                              onClick={() => desactivarUsuario(usuario)}
                              disabled={!obtenerEstadoActivo(usuario) || usuario.id === 9}
                            >
                              <IconoDesactivar />
                            </button>

                            <button
                              title="Eliminar usuario"
                              className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "34px", height: "34px", color: "#e76f51", border: "1px solid #e9ecef" }}
                              onClick={() => eliminarUsuario(usuario)}
                              disabled={usuario.id === 9}
                            >
                              <IconoEliminar />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL AGREGAR / EDITAR USUARIO */}
      <div className="modal fade" id="modalUsuario" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg" style={{ background: "linear-gradient(180deg, #ffffff 0%, #fff7f9 100%)" }}>
            <div className="modal-header border-0 px-4 pt-4">
              <h3 className="modal-title" style={{ color: "#4b2b32", fontWeight: "900" }}>
                {modo === "crear" ? "Agregar nuevo usuario" : "Modificar usuario"}
              </h3>
              <button className="btn-close" data-bs-dismiss="modal" disabled={guardando}></button>
            </div>

            <form onSubmit={guardarUsuario}>
              <div className="modal-body px-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-1">Nombre</label>
                    <input className="form-control rounded-3 border-0 shadow-sm" name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Ej. Juan Pérez" disabled={guardando}/>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-1">Correo</label>
                    <input type="email" className="form-control rounded-3 border-0 shadow-sm" name="email" value={formulario.email} onChange={handleChange} placeholder="correo@gmail.com" disabled={guardando}/>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-1">Contraseña</label>
                    <input type="password" className="form-control rounded-3 border-0 shadow-sm" name="password" value={formulario.password} onChange={handleChange} placeholder={modo === "crear" ? "Mínimo 8 caracteres" : "Dejar vacío si no cambia"} disabled={guardando}/>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-1">Teléfono</label>
                    <input className="form-control rounded-3 border-0 shadow-sm" name="telefono" value={formulario.telefono} onChange={handleChange} placeholder="912345678" disabled={guardando}/>
                  </div>

                  {/* SELECTOR DE REGIÓN DINÁMICO */}
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-1">Región</label>
                    <select 
                      className="form-select rounded-3 border-0 shadow-sm" 
                      name="region" 
                      value={formulario.region} 
                      onChange={handleRegionChange} 
                      disabled={guardando}
                    >
                      <option value="">Selecciona una región</option>
                      {Object.keys(comunasPorRegion).map((reg) => (
                        <option key={reg} value={reg}>{reg}</option>
                      ))}
                    </select>
                  </div>

                  {/* SELECTOR DE COMUNA DINÁMICO */}
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-1">Comuna</label>
                    <select 
                      className="form-select rounded-3 border-0 shadow-sm" 
                      name="comuna" 
                      value={formulario.comuna} 
                      onChange={handleChange} 
                      disabled={guardando || !formulario.region}
                    >
                      <option value="">Selecciona una comuna</option>
                      {formulario.region && comunasPorRegion[formulario.region]?.map((com) => (
                        <option key={com} value={com}>{com}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-8">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-1">Dirección</label>
                    <input className="form-control rounded-3 border-0 shadow-sm" name="direccion" value={formulario.direccion} onChange={handleChange} placeholder="Calle 123" disabled={guardando}/>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-1">Depto</label>
                    <input className="form-control rounded-3 border-0 shadow-sm" name="departamento" value={formulario.departamento} onChange={handleChange} placeholder="Opcional" disabled={guardando}/>
                  </div>

                  <div className="col-12">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-1">Información de envío</label>
                    <textarea className="form-control rounded-3 border-0 shadow-sm" name="infoEnvio" value={formulario.infoEnvio} onChange={handleChange} placeholder="Indicaciones adicionales (ej. dejar en conserjería)" rows="2" disabled={guardando}/>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-1">Rol</label>
                    <select className="form-select rounded-3 border-0 shadow-sm" name="rol_id" value={formulario.rol_id} onChange={handleChange} disabled={guardando}>
                      <option value={1}>Cliente</option>
                      <option value={2}>Administrador</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-1">Estado</label>
                    <select className="form-select rounded-3 border-0 shadow-sm" name="estado" value={formulario.estado} onChange={handleChange} disabled={guardando}>
                      <option value={1}>Activo</option>
                      <option value={0}>Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 px-4 pb-4 mt-2">
                <button type="button" className="btn rounded-pill px-4 shadow-sm" data-bs-dismiss="modal" disabled={guardando} style={{ backgroundColor: "#fff", color: "#7a3f4b", fontWeight: "700", border: "1px solid #e8b8c2" }}>
                  Cancelar
                </button>

                <button type="submit" className="btn rounded-pill px-4 shadow-sm d-flex align-items-center" disabled={guardando} style={{ backgroundColor: "#c46a7a", color: "white", fontWeight: "800" }}>
                  {guardando ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                      Guardando...
                    </>
                  ) : (
                    modo === "crear" ? "Guardar usuario" : "Guardar cambios"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}