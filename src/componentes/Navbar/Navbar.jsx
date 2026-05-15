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
    setBusqueda("");
  };

  const formatearPrecio = (valor) => {
    return Number(valor || 0).toLocaleString("es-CL");
  };

  const totalCarrito = carrito.reduce(
    (total, item) =>
      total + Number(item.precio || 0) * Number(item.cantidad || 0),
    0
  );

  return (
    <>
      <nav className="navbar navbar-expand-sm mi-navbar position-relative">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#Menu"
            aria-controls="Menu"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <img src="/img/Menu.png" alt="Menu" />
          </button>

          <Link className="navbar-brand order-0 me-3" to="/">
            <img src="/img/LumiSkin.png" alt="Logo" width="120" />
          </Link>

          <form
            className="d-none d-lg-flex buscador-navbar ms-3 me-4"
            onSubmit={handleBuscar}
          >
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <button type="submit" className="btn btn-buscar-navbar">
              Buscar
            </button>
          </form>

          <div className="iconos-navbar d-flex align-items-center gap-3">
            {usuarioActivo && (
              <span
                className="d-none d-md-inline"
                style={{
                  color: "#4b2b32",
                  fontWeight: "500",
                  fontSize: "15px",
                }}
              >
                Hola 👋, {usuarioActivo.nombre}
              </span>
            )}

            <button
              type="button"
              className="btn btn-transparent p-0 position-relative"
              data-bs-toggle="modal"
              data-bs-target="#carritoModal"
            >
              <img src="/img/carrito1.png" alt="Carrito" />

              {totalProductos() > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalProductos()}
                </span>
              )}
            </button>

            <button
              type="button"
              className="btn btn-transparent p-0"
              data-bs-toggle="modal"
              data-bs-target="#usuarioModal"
            >
              <img src="/img/user.png" alt="Usuario" />
            </button>
          </div>

          <div className="collapse navbar-collapse" id="Menu">
            <div className="w-100">
              <ul className="navbar-nav me-auto ms-4 mb-2 mb-lg-0 menu-principal-navbar">
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

                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/productos">
                        Todos los productos
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/Cuidado-Capilar">
                        Cuidado Capilar
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/cuidado-facial">
                        Cuidado Facial
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/cuidado-corporal">
                        Cuidado Corporal
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/fragancias">
                        Perfumes y fragancias
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/Cuidado-personal">
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
                    <Link className="nav-link" to="/admin">
                      Panel de administración
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* MODAL CARRITO */}
      <div className="modal fade" id="carritoModal" tabIndex="-1">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          style={{ maxWidth: "760px" }}
        >
          <div
            className="modal-content border-0 rounded-4 shadow-lg"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #fff7f9 100%)",
              border: "1px solid #f1d4dc",
            }}
          >
            <div className="modal-header border-0 px-4 pt-4">
              <h2
                className="modal-title w-100 text-center"
                style={{
                  color: "#4b2b32",
                  fontWeight: "800",
                  fontSize: "30px",
                }}
              >
                Mi carrito
              </h2>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>

            <div className="modal-body px-4 pb-4">
              {carrito.length === 0 ? (
                <div className="text-center py-4">
                  <h4 style={{ color: "#4b2b32", fontWeight: "800" }}>
                    Tu carrito está vacío
                  </h4>

                  <p className="text-muted mb-4">
                    Agrega productos para continuar con tu compra.
                  </p>

                  <button
                    type="button"
                    className="btn rounded-pill px-4 py-2"
                    style={{
                      backgroundColor: "#c46a7a",
                      color: "white",
                      fontWeight: "700",
                    }}
                    data-bs-dismiss="modal"
                    onClick={() => navigate("/productos")}
                  >
                    Ver productos
                  </button>
                </div>
              ) : (
                <>
                  {carrito.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex justify-content-between align-items-center border-bottom py-3 gap-3"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={
                            item.imagen_url ||
                            item.foto ||
                            "https://via.placeholder.com/80"
                          }
                          alt={item.nombre}
                          style={{
                            width: "75px",
                            height: "75px",
                            objectFit: "cover",
                            borderRadius: "14px",
                          }}
                        />

                        <div>
                          <h5
                            className="mb-1"
                            style={{
                              color: "#4b2b32",
                              fontWeight: "800",
                            }}
                          >
                            {item.nombre}
                          </h5>

                          <p className="mb-1 text-muted">
                            ${formatearPrecio(item.precio)} x {item.cantidad}
                          </p>

                          {errores[item.id] && (
                            <small className="text-danger fw-bold">
                              {errores[item.id]}
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            actualizarCantidad(item.id, item.cantidad - 1)
                          }
                        >
                          -
                        </button>

                        <span className="fw-bold px-2">{item.cantidad}</span>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            actualizarCantidad(item.id, item.cantidad + 1)
                          }
                        >
                          +
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={() => eliminarProducto(item.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {carrito.length > 0 && (
              <div className="modal-footer border-0 d-flex justify-content-between px-4 pb-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={vaciarCarrito}
                >
                  Vaciar carrito
                </button>

                <div className="d-flex align-items-center gap-3">
                  <h5
                    className="mb-0"
                    style={{
                      color: "#4b2b32",
                      fontWeight: "900",
                    }}
                  >
                    Total: ${formatearPrecio(totalCarrito)}
                  </h5>

                  <button
                    type="button"
                    className="btn rounded-pill px-4"
                    style={{
                      backgroundColor: "#c46a7a",
                      color: "white",
                      fontWeight: "800",
                    }}
                    data-bs-dismiss="modal"
                    onClick={() => navigate("/pago")}
                  >
                    Ir a pagar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL USUARIO */}
      <div className="modal fade" id="usuarioModal" tabIndex="-1">
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: "620px" }}
        >
          <div
            className="modal-content border-0 rounded-4 shadow-lg"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #fff7f9 100%)",
              border: "1px solid #f1d4dc",
            }}
          >
            <div className="modal-header border-0 pb-0 px-5 pt-4">
              <h2
                className="modal-title w-100 text-center"
                style={{
                  color: "#4b2b32",
                  fontWeight: "800",
                  fontSize: "34px",
                }}
              >
                Mi cuenta
              </h2>

              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body text-center px-5 pb-5 pt-3">
              {!usuarioActivo ? (
                <>
                  <h3
                    className="mb-3"
                    style={{
                      color: "#080808",
                      fontWeight: "800",
                      fontSize: "30px",
                    }}
                  >
                    Bienvenid@ a Lumiskin
                  </h3>

                  <p
                    className="text-muted mb-4"
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.6",
                    }}
                  >
                    Inicia sesión o crea tu cuenta para continuar con tu compra y guardar tus datos.
                  </p>

                  <button
                    className="btn w-100 py-3 rounded-pill mb-3"
                    style={{
                      backgroundColor: "#c46a7a",
                      color: "white",
                      fontWeight: "500",
                      fontSize: "20px",
                      boxShadow: "0 10px 20px rgba(196, 106, 122, 0.25)",
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
                    className="btn w-100 py-3 rounded-pill"
                    style={{
                      backgroundColor: "#fff",
                      color: "#7a3f4b",
                      fontWeight: "500",
                      fontSize: "20px",
                      border: "1px solid #e8b8c2",
                    }}
                    onClick={() => {
                      navigate("/registro");
                      window.bootstrap.Modal.getInstance(
                        document.getElementById("usuarioModal")
                      ).hide();
                    }}
                  >
                    Crear cuenta
                  </button>
                </>
              ) : (
                <>
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "82px",
                      height: "82px",
                      borderRadius: "50%",
                      backgroundColor: "#f7dbe2",
                      color: "#9b4d5d",
                      fontSize: "34px",
                      fontWeight: "800",
                    }}
                  >
                    {usuarioActivo.nombre?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <h3
                    className="mb-2"
                    style={{
                      color: "#4b2b32",
                      fontWeight: "800",
                      fontSize: "30px",
                    }}
                  >
                    Hola, {usuarioActivo.nombre}
                  </h3>

                  <p className="text-muted mb-4" style={{ fontSize: "17px" }}>
                    ¿Qué deseas hacer ahora?
                  </p>

                  <div className="d-grid gap-3">
                    <button
                      className="btn py-3 rounded-pill"
                      style={{
                        backgroundColor: "#fff",
                        color: "#7a3f4b",
                        fontWeight: "700",
                        fontSize: "17px",
                        border: "1px solid #e8b8c2",
                      }}
                      onClick={() => {
                        navigate("/Perfil");
                        window.bootstrap.Modal.getInstance(
                          document.getElementById("usuarioModal")
                        ).hide();
                      }}
                    >
                      Mi perfil
                    </button>

                    <button
                      className="btn py-3 rounded-pill"
                      style={{
                        backgroundColor: "#c46a7a",
                        color: "white",
                        fontWeight: "800",
                        fontSize: "17px",
                        boxShadow: "0 10px 20px rgba(196, 106, 122, 0.25)",
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
                      className="btn py-3 rounded-pill"
                      style={{
                        backgroundColor: "#000000",
                        color: "white",
                        fontWeight: "500",
                        fontSize: "19px",
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