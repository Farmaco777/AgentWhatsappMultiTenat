# Problemas Conocidos y Soluciones - BotWhatsappMulti


Este documento contiene todos los problemas descubiertos durante el desarrollo y sus soluciones. **Lee esto antes de debuggear**.


Checklist Rápido Pre-Producción


Antes de lanzar un agente de WhatsApp para negocios usando la API oficial de Meta (WhatsApp Business Platform), valida siempre:


Secrets y credenciales configuradas:


ID de cuenta de WhatsApp Business / Business Manager


Token de acceso (permanent o de larga duración)


App Secret


Phone Number ID


Verify Token para el webhook


Webhook registrado correctamente en el panel de Meta:


URL accesible por HTTPS


Campos de suscripción correctos (messages, message_template, etc.)


Verify Token coincidiendo con tu servidor/backend


Número de WhatsApp:


Número verificado y con estado “Connected” o equivalente


Pruebas básicas desde la consola de Meta


Backend / función de webhook desplegada con lógica real


Base de datos lista:


Clientes


Conversaciones


Mensajes


Pedidos (si aplica)


Negocios y sedes (si tu sistema es multi-sede)


Dashboard / PWA interno funcionando en entorno de pruebas


Logs habilitados para:


Webhook


Llamadas a Meta


Llamadas a tu proveedor de IA


Base de datos




Problemas Típicos con la API de WhatsApp Cloud (Meta)


2.1. Webhook no se dispara o muestra errores de verificación


Causas frecuentes:


Verify Token en el backend no coincide con el configurado en Meta.


La URL del webhook no acepta el handshake de verificación (GET).


No se suscribieron los campos correctos (por ejemplo, solo se suscribieron a “messages” en lugar de mensajes y plantillas).


El servidor no está accesible por HTTPS válido.


Diagnóstico:


Revisar en el panel de Meta el estado del webhook.


Revisar logs de tu servidor en la llamada de verificación.


Confirmar que la respuesta coincide con el formato esperado por Meta.


2.2. Mensajes entrantes que no llegan a tu backend


Causas:


Webhook sin suscripción al campo de mensajes.


Errores de despliegue: endpoint incorrecto o caído.


Falta de permisos en la app de Meta (scopes).


Acciones:


Revisar suscripciones de la app en Meta: que “messages” esté activado.


Ver logs de mensajes entrantes en el panel de Meta.


Verificar URL y estado HTTP de tu endpoint.


2.3. Mensajes salientes que fallan o no se entregan


Causas:


Token de acceso expirado o incorrecto.


Phone Number ID equivocado.


Formato de destino incorrecto (falta código de país, formato E.164).


Uso de plantillas sin aprobación o sin parámetros válidos.


Acciones:


Revisar el estado del token en el panel de Meta.


Confirmar el Phone Number ID asociado al número que envía.


Validar formato del número destino con código de país.


Ver el estado de la plantilla (aprobada, rechazada, pendiente).


2.4. Problemas con plantillas (templates)


Problemas típicos:


Plantillas rechazadas por no cumplir políticas (promociones agresivas, contenido prohibido).


Errores de parámetros: placeholders no coinciden con el contenido enviado.


Uso de categorías incorrectas (utility, marketing, authentication) versus el caso real.


Acciones:


Revisar la descripción de componentes de plantilla: header, body, footer, botones.


Asegurar que el número de variables y el orden coincidan exactamente con la plantilla aprobada.


Usar variables de texto para representar puntos, códigos y premios en lugar de intentar adjuntar tarjetas complejas.


Problemas del Agente de IA (Lógica Conversacional y Acciones)


3.1. El agente responde texto pero no ejecuta acciones de negocio


Síntomas:


El usuario confirma querer hacer un pedido, reservar o registrarse, pero el sistema no crea nada en la base de datos.


Causas:


Prompt del agente poco claro respecto a cuándo llamar acciones.


Falta de puente claro entre “intención detectada” y ejecución de lógica de negocio.


Soluciones:


Definir reglas claras en el prompt: después de una confirmación explícita, siempre ejecutar la acción correspondiente (crear pedido, registro, etc.).


