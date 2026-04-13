# Documentación del Agente IA (WhatsApp)

## 1. Naturaleza del Agente
El Agente IA es un asistente virtual multimodal entrenado para integrarse estrictamente con WhatsApp mediante **Twilio/WhatsApp Business API**. Está diseñado originalmente para operar la atención al cliente, gestión de reservas, toma de pedidos y entrega de fidelización (Ecosistema de Puntos) para distintos tipos de negocios (enfocado al sector restaurantero/retail).

## 2. Capacidades Base

1. **Atención a Clientes Frecuentes y Nuevos**: Puede identificar un cliente registrado en la base de datos (Supabase) y hablarle por su nombre.
2. **Sistema de Reservaciones**: Permite coordinar, registrar e ingresar reservaciones en el calendario manejando disponibilidad. Pide confirmación y guarda estado.
3. **Gestión de Pedidos & Menú**: Responde consultas sobre el menú alimentando su conocimiento mediante Retrieval-Augmented Generation (RAG) utilizando documentos (PDF/Excel) o URL conectadas.
4. **Programa de Fidelización**: Conoce la cantidad de puntos de cada cliente e incentiva la redención en días u horarios inactivos basados en promociones configuradas.

## 3. Instrucciones de Entrenamiento (Prompt System)
El prompt central que guía el comportamiento del bot está compuesto por directrices primarias dinámicas:

> **Rol**: *Eres un agente virtual empático y eficiente para {nombre_negocio}. Tu tono de voz es {tono_voz}. Tu objetivo principal es tomar pedidos, gestionar reservaciones y brindar respuestas veloces al menú. Eres conciso, usas viñetas y formato amigable de WhatsApp (emojis moderados).*

### 3.1 Manejo de Reglas Estrictas:
* Nunca inventes promociones. Si dudas, deriva a soporte humano.
* Preguntar siempre el método de pago si la intención detectada es una venta o pedido.
* Recopilar el correo del cliente de manera orgánica si es su primera interacción.
* Terminar la conversación con un resumen corto del pedido o reserva si se concretó exitosamente.

## 4. Arquitectura del Flujo (Supabase + OpenAI)

1. **Ingesta Webhook**: Entra un nuevo mensaje por WhatsApp a nuestro Edge Function de Supabase.
2. **Clasificador de Intención (Intent Recognition)**: Una pequeña cadena rápida etiqueta el mensaje (`pedido`, `reserva`, `soporte`, `curiosidad`).
3. **Búsqueda Vectorial (RAG)**: Si el cliente pregunta por platos, precios o FAQ, el sistema busca similitudes en los vectores (Archivos entrenados) y provee el contexto.
4. **Inyección de Perfil**: El número telefónico es verificado en la tabla `profiles`/`customers` trayendo sus puntos y nombre real.
5. **Generación con LLM**: OpenAI GPT-4o o Claude genera la respuesta natural incluyendo variables dinámicas (puntos, nombre).
6. **Despacho WhatsApp**: Envío final vía Twilio al cliente con latencia mínima (< 2 segundos meta).

## 5. Mantenimiento y Extensibilidad
El agente debe alimentarse mediante la vista **"Agente IA"** del Dashboard, donde el administrador actualizará manualmente los documentos base y las instrucciones directas de tono de voz, lo cual reconstruirá los embeddings/vectores automáticamente.
