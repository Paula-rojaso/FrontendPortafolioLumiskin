import { useEffect, useState } from "react";

export function AdministracionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
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
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    setMensaje(null);

    try {
      const token = obtenerToken();

      if (!token) {
        throw new Error("No hay token de sesión. Inicia sesión nuevamente.");
      }

      const res = await fetch("https://backend-usuario.onrender.com/api/usuarios", {
        method: "GET",
        headers: headersAuth(),
      });

      if (!res.ok) {
        throw new Error("No se pudieron cargar los usuarios");
      }

      const data = await res.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setMensaje({
        tipo: "error",
        texto:
          error.message ||
          "No se pudieron cargar los usuarios. Verifica que estés como administrador.",
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

    const modal = new window.bootstrap.Modal(
      document.getElementById("modalUsuario")
    );

    modal.show();
  };

  const abrirModalEditar = (usuario) => {
    setModo("editar");
    setUsuarioSeleccionado(usuario);

    setFormulario({
      nombre: usuario.nombre || "",
      email: usuario.email || "",
      password: "",
      telefono: usuario.telefono || "",
      region: usuario.region || "",
      comuna: usuario.comuna || "",
      direccion: usuario.direccion || "",
      departamento: usuario.departamento || "",
      infoEnvio: usuario.infoEnvio || "",
      rol_id: usuario.rol_id || usuario.rol?.id || 1,
      estado: usuario.estado === true || usuario.estado === 1 ? 1 : 0,
    });

    const modal = new window.bootstrap.Modal(
      document.getElementById("modalUsuario")
    );

    modal.show();
  };

  const cerrarModal = () => {
    const modal = window.bootstrap.Modal.getInstance(
      document.getElementById("modalUsuario")
    );

    if (modal) modal.hide();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: name === "rol_id" || name === "estado" ? Number(value) : value,
    }));
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    setMensaje(null);

    if (!formulario.nombre.trim()) {
      setMensaje({ tipo: "error", texto: "El nombre es obligatorio." });
      return;
    }

    if (!formulario.email.trim()) {
      setMensaje({ tipo: "error", texto: "El correo es obligatorio." });
      return;
    }

    if (modo === "crear" && formulario.password.trim().length < 8) {
      setMensaje({ tipo: "error", texto: "La contraseña debe tener al menos 8 caracteres." });
      return;
    }

    try {
      const token = obtenerToken();

      if (!token) {
        throw new Error("No hay token de sesión. Inicia sesión nuevamente.");
      }

      const url =
        modo === "crear"
          ? "https://backend-usuario.onrender.com/api/usuarios"
          : `https://backend-usuario.onrender.com/api/usuarios/${usuarioSeleccionado.id}`;

      const metodo = modo === "crear" ? "POST" : "PUT";

      // 👇 AQUÍ ESTÁ EL CAMBIO CLAVE
      const body = {
        nombre: formulario.nombre,
        email: formulario.email,
        telefono: formulario.telefono,
        region: formulario.region,
        comuna: formulario.comuna,
        direccion: formulario.direccion,
        departamento: formulario.departamento,
        infoEnvio: formulario.infoEnvio,
        estado: formulario.estado === 1,
        // Enviamos el rol como un objeto para que Spring Boot lo mapee correctamente
        rol: {
          id: formulario.rol_id
        }
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
      const data = texto ? JSON.parse(texto) : {};

      if (!res.ok) {
        throw new Error(
          data.error || data.mensaje || "No se pudo guardar el usuario."
        );
      }

      setMensaje({
        tipo: "exito",
        texto:
          modo === "crear"
            ? "Usuario agregado correctamente."
            : "Usuario modificado correctamente.",
      });

      cerrarModal();
      limpiarFormulario();
      cargarUsuarios();
    } catch (error) {
      console.error("Error guardando usuario:", error);
      setMensaje({
        tipo: "error",
        texto: error.message || "No se pudo guardar el usuario.",
      });
    }
  };

  const desactivarUsuario = async (usuario) => {
    const confirmar = confirm(
      `¿Seguro que deseas desactivar a ${usuario.nombre}?`
    );

    if (!confirmar) return;

    try {
      const token = obtenerToken();

      if (!token) {
        throw new Error("No hay token de sesión. Inicia sesión nuevamente.");
      }

      const res = await fetch(
        `https://backend-usuario.onrender.com/api/usuarios/${usuario.id}/desactivar`,
        {
          method: "PATCH",
          headers: headersAuth(),
        }
      );

      if (!res.ok) {
        throw new Error("No se pudo desactivar el usuario");
      }

      setMensaje({
        tipo: "exito",
        texto: "Usuario desactivado correctamente.",
      });

      cargarUsuarios();
    } catch (error) {
      console.error("Error desactivando usuario:", error);
      setMensaje({
        tipo: "error",
        texto: error.message || "No se pudo desactivar el usuario.",
      });
    }
  };

  const eliminarUsuario = async (usuario) => {
    const confirmar = confirm(
      `¿Seguro que deseas eliminar al usuario ${usuario.nombre}?`
    );

    if (!confirmar) return;

    try {
      const token = obtenerToken();

      if (!token) {
        throw new Error("No hay token de sesión. Inicia sesión nuevamente.");
      }

      const res = await fetch(
        `https://backend-usuario.onrender.com/api/usuarios/${usuario.id}`,
        {
          method: "DELETE",
          headers: headersAuth(),
        }
      );

      if (!res.ok) {
        throw new Error("No se pudo eliminar el usuario");
      }

      setMensaje({
        tipo: "exito",
        texto: "Usuario eliminado correctamente.",
      });

      cargarUsuarios();
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      setMensaje({
        tipo: "error",
        texto: error.message || "No se pudo eliminar el usuario.",
      });
    }
  };

  const formatearRol = (usuario) => {
  const rolId = usuario.rol_id || usuario.rol?.id;

  if (typeof usuario.rol === "string") {
    return usuario.rol.toLowerCase();
  }

  if (usuario.rol?.nombre) {
    return usuario.rol.nombre.toLowerCase();
  }

  if (rolId === 2) return "admin";
  if (rolId === 1) return "cliente";

  return "cliente";
};

  const obtenerEstadoActivo = (usuario) => {
    return usuario.estado === 1 || usuario.estado === true;
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
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 style={{ color: "#4b2b32", fontWeight: "900" }}>
              Administración de usuarios
            </h1>

            <p className="text-muted mb-0">
              Agrega, modifica, desactiva o elimina usuarios del sistema.
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn rounded-pill px-4 py-2"
              style={{
                backgroundColor: "#fff",
                color: "#7a3f4b",
                fontWeight: "700",
                border: "1px solid #e8b8c2",
              }}
              onClick={cargarUsuarios}
            >
              Actualizar
            </button>

            <button
              className="btn rounded-pill px-4 py-2"
              style={{
                backgroundColor: "#c46a7a",
                color: "white",
                fontWeight: "800",
              }}
              onClick={abrirModalCrear}
            >
              Agregar usuario
            </button>

            <button
              className="btn rounded-pill px-4 py-2"
              style={{
                backgroundColor: "#fff",
                color: "#7a3f4b",
                fontWeight: "700",
                border: "1px solid #e8b8c2",
              }}
              onClick={() => window.history.back()}
            >
              Volver al Panel
            </button>
          </div>
        </div>

        {mensaje && (
          <div
            className={`alert ${
              mensaje.tipo === "error" ? "alert-danger" : "alert-success"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        <div className="card border-0 rounded-4 shadow-sm">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
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
                      <td colSpan="7" className="text-center">
                        Cargando usuarios...
                      </td>
                    </tr>
                  ) : usuarios.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  ) : (
                    usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.id}</td>
                        <td className="fw-bold">{usuario.nombre}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.telefono || "-"}</td>

                        <td>
                          <span
                            className="badge rounded-pill px-3 py-2"
                            style={{
                              backgroundColor:
                                formatearRol(usuario) === "admin"
                                  ? "#f7dbe2"
                                  : "#eef2ff",
                              color:
                                formatearRol(usuario) === "admin"
                                  ? "#9b4d5d"
                                  : "#4f46e5",
                            }}
                          >
                            {formatearRol(usuario)}
                          </span>
                        </td>

                        <td>
                          {obtenerEstadoActivo(usuario) ? (
                            <span className="text-success fw-bold">
                              Activo
                            </span>
                          ) : (
                            <span className="text-danger fw-bold">
                              Inactivo
                            </span>
                          )}
                        </td>

                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => abrirModalEditar(usuario)}
                            >
                              Editar
                            </button>

                            <button
                              className="btn btn-outline-warning"
                              onClick={() => desactivarUsuario(usuario)}
                              disabled={!obtenerEstadoActivo(usuario)}
                            >
                              Desactivar
                            </button>

                            <button
                              className="btn btn-outline-danger"
                              onClick={() => eliminarUsuario(usuario)}
                            >
                              Eliminar
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
          <div
            className="modal-content border-0 rounded-4 shadow-lg"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #fff7f9 100%)",
            }}
          >
            <div className="modal-header border-0 px-4 pt-4">
              <h2
                className="modal-title"
                style={{ color: "#4b2b32", fontWeight: "900" }}
              >
                {modo === "crear" ? "Agregar usuario" : "Modificar usuario"}
              </h2>

              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form onSubmit={guardarUsuario}>
              <div className="modal-body px-4">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Nombre</label>
                    <input
                      className="form-control rounded-3"
                      name="nombre"
                      value={formulario.nombre}
                      onChange={handleChange}
                      placeholder="Nombre del usuario"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Correo</label>
                    <input
                      type="email"
                      className="form-control rounded-3"
                      name="email"
                      value={formulario.email}
                      onChange={handleChange}
                      placeholder="correo@gmail.com"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control rounded-3"
                      name="password"
                      value={formulario.password}
                      onChange={handleChange}
                      placeholder={
                        modo === "crear"
                          ? "Mínimo 8 caracteres"
                          : "Dejar vacío si no cambia"
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Teléfono</label>
                    <input
                      className="form-control rounded-3"
                      name="telefono"
                      value={formulario.telefono}
                      onChange={handleChange}
                      placeholder="912345678"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Región</label>
                    <input
                      className="form-control rounded-3"
                      name="region"
                      value={formulario.region}
                      onChange={handleChange}
                      placeholder="Región Metropolitana"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Comuna</label>
                    <input
                      className="form-control rounded-3"
                      name="comuna"
                      value={formulario.comuna}
                      onChange={handleChange}
                      placeholder="Maipú"
                    />
                  </div>

                  <div className="col-md-8 mb-3">
                    <label className="form-label fw-semibold">Dirección</label>
                    <input
                      className="form-control rounded-3"
                      name="direccion"
                      value={formulario.direccion}
                      onChange={handleChange}
                      placeholder="Calle 123"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">
                      Departamento
                    </label>
                    <input
                      className="form-control rounded-3"
                      name="departamento"
                      value={formulario.departamento}
                      onChange={handleChange}
                      placeholder="Opcional"
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">
                      Información de envío
                    </label>
                    <textarea
                      className="form-control rounded-3"
                      name="infoEnvio"
                      value={formulario.infoEnvio}
                      onChange={handleChange}
                      placeholder="Indicaciones adicionales"
                      rows="2"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Rol</label>
                    <select
                      className="form-select rounded-3"
                      name="rol_id"
                      value={formulario.rol_id}
                      onChange={handleChange}
                    >
                      <option value={1}>Cliente</option>
                      <option value={2}>Administrador</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Estado</label>
                    <select
                      className="form-select rounded-3"
                      name="estado"
                      value={formulario.estado}
                      onChange={handleChange}
                    >
                      <option value={1}>Activo</option>
                      <option value={0}>Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 px-4 pb-4">
                <button
                  type="button"
                  className="btn rounded-pill px-4"
                  data-bs-dismiss="modal"
                  style={{
                    backgroundColor: "#fff",
                    color: "#7a3f4b",
                    fontWeight: "700",
                    border: "1px solid #e8b8c2",
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn rounded-pill px-4"
                  style={{
                    backgroundColor: "#c46a7a",
                    color: "white",
                    fontWeight: "800",
                  }}
                >
                  {modo === "crear" ? "Guardar usuario" : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}