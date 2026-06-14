import { renderHook, act } from "@testing-library/react";
import { CarritoProvider, useCarrito } from "./ContextCarrito";
import { vi } from "vitest";

// mock localStorage
beforeEach(() => {
  const store = {};
  global.localStorage = {
    getItem: vi.fn((key) => store[key]),
    setItem: vi.fn((key, val) => (store[key] = val)),
    removeItem: vi.fn((key) => delete store[key]),
  };
});

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ stock: 10 }),
  })
);

describe("CarritoContext", () => {
  it("agrega un producto al carrito", async () => {
    const wrapper = ({ children }) => (
      <CarritoProvider>{children}</CarritoProvider>
    );

    const { result } = renderHook(() => useCarrito(), { wrapper });
    const producto = { id: 1, nombre: "Polera Negra" };
    await act(async () => {
      await result.current.agregarProducto(producto);
    });

    expect(result.current.carrito.length).toBe(1);
    expect(result.current.carrito[0].nombre).toBe("Polera Negra");
    expect(result.current.carrito[0].cantidad).toBe(1);
  });
});
