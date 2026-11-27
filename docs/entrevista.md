# Entrevista sobre la spec · parada 5

[BORRADOR IA — EN REVISIÓN]

Lo acordado con el BIM Manager el 27/11/2026 para cerrar los **PENDIENTE** de la spec, los de [como-se-hace-hoy.md](como-se-hace-hoy.md) y lo abierto en [rea-visor-obra.md](rea-visor-obra.md).

La spec no se ha cambiado: lo hace la parada 7 con este documento. Al final hay una lista de lo que hay que tocar en la spec y en `AGENTS.md`.

## Resumen

| # | Tema | Acuerdo | Cierra |
|---|---|---|---|
| 1 | Permisos | Los tres niveles de Drive de la v1 (editor = equipo, comentarista = agente, lector = consulta) más el JP de la columna E | Spec 2 |
| 2 | Roles de notificación | Los roles sirven para avisar, no para dar permisos. El JP los asigna en una pantalla «Personas» del visor y se guardan en una pestaña «Personas» del libro central | Spec 2 |
| 3 | Disciplinas | La lista de la v1 es el rol de notificación | P-09 |
| 4 | Propiedad | Puede crear consultas si es comentarista en Drive; si es lectora, solo responde | Spec 2, §8.1 |
| 5 | Comentar con rol consulta | Intencionado: es el «ver y responder» de la propiedad | P-07 |
| 6 | Eliminar comunicaciones | Solo el JP, con motivo obligatorio y registro | P-08 |
| 7 | Avisos | Las órdenes avisan al momento por correo. El resto va en un resumen diario | P-06, REA 1 |
| 8 | Transcripción | Dictado del teclado del móvil. Antes del piloto se comprueba dónde procesan la voz Apple y Google | Spec 3.3, §8.2 |
| 9 | Registro de la IA | Texto dictado, propuesta, decisión, quién y hora. Sin audio | CA-16 |
| 10 | Acta: formato | Se edita en el visor y se guarda en PDF. Botón para editar en Google Docs los textos largos y volver al visor | Spec 3.4, P-05 |
| 11 | Acta: dónde | Carpeta central › Actas › año. Se ve en el visor una vez validada; el borrador solo lo ven JP y DF | Spec 3.4, §8.3 |
| 12 | Acta: plantilla | La estructura propuesta, con estilo CEL-RAS | Spec 3.4, §8.3 |
| 13 | Plazos | Incidencia 2 laborables, consulta 3, orden 2; envío y aviso sin plazo | §8.4 |
| 14 | Festivos | Se descuentan los nacionales y autonómicos, no los locales | P-10 |
| 15 | Devolver | DF y JP pueden devolver una respuesta (Respondida → Abierta), con comentario obligatorio. El plazo vuelve a contar | REA 2 |
| 16 | Planos en el móvil | Se prueban con un prototipo de teselas (`.crimg`). Se quedan si abrir IE02-30 tarda menos de 3 s con 4G en un iPhone y un Android reales y el zoom va fluido. El modelo 3D sigue fuera del móvil | P-11, REA 3 |
| 17 | `.crimg` y `range` | Se recuperan para el prototipo del móvil y para la tablet | P-14, REA 6 |
| 18 | Plantillas de incidencia | No en la v2. Se proponen cuando la v2 esté validada | REA 4 |
| 19 | Eliminar lámina | El PDF se mueve a una subcarpeta «_eliminadas». El visor descuenta las eliminadas al comprobar la marca de publicación | REA 5, CA-21 |
| 20 | App de Google | El piloto solo admite cuentas del despacho; no se publica | §8.5 |
| 21 | Dónde se prueba | Solo en la copia de CASO-F | §8.6 |
| 22 | Cómo se describe CASO-F | Federación de 2 modelos de origen con 38 vínculos (17 + 21) y 257 copias | C-02 |
| 23 | PDF pesados | Por encima de 30 MB, «Exportar lámina obra» los reduce antes de publicar. Si siguen por encima, publica, lo anota y el visor avisa | C-04 |
| 24 | Red de las medidas de la parada 3 | Cable del despacho | Parada 3 |

## Detalle y consecuencias

### Permisos y roles (1–6)

- **Hay dos capas:**
  - **Permiso:** el nivel de Drive sobre la carpeta del visor, como en la v1 (`como-se-hace-hoy.md` 2.2–2.4). La tabla de la spec queda así:
    - JP y DF son equipo (editor);
    - constructora e ingenierías son agentes (comentarista), con los mismos derechos;
    - la propiedad es comentarista o lectora, según le dé el JP.
  - **Notificación:** cada persona o grupo puede tener un rol de la lista de la v1: Arquitectura, Dirección de ejecución, Constructora, Ing. estructuras, Ing. instalaciones, Propiedad / PM.
    - La DF es Arquitectura + Dirección de ejecución; las ingenierías, estructuras + instalaciones.
    - El JP sale de la columna E y el BIM Manager es fijo.
    - Una comunicación dirigida a una disciplina avisa a todos los que tienen ese rol.
    - Quien no tiene rol solo recibe los avisos de lo que va a su nombre («Para» y «Copia»).
