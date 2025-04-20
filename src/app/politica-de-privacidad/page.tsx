"use client"

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNavbar } from "@/components/MobileNavbar";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16 dark:bg-slate-950 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Política de Privacidad
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 dark:prose-invert dark:text-gray-300">
            <p>
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <h2>1. Introducción</h2>
            <p>
              En webcincodevNew ("nosotros", "nuestro", o "el Sitio"), respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta política de privacidad le informará sobre cómo cuidamos sus datos personales cuando visita nuestro sitio web y le informará sobre sus derechos de privacidad y cómo la ley le protege.
            </p>
            
            <h2>2. Datos que Recopilamos</h2>
            <p>
              Podemos recopilar, usar, almacenar y transferir diferentes tipos de datos personales sobre usted, que hemos agrupado de la siguiente manera:
            </p>
            <ul>
              <li><strong>Datos de Identidad</strong>: incluye nombre, apellido, nombre de usuario o identificador similar.</li>
              <li><strong>Datos de Contacto</strong>: incluye dirección de correo electrónico y números de teléfono.</li>
              <li><strong>Datos Técnicos</strong>: incluye dirección de protocolo de Internet (IP), datos de inicio de sesión, tipo y versión de navegador, configuración de zona horaria y ubicación, tipos y versiones de complementos del navegador, sistema operativo y plataforma, y otra tecnología en los dispositivos que utiliza para acceder a este sitio web.</li>
              <li><strong>Datos de Perfil</strong>: incluye su nombre de usuario y contraseña, sus intereses, preferencias, comentarios y respuestas a encuestas.</li>
              <li><strong>Datos de Uso</strong>: incluye información sobre cómo utiliza nuestro sitio web, productos y servicios.</li>
            </ul>
            
            <h2>3. Cómo Recopilamos sus Datos Personales</h2>
            <p>
              Utilizamos diferentes métodos para recopilar datos de y sobre usted, incluyendo:
            </p>
            <ul>
              <li><strong>Interacciones directas</strong>: Puede proporcionarnos sus datos de identidad, contacto y financieros al completar formularios o al comunicarse con nosotros por correo postal, teléfono, correo electrónico o de otra manera.</li>
              <li><strong>Tecnologías o interacciones automatizadas</strong>: A medida que interactúa con nuestro sitio web, podemos recopilar automáticamente datos técnicos sobre su equipo, acciones de navegación y patrones. Recopilamos estos datos personales mediante el uso de cookies, registros del servidor y otras tecnologías similares.</li>
            </ul>
            
            <h2>4. Cómo Utilizamos sus Datos Personales</h2>
            <p>
              Solo utilizaremos sus datos personales cuando la ley nos lo permita. Más comúnmente, utilizaremos sus datos personales en las siguientes circunstancias:
            </p>
            <ul>
              <li>Donde necesitemos ejecutar el contrato que estamos a punto de celebrar o hemos celebrado con usted.</li>
              <li>Donde sea necesario para nuestros intereses legítimos (o los de un tercero) y sus intereses y derechos fundamentales no anulen esos intereses.</li>
              <li>Donde necesitemos cumplir con una obligación legal o regulatoria.</li>
            </ul>
            
            <h2>5. Divulgación de sus Datos Personales</h2>
            <p>
              Podemos compartir sus datos personales con las partes establecidas a continuación para los fines establecidos en la sección 4 anterior:
            </p>
            <ul>
              <li>Proveedores de servicios que proporcionan servicios de TI y administración de sistemas.</li>
              <li>Asesores profesionales que incluyen abogados, banqueros, auditores y aseguradoras.</li>
              <li>Autoridades fiscales, reguladoras y otras autoridades.</li>
              <li>Terceros a quienes podemos elegir vender, transferir o fusionar partes de nuestro negocio o nuestros activos.</li>
            </ul>
            <p>
              Requerimos a todos los terceros que respeten la seguridad de sus datos personales y los traten de acuerdo con la ley. No permitimos a nuestros proveedores de servicios terceros utilizar sus datos personales para sus propios fines y solo les permitimos procesar sus datos personales para fines específicos y de acuerdo con nuestras instrucciones.
            </p>
            
            <h2>6. Seguridad de Datos</h2>
            <p>
              Hemos implementado medidas de seguridad apropiadas para evitar que sus datos personales se pierdan, utilicen o accedan de manera no autorizada, se modifiquen o divulguen accidentalmente. Además, limitamos el acceso a sus datos personales a aquellos empleados, agentes, contratistas y otros terceros que tienen una necesidad comercial de conocer. Solo procesarán sus datos personales según nuestras instrucciones y están sujetos a un deber de confidencialidad.
            </p>
            
            <h2>7. Retención de Datos</h2>
            <p>
              Solo conservaremos sus datos personales durante el tiempo que sea necesario para cumplir con los fines para los que los recopilamos, incluyendo para satisfacer cualquier requisito legal, contable o de informes.
            </p>
            
            <h2>8. Sus Derechos Legales</h2>
            <p>
              Bajo ciertas circunstancias, tiene derechos bajo las leyes de protección de datos en relación con sus datos personales, incluyendo el derecho a:
            </p>
            <ul>
              <li>Solicitar acceso a sus datos personales.</li>
              <li>Solicitar la corrección de sus datos personales.</li>
              <li>Solicitar la eliminación de sus datos personales.</li>
              <li>Oponerse al procesamiento de sus datos personales.</li>
              <li>Solicitar la restricción del procesamiento de sus datos personales.</li>
              <li>Solicitar la transferencia de sus datos personales.</li>
              <li>Retirar el consentimiento.</li>
            </ul>
            
            <h2>9. Cookies</h2>
            <p>
              Puede configurar su navegador para rechazar todas o algunas cookies del navegador, o para alertarle cuando los sitios web establezcan o accedan a cookies. Si deshabilita o rechaza cookies, tenga en cuenta que algunas partes de este sitio web pueden volverse inaccesibles o no funcionar correctamente.
            </p>
            
            <h2>10. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre esta política de privacidad o nuestras prácticas de privacidad, contáctenos en:
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
