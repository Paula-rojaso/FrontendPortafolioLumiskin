import { useEffect, useState } from "react";

export function AdministracionContactos() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const API_CONTACTOS = "https://backend-usuario.onrender.com/api/contactos";

  async function cargarContactos() {
    setCargando(true);
    setMensaje(null);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(API_CONTACTOS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al obtener mensajes de contacto");
      }

      const data = await res.json();
      setContactos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar contactos:", error);
      setMensaje({
        tipo: "error",
        texto: "No se pudieron cargar los mensajes de contacto.",
      });
    } finally {
      setCargando(false);
    }
  }

  async function marcarComoLeido(id) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_CONTACTOS}/${id}/leido`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("No se pudo marcar como leído");
      }

      cargarContactos();
    } catch (error) {
      console.error("Error al marcar como leído:", error);
      setMensaje({
        tipo: "error",
        texto: "No se pudo marcar el mensaje como leído.",
      });
    }
  }

  async function eliminarContacto(id) {
    if (!confirm("¿Seguro que deseas eliminar este mensaje?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_CONTACTOS}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("No se pudo eliminar el mensaje");
      }

      cargarContactos();
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      setMensaje({
        tipo: "error",
        texto: "No se pudo eliminar el mensaje.",
      });
    }
  }

  useEffect(() => {
    cargarContactos();
  }, []);

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
            Mensajes recibidos
          </span>

          <h1
            className="mt-4"
            style={{
              color: "#4b2b32",
              fontWeight: "900",
            }}
          >
            Formularios de contacto
          </h1>

          <p className="text-muted">
            Revisa los mensajes enviados por clientes desde la página de contacto.
          </p>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn rounded-pill px-4"
            style={{
              backgroundColor: "#c46a7a",
              color: "white",
              fontWeight: "700",
            }}
            onClick={cargarContactos}
          >
            Actualizar
          </button>
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
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Mensaje</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {cargando ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Cargando mensajes...
                      </td>
                    </tr>
                  ) : contactos.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No hay mensajes de contacto.
                      </td>
                    </tr>
                  ) : (
                    contactos.map((c) => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.nombre}</td>
                        <td>{c.email}</td>
                        <td style={{ maxWidth: "320px" }}>{c.contenido}</td>

                        <td>
                          {c.leido ? (
                            <span className="badge bg-success">Leído</span>
                          ) : (
                            <span className="badge bg-warning text-dark">
                              Pendiente
                            </span>
                          )}
                        </td>

                        <td>
                          {c.fechaCreacion
                            ? new Date(c.fechaCreacion).toLocaleString("es-CL")
                            : "-"}
                        </td>

                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            {!c.leido && (
                              <button
                                className="btn btn-outline-success"
                                onClick={() => marcarComoLeido(c.id)}
                              >
                                Leído
                              </button>
                            )}

                            <button
                              className="btn btn-outline-danger"
                              onClick={() => eliminarContacto(c.id)}
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
    </main>
  );
}