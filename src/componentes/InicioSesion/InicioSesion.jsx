import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./InicioSesion.css";

export function InicioSesion() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  const emailPermitido = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

  const validarCampo = (id, valor) => {
    const input = document.getElementById(id);
    const err = document.getElementById(`err-${id}`);
    const ok = document.getElementById(`ok-${id}`);

    if (!input) return false;
    input.classList.remove("is-invalid", "is-valid");
    if (err) err.textContent = "";
    if (ok) ok.textContent = "";

    if (id === "email") {
      if (!valor || !emailPermitido.test(valor.trim())) {
        input.classList.add("is-invalid");
        err.textContent =
          "Ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com)";
        return false;
      }
      input.classList.add("is-valid");
      ok.textContent = "Correo válido.";
      return true;
    }

    if (id === "password") {
      if (!valor || valor.trim().length < 8) {
        input.classList.add("is-invalid");
        err.textContent = "La contraseña debe tener al menos 8 caracteres.";
        return false;
      }
      input.classList.add("is-valid");
      ok.textContent = "Contraseña válida.";
      return true;
    }

    return true;
  };

  useEffect(() => {
    const emailRecordado = localStorage.getItem("emailRecordado");
    if (emailRecordado) {
      setEmail(emailRecordado);
      const check = document.getElementById("Recordar");
      if (check) check.checked = true;
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje(null);

    const validoEmail = validarCampo("email", email);
    const validoPass = validarCampo("password", password);
    if (!validoEmail || !validoPass) return;

    setCargando(true);

    try {
      const respuesta = await fetch("https://backend-usuario.onrender.com/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        const mensajeError =
          typeof data === "object" && data !== null
            ? data.error || JSON.stringify(data)
            : data;

        setMensaje({
          tipo: "error",
          texto: mensajeError || "⚠️ Credenciales incorrectas.",
        });
        return;
      }

      // Usuario guardado completo
      const usuarioGuardado = {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        region: data.region,
        comuna: data.comuna,
        direccion: data.direccion,
        departamento: data.departamento,
        infoEnvio: data.infoEnvio,
        rol: data.rol,
        estado: data.estado,
        token: data.token
      };

      // Guardar correctamente
      localStorage.setItem("usuario", JSON.stringify(usuarioGuardado));
      localStorage.setItem("token", data.token); 
      localStorage.setItem("rolUsuario", data.rol?.toLowerCase() || "cliente");
      localStorage.setItem("nombreUsuario", data.nombre);
      localStorage.setItem("mostrarModalUsuario", "true");

      // Actualizar navbar
      window.dispatchEvent(new Event("storage"));

      // Recordar correo (checkbox)
      const recordar = document.getElementById("Recordar");
      if (recordar && recordar.checked) {
        localStorage.setItem("emailRecordado", email);
      } else {
        localStorage.removeItem("emailRecordado");
      }

      setMensaje({
        tipo: "exito",
        texto: "✅ Inicio de sesión exitoso. Redirigiendo...",
      });

      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      console.error("❌Error de login:", error);
      setMensaje({
        tipo: "error",
        texto: "❌ Error de conexión con el servidor. Inténtalo más tarde.",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="container container-login">
      <h2 className="mb-3"><strong>Inicio de Sesión</strong></h2>
      <h3 className="text-muted mb-4">
        Inicia sesión para acceder a tu cuenta y continuar tu experiencia en LumiSkin.
      </h3>

      <div className="card card-login">
        <form onSubmit={handleLogin} id="loginForm" method="post" style={{ marginTop: "15px" }}>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => validarCampo("email", e.target.value)}
            />
            <div id="err-email" className="invalid-feedback"></div>
            <div id="ok-email" className="valid-feedback"></div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => validarCampo("password", e.target.value)}
            />
            <div id="err-password" className="invalid-feedback"></div>
            <div id="ok-password" className="valid-feedback"></div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="Recordar" />
              <label className="form-check-label" htmlFor="Recordar">Recordarme</label>
            </div>
            <Link to="/olvidaste-contrasena" className="text-decoration-none">¿Olvidaste tu contraseña?</Link>
          </div>

          <button type="submit" className="btn w-100 button1" disabled={cargando}>
            {cargando ? "Verificando..." : "Iniciar Sesión"}
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
            ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