- **Consecuencias:**
  - Las ingenierías podrán crear incidencias, porque tienen los mismos derechos que la constructora. La spec decía que solo consultas.
  - Una DF externa al despacho tiene que ser editora de la carpeta del visor, y con ello puede modificar archivos de la publicación en Drive. Es un riesgo a anotar en la spec.
- **Pantalla «Personas»:** solo el JP. Lista las personas y grupos con permiso en la carpeta y les asigna un rol. Si dos JP guardan a la vez, se avisa como al organizar planos (`como-se-hace-hoy.md` 9.3).
- **Eliminar comunicaciones:** solo el JP, con motivo obligatorio. La DF puede cerrarlas, pero no eliminarlas.

### Avisos (7)

- **Órdenes:** un correo al momento a sus destinatarios, desde la cuenta del despacho.
- **Resto:** un correo diario por persona, solo si tiene algo (nuevas para ella o su rol, pendientes y vencidas), con enlace directo a cada una.
- **Pendiente para la parada 7:** si las incidencias de prioridad Alta también avisan al momento. En la entrevista solo se acordó para las órdenes.

### Voz, IA y acta (8–12)

- **Transcripción:** el dictado del teclado del móvil. Claude no transcribe audio.
- **Antes del piloto:** comprobar en la documentación de Apple y de Google si la voz se procesa en el aparato o en sus servidores. Choca con la regla de `AGENTS.md` sobre datos de obra (solo a Claude y a Google desde el servidor). Se decide con lo que diga esa documentación.
- **Registro de cada nota:** el texto dictado tal cual, antes de que lo edite nadie; la propuesta de la IA; la decisión; quién la tomó y la hora. **No hay audio.**
- **Acta:**
  - se edita en el visor y se guarda en PDF;
  - el botón «Editar en Google Docs» abre el texto en un documento para los textos largos; al volver, el visor recoge el texto;
  - lleva la etiqueta de borrador hasta que el técnico la valida y añade `[REVISADO POR: …]`;
  - ruta: carpeta central › `<proyecto>` › Actas › `<año>` › `AAAAMMDD_Acta_visita_NN.pdf`;
  - una vez validada se ve en el visor para todos los que tienen permiso. El borrador solo lo ven JP y DF.
- **Plantilla del acta:**
  1. cabecera CEL-RAS;
  2. datos de la visita (proyecto, fecha, hora, número de acta);
  3. asistentes;
  4. incidencias nuevas, cambiadas y cerradas, con su número;
  5. acuerdos e instrucciones (entradas de acta validadas);
  6. próxima visita;
  7. firma.

### Comunicaciones (13–15)

- **Plazos por defecto:**
  - incidencia, 2 días laborables;
  - consulta, 3;
  - orden, 2, que es el plazo para el acuse de recibo;
  - envío y aviso, sin plazo.
  - Quien crea la comunicación puede cambiarlo.
- **Festivos:** se descuentan los nacionales y autonómicos. Hacen falta:
  - una pestaña «Festivos» en la hoja de proyectos, que el BIM Manager mantiene una vez al año;
  - una columna nueva «comunidad autónoma» en «Proyectos».
  - Los festivos locales no se descuentan.
- **Devolver:**
  - botón solo para DF y JP;
  - Respondida → Abierta, con comentario obligatorio en el hilo;
  - el plazo vuelve a contar desde ese momento;
  - no cambia el formato del libro.

### Móvil, tablet y planos (16–17)

- **Prototipo de planos en el móvil:**
  - mientras no esté medido, el móvil sigue sin planos;
  - en la construcción se hace un prototipo con láminas por teselas (`.crimg`): el móvil solo pide los trozos que mira, con la función `range` del servidor;
  - se queda si, con 4G, en un iPhone y un Android reales, abrir IE02-30 tarda menos de 3 s y el zoom va fluido;
  - el modelo 3D sigue fuera del móvil en cualquier caso.
- **Crear incidencias desde el móvil** mientras no haya planos: sin plano, con foto y la lámina elegida de la lista, y marcada «Sin situar» hasta que la DF o el JP le pone la nube.
  - Es la recomendación de la REA, pero **no se ha confirmado** porque la respuesta abrió el prototipo de planos. Se confirma en la parada 7.