Documentar dentro del sistema que “confirmaciones” como “sí”, “confirmo”, “listo”, “de acuerdo” deben interpretarse como autorización para proceder.


Mantener una capa de orquestación en tu backend que interprete la intención del modelo y dispare funciones concretas.




3.2. El agente inventa IDs o datos que no existen en la BD


Síntomas:


IDs de productos inexistentes.


Precios o nombres que no coinciden con el menú real.


Causas:


El modelo genera datos “de memoria” en lugar de usar la base de datos.


Soluciones:


Separar claramente conocimiento estructurado (productos, precios, clientes) del texto libre.


Hacer que el agente siempre consulte fuentes confiables (BD, APIs internas) antes de confirmar un pedido.


Documentar en el prompt que no debe inventar IDs, precios ni productos; debe usar únicamente resultados de consultas internas.




3.3. El agente termina procesos sin confirmar al usuario


Síntomas:


El pedido se crea, pero el cliente no recibe un mensaje de confirmación con resumen.


Causas:


Falta de instrucción explícita en el prompt para “cerrar” el flujo con una confirmación clara.


Soluciones:


Añadir instrucciones específicas: “Despues de ejecutar cualquier acción de negocio (crear pedido, registrar cliente, etc.), siempre confirma al usuario con un mensaje que incluya resumen y próximos pasos.”


Tener mensajes estándar para confirmar éxito/fallo.




Problemas de Datos de Negocio (Clientes, Pedidos, Sedes)


4.1. Clientes duplicados por variaciones de número


Síntomas:


Un mismo cliente aparece varias veces con variantes de teléfono.


Causa:


Falta de criterio único para normalizar el número (códigos de país, espacios, símbolos).


Soluciones:


Definir un formato estándar de almacenamiento (por ejemplo, E.164 sin prefijos adicionales).


Normalizar el número en un solo punto antes de cualquier operación de lectura/escritura.


Ejecutar limpiezas periódicas de duplicados, consolidando registros históricos cuando sea necesario.




4.2. Pedidos inconsistentes o duplicados


Síntomas:


Múltiples pedidos “activos” para el mismo cliente sin intención clara.


Estados de pedido que no reflejan la realidad operativa.


Causas:


Validaciones insuficientes en la capa de negocio.


Falta de reglas para cuándo se permite un nuevo pedido activo.


Soluciones:


Definir reglas: por ejemplo, “un cliente solo puede tener un pedido pendiente por sede”.


Antes de crear un pedido, consultar si existen pedidos abiertos y actuar en consecuencia (continuar el existente, preguntar, etc.).


Mantener un flujo claro de estados (ej. pendiente, confirmado, preparando, listo, entregado, cancelado).




4.3. Datos incompletos de clientes (nombres, correos, etc.)


Síntomas:


Registros con nombres genéricos (“Cliente nuevo”, “Invitado”), o correos vacíos.


Causas:


El agente no pregunta por datos esenciales al momento adecuado.


Soluciones:


Incluir en el prompt que, antes de considerar el perfil como “completo”, debe preguntar al menos nombre y confirmar el número cuando sea necesario.


Diseñar flujos cortos donde el agente explique por qué pide estos datos (para identificar pedidos, puntos, etc.).




Problemas de Multi-Negocio / Multi-Sede


5.1. Pedidos o mensajes asignados a la sede equivocada


Síntomas:


Pedidos de una sucursal se registran en otra.


Causas:


No se identifica correctamente la sede (por número de WhatsApp, por dominio, por configuración).


Falta de un branch_id consistente en la base de datos.


Soluciones:


Definir claramente la asignación: cada número de WhatsApp, o cada flujo, se asocia a una sede.


Incluir siempre la sede en todas las tablas clave (conversaciones, pedidos, clientes si aplica).


Si el número es compartido, hacer que el agente pregunte por la sede al inicio y mantener ese contexto.




5.2. Métricas mezcladas entre sedes


Síntomas:


Dashboard muestra datos combinados sin distinguir sede.


Causas:


Falta de filtros por sede en consultas.


branch_id ausente o mal usado.


Soluciones:


Incluir filtros por sede en todos los reportes, queries y métricas.


