import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { HomeSection } from "./HomeSection";

describe("Componente HomeSection", () => {

  it("renderiza las imágenes del carrusel", () => {
    render(
      <MemoryRouter>
        <HomeSection />
      </MemoryRouter>
    );

    expect(screen.getByAltText("Slide 1")).toBeInTheDocument();
    expect(screen.getByAltText("Slide 2")).toBeInTheDocument();
  });

  it("contiene los indicadores del carrusel", () => {
    render(
      <MemoryRouter>
        <HomeSection />
      </MemoryRouter>
    );

    const indicadores = document.querySelectorAll(".carousel-indicators button");
    expect(indicadores.length).toBe(5); 
  });

  it("contiene los controles prev y next del carrusel", () => {
    render(
      <MemoryRouter>
        <HomeSection />
      </MemoryRouter>
    );

    const prev = document.querySelector(".carousel-control-prev");
    const next = document.querySelector(".carousel-control-next");

    expect(prev).toBeInTheDocument();
    expect(next).toBeInTheDocument();
  });

  it("el carrusel existe en el DOM", () => {
    render(
      <MemoryRouter>
        <HomeSection />
      </MemoryRouter>
    );

    expect(document.getElementById("demo")).toBeInTheDocument();
  });

});