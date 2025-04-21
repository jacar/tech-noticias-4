"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Loading() {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(interval);
  }, []);
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950">
      <Image src="/android-chrome-192x192.png" alt="Logo" width={100} height={100} />
      <h1 className="mt-4 text-2xl font-medium">cargando{".".repeat(dots)}</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Desarrollo: Armando Ovalle J.</p>
    </main>
  );
}
