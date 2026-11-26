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
- El contrato de publicación de Revit: la v2 lee el mismo paquete que genera «Exportar lámina obra» (PDF + JSON de localización, índice, IFC federado, `_PROPS.json.gz`, `.crimg`, marca de publicación completa). Si algo del paquete no basta, se propone un cambio en Revit; no se adapta el visor a escondidas.
- La carpeta central de COMUNICACIONES y la hoja `CR_VisorObra_Proyectos` de producción. En desarrollo se usa el entorno de pruebas.
- Las credenciales: ni el OAuth Client ID de producción, ni claves de API, ni correos reales en el código o en git. Las claves van en las propiedades del script de Apps Script.
- El repositorio es público: ningún dato de obra, persona o cliente se sube a git.

## Datos y permisos

- Nadie sin permiso ve nada de un proyecto. Cada función nueva se prueba también con un usuario sin permiso.
- Solo el jefe de proyecto (JP, columna E de la hoja de proyectos) organiza y elimina planos.
- Órdenes: las emiten la DF y los JP del despacho.
- La IA solo propone. Ninguna incidencia, cambio, cierre ni acta se escribe sin que un técnico la valide. Se guarda audio, transcripción, propuesta y decisión.
- Los datos de obra solo se envían a la API de Claude y a Google desde el servidor, con la cuenta del despacho.

## Pruebas

- Caso de prueba: solo CASO-F (federación de 22 vínculos). Cada paso se prueba con él, en su copia de pruebas. CASO-P se descartó el 26/11/2026: su carpeta del visor solo contiene el PROY-X-PE (ver `casos/README.md`).
- Pantallas: ordenador, tablet y móvil. En móvil no se cargan planos ni modelo 3D.
- Todo botón de la interfaz se prueba haciendo clic en un navegador real con Playwright, en tamaño escritorio y en tamaño móvil. Una función de la interfaz no está hecha hasta que esa prueba pasa.
- Los tiempos se miden, no se estiman. Cada medida indica dispositivo, red y hora.
- Antes de culpar al código, descarta lo de entorno: sincronización de Drive, archivo equivocado, sesión de Google o GitHub, abrir con `file://`.
