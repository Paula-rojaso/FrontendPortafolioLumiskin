import { useState } from "react";
import "./ContactoForm.css";

export function ContactoForm() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    contenido: "",
  });

  const [errores, setErrores] = useState({});
  const [ok, setOk] = useState({});
  const [mensaje, setMensaje] = useState(null);

  const correoValido = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || "").trim());

  const reglas = {
    nombre: {
      test: (v) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{4,100}$/.test((v || "").trim()),
      ok: "Nombre válido.",
      bad: "Debe tener al menos 4 letras, sin números.",
    },
    email: {
    test: (v) => v.length <= 100 && correoValido(v),
    ok: "Correo válido.",
    bad: "Ingresa un correo electrónico válido.",
  },
    contenido: {
      test: (v) => (v || "").trim().length >= 10,
      ok: "Mensaje válido.",
      bad: "Debe tener al menos 10 caracteres.",
    },
  };

  const validarCampo = (name, valor) => {
    const regla = reglas[name];
    if (!regla) return;

    if (regla.test(valor)) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
      setOk((prev) => ({ ...prev, [name]: regla.ok }));
    } else {
      setOk((prev) => ({ ...prev, [name]: "" }));
      setErrores((prev) => ({ ...prev, [name]: regla.bad }));
    }
  };


  const handleSubmit = async (e) => {
  e.preventDefault();

  let valido = true;

  Object.keys(reglas).forEach((campo) => {
    const valor = form[campo];
    validarCampo(campo, valor);

    if (!reglas[campo].test(valor)) {
      valido = false;
    }
  });

  if (!valido) {
    setMensaje({
      tipo: "error",
      texto: "Revisa los campos marcados antes de enviar.",
    });
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/contacto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form), // ya tiene {nombre, email, contenido}
    });

    if (!response.ok) {
      throw new Error("Error al enviar el mensaje");
    }

    setMensaje({
      tipo: "exito",
      texto: "Mensaje enviado correctamente. Pronto nos pondremos en contacto contigo.",
    });

    setForm({
      nombre: "",
      email: "",
      contenido: "",
    });

    setErrores({});
    setOk({});
  } catch (error) {
    console.error(error);
    setMensaje({
      tipo: "error",
      texto: "Hubo un problema al enviar tu mensaje. Intenta de nuevo.",
    });
  }
};

  return (
    <main className="contacto-lumiskin">
      <div className="container">
        <div className="contacto-encabezado text-center">

          <h1><br></br>Estamos aquí para ayudarte</h1>

          <p>
            Completa el formulario y nos pondremos en contacto contigo lo antes
            posible.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">
            <div className="contacto-card">
              <form onSubmit={handleSubmit}>
                <h2 className="text-center mb-2">Formulario de contacto</h2>


                <div className="mb-3">
                  <label className="form-label">Nombre</label>

                  <input
                    name="nombre"
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className={`form-control rounded-3 ${
                      errores.nombre ? "is-invalid" : ok.nombre ? "is-valid" : ""
                    }`}
                  />

                  {errores.nombre && (
                    <div className="invalid-feedback">{errores.nombre}</div>
                  )}

                  {ok.nombre && (
                    <div className="valid-feedback">{ok.nombre}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="correo@gmail.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`form-control rounded-3 ${
                      errores.email ? "is-invalid" : ok.email ? "is-valid" : ""
                    }`}
                  />

                  {errores.email && (
                    <div className="invalid-feedback">{errores.email}</div>
                  )}

                  {ok.email && (
                    <div className="valid-feedback">{ok.email}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label">Mensaje</label>

                  <textarea
                    name="contenido"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    rows="5"
                    value={form.contenido}
                    onChange={handleChange}
                    className={`form-control rounded-3 ${
                      errores.contenido
                        ? "is-invalid"
                        : ok.contenido
                        ? "is-valid"
                        : ""
                    }`}
                  ></textarea>

                  {errores.contenido && (
                    <div className="invalid-feedback">
                      {errores.contenido}
                    </div>
                  )}

                  {ok.contenido && (
                    <div className="valid-feedback">{ok.contenido}</div>
                  )}
                </div>

                <button type="submit" className="btn-contacto-lumiskin">
                  Enviar mensaje
                </button>

                {mensaje && (
                  <div
                    className={`alert mt-4 text-center rounded-4 ${
                      mensaje.tipo === "exito"
                        ? "alert-success"
                        : "alert-danger"
                    }`}
                  >
                    {mensaje.texto}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}