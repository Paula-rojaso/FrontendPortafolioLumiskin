
export function HomeSection() {
  return (
    <>
      <div className="container">
        <div
          id="demo"
          className="carousel slide mt-5"
          data-bs-ride="carousel"
          data-bs-interval="3000"
        >
          {/* Indicadores */}
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#demo" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
            <button type="button" data-bs-target="#demo" data-bs-slide-to="3"></button>
            <button type="button" data-bs-target="#demo" data-bs-slide-to="4"></button>
          </div>

          {/* Slides */}
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/img/fotoCar1.png" alt="Slide 1" className="d-block w-100" />
            </div>

            <div className="carousel-item">
              <img src="/img/fotoCar2.png" alt="Slide 2" className="d-block w-100" />
            </div>

            <div className="carousel-item">
              <img src="/img/fotoCar3.jpg" alt="Slide 3" className="d-block w-100" />
            </div>

            <div className="carousel-item">
              <img src="/img/fotoCar4.jpg" alt="Slide 4" className="d-block w-100" />
            </div>

            <div className="carousel-item">
              <img src="/img/fotoCar5.jpg" alt="Slide 5" className="d-block w-100" />
            </div>
          </div>

          {/* Botones */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#demo"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#demo"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
    </>
  );
}