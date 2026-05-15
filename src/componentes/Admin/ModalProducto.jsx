import { useState, useEffect } from "react";

export function ModalProducto({ modo, producto, onGuardar }) {
  const esEditar = modo === "editar";

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    imagen: "",
    categoriaId: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [errores, setErrores] = useState({});
  const [ok, setOk] = useState({});

  const reglas = {
    nombre: {
      test: (v) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s]{3,100}$/.test((v || "").trim()),
      ok: "Nombre válido.",
      bad: "Debe tener al menos 3 caracteres alfanuméricos.",
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
    imagen: {
      test: (v) => v.trim() === "" || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v.trim()),
      ok: "URL válida.",
      bad: "Debe ser una URL válida de imagen (http/https).",
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
        imagen: producto.imagenUrl || producto.imagen || "",
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
        imagen: "",
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
    setPreview(f ? URL.createObjectURL(f) : form.imagen || null);
  };

  // ===== Envío =====
  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje(null);

    if (!validarTodo()) {
      setMensaje({ tipo: "error", texto: "❌ Revisa los campos marcados en rojo." });
      return;
    }

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

      // Subir imagen si corresponde
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
    }
  }

  return (
    <div className="modal fade" id="modalProducto" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{esEditar ? "Editar producto" : "Agregar producto"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
            </div>

            <div className="modal-body">
              {mensaje && (
                <div className={`alert ${mensaje.tipo === "error" ? "alert-danger" : "alert-success"}`}>
                  {mensaje.texto}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange}
                    className={`form-control ${
                      errores.nombre ? "is-invalid" : ok.nombre ? "is-valid" : ""
                    }`}
                  />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                  {ok.nombre && <div className="valid-feedback">{ok.nombre}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Categoría</label>
                  <select name="categoriaId" value={form.categoriaId}
                    onChange={handleChange}
                    className={`form-select ${
                      errores.categoriaId ? "is-invalid" : ok.categoriaId ? "is-valid" : ""
                    }`}
                  >
                    <option value="">Seleccione...</option>
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
                  <label className="form-label">Precio</label>
                  <input type="number" name="precio"
                    value={form.precio}
                    onChange={handleChange}
                    className={`form-control ${
                      errores.precio ? "is-invalid" : ok.precio ? "is-valid" : ""
                    }`}
                  />
                  {errores.precio && <div className="invalid-feedback">{errores.precio}</div>}
                  {ok.precio && <div className="valid-feedback">{ok.precio}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Stock</label>
                  <input type="number" name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className={`form-control ${
                      errores.stock ? "is-invalid" : ok.stock ? "is-valid" : ""
                    }`}
                  />
                  {errores.stock && <div className="invalid-feedback">{errores.stock}</div>}
                  {ok.stock && <div className="valid-feedback">{ok.stock}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea name="descripcion" value={form.descripcion}
                    onChange={handleChange}
                    rows="2"
                    className={`form-control ${
                      errores.descripcion ? "is-invalid" : ok.descripcion ? "is-valid" : ""
                    }`}
                  />
                  {errores.descripcion && (
                    <div className="invalid-feedback">{errores.descripcion}</div>
                  )}
                  {ok.descripcion && <div className="valid-feedback">{ok.descripcion}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label">URL Imagen (opcional)</label>
                  <input type="text" name="imagen"
                    value={form.imagen}
                    onChange={(e) => {
                      handleChange(e);
                      if (!archivo) setPreview(e.target.value || null);
                    }}
                    placeholder="https://..."
                    className={`form-control ${
                      errores.imagen ? "is-invalid" : ok.imagen ? "is-valid" : ""
                    }`}
                  />
                  {errores.imagen && <div className="invalid-feedback">{errores.imagen}</div>}
                  {ok.imagen && <div className="valid-feedback">{ok.imagen}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label">Subir imagen</label>
                  <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
                  {preview && (
                    <div className="mt-2">
                      <img src={preview} alt="Vista previa" style={{ width: 90, height: 90, borderRadius: 8, objectFit: "cover", border: "1px solid #ddd",}}/>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {esEditar ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}