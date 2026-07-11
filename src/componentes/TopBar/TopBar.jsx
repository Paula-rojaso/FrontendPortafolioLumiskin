export function TopBar() {
  return (
    <div className="topbar-personalizado py-2">
      <div className="container d-flex justify-content-between align-items-center">

        <div className="redes-topbar d-flex gap-3">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
          >
            <i className="bi bi-instagram"></i>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61591822261673"
            target="_blank"
            rel="noreferrer"
          >
            <i className="bi bi-facebook"></i>
          </a>
        </div>

        <div className="text-center flex-grow-1 mensaje-topbar">
          <span>
            <i className="bi bi-truck me-2"></i>
            Despachamos a todo Chile
          </span>
        </div>

        <div style={{ width: "60px" }}></div>
      </div>
    </div>
  );
}