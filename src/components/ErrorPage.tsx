"use client"

import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/Header";
import { MobileNavbar } from "@/components/MobileNavbar";
import { Footer } from "@/components/Footer";

interface ErrorPageProps {
  title?: string;
  message?: string;
  code?: string | number;
  retry?: () => void;
}

export const ErrorPage = ({
  title = "Error del servidor",
  message = "Ha ocurrido un error al conectar con el servidor de noticias",
  code = "500",
  retry
}: ErrorPageProps) => {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!retry) return;
    
    setIsRetrying(true);
    try {
      await retry();
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-16 dark:bg-slate-950 md:pb-0">
      <Header />
      
      <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
              <AlertCircle size={48} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <div className="mb-2 inline-block rounded-md bg-red-50 px-2 py-1 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
            Error {code}
          </div>
          
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            {title}
          </h1>
          
          <p className="mb-6 text-xl text-gray-600 dark:text-gray-400">
            {message}
          </p>
          
          <p className="mb-8 text-gray-500 dark:text-gray-500">
            Por favor, inténtalo de nuevo más tarde o contacta con el administrador del sitio
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            {retry && (
              <button
                onClick={handleRetry}
                className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-70"
                disabled={isRetrying}
              >
                <RefreshCw size={18} className={isRetrying ? "animate-spin" : ""} />
                {isRetrying ? "Intentando..." : "Reintentar"}
              </button>
            )}
            
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
            >
              <Home size={18} />
              Ir a inicio
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
      <MobileNavbar />
    </main>
  );
};
