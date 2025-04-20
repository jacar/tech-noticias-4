"use client"

import { useEffect } from "react";
import { ErrorPage } from "@/components/ErrorPage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <ErrorPage 
      title="Error en la aplicación"
      message="Ha ocurrido un error inesperado al procesar tu solicitud"
      code="500"
      retry={() => reset()}
    />
  );
}
