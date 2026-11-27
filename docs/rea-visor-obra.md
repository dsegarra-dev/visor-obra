# REA · Aprender de lo que existe

[BORRADOR IA — EN REVISIÓN]

Parada 4. Qué hacen otros programas, qué ideas tomamos y qué parte de la v1 se conserva. Lo leen la entrevista (parada 5) y el cierre de la spec (parada 7).

**Regla:** aprender y reescribir con nuestras palabras. No se copia código ni texto de ningún programa.

## Cómo se ha hecho

- Solo documentación pública, leída el 27/11/2026: webs de los fabricantes, centros de ayuda, fichas de App Store y una ficha de un curso. Ningún programa se ha instalado ni probado.
- **Límites de la lectura:**
  - Los centros de ayuda de Dalux y de Revizto no se dejan leer con un lector automático (error 403). Lo de Dalux sale de los extractos de sus artículos de ayuda que da el buscador. Lo de Revizto sale de su ficha de App Store y de esos mismos extractos.
  - De Aelion solo hay una fuente que describa el producto (Companion AEC): la ficha de un curso en butic.es. Su web no describe funciones.
  - Lo que no consta en ninguna fuente se marca **«no consta»**. No se deduce.
- Columna «Fiabilidad» de las tablas:
  - **Doc.**: documentación del fabricante;
  - **Ficha**: ficha de tienda o comercial;
  - **2.ª**: fuente secundaria.
- Lo que la v2 ya tiene en la spec se cita por su criterio (CA-xx). Lo que es nuevo y hay que decidir va a la entrevista: **Entrevista**.

---

## A. Programas comerciales

### A.1 Aelion · Companion AEC (voz, incidencias y acta)

**Qué hace, según las fuentes**
- Asistente de IA para obra: convierte notas de voz en actas estructuradas. *(2.ª)*
- Detecta incidencias en lo dictado, las clasifica (tipo, prioridad, responsable) y las envía al responsable. *(2.ª)*
- Sigue las incidencias abiertas y avisa de las que llevan tiempo sin respuesta. *(2.ª)*
- Genera partes, informes y listas de comprobación. *(2.ª)*
- **No consta:**
  - si cambia o cierra incidencias ya existentes;
  - si el técnico valida antes de guardar (la fuente sugiere envío directo);
  - cómo funciona sin cobertura;
  - en qué dispositivos funciona.

| Fuente | Idea | ¿La adoptamos? | Cómo, con Drive y Apps Script |
|---|---|---|---|
| Aelion *(2.ª)* | Nota de voz → acta estructurada | **Sí** (spec 3.3, 3.4, CA-18) | El servidor envía a la API de Claude la transcripción y la lista de incidencias tocadas en la visita, y recibe entradas de acta en JSON. Con lo validado, crea un documento de Google desde una plantilla del despacho, en la carpeta central del proyecto, con la etiqueta de borrador. Plantilla y carpeta: P-05, **Entrevista** |
| Aelion *(2.ª)* | De lo dictado salen tipo, prioridad y responsable de la incidencia | **Sí**, como propuesta | La IA rellena los campos de la propuesta. El responsable solo puede ser alguien con permiso en la carpeta del visor: el servidor le pasa la lista que ya calcula la v1 («Para» y «Copia»). Si el nombre dictado no está en la lista, la propuesta lo deja en blanco y lo marca |
| Aelion *(2.ª)* | La incidencia se envía al responsable sin revisión | **No** | Choca con la regla de `AGENTS.md`: la IA solo propone. Todo pasa por la bandeja «Propuestas IA» (CA-13, CA-17) |
| Aelion *(2.ª)* | Aviso de incidencias que llevan tiempo sin respuesta | **Entrevista** (P-06: la v1 no avisa) | Un activador diario de Apps Script busca las vencidas y envía a cada responsable un único correo de resumen desde la cuenta del despacho. Sin datos de obra en el asunto |
| Aelion *(2.ª)* | «Aprende» las preferencias del usuario | **No** | No se puede comprobar ni medir. Además obligaría a guardar datos de obra fuera del archivo central |
| Aelion *(no consta)* | Cambiar y cerrar incidencias por voz | **Sí**, aunque no conste que Aelion lo haga (spec 3.3, CA-14) | Se envían a la IA las incidencias abiertas con su número. La propuesta de cambio o cierre cita ese número y el servidor comprueba que existe y sigue abierta antes de enseñarla |

