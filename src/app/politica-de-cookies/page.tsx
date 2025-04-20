"use client"

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNavbar } from "@/components/MobileNavbar";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16 dark:bg-slate-950 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Política de Cookies
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 dark:prose-invert dark:text-gray-300">
            <p>
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <h2>1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tableta o móvil) cuando visita un sitio web. Las cookies se utilizan ampliamente para hacer que los sitios web funcionen, o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
            </p>
            
            <h2>2. Cómo utilizamos las cookies</h2>
            <p>
              webcincodevNew utiliza cookies para varios propósitos, incluyendo:
            </p>
            <ul>
              <li><strong>Cookies esenciales</strong>: Necesarias para el funcionamiento del sitio web. Sin estas cookies, el sitio web no podría funcionar correctamente.</li>
              <li><strong>Cookies de preferencias</strong>: Permiten que el sitio web recuerde información que cambia la forma en que el sitio se comporta o se ve, como su idioma preferido o la región en la que se encuentra.</li>
              <li><strong>Cookies estadísticas</strong>: Ayudan a entender cómo los visitantes interactúan con el sitio web recopilando y reportando información de forma anónima.</li>
              <li><strong>Cookies de marketing</strong>: Se utilizan para rastrear a los visitantes en los sitios web. La intención es mostrar anuncios que sean relevantes y atractivos para el usuario individual.</li>
            </ul>
            
            <h2>3. Tipos de cookies que utilizamos</h2>
            <p>
              En nuestro sitio web utilizamos los siguientes tipos de cookies:
            </p>
            <ul>
              <li><strong>Cookies de sesión</strong>: Son cookies temporales que se eliminan cuando cierra su navegador.</li>
              <li><strong>Cookies persistentes</strong>: Permanecen en su dispositivo hasta que expiran o hasta que las elimina manualmente.</li>
              <li><strong>Cookies propias</strong>: Establecidas por el sitio web que está visitando.</li>
              <li><strong>Cookies de terceros</strong>: Establecidas por un sitio web diferente al que está visitando.</li>
            </ul>
            
            <h2>4. Control de cookies</h2>
            <p>
              Puede controlar y/o eliminar las cookies según desee. Puede eliminar todas las cookies que ya están en su dispositivo y puede configurar la mayoría de los navegadores para evitar que se coloquen. Sin embargo, si hace esto, es posible que tenga que ajustar manualmente algunas preferencias cada vez que visite un sitio y algunas funciones y servicios pueden no funcionar.
            </p>
            <p>
              Para obtener más información sobre cómo administrar las cookies, visite <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">aboutcookies.org</a>.
            </p>
            
            <h2>5. Cookies específicas que utilizamos</h2>
            <p>
              A continuación se detallan algunas de las cookies específicas que utilizamos y los propósitos para los que se utilizan:
            </p>
            <table className="w-full border-collapse border border-gray-300 dark:border-slate-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-800">
                  <th className="border border-gray-300 p-2 dark:border-slate-700">Nombre</th>
                  <th className="border border-gray-300 p-2 dark:border-slate-700">Propósito</th>
                  <th className="border border-gray-300 p-2 dark:border-slate-700">Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">theme</td>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">Almacena la preferencia de tema (claro/oscuro) del usuario</td>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">1 año</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">savedNews</td>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">Almacena los IDs de las noticias guardadas por el usuario</td>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">Persistente</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">useRssFeed</td>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">Almacena la preferencia del usuario sobre el uso de feeds RSS</td>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">Persistente</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">analyticsSessionId</td>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">Utilizada para análisis de uso del sitio</td>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">30 días</td>
                </tr>
              </tbody>
            </table>
            
            <h2>6. Cambios en nuestra política de cookies</h2>
            <p>
              Cualquier cambio que podamos hacer en nuestra política de cookies en el futuro se publicará en esta página. Por favor, compruebe con frecuencia para ver cualquier actualización o cambio en nuestra política de cookies.
            </p>
            
            <h2>7. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre nuestras cookies o esta política de cookies, contáctenos en:
            </p>
            <ul>
              <li>Email: info@webcincodev.com</li>
              <li>Dirección: Calle Principal 123, 28001 Madrid, España</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
      <MobileNavbar />
      <DarkModeToggle />
    </main>
  );
}
