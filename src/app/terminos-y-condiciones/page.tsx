"use client"

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNavbar } from "@/components/MobileNavbar";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16 dark:bg-slate-950 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Términos y Condiciones
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 dark:prose-invert dark:text-gray-300">
            <p>
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <h2>1. Introducción</h2>
            <p>
              Bienvenido a webcincodevNew ("nosotros", "nuestro", o "el Sitio"). Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos Términos y Condiciones, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables.
            </p>
            <p>
              Si no está de acuerdo con alguno de estos términos, tiene prohibido utilizar o acceder a este sitio. Los materiales contenidos en este sitio web están protegidos por las leyes de derechos de autor y marcas registradas aplicables.
            </p>
            
            <h2>2. Licencia de Uso</h2>
            <p>
              Se concede permiso para descargar temporalmente una copia de los materiales (información o software) en el sitio web de webcincodevNew para visualización transitoria personal y no comercial únicamente. Esta es la concesión de una licencia, no una transferencia de título, y bajo esta licencia usted no puede:
            </p>
            <ul>
              <li>Modificar o copiar los materiales;</li>
              <li>Utilizar los materiales para cualquier propósito comercial o para cualquier exhibición pública (comercial o no comercial);</li>
              <li>Intentar descompilar o aplicar ingeniería inversa a cualquier software contenido en el sitio web de webcincodevNew;</li>
              <li>Eliminar cualquier derecho de autor u otras notaciones de propiedad de los materiales; o</li>
              <li>Transferir los materiales a otra persona o "reflejar" los materiales en cualquier otro servidor.</li>
            </ul>
            <p>
              Esta licencia terminará automáticamente si viola cualquiera de estas restricciones y puede ser terminada por webcincodevNew en cualquier momento. Al terminar su visualización de estos materiales o al finalizar esta licencia, debe destruir cualquier material descargado en su posesión, ya sea en formato electrónico o impreso.
            </p>
            
            <h2>3. Exención de Responsabilidad</h2>
            <p>
              Los materiales en el sitio web de webcincodevNew se proporcionan "tal cual". webcincodevNew no ofrece garantías, expresas o implícitas, y por la presente renuncia y niega todas las demás garantías, incluyendo, sin limitación, garantías implícitas o condiciones de comerciabilidad, idoneidad para un propósito particular, o no infracción de propiedad intelectual u otra violación de derechos.
            </p>
            <p>
              Además, webcincodevNew no garantiza ni hace ninguna representación con respecto a la precisión, los resultados probables, o la confiabilidad del uso de los materiales en su sitio web o de otra manera relacionados con dichos materiales o en cualquier sitio vinculado a este sitio.
            </p>
            
            <h2>4. Limitaciones</h2>
            <p>
              En ningún caso webcincodevNew o sus proveedores serán responsables por cualquier daño (incluyendo, sin limitación, daños por pérdida de datos o beneficios, o debido a la interrupción del negocio) que surja del uso o la incapacidad de usar los materiales en el sitio web de webcincodevNew, incluso si webcincodevNew o un representante autorizado de webcincodevNew ha sido notificado oralmente o por escrito de la posibilidad de tales daños.
            </p>
            <p>
              Debido a que algunas jurisdicciones no permiten limitaciones en garantías implícitas, o limitaciones de responsabilidad por daños consecuentes o incidentales, estas limitaciones pueden no aplicarse a usted.
            </p>
            
            <h2>5. Precisión de los Materiales</h2>
            <p>
              Los materiales que aparecen en el sitio web de webcincodevNew podrían incluir errores técnicos, tipográficos o fotográficos. webcincodevNew no garantiza que cualquiera de los materiales en su sitio web sea preciso, completo o actual. webcincodevNew puede realizar cambios a los materiales contenidos en su sitio web en cualquier momento sin previo aviso. Sin embargo, webcincodevNew no se compromete a actualizar los materiales.
            </p>
            
            <h2>6. Enlaces</h2>
            <p>
              webcincodevNew no ha revisado todos los sitios vinculados a su sitio web y no es responsable por el contenido de ningún sitio vinculado. La inclusión de cualquier enlace no implica respaldo por parte de webcincodevNew del sitio. El uso de cualquier sitio web vinculado es bajo el propio riesgo del usuario.
            </p>
            
            <h2>7. Modificaciones</h2>
            <p>
              webcincodevNew puede revisar estos términos de servicio para su sitio web en cualquier momento sin previo aviso. Al usar este sitio web, usted acepta estar sujeto a la versión actual de estos términos de servicio.
            </p>
            
            <h2>8. Ley Aplicable</h2>
            <p>
              Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes de España y usted se somete irrevocablemente a la jurisdicción exclusiva de los tribunales en esa ubicación.
            </p>
            
            <h2>9. Política de Privacidad</h2>
            <p>
              Su privacidad es importante para nosotros. Es política de webcincodevNew respetar su privacidad con respecto a cualquier información que podamos recopilar de usted a través de nuestro sitio web. Para más información, consulte nuestra Política de Privacidad.
            </p>
            
            <h2>10. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos en:
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
