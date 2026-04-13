# Roadmap de Producto - BotWhatsapp (SaaS Multi-tenant)

Este documento define la ruta estratégica para el desarrollo de la plataforma SaaS de automatización conversacional, enfocada en agentes inteligentes de WhatsApp para negocios locales.

---

## FASE 1: Refinamiento de UI/UX y Flujos Base
*   **Estado:** `EN CURSO`
*   **Objetivo:** Consolidar la experiencia de usuario (UX) para que sea intuitiva, moderna y 100% operativa.
*   **Hitos:**
    *   [x] Rediseño de Onboarding (Stepper, Sidebar, Personalidad).
    *   [x] Dashboard principal con métricas clave (Conversaciones, Pedidos, Clientes).
    *   [ ] Finalización de la Bandeja de Entrada de Mensajes (Inbox) con soporte para intervención humana.
    *   [ ] Panel de Configuración del Agente (Reglas de negocio, horarios, menú/productos).

## FASE 2: Backend Multi-tenant y Persistencia (Supabase)
*   **Estado:** `PRÓXIMO`
*   **Objetivo:** Implementar la arquitectura de datos que soporte múltiples negocios de forma aislada y segura.
*   **Hitos:**
    *   **Modelado de Datos:** Tablas para `tenants` (negocios), `customers`, `conversations`, `messages`, `orders` e `inventory`.
    *   **Seguridad RLS:** Implementación de Row Level Security para garantizar que cada negocio solo acceda a su información.
    *   **Autenticación:** Sistema de login para dueños de negocios vinculado a su espacio de tenant.

## FASE 3: Integración Meta API & Webhooks Oficiales
*   **Estado:** `PLANIFICADO`
*   **Objetivo:** Conectar la plataforma directamente con la infraestructura oficial de WhatsApp (Meta Cloud API).
*   **Hitos:**
    *   **Webhook Handler:** Implementación de Supabase Edge Functions para recibir mensajes (GET handshake y POST events).
    *   **Meta SDK:** Envío de mensajes de texto y estados (lectura/recibido) a través de la API oficial.
    *   **Normalización de Números:** Lógica para manejar formatos internacionales (E.164) y evitar duplicidad de clientes.

## FASE 4: Cerebro IA y Toma de Pedidos
*   **Estado:** `PLANIFICADO`
*   **Objetivo:** Dotar al agente de capacidad para entender intenciones, responder dudas y capturar pedidos.
*   **Hitos:**
    *   **Orquestación de IA:** Integración con OpenAI para procesar mensajes según el tono y reglas configuradas por el negocio.
    *   **Toma de Pedidos:** Lógica para que la IA extraiga ítems, cantidades y datos del cliente, registrándolos automáticamente en la BD.
    *   **Contexto de Sesión:** Manejo de historial para que el agente recuerde lo hablado previamente en la misma sesión.

## FASE 5: Operaciones en Tiempo Real y Cierre
*   **Estado:** `FUTURO`
*   **Objetivo:** Asegurar que el negocio pueda operar los pedidos y conversaciones sin retrasos.
*   **Hitos:**
    *   **Realtime Dashboard:** Uso de Supabase Realtime para notificar pedidos nuevos y mensajes entrantes al dueño sin recargar.
    *   **Gestión de Estados:** Flujo de pedidos (Pendiente -> Preparando -> Entregado) operable desde el panel.
    *   **Estabilización:** Pruebas de estrés y mitigación de alucinaciones de la IA (siguiendo las recomendaciones de `Gotchas.md`).

---

**Enfoque de Producto:** 
*   **Core:** Conversaciones + Toma de Pedidos.
*   **Fuera de Alcance:** Reservas, Puntos, Campañas de Marketing, Pagos Online.
*   **Tecnología:** Next.js, Tailwind, Supabase, Meta WhatsApp API, OpenAI.
