import { useEffect, useMemo, useState } from "react";

export function ModalUsuario({ modo, usuario, onGuardar, roles }) {
  const esEditar = modo === "editar";

  const comunasPorRegion = useMemo(() => ({
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
  }), []);

    const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "",
    estado: true,
    region: "",
    comuna: "",
  });

  const [errores, setErrores] = useState({});
  const [ok, setOk] = useState({});
  const [mensaje, setMensaje] = useState(null);

  const correoValido = (email) =>
    /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(
      (email || "").trim()
    );

  const passwordValida = (pass) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,100}$/.test(
      pass || ""
    );

  const reglas = {
    nombre: {
      test: (v) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{4,100}$/.test((v || "").trim()),
      ok: "Nombre válido.",
      bad: "Debe tener al menos 4 letras sin números.",
    },
    email: {
      test: (v) => v.length <= 100 && correoValido(v),
      ok: "Correo válido.",
      bad: "Solo se aceptan @duoc.cl, @profesor.duoc.cl o @gmail.com.",
    },
    password: {
      test: (v) => esEditar || passwordValida(v),
      ok: "Contraseña segura.",
      bad: "Debe tener mayúscula, minúscula, número y símbolo.",
    },
    region: {
      test: (v) => v !== "",
      ok: "Región seleccionada.",
      bad: "Selecciona una región.",
    },
    comuna: {
      test: (v) => v !== "",
      ok: "Comuna seleccionada.",
      bad: "Selecciona una comuna.",
    },
    rol: {
      test: (v) => v !== "",
      ok: "Rol válido.",
      bad: "Selecciona un rol.",
    },
  };

  const validarCampo = (name, valor) => {
    const regla = reglas[name];
    if (!regla) return true;

    if (regla.test(valor)) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
      setOk((prev) => ({ ...prev, [name]: regla.ok }));
      return true;
    } else {
      setOk((prev) => ({ ...prev, [name]: "" }));
      setErrores((prev) => ({ ...prev, [name]: regla.bad }));
      return false;
    }
  };

  const validarTodo = () => {
    let valido = true;
    Object.keys(reglas).forEach((campo) => {
      if (!validarCampo(campo, form[campo])) valido = false;
    });
    return valido;
  };

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((f) => ({ ...f, [name]: val }));
    validarCampo(name, val);
  }

  const comunasDisponibles = useMemo(
    () => (form.region ? comunasPorRegion[form.region] ?? [] : []),
    [form.region, comunasPorRegion]
  );

  useEffect(() => {
    if (form.region && form.comuna && !comunasDisponibles.includes(form.comuna))
      setForm((f) => ({ ...f, comuna: "" }));
  }, [form.region, comunasDisponibles]);

  useEffect(() => {
    if (usuario) {
      setForm({
        id: usuario.id,
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        password: "",
        rol: usuario.rol_id ?? usuario.rol?.id ?? "",
        estado: usuario.estado ?? true,
        region: usuario.region ?? "",
        comuna: usuario.comuna ?? "",
      });
    } else {
      setForm({
        nombre: "",
        email: "",
        password: "",
        rol: "",
        estado: true,
        region: "",
        comuna: "",
      });
    }
    setErrores({});
    setOk({});
    setMensaje(null);
  }, [usuario, modo]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje(null);

    if (!validarTodo()) {
      setMensaje({ tipo: "error", texto: "Revisa los campos marcados en rojo." });
      return;
    }

    try {
      const url = esEditar
        ? `https://backend-usuario.onrender.com/api/usuarios/${form.id}`
        : "https://backend-usuario.onrender.com/api/usuarios";
      const metodo = esEditar ? "PUT" : "POST";

      const base = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        estado: !!form.estado,
        region: form.region,
        comuna: form.comuna,
        rol: form.rol ? { id: Number(form.rol) } : null,
      };
      const payload = esEditar ? base : { ...base, password: form.password };

      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al guardar el usuario");

      const data = await res.json();
      setMensaje({
        tipo: "exito",
        texto: "Usuario guardado correctamente.",
      });
      onGuardar?.(data);
    } catch (error) {
      console.error("Error al guardar:", error);
      setMensaje({ tipo: "error", texto: "No se pudo guardar el usuario." });
    }
  }

  return (
    <div className="modal fade" id="modalUsuario" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {esEditar ? "Editar Usuario" : "Agregar Usuario"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"/>
            </div>

            <div className="modal-body">
              {mensaje && (
                <div
                  className={`alert ${
                    mensaje.tipo === "error" ? "alert-danger" : "alert-success"
                  }`}
                >
                  {mensaje.texto}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input name="nombre" value={form.nombre}  onChange={handleChange}
                    className={`form-control ${
                      errores.nombre
                        ? "is-invalid"
                        : ok.nombre
                        ? "is-valid"
                        : ""
                    }`}
                  />
                  {errores.nombre && (
                    <div className="invalid-feedback">{errores.nombre}</div>
                  )}
                  {ok.nombre && (
                    <div className="valid-feedback">{ok.nombre}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Correo electrónico</label>
                  <input type="email" name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`form-control ${
                      errores.email
                        ? "is-invalid"
                        : ok.email
                        ? "is-valid"
                        : ""
                    }`}
                  />
                  {errores.email && (
                    <div className="invalid-feedback">{errores.email}</div>
                  )}
                  {ok.email && <div className="valid-feedback">{ok.email}</div>}
                </div>

                {/* Password */}
                {!esEditar && (
                  <div className="col-md-6">
                    <label className="form-label">Contraseña</label>
                    <input  type="password" name="password"
                      value={form.password}
                      onChange={handleChange}
                      className={`form-control ${
                        errores.password
                          ? "is-invalid"
                          : ok.password
                          ? "is-valid"
                          : ""
                      }`}
                    />
                    {errores.password && (
                      <div className="invalid-feedback">{errores.password}</div>
                    )}
                    {ok.password && (
                      <div className="valid-feedback">{ok.password}</div>
                    )}
                  </div>
                )}

                <div className="col-md-6">
                  <label className="form-label">Rol</label>
                  <select name="rol" value={form.rol}
                    onChange={handleChange}
                    className={`form-select ${
                      errores.rol ? "is-invalid" : ok.rol ? "is-valid" : ""
                    }`}
                  >
                    <option value="">Seleccione rol...</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                  {errores.rol && (
                    <div className="invalid-feedback">{errores.rol}</div>
                  )}
                  {ok.rol && <div className="valid-feedback">{ok.rol}</div>}
                </div>

                {/* Región */}
                <div className="col-md-6">
                  <label className="form-label">Región</label>
                  <select name="region" value={form.region} onChange={handleChange}
                    className={`form-select ${
                      errores.region
                        ? "is-invalid"
                        : ok.region
                        ? "is-valid"
                        : ""
                    }`}
                  >
                    <option value="">Selecciona una región</option>
                    {Object.keys(comunasPorRegion).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {errores.region && (
                    <div className="invalid-feedback">{errores.region}</div>
                  )}
                  {ok.region && (
                    <div className="valid-feedback">{ok.region}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Comuna</label>
                  <select name="comuna" value={form.comuna}
                    onChange={handleChange}
                    disabled={!form.region}
                    className={`form-select ${
                      errores.comuna
                        ? "is-invalid"
                        : ok.comuna
                        ? "is-valid"
                        : ""
                    }`}
                  >
                    <option value="">Selecciona una comuna</option>
                    {comunasDisponibles.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errores.comuna && (
                    <div className="invalid-feedback">{errores.comuna}</div>
                  )}
                  {ok.comuna && (
                    <div className="valid-feedback">{ok.comuna}</div>
                  )}
                </div>

                <div className="col-12">
                  <div className="form-check mt-2">
                    <input className="form-check-input" type="checkbox" name="estado"
                      checked={!!form.estado}
                      onChange={handleChange}
                      id="estado"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="estado"
                    >
                      Activo
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {esEditar ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}