### A.2 Dalux Field (incidencias sobre plano y modelo, sin cobertura)

**Qué hace, según las fuentes**
- **Sin cobertura:**
  - hay que preparar el móvil antes de ir a obra; si no, una mala conexión puede dejar la app sin datos *(Doc.)*;
  - se eligen las carpetas de tareas que se guardan; se recomienda al menos la bandeja de entrada, y cada carpeta se puede filtrar *(Doc.)*;
  - el modelo 3D se descarga solo si se marca una opción aparte *(Doc.)*;
  - una pantalla resume qué hay disponible sin conexión, y se puede borrar *(Doc.)*;
  - una opinión de terceros advierte de que se pierde lo no sincronizado si se corta la red *(2.ª)*.
- **Tareas:**
  - se crean sobre el plano desde el móvil *(Doc.)*;
  - siguen un flujo por roles, «crea» y «responde», y van de un rol a otro al cambiar de estado *(Doc.)*;
  - lo que ve cada persona depende de su rol y del punto del flujo *(Doc.)*;
  - los roles se asignan a grupos, nunca a personas sueltas *(Doc.)*;
  - la bandeja se ordena sola en carpetas por estado: entrada, en curso, esperando aprobación, aprobadas y cerradas *(Doc.)*.
- **No consta:**
  - qué campos tiene una tarea (plazo, foto);
  - cómo se resuelve un conflicto al sincronizar.

| Fuente | Idea | ¿La adoptamos? | Cómo, con Drive y Apps Script |
|---|---|---|---|
| Dalux *(Doc.)* | «Preparar para obra» antes de salir, y una pantalla que dice qué hay disponible sin cobertura | **Sí** | Botón «Preparar visita». Descarga a IndexedDB las comunicaciones del proyecto, con sus recortes PNG y fotos reducidas. La pantalla dice qué hay guardado, de qué fecha y cuánto ocupa. En móvil no se descarga ningún PDF ni modelo (CA-08) |
| Dalux *(Doc.)* | Elegir qué se guarda, con la bandeja de entrada como mínimo | **Sí**, simplificado | Por defecto, las abiertas y las «Para mí» de los proyectos marcados. Una sola opción: «también las cerradas». En el móvil no hay más filtros |
| Dalux *(Doc.)* | El modelo 3D sin conexión es una opción aparte | **Sí**, solo en tablet y ordenador | Casilla «Guardar planos y modelo» en «Preparar visita». Usa la caché por id y fecha que ya tiene la v1 (apartado 12.8). En móvil no aparece |
| Dalux *(Doc.)* | Bandeja ordenada por estado y por lo que me toca hacer | **Sí** | Pestañas «Me toca», «Esperan respuesta» y «Por validar». Salen de los estados y del «Para» que ya tiene la v1. No hace falta un campo nuevo en el libro |
| Dalux *(Doc.)* | Roles asignados a grupos, no a personas | **Ya lo hace la v1** | El rol sale de los permisos de Drive, también por grupo de Google (`como-se-hace-hoy.md` 2.3). Se conserva |
| Dalux *(Doc.)* | Flujo crea → responde → aprueba, con «devolver» | **Entrevista** | La v1 tiene Abierta → En curso → Respondida → Cerrada. Se propone que la DF pueda devolver una respuesta (Respondida → Abierta) con comentario obligatorio. Es un mensaje más del hilo y no cambia el libro |
| Dalux *(Doc.)* | Crear tareas sobre el plano desde el móvil | **No en móvil** | En el móvil de la v2 no hay planos (spec 3.2). Desde el móvil se crea la incidencia sin plano, con foto, y la DF la sitúa luego desde la tablet o el ordenador. **Entrevista**: confirmar |

### A.3 Revizto (incidencias en 2D y 3D, sin cobertura)

