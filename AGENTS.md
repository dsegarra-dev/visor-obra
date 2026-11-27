# AGENTS.md · Visor de obra CEL-RAS v2

[BORRADOR IA — EN REVISIÓN]

Reglas del proyecto. Claude Code las lee al empezar cada sesión a través de `CLAUDE.md`.

## Cómo trabajamos

- Responde siempre en castellano, en frases cortas.
- Antes de cada paso, lee `docs/referencia/lecciones.md`. Son lecciones de la v1 y del taller, y se aplican desde el principio.
- La fuente de verdad es `docs/specs/CR_ESP_VisorObra_PO_v2.0.md`. Nunca cambies la spec ni una prueba para que algo pase.
- Una pregunta cada vez, con tu recomendación. Lo irreversible lo decide el BIM Manager.
- Ninguna cifra se da por buena sin medirla. Una causa solo se da como causa si se ha comprobado; si no, escribe «hipótesis» y cómo se comprobaría.
- Lo temporal (prototipos, informes, capturas) va en `.scratchpad/`, ignorada por git.
- Al cerrar cada parada, actualiza `docs/handoff.md`.
- Cada parada termina con commit y etiqueta, sin preguntar: `v2-p1`, `v2-p2`…; en la construcción, `v2-p11.1`, `v2-p11.2`…, uno por paso del plan.

## Lo que nunca se toca

- La rama `main` y lo publicado en GitHub Pages. La v2 se desarrolla en la rama `v2` hasta que supere el piloto.
- El contrato de publicación de Revit: la v2 lee el mismo paquete que genera «Exportar lámina obra» v0.19 (PDF + JSON de localización, índice, IFC federado, `_PROPS.json.gz`, marca de publicación completa). Si algo del paquete no basta, se propone un cambio en Revit; no se adapta el visor a escondidas.
  - Revit no genera `.crgeo` ni `.crimg`. Los genera el visor en `_visor_procesado`.
  - Al eliminar una lámina, el servidor solo añade un registro de eliminadas (`…_VisorObra_ELIMINADAS.json`) en la carpeta de la publicación. Nunca mueve ni borra el PDF ni otros archivos de una publicación (spec 4.2).
- La carpeta central de COMUNICACIONES, la hoja `CR_VisorObra_Proyectos` y las carpetas del visor de producción. En desarrollo y antes del piloto, la v2 solo escribe en el entorno de pruebas: copias completas de las carpetas del visor y de los libros (spec 5.0 y 8).
- Los libros de comunicaciones de la v1: la v2 solo los lee. Durante el piloto escribe en un libro propio por proyecto; la v1 y la v2 nunca escriben en el mismo libro (spec 3.6).
- Las credenciales: ni el OAuth Client ID de producción, ni claves de API, ni correos reales en el código o en git. Las claves van en las propiedades del script de Apps Script.
- El repositorio es público: ningún dato de obra, persona o cliente se sube a git.

## Datos y permisos

- Nadie sin permiso ve nada de un proyecto. Cada función nueva se prueba también con un usuario sin permiso.
- Los permisos (spec 2.1):
  - equipo = en la columna «Equipo» de la hoja de proyectos o JP (columna E), y con al menos permiso de comentarista en la carpeta del visor;
  - agente = comentarista o editor de Drive que no está en «Equipo»;
  - consulta = lector.
  - Ser editor de Drive no da el nivel equipo.
- Quien pierde el permiso pierde también su caché, su cola sin red y sus avisos de ese proyecto (spec 2.1).
- Los roles (disciplinas) solo deciden a quién se avisa. Los asigna el JP en «Personas» (spec 2.2).
- Solo el jefe de proyecto (JP, columna E de la hoja de proyectos) organiza y elimina planos, elimina comunicaciones y asigna roles.
- Órdenes: las emiten la DF y los JP del despacho, es decir, el equipo.
- Los números de comunicación llevan el código del proyecto, para que no se repitan entre obras (spec 3.2).
- La IA solo propone. Ninguna incidencia, cambio, cierre ni acta se escribe sin que un técnico (JP o DF) la valide.
  - Se guardan el texto de la nota, lo enviado a la IA, la propuesta, la decisión, quién y cuándo. No se guarda audio.
- Los datos de obra solo se envían a la API de Claude y a Google desde el servidor, con la cuenta del despacho.
  - A la IA solo van el texto de la nota y la lista cerrada de campos de la spec 3.4: sin correos, nombres, descripciones ni adjuntos.
  - Los correos de aviso solo llevan número, tipo, plazo y enlace.
  - Única excepción: el dictado del teclado, solo en los móviles del piloto y solo si se hace en el propio dispositivo. Es condición antes del piloto (spec 6). En ordenador y tablet, las notas se escriben.

## Pruebas

- Casos de prueba: dos, y cada paso se prueba con los dos, en su copia de pruebas (spec 5.0):
  - **CASO-F**, el grande: federación de 2 modelos con 38 vínculos (17 + 21) y 257 copias; 589 láminas con una versión cada una;
  - **CASO-P**, el pequeño: 19 láminas con 3 versiones cada una, un solo modelo sin vínculos y publicaciones antiguas.
  - CASO-P se descartó el 26/11/2026 porque su carpeta solo contiene el PROY-X-PE, y se recuperó el 27/11/2026 como caso pequeño precisamente por cubrir lo que CASO-F no tiene (ver `casos/README.md`).
- Mientras la app de Google esté en modo prueba, solo entran cuentas del despacho. Los permisos externos se prueban con cuentas internas de pruebas con el nivel de Drive que toque.
- Pantallas: ordenador, tablet y móvil.
  - En móvil no se carga nunca el modelo 3D, tampoco con «versión completa».
  - Los planos en el móvil solo entran si el prototipo de teselas cumple el CA-22; hasta entonces, tampoco se cargan.
- Todo botón de la interfaz se prueba haciendo clic en un navegador real con Playwright, en tamaño escritorio y en tamaño móvil. Una función de la interfaz no está hecha hasta que esa prueba pasa.
- Los tiempos se miden, no se estiman. Cada medida indica dispositivo, red y hora.
- Antes de culpar al código, descarta lo de entorno: sincronización de Drive, archivo equivocado, sesión de Google o GitHub, abrir con `file://`.
