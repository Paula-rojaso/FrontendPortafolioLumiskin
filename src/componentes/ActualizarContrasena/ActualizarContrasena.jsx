import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./ActualizarContrasena.css";

export function ActualizarContrasena() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleActualizar = async (e) => {
    e.preventDefault();
    setMensaje(null);

    if (!token) {
      setMensaje({
        tipo: "error",
        texto: "El enlace no es válido.",
      });
      return;
    }

    if (nuevaContrasena.length < 8) {
      setMensaje({
        tipo: "error",
        texto: "La contraseña debe tener al menos 8 caracteres.",
      });
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setMensaje({
        tipo: "error",
        texto: "Las contraseñas no coinciden.",
      });
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(
        "https://backend-usuario.onrender.com/api/usuarios/actualizar-contrasena",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            nuevaContrasena,
          }),
        }
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje({
          tipo: "error",
          texto: data.error || "No se pudo actualizar la contraseña.",
        });
        return;
      }

        setMensaje({
        tipo: "exito",
        texto: "Tu contraseña ha sido cambiada con éxito. Por favor inicia sesión nuevamente.",
        });

        setNuevaContrasena("");
        setConfirmarContrasena("");

    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      setMensaje({
        tipo: "error",
        texto: "Error de conexión con el servidor.",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="container container-login">
      <h2 className="mb-3">
        <strong>Actualizar contraseña</strong>
      </h2>

      <h3 className="text-muted mb-4">
        Ingresa tu nueva contraseña.
      </h3>

      <div className="card card-login">
        <form onSubmit={handleActualizar} style={{ marginTop: "15px" }}>
          <div className="mb-3">
            <label className="form-label">Nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              className="form-control"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
            />
          </div>

          <button type="submit" className="btn w-100 button1" disabled={cargando}>
            {cargando ? "Actualizando..." : "Actualizar contraseña"}
          </button>

          {mensaje && (
            <div
              className={`alert mt-3 ${
                mensaje.tipo === "error" ? "alert-danger" : "alert-success"
              }`}
            >
              {mensaje.texto}
            </div>
          )}

          <p className="text-center mt-3 mb-0">
            <Link to="/login">Iniciar sesión</Link>
          </p>
        </form>
      </div>
    </main>
  );
}