import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MiPerfil.css";

export function MiPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [comunas, setComunas] = useState([]);

  // ==========================
  // CARGAR USUARIO
  // ==========================
  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) setUsuario(JSON.parse(guardado));
  }, []);

  // ==========================
  // REGIONES & COMUNAS (COMPLETO)
  // ==========================
  const comunasPorRegion = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": [
      "Antofagasta","Mejillones","Sierra Gorda","Taltal","Calama",
      "Ollagüe","San Pedro de Atacama","Tocopilla","María Elena"
    ],
    "Atacama": ["Copiapó","Caldera","Tierra Amarilla","Chañaral","Diego de Almagro","Vallenar","Huasco","Freirina","Alto del Carmen"],
    "Coquimbo": ["La Serena","Coquimbo","Andacollo","La Higuera","Paihuano","Vicuña","Illapel","Canela","Los Vilos","Salamanca","Ovalle","Combarbalá","Monte Patria","Punitaqui","Río Hurtado"],
    "Valparaíso": [
      "Valparaíso","Viña del Mar","Concón","Quintero","Puchuncaví","Casablanca","Juan Fernández","Isla de Pascua",
      "San Antonio","Cartagena","El Quisco","El Tabo","Algarrobo","Santo Domingo","San Felipe","Llaillay",
      "Catemu","Panquehue","Putaendo","Santa María","Los Andes","Calle Larga","Rinconada","San Esteban",
      "Quillota","La Cruz","La Calera","Hijuelas","Nogales","Petorca","La Ligua","Cabildo","Zapallar",
      "Papudo","Quilpué","Villa Alemana","Limache","Olmué"
    ],
    "Región Metropolitana": [
      "Santiago","Cerrillos","Cerro Navia","Conchalí","El Bosque","Estación Central","Huechuraba","Independencia",
      "La Cisterna","La Florida","La Granja","La Pintana","La Reina","Las Condes","Lo Barnechea","Lo Espejo",
      "Lo Prado","Macul","Maipú","Ñuñoa","Pedro Aguirre Cerda","Peñalolén","Providencia","Pudahuel","Quilicura",
      "Quinta Normal","Recoleta","Renca","San Joaquín","San Miguel","San Ramón","Vitacura","Colina","Lampa",
      "Tiltil","Puente Alto","Pirque","San José de Maipo","San Bernardo","Buin","Paine","Calera de Tango",
      "Melipilla","Alhué","Curacaví","María Pinto","San Pedro","Talagante","El Monte","Isla de Maipo",
      "Padre Hurtado","Peñaflor"
    ],
    "O’Higgins": [
      "Rancagua","Machalí","Graneros","Mostazal","Codegua","Coinco","Coltauco","Doñihue","Las Cabras","Malloa",
      "Olivar","Peumo","Pichidegua","Quinta de Tilcoco","Rengo","Requínoa","San Vicente","Pichilemu","Marchigüe",
      "La Estrella","Litueche","Navidad","Paredones","San Fernando","Chimbarongo","Nancagua","Palmilla","Peralillo",
      "Placilla","Pumanque","Santa Cruz"
    ],
    "Maule": [
      "Talca","Constitución","Curepto","Empedrado","Maule","Pencahue","Río Claro","San Clemente","San Rafael",
      "Linares","Colbún","Longaví","Parral","Retiro","Villa Alegre","Yerbas Buenas","Curicó","Hualañé","Licantén",
      "Molina","Rauco","Romeral","Sagrada Familia","Teno","Vichuquén","Cauquenes","Chanco","Pelluhue"
    ],
    "Ñuble": [
      "Chillán","Chillán Viejo","Coihueco","Pinto","San Ignacio","El Carmen","Pemuco","Yungay","Quillón",
      "San Nicolás","Bulnes","Quirihue","Cobquecura","Ninhue","Portezuelo","Ránquil","Trehuaco","Coelemu"
    ],
    "Biobío": [
      "Concepción","Talcahuano","Hualpén","San Pedro de la Paz","Chiguayante","Penco","Tomé","Florida","Hualqui",
      "Santa Juana","Coronel","Lota","Los Ángeles","Cabrero","Laja","San Rosendo","Yumbel","Alto Biobío",
      "Mulchén","Nacimiento","Negrete","Quilaco","Quilleco","Santa Bárbara","Tucapel","Antuco","Arauco","Cañete",
      "Contulmo","Curanilahue","Lebu","Los Álamos","Tirúa"
    ],
    "La Araucanía": [
      "Temuco","Padre Las Casas","Lautaro","Perquenco","Vilcún","Cunco","Melipeuco","Curarrehue","Pucón","Villarrica",
      "Freire","Gorbea","Toltén","Loncoche","Teodoro Schmidt","Carahue","Nueva Imperial","Saavedra","Cholchol",
      "Angol","Renaico","Collipulli","Ercilla","Los Sauces","Purén","Lumaco","Traiguén","Victoria","Lonquimay",
      "Curacautín","Galvarino"
    ],
    "Los Ríos": [
      "Valdivia","Corral","Lanco","Los Lagos","Máfil","Mariquina","Paillaco","Panguipulli","La Unión","Futrono",
      "Lago Ranco","Río Bueno"
    ],
    "Los Lagos": [
      "Puerto Montt","Puerto Varas","Llanquihue","Frutillar","Los Muermos","Calbuco","Maullín","Cochamó",
      "Osorno","San Pablo","Puyehue","Río Negro","Purranque","San Juan de la Costa","Castro","Ancud","Chonchi",
      "Dalcahue","Puqueldón","Queilén","Quellón","Quemchi","Quinchao","Chaitén","Futaleufú","Hualaihué","Palena"
    ],
    "Aysén": [
      "Coyhaique","Aysén","Cisnes","Guaitecas","Lago Verde","Cochrane","O’Higgins","Tortel","Chile Chico","Río Ibáñez"
    ],
    "Magallanes y la Antártica": [
      "Punta Arenas","Laguna Blanca","Río Verde","San Gregorio","Natales","Torres del Paine","Porvenir","Primavera",
      "Timaukel","Cabo de Hornos","Antártica"
    ]
  };

  // ==========================
  // ACTUALIZAR COMUNAS CUANDO CAMBIA REGIÓN
  // ==========================
  useEffect(() => {
    if (usuario?.region) {
      setComunas(comunasPorRegion[usuario.region] || []);
    }
  }, [usuario]);

  if (!usuario) return <h2>Cargando...</h2>;

  // ==========================
  // HANDLERS
  // ==========================
  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
    try {
      const token = usuario.token;
      if (!token) {
        setMensaje("❌ No hay sesión activa");
        return;
      }

      const res = await fetch(
        `https://backend-usuario.onrender.com/api/usuarios/${usuario.id}/perfil`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: usuario.nombre,
            telefono: usuario.telefono,
            region: usuario.region,
            comuna: usuario.comuna,
            direccion: usuario.direccion,
            departamento: usuario.departamento,
            infoEnvio: usuario.infoEnvio,
          }),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar");

      const actualizado = await res.json();

      const usuarioConToken = {
        ...actualizado,
        token: usuario.token,
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioConToken));
      setUsuario(usuarioConToken);

      setMensaje("✔ Datos actualizados correctamente");
      setEditando(false);
    } catch (e) {
      setMensaje("❌ Error al guardar los cambios");
    }
  };

  // ==========================
  // UI
  // ==========================
  return (
    <main className="container container-perfil" style={{ maxWidth: "700px" }}>
      <h2><strong>Mi Perfil – {usuario.nombre}</strong></h2>
      <h3 className="text-muted mb-3">Información de tu cuenta</h3>

      <form>
        <div className="mb-3">
          <label>Nombre</label>
          <input
            name="nombre"
            disabled={!editando}
            type="text"
            className="form-control"
            value={usuario.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input disabled type="email" className="form-control" value={usuario.email} />
        </div>

        <div className="mb-3">
          <label>Teléfono</label>
          <input
            name="telefono"
            disabled={!editando}
            type="text"
            className="form-control"
            value={usuario.telefono || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Región</label>
          <select
            name="region"
            disabled={!editando}
            className="form-select"
            value={usuario.region || ""}
            onChange={(e) => {
              handleChange(e);
              setComunas(comunasPorRegion[e.target.value] || []);
            }}
          >
            <option value="">Selecciona región</option>
            {Object.keys(comunasPorRegion).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Comuna</label>
          <select
            name="comuna"
            disabled={!editando}
            className="form-select"
            value={usuario.comuna || ""}
            onChange={handleChange}
          >
            <option value="">Selecciona comuna</option>
            {comunas.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Dirección</label>
          <input
            name="direccion"
            disabled={!editando}
            className="form-control"
            value={usuario.direccion || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Departamento</label>
          <input
            name="departamento"
            disabled={!editando}
            className="form-control"
            value={usuario.departamento || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Información adicional</label>
          <textarea
            name="infoEnvio"
            disabled={!editando}
            className="form-control"
            value={usuario.infoEnvio || ""}
            onChange={handleChange}
          />
        </div>

        {!editando ? (
          <button type="button" className="btn button1 w-100" onClick={() => setEditando(true)}>
            Editar perfil
          </button>
        ) : (
          <button type="button" className="btn btn-success w-100" onClick={guardarCambios}>
            Guardar cambios
          </button>
        )}

        {mensaje && <div className="alert alert-info text-center mt-3">{mensaje}</div>}

        <Link to="/" className="btn btn-secondary w-100 mt-3">Volver</Link>
      </form>
    </main>
  );
}
