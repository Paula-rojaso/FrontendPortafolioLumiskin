import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../Carrito/ContextCarrito";

export function Navbar() {
  const navigate = useNavigate();

  const {
    carrito,
    eliminarProducto,
    totalProductos,
    actualizarCantidad,
    errores,
    vaciarCarrito,
  } = useCarrito();

  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [rol, setRol] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarSesion = () => {
      const guardado = localStorage.getItem("usuario");

      if (guardado) {
        try {
          const user = JSON.parse(guardado);
          const rolNormalizado =
            typeof user.rol === "string"
              ? user.rol.toLowerCase()
              : user.rol?.nombre?.toLowerCase() || "cliente";

          setUsuarioActivo(user);
          setRol(rolNormalizado);
        } catch {
          setUsuarioActivo(null);
          setRol(null);
        }
      } else {
        setUsuarioActivo(null);
        setRol(null);
      }
    };

    cargarSesion();
    window.addEventListener("storage", cargarSesion);

    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, arguments);
      if (key === "usuario") cargarSesion();
    };

    return () => {
      window.removeEventListener("storage", cargarSesion);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  useEffect(() => {
    const texto = busqueda.trim();

    if (texto === "") return;

    const timer = setTimeout(() => {
      navigate(`/productos?search=${encodeURIComponent(texto)}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [busqueda, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rolUsuario");
    localStorage.removeItem("nombreUsuario");

    setUsuarioActivo(null);
    setRol(null);

    navigate("/");
  };

  const handleBuscar = (e) => {
    e.preventDefault();

    const texto = busqueda.trim();

    if (!texto) {
      navigate("/productos");
      return;
    }

    navigate(`/productos?search=${encodeURIComponent(texto)}`);
  };

  const formatearPrecio = (valor) => {
    return Number(valor || 0).toLocaleString("es-CL");
  };

  const totalCarrito = carrito.reduce(
    (total, item) =>
      total + Number(item.precio || 0) * Number(item.cantidad || 0),
    0
  );

  const IconoBasurero = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  const IconoCarritoVacio = () => (
    <svg
      width="72"
      height="72"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#e8b8c2"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mb-3"
    >
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      <line x1="9" y1="10" x2="15" y2="10"></line>
    </svg>
  );

  return (
    <>
      <nav className="navbar navbar-expand-sm mi-navbar position-relative shadow-sm">
        <div className="container-fluid">
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#Menu"
            aria-controls="Menu"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <img src="/img/Menu.png" alt="Menu" style={{ width: "30px" }} />
          </button>

          <Link className="navbar-brand order-0 me-3 ms-2 ms-sm-0" to="/">
            <img src="/img/LumiSkin.png" alt="Logo" width="120" />
          </Link>

          <form
            className="d-none d-lg-flex buscador-navbar ms-3 me-4 flex-grow-1"
            style={{ maxWidth: "300px" }}
            onSubmit={handleBuscar}
          >
            <input
              type="text"
              className="form-control rounded-pill px-4 bg-light border-0"
              placeholder="🔍 Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </form>

          <div className="iconos-navbar d-flex align-items-center gap-2 gap-md-4 ms-auto">
            {usuarioActivo && (
              <span
                className="d-none d-xl-inline"
                style={{
                  color: "#4b2b32",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                Hola 👋, {usuarioActivo.nombre.split(" ")[0]}
              </span>
            )}

            <button
              type="button"
              className="btn btn-light rounded-circle p-2 position-relative border-0 shadow-sm"
              data-bs-toggle="modal"
              data-bs-target="#carritoModal"
              style={{ width: "45px", height: "45px" }}
            >
              <img
                src="/img/carrito1.png"
                alt="Carrito"
                style={{ width: "22px" }}
              />

              {totalProductos() > 0 && (
                <span
                  className="position-absolute translate-middle badge rounded-pill"
                  style={{
                    top: "5px",
                    left: "85%",
                    backgroundColor: "#c46a7a",
                    border: "2px solid #fff",
                  }}
                >
                  {totalProductos()}
                </span>
              )}
            </button>

            <button
              type="button"
              className="btn btn-light rounded-circle p-2 border-0 shadow-sm"
              data-bs-toggle="modal"
              data-bs-target="#usuarioModal"
              style={{ width: "45px", height: "45px" }}
            >
              <img src="/img/user.png" alt="Usuario" style={{ width: "20px" }} />
            </button>
          </div>

          <div className="collapse navbar-collapse mt-3 mt-sm-0" id="Menu">
            <div className="w-100">
              <ul className="navbar-nav me-auto ms-lg-4 mb-2 mb-lg-0 menu-principal-navbar fw-semibold">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="/productos"
                    data-bs-toggle="dropdown"
                  >
                    Productos
                  </Link>

                  <ul className="dropdown-menu border-0 shadow-sm rounded-3">
                    <li>
                      <Link className="dropdown-item py-2" to="/productos">
                        Todos los productos
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item py-2" to="/Cuidado-Capilar">
                        Cuidado Capilar
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2" to="/cuidado-facial">
                        Cuidado Facial
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item py-2"
                        to="/cuidado-corporal"
                      >
                        Cuidado Corporal
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2" to="/fragancias">
                        Perfumes y fragancias
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item py-2"
                        to="/Cuidado-personal"
                      >
                        Cuidado Personal
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/nosotros">
                    Nosotros
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/blogs">
                    Blogs
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/contacto">
                    Contacto
                  </Link>
                </li>

                {(rol === "admin" || rol === "administrador") && (
                  <li className="nav-item">
                    <Link className="nav-link text-primary" to="/admin">
                      ⚙️ Panel
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="modal fade" id="carritoModal" tabIndex="-1">
        <div
          className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable"
          style={{ maxWidth: "650px" }}
        >
          <div
            className="modal-content border-0 rounded-4 shadow-lg"
            style={{ background: "#ffffff" }}
          >
            <div className="modal-header border-bottom-0 px-4 pt-4 pb-2">
              <h3
                className="modal-title"
                style={{
                  color: "#4b2b32",
                  fontWeight: "900",
                  fontSize: "28px",
                }}
              >
                Mi Carrito
              </h3>

              <button
                type="button"
                className="btn-close bg-light rounded-circle p-2"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>

            <div className="modal-body px-4 custom-scrollbar">
              {carrito.length === 0 ? (
                <div className="text-center py-5">
                  <IconoCarritoVacio />

                  <h4 style={{ color: "#4b2b32", fontWeight: "800" }}>
                    Tu carrito está vacío
                  </h4>

                  <p className="text-muted mb-4">
                    ¿Aún no te decides? Tenemos los mejores productos para tu
                    piel.
                  </p>

                  <button
                    type="button"
                    className="btn rounded-pill px-5 py-3 shadow-sm"
                    style={{
                      backgroundColor: "#c46a7a",
                      color: "white",
                      fontWeight: "800",
                    }}
                    data-bs-dismiss="modal"
                    onClick={() => navigate("/productos")}
                  >
                    Ver catálogo de productos
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {carrito.map((item) => (
                    <div
                      key={item.id}
                      className="card border-0 rounded-4 shadow-sm"
                      style={{
                        backgroundColor: "#fdfbfb",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <div className="card-body p-3 d-flex align-items-center gap-3">
                        <div
                          className="bg-white rounded-3 d-flex align-items-center justify-content-center p-2"
                          style={{
                            width: "80px",
                            height: "80px",
                            border: "1px solid #eee",
                          }}
                        >
                          <img
                            src={item.imagenUrl || item.foto || "/sin-imagen.png"}
                            alt={item.nombre}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </div>

                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6
                              className="fw-bold mb-0 me-2"
                              style={{
                                color: "#4b2b32",
                                lineHeight: "1.3",
                              }}
                            >
                              {item.nombre}
                            </h6>

                            <button
                              type="button"
                              className="btn btn-link text-danger p-0 m-0 text-decoration-none opacity-75 hover-opacity-100"
                              onClick={() => eliminarProducto(item.id)}
                              title="Eliminar producto"
                            >
                              <IconoBasurero />
                            </button>
                          </div>

                          <p
                            className="mb-2 text-muted small"
                            style={{ fontSize: "13px" }}
                          >
                            ${formatearPrecio(item.precio)} c/u
                          </p>

                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-inline-flex align-items-center bg-white border rounded-pill px-2 py-1 shadow-sm">
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-decoration-none text-dark p-0 px-2 fw-bold"
                                onClick={() =>
                                  actualizarCantidad(item.id, item.cantidad - 1)
                                }
                                disabled={item.cantidad <= 1}
                              >
                                −
                              </button>

                              <span
                                className="fw-bold px-3"
                                style={{
                                  fontSize: "14px",
                                  color: "#4b2b32",
                                }}
                              >
                                {item.cantidad}
                              </span>

                              <button
                                type="button"
                                className="btn btn-sm btn-link text-decoration-none text-dark p-0 px-2 fw-bold"
                                onClick={() =>
                                  actualizarCantidad(item.id, item.cantidad + 1)
                                }
                              >
                                +
                              </button>
                            </div>

                            <span
                              className="fw-bolder fs-6"
                              style={{ color: "#2a9d8f" }}
                            >
                              ${formatearPrecio(item.precio * item.cantidad)}
                            </span>
                          </div>

                          {errores[item.id] && (
                            <small
                              className="text-danger fw-bold d-block mt-2"
                              style={{ fontSize: "11px" }}
                            >
                              ⚠️ {errores[item.id]}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {carrito.length > 0 && (
              <div
                className="modal-footer flex-column border-top-0 px-4 pb-4 pt-2"
                style={{
                  background:
                    "linear-gradient(0deg, #fffcfd 0%, #ffffff 100%)",
                }}
              >
                <div
                  className="d-flex justify-content-between w-100 align-items-center mb-3 p-3 rounded-4"
                  style={{ backgroundColor: "#f9f1f3" }}
                >
                  <span
                    className="text-muted fw-bold text-uppercase"
                    style={{ fontSize: "14px", letterSpacing: "1px" }}
                  >
                    Total a Pagar
                  </span>

                  <span
                    className="fs-3 fw-black"
                    style={{
                      color: "#4b2b32",
                      fontWeight: "900",
                    }}
                  >
                    ${formatearPrecio(totalCarrito)}
                  </span>
                </div>

                <div className="d-flex w-100 align-items-center gap-3">
                  <button
                    type="button"
                    className="btn btn-link text-muted text-decoration-none fw-semibold p-0 flex-shrink-0"
                    onClick={vaciarCarrito}
                    style={{ fontSize: "14px" }}
                  >
                    Vaciar carrito
                  </button>

                  <button
                    type="button"
                    className="btn w-100 py-3 rounded-pill shadow-sm"
                    style={{
                      backgroundColor: "#c46a7a",
                      color: "white",
                      fontWeight: "800",
                      fontSize: "17px",
                    }}
                    data-bs-dismiss="modal"
                    onClick={() => navigate("/pago")}
                  >
                    Ir a pagar de forma segura
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="modal fade" id="usuarioModal" tabIndex="-1">
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: "550px" }}
        >
          <div
            className="modal-content border-0 rounded-4 shadow-lg"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #fff7f9 100%)",
            }}
          >
            <div className="modal-header border-0 pb-0 px-4 pt-4">
              <h3
                className="modal-title w-100 text-center"
                style={{ color: "#4b2b32", fontWeight: "900" }}
              >
                Mi Cuenta
              </h3>

              <button
                className="btn-close bg-light rounded-circle p-2"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body text-center px-4 pb-5 pt-3">
              {!usuarioActivo ? (
                <>
                  <h4
                    className="mb-3"
                    style={{ color: "#080808", fontWeight: "800" }}
                  >
                    Bienvenid@ a Lumiskin
                  </h4>

                  <p className="text-muted mb-4">
                    Inicia sesión o crea tu cuenta para continuar con tu compra y
                    guardar tus datos.
                  </p>

                  <div className="d-grid gap-3 px-3">
                    <button
                      className="btn py-3 rounded-pill shadow-sm"
                      style={{
                        backgroundColor: "#c46a7a",
                        color: "white",
                        fontWeight: "700",
                        fontSize: "18px",
                      }}
                      onClick={() => {
                        navigate("/login");
                        window.bootstrap.Modal.getInstance(
                          document.getElementById("usuarioModal")
                        ).hide();
                      }}
                    >
                      Iniciar sesión
                    </button>

                    <button
                      className="btn py-3 rounded-pill"
                      style={{
                        backgroundColor: "#fff",
                        color: "#7a3f4b",
                        fontWeight: "700",
                        fontSize: "18px",
                        border: "1px solid #e8b8c2",
                      }}
                      onClick={() => {
                        navigate("/registro");
                        window.bootstrap.Modal.getInstance(
                          document.getElementById("usuarioModal")
                        ).hide();
                      }}
                    >
                      Crear cuenta nueva
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center shadow-sm"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      backgroundColor: "#f7dbe2",
                      color: "#9b4d5d",
                      fontSize: "32px",
                      fontWeight: "800",
                    }}
                  >
                    {usuarioActivo.nombre?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <h3
                    className="mb-2"
                    style={{ color: "#4b2b32", fontWeight: "800" }}
                  >
                    Hola, {usuarioActivo.nombre.split(" ")[0]}
                  </h3>

                  <p className="text-muted mb-4">¿Qué deseas hacer ahora?</p>

                  <div className="d-grid gap-3 px-3">
                    <button
                      className="btn py-3 rounded-pill"
                      style={{
                        backgroundColor: "#fff",
                        color: "#7a3f4b",
                        fontWeight: "700",
                        fontSize: "16px",
                        border: "1px solid #e8b8c2",
                      }}
                      onClick={() => {
                        navigate("/Perfil");
                        window.bootstrap.Modal.getInstance(
                          document.getElementById("usuarioModal")
                        ).hide();
                      }}
                    >
                      Ver mi perfil
                    </button>

                    <button
                      className="btn py-3 rounded-pill shadow-sm"
                      style={{
                        backgroundColor: "#c46a7a",
                        color: "white",
                        fontWeight: "800",
                        fontSize: "16px",
                      }}
                      onClick={() => {
                        navigate("/productos");
                        window.bootstrap.Modal.getInstance(
                          document.getElementById("usuarioModal")
                        ).hide();
                      }}
                    >
                      Ir a comprar
                    </button>

                    <button
                      className="btn py-3 rounded-pill mt-2"
                      style={{
                        backgroundColor: "#212529",
                        color: "white",
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}