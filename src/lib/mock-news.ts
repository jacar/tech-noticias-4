import { NewsItem } from "@/types";
import { newsSources } from "./news-sources";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// Función para generar fechas aleatorias recientes
const getRandomRecentDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7); // Entre 0 y 7 días atrás
  const hoursAgo = Math.floor(Math.random() * 24); // Entre 0 y 24 horas atrás

  now.setDate(now.getDate() - daysAgo);
  now.setHours(now.getHours() - hoursAgo);
  return now.toISOString();
};

// Función para formatear la fecha en "hace X tiempo"
export const formatRelativeTime = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: es
  });
};
export const mockNews: NewsItem[] = [{
  id: "1",
  title: "Apple Vision Pro: probamos las gafas de realidad mixta más avanzadas del mercado",
  description: "Analizamos en profundidad el nuevo dispositivo de Apple que promete revolucionar la forma en que interactuamos con el contenido digital mediante una experiencia inmersiva sin precedentes.",
  source: "Xataka",
  sourceUrl: newsSources.find(s => s.id === "xataka")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1707343843982-f8275f3994c5?q=80&w=2070&auto=format&fit=crop",
  url: "https://www.xataka.com/realidad-virtual-aumentada/apple-vision-pro-analisis-caracteristicas-precio-especificaciones",
  publishedAt: getRandomRecentDate(),
  category: "Dispositivos"
}, {
  id: "2",
  title: "La IA generativa de Google Gemini supera a GPT-4 en pruebas de razonamiento complejo",
  description: "El nuevo modelo de inteligencia artificial de Google demuestra capacidades superiores en tareas que requieren razonamiento matemático y comprensión contextual avanzada.",
  source: "Xataka",
  sourceUrl: newsSources.find(s => s.id === "xataka")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
  url: "https://www.xataka.com/inteligencia-artificial/google-gemini-supera-gpt4-pruebas-razonamiento",
  publishedAt: getRandomRecentDate(),
  category: "Inteligencia Artificial"
}, {
  id: "3",
  title: "Samsung Galaxy S24 Ultra: análisis completo del nuevo buque insignia coreano",
  description: "Probamos a fondo el smartphone más avanzado de Samsung, con su revolucionario sistema de cámaras, procesador Snapdragon 8 Gen 3 y nuevas funciones de IA integradas en One UI 6.1.",
  source: "El Androide Libre",
  sourceUrl: newsSources.find(s => s.id === "elandroidelibre")?.url || "",
  imageUrl: "https://picsum.photos/200",
  url: "https://elandroidelibre.elespanol.com/2024/02/samsung-galaxy-s24-ultra-analisis-review-opinion.html",
  publishedAt: getRandomRecentDate(),
  category: "Dispositivos"
}, {
  id: "4",
  title: "Así es Rabbit r1, el dispositivo de IA que quiere reemplazar a tu smartphone",
  description: "Analizamos este curioso gadget que promete simplificar nuestra interacción con la tecnología mediante un asistente de IA avanzado que aprende de nuestros hábitos.",
  source: "El Androide Libre",
  sourceUrl: newsSources.find(s => s.id === "elandroidelibre")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=2070&auto=format&fit=crop",
  url: "https://elandroidelibre.elespanol.com/2024/01/rabbit-r1-dispositivo-ia-reemplazar-smartphone.html",
  publishedAt: getRandomRecentDate(),
  category: "Inteligencia Artificial"
}, {
  id: "5",
  title: "Windows 11 24H2: todas las novedades de la próxima gran actualización",
  description: "Microsoft prepara importantes cambios para Windows 11 con su actualización 24H2, incluyendo mejoras en la interfaz, nuevas funcionalidades de IA y optimizaciones de rendimiento.",
  source: "Genbeta",
  sourceUrl: newsSources.find(s => s.id === "genbeta")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1624571409108-e9a41746af53?q=80&w=2070&auto=format&fit=crop",
  url: "https://www.genbeta.com/windows/windows-11-24h2-todas-novedades-proxima-gran-actualizacion",
  publishedAt: getRandomRecentDate(),
  category: "Software"
}, {
  id: "6",
  title: "GitHub Copilot se integra con Visual Studio y promete revolucionar el desarrollo de software",
  description: "La herramienta de IA para programadores ahora ofrece sugerencias de código más precisas y se integra perfectamente con el popular IDE de Microsoft.",
  source: "Genbeta",
  sourceUrl: newsSources.find(s => s.id === "genbeta")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1607798748738-b15c40d33d57?q=80&w=2070&auto=format&fit=crop",
  url: "https://www.genbeta.com/desarrollo/github-copilot-se-integra-visual-studio-promete-revolucionar-desarrollo-software",
  publishedAt: getRandomRecentDate(),
  category: "Desarrollo"
}, {
  id: "7",
  title: "La Unión Europea aprueba el Reglamento de IA: así afectará a las empresas tecnológicas",
  description: "El nuevo marco regulatorio europeo establece normas estrictas para el desarrollo y uso de sistemas de inteligencia artificial, con especial atención a la transparencia y seguridad.",
  source: "Hipertextual",
  sourceUrl: newsSources.find(s => s.id === "hipertextual")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2070&auto=format&fit=crop",
  url: "https://hipertextual.com/2024/03/union-europea-aprueba-reglamento-ia",
  publishedAt: getRandomRecentDate(),
  category: "Legislación"
}, {
  id: "8",
  title: "Tesla Cybertruck: probamos el vehículo más polémico de Elon Musk",
  description: "Nos subimos al futurista pickup eléctrico de Tesla para comprobar si cumple con las expectativas generadas tras años de retrasos y cambios en su diseño y especificaciones.",
  source: "Hipertextual",
  sourceUrl: newsSources.find(s => s.id === "hipertextual")?.url || "",
  imageUrl: "https://picsum.photos/200",
  url: "https://hipertextual.com/2024/01/tesla-cybertruck-analisis-prueba",
  publishedAt: getRandomRecentDate(),
  category: "Automoción"
}, {
  id: "9",
  title: "NVIDIA presenta la RTX 5090: la GPU más potente jamás creada",
  description: "La nueva generación de tarjetas gráficas de NVIDIA promete un rendimiento sin precedentes para gaming y tareas de IA, con 32GB de memoria GDDR7 y una arquitectura completamente renovada.",
  source: "MuyComputer",
  sourceUrl: newsSources.find(s => s.id === "muycomputer")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070&auto=format&fit=crop",
  url: "https://www.muycomputer.com/2024/03/nvidia-rtx-5090-especificaciones-precio",
  publishedAt: getRandomRecentDate(),
  category: "Hardware"
}, {
  id: "10",
  title: "AMD Ryzen 9000: analizamos los nuevos procesadores con arquitectura Zen 5",
  description: "Los nuevos chips de AMD ofrecen un importante salto generacional en rendimiento y eficiencia energética, poniendo en jaque a Intel en el mercado de procesadores de alto rendimiento.",
  source: "MuyComputer",
  sourceUrl: newsSources.find(s => s.id === "muycomputer")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=2070&auto=format&fit=crop",
  url: "https://www.muycomputer.com/2024/02/amd-ryzen-9000-analisis-benchmarks",
  publishedAt: getRandomRecentDate(),
  category: "Hardware"
}, {
  id: "11",
  title: "Meta presenta sus nuevas gafas Ray-Ban con realidad aumentada avanzada",
  description: "La colaboración entre Meta y Ray-Ban da un paso adelante con unas gafas inteligentes que proyectan información contextual sobre el mundo real y se integran con el asistente de IA de Meta.",
  source: "FayerWayer",
  sourceUrl: newsSources.find(s => s.id === "fayerwayer")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2070&auto=format&fit=crop",
  url: "https://www.fayerwayer.com/2024/03/meta-ray-ban-gafas-realidad-aumentada",
  publishedAt: getRandomRecentDate(),
  category: "Realidad Aumentada"
}, {
  id: "12",
  title: "El Bitcoin supera los 100.000 dólares tras la aprobación de los ETF en Estados Unidos",
  description: "La principal criptomoneda alcanza un nuevo máximo histórico impulsada por la aprobación de fondos cotizados al contado por parte de la SEC y el creciente interés institucional.",
  source: "FayerWayer",
  sourceUrl: newsSources.find(s => s.id === "fayerwayer")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop",
  url: "https://www.fayerwayer.com/2024/02/bitcoin-supera-100000-dolares-etf",
  publishedAt: getRandomRecentDate(),
  category: "Blockchain"
}, {
  id: "13",
  title: "Cómo configurar ChatGPT para maximizar su potencial en tareas profesionales",
  description: "Guía completa para aprovechar al máximo las capacidades de ChatGPT en entornos laborales, con consejos para mejorar los prompts y obtener respuestas más precisas y útiles.",
  source: "WWWhat's New",
  sourceUrl: newsSources.find(s => s.id === "wwwhatsnew")?.url || "",
  imageUrl: "https://picsum.photos/200",
  url: "https://wwwhatsnew.com/2024/01/como-configurar-chatgpt-maximizar-potencial-tareas-profesionales",
  publishedAt: getRandomRecentDate(),
  category: "Inteligencia Artificial"
}, {
  id: "14",
  title: "Las mejores aplicaciones de productividad para 2024",
  description: "Selección de herramientas digitales que te ayudarán a organizar mejor tu tiempo, gestionar proyectos y aumentar tu eficiencia en el trabajo y los estudios.",
  source: "WWWhat's New",
  sourceUrl: newsSources.find(s => s.id === "wwwhatsnew")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2071&auto=format&fit=crop",
  url: "https://wwwhatsnew.com/2024/01/mejores-aplicaciones-productividad-2024",
  publishedAt: getRandomRecentDate(),
  category: "Software"
}, {
  id: "15",
  title: "Xiaomi SU7: el fabricante chino entra en el mercado de coches eléctricos",
  description: "Analizamos el primer vehículo eléctrico de Xiaomi, un sedán de altas prestaciones que promete competir directamente con Tesla y que integra el ecosistema de productos de la marca.",
  source: "Xataka",
  sourceUrl: newsSources.find(s => s.id === "xataka")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072&auto=format&fit=crop",
  url: "https://www.xataka.com/movilidad/xiaomi-su7-analisis-caracteristicas-precio",
  publishedAt: getRandomRecentDate(),
  category: "Automoción"
}, {
  id: "16",
  title: "Starlink llega a España: así es el internet por satélite de SpaceX",
  description: "El servicio de internet satelital de Elon Musk ya está disponible en España, prometiendo conexiones de alta velocidad en zonas rurales donde la fibra óptica no llega.",
  source: "El Androide Libre",
  sourceUrl: newsSources.find(s => s.id === "elandroidelibre")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?q=80&w=2070&auto=format&fit=crop",
  url: "https://elandroidelibre.elespanol.com/2024/02/starlink-espana-internet-satelite-spacex.html",
  publishedAt: getRandomRecentDate(),
  category: "Telecomunicaciones"
}, {
  id: "17",
  title: "Microsoft integra Copilot en todo el ecosistema Windows: así cambiará tu experiencia",
  description: "El asistente de IA de Microsoft ahora estará presente en todas las aplicaciones de Windows, ofreciendo ayuda contextual y automatizando tareas complejas con un simple comando.",
  source: "Genbeta",
  sourceUrl: newsSources.find(s => s.id === "genbeta")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?q=80&w=2070&auto=format&fit=crop",
  url: "https://www.genbeta.com/windows/microsoft-integra-copilot-todo-ecosistema-windows",
  publishedAt: getRandomRecentDate(),
  category: "Software"
}, {
  id: "18",
  title: "El futuro de los procesadores: IBM logra crear chips de 1 nanómetro",
  description: "La compañía estadounidense ha conseguido un hito tecnológico al desarrollar la primera tecnología de fabricación de semiconductores de 1nm, superando las limitaciones físicas actuales.",
  source: "Hipertextual",
  sourceUrl: newsSources.find(s => s.id === "hipertextual")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
  url: "https://hipertextual.com/2024/03/ibm-chips-1-nanometro",
  publishedAt: getRandomRecentDate(),
  category: "Hardware"
}, {
  id: "19",
  title: "PlayStation 6: Sony confirma que trabaja en su próxima consola",
  description: "La compañía japonesa ha revelado los primeros detalles sobre su próxima generación de consolas, que promete un salto cualitativo en potencia gráfica y experiencias inmersivas.",
  source: "MuyComputer",
  sourceUrl: newsSources.find(s => s.id === "muycomputer")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=2019&auto=format&fit=crop",
  url: "https://www.muycomputer.com/2024/03/playstation-6-sony-confirma-desarrollo",
  publishedAt: getRandomRecentDate(),
  category: "Videojuegos"
}, {
  id: "20",
  title: "Neuralink realiza su primer implante cerebral en un humano con éxito",
  description: "La empresa de Elon Musk ha completado con éxito su primera intervención para implantar un chip cerebral en un paciente con parálisis, permitiéndole controlar un ordenador con el pensamiento.",
  source: "FayerWayer",
  sourceUrl: newsSources.find(s => s.id === "fayerwayer")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1580196969807-cc6de06c05be?q=80&w=2071&auto=format&fit=crop",
  url: "https://www.fayerwayer.com/2024/01/neuralink-primer-implante-cerebral-humano",
  publishedAt: getRandomRecentDate(),
  category: "Biotecnología"
}, {
  id: "21",
  title: "Los mejores auriculares con cancelación de ruido de 2024",
  description: "Analizamos y comparamos los auriculares más avanzados del mercado, con tecnologías de cancelación de ruido que te aislarán por completo del entorno para disfrutar de tu música.",
  source: "WWWhat's New",
  sourceUrl: newsSources.find(s => s.id === "wwwhatsnew")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
  url: "https://wwwhatsnew.com/2024/02/mejores-auriculares-cancelacion-ruido-2024",
  publishedAt: getRandomRecentDate(),
  category: "Dispositivos"
}, {
  id: "22",
  title: "La realidad virtual revoluciona la formación médica en España",
  description: "Hospitales y universidades españolas implementan tecnologías de realidad virtual para entrenar a futuros cirujanos, permitiéndoles practicar operaciones complejas en entornos virtuales.",
  source: "Xataka",
  sourceUrl: newsSources.find(s => s.id === "xataka")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=2078&auto=format&fit=crop",
  url: "https://www.xataka.com/medicina-y-salud/realidad-virtual-revoluciona-formacion-medica-espana",
  publishedAt: getRandomRecentDate(),
  category: "Realidad Virtual"
}, {
  id: "23",
  title: "Nothing Phone (2a): análisis del smartphone más original de gama media",
  description: "Probamos el nuevo teléfono de Nothing, que mantiene su distintivo diseño con luces LED traseras pero ahora a un precio más accesible y con un rendimiento sorprendente.",
  source: "El Androide Libre",
  sourceUrl: newsSources.find(s => s.id === "elandroidelibre")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2027&auto=format&fit=crop",
  url: "https://elandroidelibre.elespanol.com/2024/03/nothing-phone-2a-analisis-review-opinion.html",
  publishedAt: getRandomRecentDate(),
  category: "Dispositivos"
}, {
  id: "24",
  title: "OpenAI presenta GPT-5: un modelo de lenguaje que comprende imágenes, audio y texto",
  description: "La nueva versión del modelo de lenguaje de OpenAI integra capacidades multimodales avanzadas, permitiendo interacciones más naturales y complejas entre humanos y máquinas.",
  source: "Genbeta",
  sourceUrl: newsSources.find(s => s.id === "genbeta")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065&auto=format&fit=crop",
  url: "https://www.genbeta.com/actualidad/openai-presenta-gpt5-modelo-lenguaje-comprende-imagenes-audio-texto",
  publishedAt: getRandomRecentDate(),
  category: "Inteligencia Artificial"
}, {
  id: "25",
  title: "El metaverso en 2024: ¿revolución o burbuja tecnológica?",
  description: "Analizamos el estado actual del metaverso, las empresas que siguen apostando por él y si realmente tiene futuro como la próxima evolución de internet o es solo una moda pasajera.",
  source: "Hipertextual",
  sourceUrl: newsSources.find(s => s.id === "hipertextual")?.url || "",
  imageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2070&auto=format&fit=crop",
  url: "https://hipertextual.com/2024/02/metaverso-2024-revolucion-burbuja",
  publishedAt: getRandomRecentDate(),
  category: "Metaverso"
}];

// Función para mezclar el array y obtener noticias aleatorias
export const getRandomNews = (count: number = 10): NewsItem[] => {
  const shuffled = [...mockNews].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};