**Qué hace, según las fuentes**
- Incidencias sobre el modelo 3D y sobre hojas 2D, con vista dividida 2D|3D y la hoja superpuesta al modelo *(Ficha)*.
- **Sin conexión:**
  - el proyecto se descarga antes de ir a obra *(Ficha)*;
  - lo creado sin conexión se sincroniza solo al volver la red *(Ficha)*.
- Las incidencias tienen estado, prioridad, plazo, responsable, observadores y etiquetas, y se pueden editar de una en una o en grupo *(Doc., extracto)*.
- **Personalización:**
  - estados, tipos y flujos configurables por proyecto *(Doc., extracto; Ficha)*;
  - «sellos»: plantillas que rellenan campos de la incidencia *(Doc., extracto)*.
- **Borradores:** las marcas y las incidencias se pueden guardar como borrador antes de publicarlas *(Ficha)*.
- **Otras funciones:** medir en la pantalla de creación de la incidencia, filtro «asignadas a mí», códigos QR para abrir una incidencia, realidad aumentada y nubes de puntos *(Ficha)*.
- **No consta:**
  - qué imagen o punto de vista se guarda con cada incidencia;
  - qué pasa si dos personas cambian la misma incidencia sin conexión.

| Fuente | Idea | ¿La adoptamos? | Cómo, con Drive y Apps Script |
|---|---|---|---|
| Revizto *(Ficha)* | La misma incidencia, enlazada al plano y al modelo | **Ya lo hace la v1** | «Ir al punto» abre la versión exacta de la lámina y devuelve el 3D a su cámara, visibilidad y corte (`como-se-hace-hoy.md` 6.14). Se conserva |
| Revizto *(Ficha)* | Lo creado sin conexión se envía solo al volver la red | **Sí** (CA-10) | Cola en IndexedDB. Cada envío lleva un id creado en el dispositivo y el servidor no guarda dos veces el mismo id: así no hay duplicados. Se escribe con el bloqueo que ya usa la v1 (`LockService`). Si la incidencia cambió mientras tanto, el envío se añade como mensaje del hilo y no pisa los campos |
| Revizto *(Ficha)* | Borrador antes de publicar | **Sí** | Dos casos: las propuestas de la IA (bandeja «Propuestas IA») y lo que está en la cola sin red («Pendiente de enviar»). Las dos se ven distintas de lo ya guardado |
| Revizto *(Doc., extracto)* | Estados, tipos y flujos configurables por proyecto | **No** en la v2 | Se mantienen los 4 estados y 5 tipos de la v1 para leer lo ya creado (CA-06) y para que la IA proponga sobre una lista cerrada |
| Revizto *(Doc., extracto)* | Sellos que rellenan campos | **Entrevista** | Si se adopta: plantillas por proyecto en una pestaña del libro central (asunto, tipo, agente y prioridad). La IA puede proponer una plantilla. No toca el formato de las comunicaciones |
| Revizto *(Ficha)* | Medir desde la pantalla de crear incidencia | **No** | Ya se mide en plano y modelo (`como-se-hace-hoy.md` 4.12 y 5.9). No aporta en obra |
| Revizto *(Ficha)* | Filtro «asignadas a mí» | **Ya lo hace la v1** | Filtro «Para mí» (6.16). Se conserva |
| Revizto *(Ficha)* | QR, realidad aumentada, nubes de puntos | **No** | Fuera de alcance (spec 7) |

### A.4 Autodesk Viewer (sencillez)

**Qué hace, según las fuentes**
- Gratuito y en el navegador, sin instalar nada. Hace falta una cuenta de Autodesk *(Doc.)*.
- Para subir un archivo, cuatro pasos. Si tarda, se puede cerrar la página y llega un correo cuando está listo *(Doc.)*.
- **Interfaz:**
  - arriba: vistas, navegador del modelo, propiedades, ajustes, comentarios, compartir y exportar *(Doc.)*;
  - abajo, en pocos grupos: navegar, ver por dentro (sección), medir e inspeccionar, y marcar *(Doc.)*;
  - cubo de vista con «Inicio» y «Encuadrar» *(Doc.)*.
