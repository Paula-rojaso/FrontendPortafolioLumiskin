import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./WhatsappChat.css";

export function WhatsappChat() {
  const [abierto, setAbierto] = useState(false);
  const location = useLocation();

  const numeroWhatsapp = "56997788351";

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

  const opcionesWhatsapp = [
    {
      texto: "Ver productos",
      mensaje: "Hola LumiSkin, quiero consultar por sus productos.",
    },
    {
      texto: "Consultar mi pedido",
      mensaje: "Hola LumiSkin, quiero consultar por el estado de mi pedido.",
    },
    {
      texto: "Hablar con una asesora",
      mensaje:
        "Hola LumiSkin, necesito ayuda para elegir un producto para mi piel.",
    },
    {
      texto: "Promociones disponibles",
      mensaje: "Hola LumiSkin, quiero saber si tienen promociones disponibles.",
    },
  ];

  const abrirWhatsapp = (mensaje) => {
    const paginaActual = window.location.href;

    const mensajeFinal = `${mensaje}\n\nVengo desde esta página: ${paginaActual}`;

    const texto = encodeURIComponent(mensajeFinal);

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
              aria-label="Cerrar chat"
            >
              ×
            </button>
          </div>

          <div className="whatsapp-chat-body">
            <p className="whatsapp-message">
              Hola, bienvenida a LumiSkin. ¿En qué podemos ayudarte?
            </p>

            <div className="whatsapp-options">
              {opcionesWhatsapp.map((opcion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => abrirWhatsapp(opcion.mensaje)}
                >
                  {opcion.texto}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className="whatsapp-main-button"
        onClick={() => setAbierto(!abierto)}
        aria-label={abierto ? "Cerrar chat de WhatsApp" : "Abrir chat de WhatsApp"}
      >
        <i className={`bi ${abierto ? "bi-x-lg" : "bi-whatsapp"}`}></i>
      </button>
    </div>
  );
}