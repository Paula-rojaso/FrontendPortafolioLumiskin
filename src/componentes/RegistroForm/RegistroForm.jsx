import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./RegistroForm.css";

export function RegistroForm() {
  useEffect(() => {
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
    function cargarSelects(regionId, comunaId) {
      const regionSelect = document.getElementById(regionId);
      const comunaSelect = document.getElementById(comunaId);
      if (!regionSelect || !comunaSelect) return;

      regionSelect.innerHTML = '<option value="">Selecciona una región</option>';
      Object.keys(comunasPorRegion).forEach((region) => {
        const opcion = document.createElement("option");
        opcion.value = region;
        opcion.textContent = region;
        regionSelect.appendChild(opcion);
      });

      regionSelect.addEventListener("change", () => {
        const regionSeleccionada = regionSelect.value;
        comunaSelect.innerHTML = '<option value="">Selecciona una comuna</option>';
        comunaSelect.disabled = true;

        if (regionSeleccionada && comunasPorRegion[regionSeleccionada]) {
          comunasPorRegion[regionSeleccionada].forEach((comuna) => {
            const opcion = document.createElement("option");
            opcion.value = comuna;
            opcion.textContent = comuna;
            comunaSelect.appendChild(opcion);
          });
          comunaSelect.disabled = false;
        }
      });
    }

    function mostrarError(id, msg) {
      const input = document.getElementById(id);
      const error = document.getElementById(`err-${id}`);
      const ok = document.getElementById(`ok-${id}`);
      if (!input) return;
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      if (error) error.textContent = msg || "Campo inválido";
      if (ok) ok.textContent = "";
    }

    function mostrarOk(id, msg) {
      const input = document.getElementById(id);
      const error = document.getElementById(`err-${id}`);
      const ok = document.getElementById(`ok-${id}`);
      if (!input) return;
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
      if (error) error.textContent = "";
      if (ok) ok.textContent = msg || "✔️ Correcto";
    }

    function limpiarCampo(id) {
      const input = document.getElementById(id);
      const error = document.getElementById(`err-${id}`);
      const ok = document.getElementById(`ok-${id}`);
      if (!input) return;
      input.classList.remove("is-invalid", "is-valid");
      if (error) error.textContent = "";
      if (ok) ok.textContent = "";
    }

    function iniciarValidacion(formId) {
      const form = document.getElementById(formId);
      if (!form) return;

      if (form.dataset.listenerAdded === "true") return;
      form.dataset.listenerAdded = "true";

      const obtener = (id) => document.getElementById(id);
      const correoValido = (email) => /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test((email || "").trim());
      const passwordValida = (pass) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,100}$/.test(pass || "");
      const telefonoValido = (fono) => /^\d{9,11}$/.test((fono || "").trim());

      const reglas = {
        nombre: { test: (v) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{4,100}$/.test((v || "").trim()), ok: "Nombre válido.", bad: "Debe tener al menos 4 letras sin números." },
        email: { test: (v) => v.length <= 100 && correoValido(v), ok: "Correo válido.", bad: "Solo se aceptan @duoc.cl, @profesor.duoc.cl o @gmail.com." },
        confirmEmail: { test: (v) => v === (obtener("email")?.value?.trim() || ""), ok: "Correos coinciden.", bad: "Los correos no coinciden." },
        password: { test: (v) => passwordValida(v), ok: "Contraseña segura.", bad: "Debe tener mayúscula, minúscula, número y símbolo." },
        confirmPassword: { test: (v) => v === (obtener("password")?.value || ""), ok: "Contraseñas coinciden.", bad: "Las contraseñas no coinciden." },
        telefono: { test: (v) => v.trim() === "" || telefonoValido(v), ok: "Teléfono válido.", bad: "Debe tener entre 9 y 11 dígitos sin espacios." },
        region: { test: (v) => v !== "", ok: "Región seleccionada.", bad: "Selecciona una región." },
        comuna: { test: (v) => v !== "", ok: "Comuna seleccionada.", bad: "Selecciona una comuna." },
      };

      const campos = ["nombre", "email", "confirmEmail", "password", "confirmPassword", "telefono", "region", "comuna"];

      function validarCampo(id) {
        const campo = obtener(id);
        const regla = reglas[id];
        if (!campo || !regla) return true;
        const valor = campo.value ?? "";
        if (regla.test(valor)) {
          mostrarOk(id, regla.ok);
          return true;
        }
        mostrarError(id, regla.bad);
        return false;
      }

      campos.forEach((id) => {
        const el = obtener(id);
        if (!el) return;
        const evento = el.tagName === "SELECT" ? "change" : "input";
        el.addEventListener(evento, () => {
          validarCampo(id);
          if (id === "email") validarCampo("confirmEmail");
          if (id === "password") validarCampo("confirmPassword");
        });
        el.addEventListener("focus", () => limpiarCampo(id));
      });

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const boton = form.querySelector("button[type='submit']");
        boton.disabled = true;
        boton.textContent = "Registrando...";

        campos.forEach(limpiarCampo);

        let valido = true;
        campos.forEach((id) => {
          if (!validarCampo(id)) valido = false;
        });
        if (!valido) {
          boton.disabled = false;
          boton.textContent = "Registrarse";
          return;
        }

        const datos = {
          nombre: obtener("nombre").value.trim(),
          email: obtener("email").value.trim().toLowerCase(),
          password: obtener("password").value,
          telefono: obtener("telefono").value.trim(),
          region: obtener("region").value,
          comuna: obtener("comuna").value,
        };

        try {
          const respuesta = await fetch("https://backend-usuario.onrender.com/api/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
          });

          const prevAlert = form.querySelector(".mensaje-resultado");
          if (prevAlert) prevAlert.remove();

          const mensaje = document.createElement("div");
          mensaje.className = "mensaje-resultado mt-3";

          if (respuesta.status === 409) {
            mensaje.classList.add("alert", "alert-warning");
            mensaje.textContent = "Este correo ya está registrado.";
            form.appendChild(mensaje);
          } else if (!respuesta.ok) {
            const errorMsg = await respuesta.text();
            mensaje.classList.add("alert", "alert-danger");
            mensaje.textContent = " Error al registrar usuario: " + errorMsg;
            form.appendChild(mensaje);
          } else {
            mensaje.classList.add("alert", "alert-success");
            mensaje.textContent = "Usuario registrado correctamente. Redirigiendo...";
            form.appendChild(mensaje);
            form.reset();
            obtener("comuna").disabled = true;
            setTimeout(() => (window.location.href = "/Login"), 2000);
          }
        } catch (error) {
          console.error("Error en el registro:", error);
          const mensaje = document.createElement("div");
          mensaje.className = "alert alert-danger mensaje-resultado mt-3";
          mensaje.textContent = "No se pudo conectar con el servidor. Inténtalo más tarde.";
          form.appendChild(mensaje);
        } finally {
          boton.disabled = false;
          boton.textContent = "Registrarse";
        }
      });
    }
    cargarSelects("region", "comuna");
    iniciarValidacion("registroForm");
  }, []);

  return (
  <>
    <main className="container container-register">
      <h2 className="mb-2">
        <strong>Crea tu cuenta</strong>
      </h2>

      <h3 className="text-muted mb-4">
        Únete a LumiSkin y descubre productos pensados para cuidar y resaltar tu piel.
      </h3>

      <div className="card card-register">
        <form id="registroForm" action="" method="post">
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input type="text" className="form-control" id="nombre" placeholder="Tu nombre" />
            <div id="err-nombre" className="invalid-feedback"></div>
            <div id="ok-nombre" className="valid-feedback"></div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input type="email" className="form-control" id="email" placeholder="tucorreo@ejemplo.com" />
            <div id="err-email" className="invalid-feedback"></div>
            <div id="ok-email" className="valid-feedback"></div>
          </div>

          <div className="mb-3">
            <label htmlFor="confirmEmail" className="form-label">
              Confirmar correo electrónico
            </label>
            <input type="email" className="form-control" id="confirmEmail" placeholder="Repite tu correo" />
            <div id="err-confirmEmail" className="invalid-feedback"></div>
            <div id="ok-confirmEmail" className="valid-feedback"></div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input type="password" className="form-control" id="password" placeholder="Crea una contraseña" />
            <div id="err-password" className="invalid-feedback"></div>
            <div id="ok-password" className="valid-feedback"></div>
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar contraseña
            </label>
            <input type="password" className="form-control" id="confirmPassword" placeholder="Repite tu contraseña" />
            <div id="err-confirmPassword" className="invalid-feedback"></div>
            <div id="ok-confirmPassword" className="valid-feedback"></div>
          </div>

          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">
              Teléfono
            </label>
            <input type="tel" className="form-control" id="telefono" placeholder="Ej: 912345678" />
            <div id="err-telefono" className="invalid-feedback"></div>
            <div id="ok-telefono" className="valid-feedback"></div>
          </div>

          <div className="mb-3">
            <label htmlFor="region" className="form-label">
              Región
            </label>
            <select id="region" className="form-select"></select>
            <div id="err-region" className="invalid-feedback"></div>
            <div id="ok-region" className="valid-feedback"></div>
          </div>

          <div className="mb-4">
            <label htmlFor="comuna" className="form-label">
              Comuna
            </label>
            <select id="comuna" className="form-select" disabled></select>
            <div id="err-comuna" className="invalid-feedback"></div>
            <div id="ok-comuna" className="valid-feedback"></div>
          </div>

          <button type="submit" className="btn w-100 button1">
            Registrarme en LumiSkin
          </button>

          <p className="text-center mt-3 mb-0">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </form>
      </div>
    </main>
  </>
);
}
