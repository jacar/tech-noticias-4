"use client"

import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { MobileNavbar } from "@/components/MobileNavbar";
import { Footer } from "@/components/Footer";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

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
          
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            ¡Lo sentimos!
          </h1>
          
          <p className="mb-6 text-xl text-gray-600 dark:text-gray-400">
            La página que buscas no existe
          </p>
          
          <p className="mb-8 text-gray-500 dark:text-gray-500">
            Quizá has escrito mal la dirección, o la hemos roto
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
            >
              <ArrowLeft size={18} />
              Volver atrás
            </button>
            
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
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
}