- **Compartir:**
  - con un enlace; cualquiera que lo tenga ve el diseño, y el propietario elige qué funciones tiene el destinatario *(Doc.)*;
  - el enlace caduca a los 30 días; no consta si se refiere al enlace o a la vista guardada *(Doc.)*.
- **Comentarios:** sobre partes del diseño, con marcas, y el historial se exporta en PDF *(Doc.)*.
- **No edita:** el diseño no se puede modificar *(2.ª)*.
- **No consta:** si el destinatario puede comentar.

| Fuente | Idea | ¿La adoptamos? | Cómo, con Drive y Apps Script |
|---|---|---|---|
| Autodesk *(Doc.)* | Sin instalar: abrir el enlace y ver | **Ya lo hace la v1** | Web en GitHub Pages, instalable como app. Se conserva |
| Autodesk *(Doc.)* | Pocas herramientas, siempre en los mismos grupos | **Sí** | Una barra con cuatro grupos, iguales en plano y en modelo: navegar, cortar, medir y marcar o crear incidencia. Lo avanzado (control de exportación, diagnóstico) va en «Más». Regla de diseño para la parada 11 |
| Autodesk *(Doc.)* | «Inicio» siempre a mano | **Sí** | «Ver todo» de la v1, fijo en la barra del 3D. Y el equivalente en el plano: «Ajustar» |
| Autodesk *(Doc.)* | Panel de propiedades y navegador del modelo | **Ya lo hace la v1** | Selección con parámetros de Revit y casillas por modelo, planta y categoría (5.7 y 5.11). Se conserva |
| Autodesk *(Doc.)* | Aviso cuando termina un proceso largo | **Sí**, adaptado | La v1 procesa el IFC en el navegador. Un proceso largo enseña su fase (lección 15). Si se cierra a medias, se retoma al volver a abrir el proyecto. No se manda correo |
| Autodesk *(Doc.)* | Compartir con enlace, sin cuenta, que caduca | **No** | Nadie sin permiso ve nada (`AGENTS.md`, CA-01). En su lugar, un **enlace directo** a una lámina o a una comunicación, que pide entrar con Google y comprueba el permiso como cualquier otra petición |
| Autodesk *(Doc.)* | Exportar los comentarios en PDF | **Ya lo hace la v1** | Ficha PDF de cada comunicación y copia diaria del libro en PDF y Excel (7.3 y 7.4). Se conserva |

---

## B. Nuestra v1: qué se conserva y qué se reescribe

- **Conservar tal cual:** se reutiliza el código de la v1, como mucho cambiándolo de sitio.
- **Conservar la regla:** se mantiene el comportamiento, pero el código se escribe de nuevo en módulos (estructura: ADR de la parada 11).
- **Reescribir:** cambia el comportamiento.
- **Quitar:** no pasa a la v2.

Los apartados citados son de [como-se-hace-hoy.md](como-se-hace-hoy.md).

### B.1 Servidor (Apps Script, `Código.gs` v0.16)

