import { useState, useEffect } from "react";

export function ModalProducto({ modo, producto, onGuardar }) {
  const esEditar = modo === "editar";

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    categoriaId: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [errores, setErrores] = useState({});
  const [ok, setOk] = useState({});
  const [guardando, setGuardando] = useState(false); // NUEVO: Estado antipánico para congelar la UI

  const reglas = {
    nombre: {
      test: (v) => v.trim().length >= 3,
      ok: "Nombre válido.",
      bad: "Debe tener al menos 3 caracteres.",
    },
    precio: {
      test: (v) => Number(v) > 0,
      ok: "Precio válido.",
      bad: "Debe ser mayor a 0.",
    },
    stock: {
      test: (v) => Number.isInteger(Number(v)) && Number(v) >= 0,
      ok: "Stock válido.",
      bad: "Debe ser un número entero positivo.",
    },
    descripcion: {
      test: (v) => v.trim().length >= 10,
      ok: "Descripción válida.",
      bad: "Debe tener al menos 10 caracteres.",
    },
    categoriaId: {
      test: (v) => v !== "",
      ok: "Categoría seleccionada.",
      bad: "Selecciona una categoría.",
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

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("https://backendportafolio-635z.onrender.com/api/categorias");
        if (!r.ok) throw new Error("No se pudieron cargar categorías");
        const data = await r.json();
        setCategorias(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setCategorias([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || "",
        precio: producto.precio ?? "",
        stock: producto.stock ?? "",
        descripcion: producto.descripcion || "",
        categoriaId: producto.categoria?.id || producto.categoriaId || "",
      });
      setPreview(producto.imagenUrl || producto.imagen || null);
      setArchivo(null);
    } else {
      setForm({
        nombre: "",
        precio: "",
        stock: "",
        descripcion: "",
        categoriaId: "",
      });
      setPreview(null);
      setArchivo(null);
    }
    setErrores({});
    setOk({});
    setMensaje(null);
  }, [producto, modo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    validarCampo(name, value);
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setArchivo(f);
    setPreview(f ? URL.createObjectURL(f) : (producto?.imagenUrl || producto?.imagen || null));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje(null);

    if (!validarTodo()) {
      setMensaje({ tipo: "error", texto: "❌ Revisa los campos marcados en rojo." });
      return;
    }

    setGuardando(true); // Activación del estado de bloqueo

    try {
      const url = esEditar
        ? `https://backendportafolio-635z.onrender.com/api/productos/${producto.id}`
        : "https://backendportafolio-635z.onrender.com/api/productos";
      const metodo = esEditar ? "PUT" : "POST";

      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        stock: Number(form.stock),
        categoria: form.categoriaId ? { id: Number(form.categoriaId) } : null,
      };

      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al guardar producto");
      const prodGuardado = await res.json();
      const productId = prodGuardado.id ?? producto?.id;

      if (archivo && productId) {
        const fd = new FormData();
        fd.append("archivo", archivo);
        const up = await fetch(`https://backendportafolio-635z.onrender.com/api/productos/${productId}/imagen`, {
          method: "POST",
          body: fd,
        });
        if (!up.ok) throw new Error("Error al subir imagen");
      }

      setMensaje({ tipo: "exito", texto: "✅ Producto guardado correctamente." });
      onGuardar(prodGuardado);
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: "error", texto: "❌ No se pudo guardar el producto." });
    } finally {
      setGuardando(false); // Liberación del estado de bloqueo
    }
  }

  return (
    <div className="modal fade" id="modalProducto" tabIndex="-1" aria-hidden="true" data-bs-backdrop={guardando ? "static" : "true"}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div 
          className="modal-content border-0 rounded-4 shadow-lg"
          style={{ background: "linear-gradient(180deg, #ffffff 0%, #fff7f9 100%)" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="modal-header border-0 px-4 pt-4">
              <h4 className="modal-title" style={{ color: "#4b2b32", fontWeight: "900" }}>
                {esEditar ? "Modificar producto existente" : "Agregar nuevo producto"}
              </h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" disabled={guardando} />
            </div>

            <div className="modal-body px-4">
              {mensaje && (
                <div className={`alert ${mensaje.tipo === "error" ? "alert-danger" : "alert-success"} rounded-3 shadow-sm border-0 mb-4`}>
                  {mensaje.texto}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold text-uppercase mb-1">Nombre</label>
                  <input 
                    name="nombre" 
                    value={form.nombre} 
                    onChange={handleChange}
                    disabled={guardando}
                    className={`form-control rounded-3 border-0 shadow-sm ${
                      errores.nombre ? "is-invalid" : ok.nombre ? "is-valid" : ""
                    }`}
                  />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                  {ok.nombre && <div className="valid-feedback">{ok.nombre}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold text-uppercase mb-1">Categoría</label>
                  <select 
                    name="categoriaId" 
                    value={form.categoriaId}
                    onChange={handleChange}
                    disabled={guardando}
                    className={`form-select rounded-3 border-0 shadow-sm ${
                      errores.categoriaId ? "is-invalid" : ok.categoriaId ? "is-valid" : ""
                    }`}
                  >
                    <option value="">Seleccione una categoría...</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                  {errores.categoriaId && <div className="invalid-feedback">{errores.categoriaId}</div>}
                  {ok.categoriaId && <div className="valid-feedback">{ok.categoriaId}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold text-uppercase mb-1">Precio (CLP)</label>
                  <input 
                    type="number" 
                    name="precio"
                    value={form.precio}
                    onChange={handleChange}
                    disabled={guardando}
                    className={`form-control rounded-3 border-0 shadow-sm ${
                      errores.precio ? "is-invalid" : ok.precio ? "is-valid" : ""
                    }`}
                  />
                  {errores.precio && <div className="invalid-feedback">{errores.precio}</div>}
                  {ok.precio && <div className="valid-feedback">{ok.precio}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold text-uppercase mb-1">Unidades en Stock</label>
                  <input 
                    type="number" 
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    disabled={guardando}
                    className={`form-control rounded-3 border-0 shadow-sm ${
                      errores.stock ? "is-invalid" : ok.stock ? "is-valid" : ""
                    }`}
                  />
                  {errores.stock && <div className="invalid-feedback">{errores.stock}</div>}
                  {ok.stock && <div className="valid-feedback">{ok.stock}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label text-muted small fw-bold text-uppercase mb-1">Descripción del producto</label>
                  <textarea 
                    name="descripcion" 
                    value={form.descripcion}
                    onChange={handleChange}
                    disabled={guardando}
                    rows="3"
                    className={`form-control rounded-3 border-0 shadow-sm ${
                      errores.descripcion ? "is-invalid" : ok.descripcion ? "is-valid" : ""
                    }`}
                  />
                  {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
                  {ok.descripcion && <div className="valid-feedback">{ok.descripcion}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label text-muted small fw-bold text-uppercase mb-1">Imagen del Producto</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="form-control rounded-3 border-0 shadow-sm" 
                    onChange={handleFileChange} 
                    disabled={guardando}
                  />
                  {preview && (
                    <div className="mt-3">
                      <img 
                        src={preview} 
                        alt="Vista previa" 
                        style={{ 
                          width: 100, 
                          height: 100, 
                          borderRadius: 12, 
                          objectFit: "cover", 
                          border: "1px solid #f0f0f0",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 px-4 pb-4 mt-3">
              <button 
                type="button" 
                className="btn rounded-pill px-4 shadow-sm" 
                data-bs-dismiss="modal" 
                disabled={guardando}
                style={{ backgroundColor: "#fff", color: "#7a3f4b", fontWeight: "700", border: "1px solid #e8b8c2" }}
              >
                Cancelar
              </button>
              
              <button 
                type="submit" 
                className="btn rounded-pill px-4 shadow-sm d-flex align-items-center" 
                disabled={guardando}
                style={{ backgroundColor: "#c46a7a", color: "white", fontWeight: "800" }}
              >
                {guardando ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    Guardando...
                  </>
                ) : (
                  esEditar ? "Guardar cambios" : "Crear producto"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}