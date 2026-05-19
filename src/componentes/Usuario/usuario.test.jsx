
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { Usuario } from "./Usuario";

global.bootstrap = {
  Modal: class {
    constructor() {}
    show() {}
    hide() {}
    static getInstance() {
      return { hide() {} };
    }
  },
};

global.confirm = vi.fn(() => true);


vi.mock("./ModalUsuario", () => ({
  ModalUsuario: () => <div data-testid="modal-usuario" />
}));

global.fetch = vi.fn((url) => {
  if (url.includes("usuarios")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            nombre: "Pancho",
            email: "pancho@example.com",
            rol_id: 1,
            estado: true,
          },
          {
            id: 2,
            nombre: "Catalina",
            email: "cata@example.com",
            rol_id: 2,
            estado: false,
          },
        ]),
    });
  }

  if (url.includes("roles")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, nombre: "Admin" },
          { id: 2, nombre: "Usuario" },
        ]),
    });
  }

  if (url.includes("/api/usuarios/1")) {
    return Promise.resolve({ ok: true });
  }

  return Promise.reject("URL no mockeada: " + url);
});

// ===========================
// TESTS
// ===========================
describe("Usuario component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga y muestra usuarios", async () => {
    render(<Usuario />);

    // Espera renderizado
    await screen.findByText("Pancho");
    await screen.findByText("Catalina");

    expect(screen.getByText("Pancho")).toBeInTheDocument();
    expect(screen.getByText("Catalina")).toBeInTheDocument();
  });

  it("filtra por texto", async () => {
    render(<Usuario />);

    await screen.findByText("Pancho");

    const input = screen.getByPlaceholderText(/buscar/i);

    await userEvent.type(input, "cata");

    expect(screen.getByText("Catalina")).toBeInTheDocument();
    expect(screen.queryByText("Pancho")).not.toBeInTheDocument();
  });

  it("filtra por rol", async () => {
    render(<Usuario />);

    await screen.findByText("Pancho");

    const select = screen.getByRole("combobox");

    await userEvent.selectOptions(select, "Admin");

    expect(screen.getByText("Pancho")).toBeInTheDocument();
    expect(screen.queryByText("Catalina")).not.toBeInTheDocument();
  });

  it("abre modal al presionar 'Agregar usuario'", async () => {
    render(<Usuario />);

    const boton = screen.getByRole("button", { name: /agregar usuario/i });

    await userEvent.click(boton);

    expect(screen.getByTestId("modal-usuario")).toBeInTheDocument();
  });

  it("abre modal al presionar 'Editar'", async () => {
    render(<Usuario />);

    await screen.findByText("Pancho");

    const btnEditar = screen.getAllByRole("button", { name: /editar/i })[0];

    await userEvent.click(btnEditar);

    expect(screen.getByTestId("modal-usuario")).toBeInTheDocument();
  });

  it("elimina usuario correctamente", async () => {
    render(<Usuario />);

    await screen.findByText("Pancho");

    const btnEliminar = screen.getAllByRole("button", { name: /eliminar/i })[0];

    await userEvent.click(btnEliminar);

    expect(global.confirm).toHaveBeenCalled();

    // asegurar llamada DELETE
    expect(global.fetch).toHaveBeenCalledWith(
      "https://backend-usuario.onrender.com/api/usuarios/1",
      expect.any(Object)
    );
  });

  it("muestra 'Sin resultados' si no coincide nada", async () => {
    render(<Usuario />);

    await screen.findByText("Pancho");

    const input = screen.getByPlaceholderText(/buscar/i);

    await userEvent.type(input, "zzzzzzzz");

    expect(screen.getByText(/sin resultados/i)).toBeInTheDocument();
  });
});