- **`.crimg`:** se recuperan, para el móvil si pasa el prototipo y para la tablet. Quién los genera y cuándo se decide en el ADR de la parada 11. En la v0.23 los preparaba un ordenador del equipo al abrir la lámina.
- **Tablet:** sigue como dice el CA-11. Se mide en la tablet real (`casos/medidas-dispositivos.md`, pendiente). Si no mejora a la v1, pasa a modo ligero.

### Publicación (19, 22, 23)

- **Eliminar lámina:**
  - el PDF y su `_LOC.json` se mueven a una subcarpeta `_eliminadas` de su publicación, y se anota en «Láminas eliminadas»;
  - al comprobar la marca de publicación, el visor descuenta lo anotado como eliminado, así que el resto de la publicación se sigue viendo (CA-21);
  - en CASO-F, la publicación 20261028_1242 tiene su PDF en la papelera por la v1. Con esta regla, sus otras 5 láminas vuelven a verse, porque la eliminación consta en el libro.
  - Esto toca el paquete de Revit: se apunta como cambio del contrato de publicación (`AGENTS.md`).
- **PDF pesados:**
  - es un cambio en «Exportar lámina obra», en una tarea aparte (spec 7: el contrato de Revit no lo cambia la v2);
  - por encima de 30 MB, reduce la resolución de las imágenes del PDF antes de publicar;
  - si sigue por encima, publica igual, lo anota en la marca de publicación y el visor avisa de que es una lámina pesada;
  - 30 MB es el límite que la v1 ya usa para no precargar.
- **Descripción de CASO-F:** federación de 2 modelos de origen con 38 vínculos (17 + 21) y 257 copias.

### Entorno (20–21, 24)

- **App de Google:** se queda en modo prueba y el piloto solo admite cuentas del despacho.
  - El piloto será sin constructora ni ingenierías externas.
  - Los criterios con un usuario de la constructora (CA-02, CA-10 y CA-17) se prueban con cuentas internas de pruebas con permiso de comentarista.
- **Pruebas:** solo en la copia de CASO-F, como dice la lección 11.
  - Cada prueba que cargue el modelo en frío tarda lo que tarda CASO-F, unos 9,6 min con la v1.
- **Red de las medidas de la parada 3:** cable del despacho. Ya está anotado en `casos/medidas-ordenador.md`.

## Qué se queda para otras paradas

- **Parada 11 (ADR):**
  - estructura del código;
  - agrupar las llamadas al servidor;
  - lectura directa de Drive;
  - quién genera los `.crimg`;
  - leer `lib/ifc-worker.js` (P-13).
- **Antes del piloto:** comprobar dónde procesan la voz los dictados de Apple y Google (acuerdo 8).
- **Datos del BIM Manager:**
  - las medidas de iPhone, Android y tablet;
  - los tres puntos de control plano↔modelo.
- **Medida pendiente:** una incidencia con capturas, en la copia de pruebas (CA-09).

## Cambios que hay que hacer en la spec (parada 7) y en `AGENTS.md`

**Spec**
- **Apartado 2:** tabla de permisos por nivel de Drive y roles de notificación aparte. Las ingenierías crean incidencias. La propiedad depende de su permiso de Drive.
- **Apartado 3.2:**
  - planos en el móvil pendientes del prototipo, con el umbral de 3 s;
  - creación desde el móvil sin plano y «Sin situar».
- **Apartado 3.3:** transcripción con el dictado del teclado; el registro sin audio.
- **Apartado 3.4:** formato, ruta, visibilidad y plantilla del acta.
- **CA-08:** depende del resultado del prototipo de planos en el móvil.
- **CA-16:** quitar «el audio» y poner «el texto dictado».
- **CA-21:** detallar el mecanismo de `_eliminadas` y el descuento en la marca.
- **CAs nuevos:**
  - avisos: las órdenes, al momento; el resto, en el resumen diario;
  - devolver;
  - festivos;
  - eliminar comunicaciones solo el JP;
  - pantalla «Personas»;
  - prototipo de planos en el móvil;
  - aviso de lámina pesada.
- **Apartado 6, riesgos:**
  - dictado procesado fuera del servidor;
  - DF externa con permiso de editor;
  - piloto sin usuarios externos.
- **Apartado 8:** quitar las preguntas cerradas.
- **CASO-F:** describirlo como 2 modelos y 38 vínculos.

**`AGENTS.md` (lo decide el BIM Manager al cerrar la spec)**
- «Se guarda audio, transcripción, propuesta y decisión» pasa a ser «texto dictado, propuesta y decisión».
- «En móvil no se cargan planos ni modelo 3D»: se mantiene hasta el resultado del prototipo.
- «federación de 22 vínculos» pasa a ser «federación de 2 modelos con 38 vínculos».
- La regla de datos de obra se revisa con lo que diga la documentación del dictado.
