<div align="center">
  <div style="background-color: #0f766e; width: 64px; height: 64px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M3 15h6"/><path d="M3 18h6"/></svg>
  </div>
  <h1>MenuIA Agents - Restaurant Ops</h1>
  <p>Panel de operaciones inteligentes y gestión de agentes IA para restaurantes y comercios gastronómicos.</p>
</div>

---

## 🚀 Sobre el Proyecto

**MenuIA Agents** es un dashboard integral moderno enfocado en la gestión operativa de restaurantes potenciada por Inteligencia Artificial. Está diseñado para centralizar pedidos, reservas, interacciones de atención al cliente (vía WhatsApp) y programas de retención en una interfaz inmersiva y altamente interactiva.

Recientemente migrado a arquitectura moderna para el mejor rendimiento.

## 🛠️ Stack Tecnológico

El proyecto está construido utilizando las últimas tecnologías del standard moderno de desarrollo web:

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Lenguaje:** TypeScript
*   **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animaciones:** [Motion for React](https://motion.dev/)
*   **Iconografía:** [Lucide React](https://lucide.dev/)

## 🧩 Secciones Principales

*   📊 **Dashboard:** Resumen operativo en tiempo real, KPIs críticos (ventas, retención), sugerencias de IA e histórico de chats recientes.
*   💬 **Conversaciones (Chats):** Interfaz completa de Inbox tipo mensajería, adaptada para leer en vivo interacciones, tomar control sobre el chatbot y lanzar acciones rápidas como agendar reservas.
*   👥 **Clientes (CRM):** Directorio consolidado, panel de preferencias e historial enriquecido con segmentación de la Inteligencia Artificial.
*   📅 **Reservas:** Sistema asíncrono con vistas predictivas de calendario y lista.
*   ⭐ **Campañas:** Tablero estratégico para visualizar puntos dispersados y lanzar campañas push (Broadcast) de fidelización mediante segmentos automáticos.
*   ⚙️ **Configuración:** Administración del entrenamiento del agente virtual, inyección de menú o fuentes externas, control de tono corporativo y links de ecosistema.

## 🏃‍♂️ Desarrollo Local

Levantar el entorno de desarrollo es muy sencillo:

### Pre-requisitos:
*   [Node.js](https://nodejs.org/en/) instalado.

### Instalación

1. Clona este repositorio (si aplica) e ingresa al directorio.
2. Instala todas las dependencias del proyecto usando NPM:
   ```bash
   npm install
   ```
3. Ejecuta el servidor en modo de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:3009](http://localhost:3009) (o el puerto que te asigne la terminal) en tu navegador para ver la web app.

## 📦 Estructura del Código

El proyecto ha sido estructurado basándose en App Router de Next.js. Las carpetas principales son:

*   **`app/`**: Almacena las rutas, layouts (rutas estáticas por archivo como `/conversations`, `/dashboard`, etc.) y el CSS global del proyecto.
*   **`src/components/`**: Elementos de UI aislados y reutilizables como el módulo de navegación (`Header`, `Sidebar`, `BottomNav`).
*   **`src/lib/`**: Helpers y funciones de utilidad, como el merge de clases de Tailwind.
*   **`src/types/`**: Interfaces exclusivas de TypeScript (modelamiento de Customers, Chats, etc.).
*   **`src/data/`**: Mocks de datos robustos que emulan base de datos temporalmente.
