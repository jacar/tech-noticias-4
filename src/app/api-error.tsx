"use client"

import { ErrorPage } from "@/components/ErrorPage";

export default function ApiErrorPage({
  params,
}: {
  params: { code?: string };
}) {
  const code = params.code || "500";
  
  let title = "Error del servidor";
  let message = "Ha ocurrido un error al conectar con el servidor de noticias";
  
  switch (code) {
    case "400":
      title = "Solicitud incorrecta";
      message = "La solicitud enviada al servidor no es válida";
      break;
    case "401":
      title = "No autorizado";
      message = "No tienes permisos para acceder a este recurso";
      break;
    case "403":
      title = "Acceso prohibido";
      message = "No tienes permisos para acceder a este recurso";
      break;
    case "404":
      title = "Recurso no encontrado";
      message = "El recurso solicitado no existe en el servidor";
      break;
    case "429":
      title = "Demasiadas solicitudes";
      message = "Has realizado demasiadas solicitudes. Por favor, inténtalo de nuevo más tarde";
      break;
    case "500":
      title = "Error interno del servidor";
      message = "Ha ocurrido un error interno en el servidor";
      break;
    case "502":
      title = "Error de puerta de enlace";
      message = "El servidor actuó como una puerta de enlace o proxy y recibió una respuesta no válida";
      break;
    case "503":
      title = "Servicio no disponible";
      message = "El servidor no está disponible temporalmente. Por favor, inténtalo de nuevo más tarde";
      break;
    case "504":
      title = "Tiempo de espera agotado";
      message = "El servidor tardó demasiado en responder";
      break;
  }

  return (
    <ErrorPage 
      title={title}
      message={message}
      code={code}
    />
  );
}