| Parte | Decisión | Por qué |
|---|---|---|
| Comprobar el token de Google en cada petición y guardar la sesión 6 h (1.2) | Conservar tal cual | Funciona y es la base de la seguridad |
| Rol según el permiso de Drive (persona, dominio y grupo; el enlace público no cuenta) (2.2–2.4) | Conservar tal cual | Es lo que Dalux recomienda: roles por grupo. Cumple CA-01 |
| Rol mínimo por acción y solo archivos del proyecto (2.7, 2.8) | Conservar tal cual | Cumple CA-02. Se amplía a las acciones nuevas (propuestas, actas) |
| Archivo central: libro con sus pestañas, carpetas por comunicación, ficha PDF, copia diaria (7.1–7.4) | Conservar tal cual | Las comunicaciones de la v1 se tienen que leer en la v2 (CA-06) |
| Numeración COM-0001…, bloqueo de escritura, textos de hoja protegidos frente a fórmulas (6.2, 7.5, 7.6) | Conservar tal cual | Evitan números repetidos, escrituras pisadas y fórmulas inyectadas |
| Registro de actividad agrupado (8) | Conservar tal cual | Se añaden las acciones de IA: propuesta, decisión y quién (CA-16) |
| Guardar una comunicación (`saveIssue`) | Reescribir | Tiene que aceptar envíos repetidos de la cola sin duplicar (id del dispositivo, CA-10) |
| Eliminar lámina (`deleteSheet`) | Reescribir | Hoy manda el PDF a la papelera e invalida su publicación. En la v2 se anota en «Láminas eliminadas» y el visor la oculta, sin tocar archivos de la publicación (CA-21, lección 23). **Entrevista**: si el PDF debe ir a la papelera, la marca de publicación tiene que admitirlo |
| Descargar archivos a trozos de 8 MB a través del servidor (12.10) | Reescribir (hipótesis) | El modelo en frío tarda unos 9,6 min (`casos/medidas-ordenador.md`). Hipótesis: el cuello es pasar unos 231 MB por Apps Script. Se comprueba midiendo la descarga directa desde Drive con el token. Decisión: ADR de la parada 11 |
| Id de la carpeta central y otros datos en el código (P-12) | Reescribir | Pasan a las propiedades del script (`AGENTS.md`) |
| Acciones nuevas: transcripción, propuestas IA, validar propuesta, acta | Escribir de nuevo | No existen en la v1 (spec 3.3, 3.4) |
| Función `range` para servir trozos de `.crimg` | **Entrevista** (P-14) | Se perdió con la v0.17. Solo haría falta si la tablet necesita `.crimg` |

### B.2 Visor (`index.html`, `sw.js`, `lib/`)

| Parte | Decisión | Por qué |
|---|---|---|
| Librerías de `lib/` (lector IFC, generador de PDF), three.js y pdf.js | Conservar tal cual | Son de terceros. Se fija y se anota su versión. P-13: falta leer qué extrae `lib/ifc-worker.js` |
| Entrar con Google y repetir una vez si la sesión caduca (1.1, 1.3) | Conservar la regla | Lo primero que se prueba en un iPhone real (lección 7) |
| Leer la publicación: todo o nada, versión vigente, varios modelos de origen, coordenadas compartidas (3) | Conservar la regla, con un cambio | Las láminas eliminadas se descuentan antes de comprobar la marca, para que borrar una no oculte las demás (CA-21). Se comprueba con CA-04 y CA-19 |
| Plano → modelo y modelo → planos (4.11, 5.8) | Conservar la regla | Es el valor diferencial del visor. Se comprueba con los tres puntos de control (CA-05) |
| Carga del modelo: caché → `.crgeo` → IFC, y subir el `.crgeo` que falte (5.1, 5.2) | Conservar la regla | Funciona. En caliente, 2,9 s. Lo lento es la descarga en frío (ver B.1) |
| Medir, sección, visibilidad, propiedades, control de exportación (4.12, 5.7–5.13) | Conservar la regla | Paridad con la v1 (spec 3.1). Se ordenan en los cuatro grupos de la barra (A.4) |
| Comunicaciones: tipos, campos, estados, plazos, hilo, lecturas, acuse (6.1–6.13) | Conservar la regla | Compatibilidad con lo creado en la v1 (CA-06) |
| Captura de la incidencia: 720 px, plano y modelo (6.4) | Reescribir | La spec pide un recorte de unos 1200 px, que es lo único que descarga el móvil (spec 3.2, CA-09). Las de 720 px de la v1 se siguen viendo |
| Organizar planos, impresión y paquete PDF (9, 11) | Conservar la regla | Funcionan y no dependen de lo nuevo |
| Sincronizar cada 20 s, solo lo cambiado (6.18) | Conservar la regla | Se comprueba que no compite con la cola sin red |
| Sin cobertura: solo lectura y error al guardar (12.6, P-04) | Reescribir | Cola con envío automático (CA-10) y «Preparar visita» (A.2) |
| Pantallas: una vista cada vez y pestañas abajo en pantalla compacta (13.2) | Reescribir | En el móvil de la v2 no hay planos ni modelo (CA-08). La «versión completa» se pide a mano (CA-12). Se elige el modo por el ancho de pantalla (spec 3.2) |
| Caché del dispositivo por id y fecha, hasta 3 GB, borrando lo menos usado (12.7, 12.8) | Conservar la regla | Lo publicado no cambia (lección 4). En móvil, el límite se revisa con lo que de verdad guarda |
| Trabajador de servicio `sw.js` (12.1) | Reescribir | Tiene que avisar de que hay versión nueva (función perdida, 16.2) y servir la cola sin red |
| Panel «Paquete» y diagnóstico de velocidad (14) | Conservar la regla | Sirve para medir (lección 2). Se añaden los tiempos de la cola y de la IA |
| Modo de desarrollo con un correo real por defecto (1.6, P-12) | Reescribir | Sin correos reales en el código (`AGENTS.md`). El acceso para pruebas solo con el servidor de pruebas |
| URL del servidor y Client ID dentro de `index.html` (P-12) | Reescribir | Configuración aparte por entorno, sin el Client ID de producción en git (`AGENTS.md`) |
| Modo local: carpeta local y guardar solo en el dispositivo (15) | Quitar | Está desactivado en producción y lo sustituye la cola sin red |
| Todo en un único `index.html` | Reescribir | Motivo de la v2 (spec 1.2). Estructura: ADR de la parada 11 |

