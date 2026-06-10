import { useState } from "react";
import { Link } from "react-router-dom";
import "./OlvidasteContrasena.css";

export function OlvidasteContrasena() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  const emailPermitido = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

  const handleEnviar = async (e) => {
    e.preventDefault();
    setMensaje(null);

    if (!email || !emailPermitido.test(email.trim())) {
      setMensaje({
        tipo: "error",
        texto: "Ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).",
      });
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(
        "https://backend-usuario.onrender.com/api/usuarios/olvidaste-contrasena",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje({
          tipo: "error",
          texto: data.error || "No se pudo enviar el correo de recuperación.",
        });
        return;
      }

      setMensaje({
        tipo: "exito",
        texto: "Te enviamos un correo con las instrucciones para recuperar tu contraseña.",
      });
    } catch (error) {
      console.error("Error al solicitar recuperación:", error);
      setMensaje({
        tipo: "error",
        texto: "Error de conexión con el servidor. Inténtalo más tarde.",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="container container-login">
      <h2 className="mb-3">
        <strong>Olvidaste contraseña</strong>
      </h2>

      <h3 className="text-muted mb-4">
        Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu cuenta.
      </h3>

      <div className="card card-login">
        <form onSubmit={handleEnviar} style={{ marginTop: "15px" }}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>

            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn w-100 button1" disabled={cargando}>
            {cargando ? "Enviando..." : "Enviar instrucciones"}
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
            ¿Recordaste tu contraseña? <Link to="/inicio-sesion">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </main>
  );
}