Permitir vista “Todas las sedes” y vista “Sede específica” en el panel.


Problemas del Dashboard / PWA Interno


6.1. Conversaciones y mensajes sin actualización en tiempo real


Síntomas:


El agente responde a los clientes, pero el panel solo refleja cambios al recargar.


Causas:


Falta de mecanismo de tiempo real o invalidación de caché.


Soluciones:


Usar Realtime (por ejemplo, Supabase Realtime) para suscribirse a inserciones de mensajes.


Combinar suscripción con un polling ligero como respaldo.


Invalidar caches o refrescar queries cuando se detectan cambios.




6.2. Errores de CORS entre el dashboard y las funciones del backend


Síntomas:


El navegador reporta errores de CORS al llamar APIs del agente.


Causas:


Falta de configuración de cabeceras CORS en tus endpoints.


Soluciones:


Añadir cabeceras de origen permitido y manejo de OPTIONS en endpoints que se consumen desde el navegador.




6.3. Autenticación inconsistente entre panel y API


Síntomas:


El panel se muestra, pero ciertas llamadas a APIs/funciones son rechazadas.


Causas:


Diferencias entre la sesión del usuario en el dashboard y los tokens usados para llamar funciones internas.


Soluciones:


Separar claramente:


llamadas internas del sistema (backend a backend, usando claves de servicio),


llamadas desde el cliente (dashboard) con tokens de usuario.


Asegurarse de no exponer secretos sensibles al frontend.




Problemas Específicos de Fidelización / Puntos (sin imágenes)


7.1. Confusión por falta de “tarjeta física” de puntos


Síntomas:


Clientes o dueños esperan ver “tarjetas visuales” o imágenes, pero WhatsApp limita el uso de media en plantillas.


Causas:


Expectativa heredada de tarjetas físicas o apps de fidelización.


Soluciones:


Plantear el sistema como “wallet de premios” y “saldo de puntos” textual.


Usar mensajes claros: saldo, progreso hacia el premio, y códigos únicos de canje.


Enviar detalles de la recompensa en texto y, si es necesario, enlazar a una landing externa donde se vea el diseño visual del premio.


7.2. Dificultad para controlar canjes sin imágenes ni códigos físicos


Síntomas:


Dudas sobre cómo comprobar si un premio ya se usó.


Causas:


Intentar replicar tarjetas de sello sin un identificador digital.


Soluciones:


Gestionar canjes con códigos únicos, estados de cupón (emitido, canjeado, vencido) y seguimiento en la BD.


Entrenar al personal para:


pedir el código,


verificarlo en el sistema,


marcarlo como canjeado.


Debugging y Buenas Prácticas de Observabilidad


8.1. Falta de logs útiles


Síntomas:


“No sé qué pasó; simplemente no funciona.”


Soluciones:


Loggear las entradas críticas: mensajes entrantes de WhatsApp, decisiones de la IA, resultados de operaciones de BD.


Loggear errores con contexto: tipo de operación, IDs involucrados, payloads clave.


Mantener logs accesibles en:


proveedor de hosting/backend,


Meta (para mensajes y errores de envío),


tu herramienta de logging (si usas una externa).




8.2. Dónde revisar


Panel de Meta: para estados de mensajes, plantillas, errores de entrega.


Logs del backend: para webhooks, IA, base de datos.


Dashboard del proveedor de BD (por ejemplo Supabase): para errores de consultas y funciones.


Consola del navegador: para errores del panel o PWA.


Validaciones y Errores Descriptivos


9.1. Validar antes de crear o relacionar datos


Ejemplos:


Verificar que el cliente exista antes de crear un pedido.


Verificar que un producto exista antes de agregarlo a un pedido.


Verificar que una sede esté activa antes de asignar un pedido o conversación.


9.2. Mensajes de error útiles para el agente y el usuario


En vez de respuestas genéricas (“Error”):
usar mensajes que expliquen la causa (“No se encontró el producto”, “Formato de fecha inválido”, “No hay suficientes puntos para este premio”).


Eso ayuda:


al agente a explicar mejor la situación al usuario, y a ti a localizar rápido el problema.

