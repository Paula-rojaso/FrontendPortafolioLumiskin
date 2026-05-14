import { useEffect, useState, useMemo } from "react";
import { ModalUsuario } from "./ModalUsuario";

export function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [modo, setModo] = useState("crear");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  async function cargarUsuarios() {
  setCargando(true);
  setMensaje(null);
  try {
    const token = localStorage.getItem("token"); 
    console.log("TOKEN:", token);
    const res = await fetch("https://backend-usuario.onrender.com/api/usuarios", {
      headers: {
        "Authorization": `Bearer ${token}` 
      }
    });
    if (!res.ok) throw new Error("Error al obtener usuarios");
    const data = await res.json();
    setUsuarios(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    setMensaje({
      tipo: "error",
      texto: "No se pudieron cargar los usuarios.",
    });
  } finally {
    setCargando(false);
  }
}
fetch("https://backend-usuario.onrender.com/api/usuarios", {
  headers: {
    "Authorization": "Bearer " + localStorage.getItem("token")
  }
}).then(r => console.log("Status:", r.status))

  async function cargarRoles() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://backend-usuario.onrender.com/api/roles", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Error al obtener roles");
      const data = await res.json();
      setRoles(data);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  }
  

  useEffect(() => {
  const token = localStorage.getItem("token");
  console.log("TOKEN en useEffect:", token);
  if (token) {
    cargarUsuarios();
    cargarRoles();
  }
}, []);

  const filtrados = useMemo(() => {
    const texto = filtroTexto.toLowerCase().trim();
    const rolSeleccionado = filtroRol.toLowerCase().trim();

    return usuarios.filter((u) => {
      const rolNombre =
        (typeof u.rol === "object"
          ? u.rol?.nombre
          : roles.find((r) => r.id === (u.rol_id || u.rol?.id))?.nombre
        )?.toLowerCase() || "";

      const okRol = !rolSeleccionado || rolNombre === rolSeleccionado;

      const okTxt =
        !texto ||
        u.nombre?.toLowerCase().includes(texto) ||
        u.email?.toLowerCase().includes(texto);

      return okRol && okTxt;
    });
  }, [usuarios, filtroTexto, filtroRol, roles]);


  function abrirModalCrear() {
    setModo("crear");
    setUsuarioSeleccionado(null);
    const modal = new bootstrap.Modal(document.getElementById("modalUsuario"));
    modal.show();
  }

  function abrirModalEditar(usr) {
    setModo("editar");
    setUsuarioSeleccionado(usr);
    const modal = new bootstrap.Modal(document.getElementById("modalUsuario"));
    modal.show();
  }

  async function eliminarUsuario(id) {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const res = await fetch(`https://backend-usuario.onrender.com/api/usuarios/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      setMensaje({
        tipo: "exito",
        texto: "Usuario eliminado correctamente.",
      });
      cargarUsuarios();
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMensaje({
        tipo: "error",
        texto: "Error al eliminar usuario.",
      });
    }
  }

  function onGuardar() {
    cargarUsuarios();
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("modalUsuario")
    );
    modal.hide();
  }

  return (
    <div className="container my-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <h1 className="m-0">ADMINISTRACIÓN DE USUARIOS</h1>
        <button className="btn btn-primary" onClick={abrirModalCrear}>
          ＋ Agregar usuario
        </button>
      </div>

      <div className="row g-2 mb-3 mt-2">
        <div className="col-md-3">
          <input value={filtroTexto} onChange={(e) => setFiltroTexto(e.target.value)} className="form-control" placeholder="Buscar por nombre o email"/>
        </div>
        <div className="col-md-3">
          <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)} className="form-select">
            <option value="">Todos los roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.nombre}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-outline-secondary w-100"
            onClick={() => {
              setFiltroTexto("");
              setFiltroRol("");
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {mensaje && (
        <div
          className={`alert ${
            mensaje.tipo === "error" ? "alert-danger" : "alert-success"
          } mt-2`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Cargando...
                </td>
              </tr>
            ) : filtrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Sin resultados
                </td>
              </tr>
            ) : (
              filtrados.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>
                    {u.rol?.nombre ||
                      roles.find(
                        (r) => r.id === (u.rol_id || u.rol?.id)
                      )?.nombre ||
                      "-"}
                  </td>
                  <td>
                    {u.estado ? (
                      <span className="badge bg-success">Activo</span>
                    ) : (
                      <span className="badge bg-secondary">Inactivo</span>
                    )}
                  </td>
                  <td className="text-center">
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => abrirModalEditar(u)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => eliminarUsuario(u.id)}
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
      
      <ModalUsuario
        modo={modo}
        usuario={usuarioSeleccionado}
        onGuardar={onGuardar}
        roles={roles}
      />
    </div>
  );
}