---

## Para la entrevista (parada 5)

Cada punto con una recomendación. Se pregunta de uno en uno.

1. **Avisos de vencidas (P-06).** Recomendación: un correo diario de resumen por persona, sin datos de obra en el asunto.
2. **Devolver una respuesta (Respondida → Abierta).** Recomendación: sí, solo DF y JP, con comentario obligatorio.
3. **Incidencias desde el móvil sin plano.** Recomendación: sí, con foto; la DF la sitúa después en el plano.
4. **Plantillas de incidencia (sellos).** Recomendación: no en la v2. Se revisa tras el piloto.
5. **Eliminar lámina sin papelera.** Recomendación: anotar y ocultar, sin mover archivos de la publicación.
6. **`.crimg` y `range` para la tablet (P-14).** Recomendación: decidirlo con la medida de la tablet (pendiente en `casos/medidas-dispositivos.md`).

## Fuentes

Consultadas el 27/11/2026. Ninguna cita literal larga; todo está reescrito.

- Aelion: [aelion.io](https://aelion.io/) (no describe funciones) · [Companion AEC en butic.es](https://butic.es/companion-aec-tu-companero-digital-gestionar-obras-forma-inteligente/)
- Dalux:
  - [Modo sin conexión](https://support.dalux.com/hc/articles/28263982197276)
  - [Flujos de tareas](https://support.dalux.com/hc/articles/27068649087644)
  - [Paquetes de trabajo y flujos](https://support.dalux.com/hc/en-us/articles/13569981431708-Work-packages-and-workflows-best-practice)
  - [Estados de tareas](https://support.dalux.com/hc/articles/6476482335004)
  - [Opinión de terceros sobre el trabajo sin conexión (G2)](https://www.g2.com/discussions/which-construction-drawing-management-tools-work-offline-and-sync-seamlessly-when-field-crews-regain-connectivity)
- Revizto:
  - [Revizto Site en App Store](https://apps.apple.com/us/app/revizto-site/id1673448001)
  - [Revizto V5 en App Store](https://apps.apple.com/us/app/id1527053373)
  - [Gestor de incidencias web](https://revizto.com/en/web-issue-tracker-release)
  - [Estados personalizados](https://help.revizto.com/hc/en-us/articles/10006005629199-Managing-custom-issue-statuses)
  - [Datos de las incidencias](https://help.revizto.com/hc/en-us/articles/360004137136-Metadata-and-dashboarding)
- Autodesk Viewer:
  - [Primeros pasos](https://help.autodesk.com/cloudhelp/ENU/ADSKVIEWER-Help/files/ADSKVIEWER_Help_GettingStarted_html.html)
  - [Compartir](https://help.autodesk.com/cloudhelp/ENU/ADSKVIEWER-Help/files/ADSKVIEWER_Help_ShareDesigns_html.html)
  - [Herramientas](https://help.autodesk.com/cloudhelp/ENU/ADSKVIEWER-Help/files/ADSKVIEWER_Help_AutodeskViewerTools_html.html)
