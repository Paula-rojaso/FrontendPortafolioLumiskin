import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { Eventos } from "./Blog";

describe("Componente Eventos (Blogs.jsx)", () => {
  it("renderiza el título principal", () => {
    render(
      <MemoryRouter>
        <Eventos />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /consejos, tendencias y bienestar/i })
    ).toBeInTheDocument();
  });

  it("muestra las tarjetas de los blogs", () => {
    render(
      <MemoryRouter>
        <Eventos />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /cómo construir una rutina facial/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /la importancia de cuidar tu piel/i })
    ).toBeInTheDocument();

    expect(screen.getByAltText(/rutina de cuidado facial/i)).toBeInTheDocument();
    expect(screen.getByAltText(/cuidado corporal/i)).toBeInTheDocument();
  });

  it("muestra los botones 'Leer más'", () => {
    render(
      <MemoryRouter>
        <Eventos />
      </MemoryRouter>
    );

    const botones = screen.getAllByRole("button", { name: /leer más/i });
    expect(botones.length).toBe(2);
  });

  it("los modales existen en el DOM", () => {
    render(
      <MemoryRouter>
        <Eventos />
      </MemoryRouter>
    );

    expect(document.getElementById("modalBlog1")).toBeInTheDocument();
    expect(document.getElementById("modalBlog2")).toBeInTheDocument();
  });
});