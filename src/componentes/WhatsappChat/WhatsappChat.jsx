import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./WhatsappChat.css";

export function WhatsappChat() {
  const [abierto, setAbierto] = useState(false);
  const location = useLocation();

  const rutasSinWhatsapp = [
    "/admin",
    "/administrador",
    "/login-admin",
    "/admin/productos",
    "/admin/ordenes",
  ];

  const ocultarWhatsapp = rutasSinWhatsapp.some((ruta) =>
    location.pathname.toLowerCase().startsWith(ruta.toLowerCase())
  );

  if (ocultarWhatsapp) return null;

  const numeroWhatsapp = "56997788351";

  const abrirWhatsapp = (mensaje) => {
    const texto = encodeURIComponent(mensaje);
    window.open(`https://wa.me/${numeroWhatsapp}?text=${texto}`, "_blank");
  };

  return (
    <div className="whatsapp-chat-container">
      {abierto && (
        <div className="whatsapp-chat-box">
          <div className="whatsapp-chat-header">
            <div>
              <strong>LumiSkin</strong>
              <p>Asistente virtual</p>
            </div>

            <button
              type="button"
              className="whatsapp-close"
              onClick={() => setAbierto(false)}
            >
              ×
            </button>
          </div>

          <div className="whatsapp-chat-body">
            <p className="whatsapp-message">
              Hola, bienvenida a LumiSkin. ¿En qué podemos ayudarte?
            </p>

            <button
              type="button"
              onClick={() =>
                abrirWhatsapp(
                  "Hola LumiSkin, quiero consultar por sus productos."
                )
              }
            >
              Ver productos
            </button>

            <button
              type="button"
              onClick={() =>
                abrirWhatsapp(
                  "Hola LumiSkin, quiero consultar por el estado de mi pedido."
                )
              }
            >
              Consultar mi pedido
            </button>

            <button
              type="button"
              onClick={() =>
                abrirWhatsapp(
                  "Hola LumiSkin, necesito ayuda para elegir un producto para mi piel."
                )
              }
            >
              Hablar con una asesora
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="whatsapp-main-button"
        onClick={() => setAbierto(!abierto)}
        aria-label="Abrir chat de WhatsApp"
      >
        <i className="bi bi-whatsapp"></i>
      </button>
    </div>
  );
}