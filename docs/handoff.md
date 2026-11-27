# Handoff · Visor de obra v2

[BORRADOR IA — EN REVISIÓN]

Estado al cerrar cada parada. Lo último va arriba.

## Parada 5 · Entrevista sobre la spec (`v2-p5`, 27/11/2026)

**Hecho**
- `docs/entrevista.md`: 24 acuerdos que cierran los PENDIENTE de la spec, las P-05 a P-14 y lo abierto en la REA. Al final, la lista de cambios que hay que hacer en la spec y en `AGENTS.md`.
- `casos/medidas-ordenador.md`: la red de las medidas era el cable del despacho.
- Memoria del asistente: proponer las plantillas de incidencia cuando la v2 esté validada.

**Decisiones que cambian el plan**
- **Permisos:** los tres niveles de Drive de la v1. Los seis roles solo sirven para notificar; los asigna el JP en una pantalla «Personas».
- **Transcripción:** el dictado del teclado, sin audio (cambia el CA-16 y `AGENTS.md`).
- **Planos en el móvil:** se reabren con un prototipo de `.crimg`. Se quedan si abrir IE02-30 tarda menos de 3 s con 4G en móviles reales.
- **Eliminar lámina:** el PDF va a `_eliminadas` y el visor descuenta la eliminación en la marca.
- **Piloto:** solo con cuentas del despacho; las pruebas, solo en la copia de CASO-F.

**Abierto**
- Antes del piloto: comprobar dónde procesan la voz los dictados de Apple y Google (choca con la regla de datos de `AGENTS.md`).
- Confirmar en la parada 7:
  - si las incidencias de prioridad Alta también avisan al momento;
  - cómo se crean incidencias desde el móvil mientras no haya planos.
- Cambio de Revit, en una tarea aparte: reducir los PDF de más de 30 MB.
- La subcarpeta `_eliminadas` la crea el servidor del visor, pero queda dentro del paquete publicado. Hay que comprobar que «Exportar lámina obra» no la toca al volver a publicar.

**Siguiente: parada 7 (cerrar la spec)**

## Parada 4 · REA (`v2-p4`, 27/11/2026)

**Hecho**
- `docs/rea-visor-obra.md`, con la tabla fuente · idea · ¿la adoptamos? · cómo:
  - parte A: Aelion, Dalux Field, Revizto y Autodesk Viewer;
  - parte B: qué se conserva de la v1 (servidor y visor) y qué se reescribe.
- Solo documentación pública, reescrita con nuestras palabras. Sin código.

**Límites**
- Los centros de ayuda de Dalux y Revizto bloquean la lectura automática (403). Lo que se sabe sale de extractos del buscador y de las fichas de App Store.
- De Aelion solo hay una fuente secundaria. No consta que valide antes de guardar.

**Abierto para la parada 5**
- Seis preguntas al final de `docs/rea-visor-obra.md`:
  1. avisos de vencidas;
  2. devolver una respuesta;
  3. incidencias desde el móvil sin plano;
  4. plantillas;
  5. eliminar sin papelera;
  6. `.crimg` en tablet.

**Siguiente: parada 5 (entrevista sobre la spec)**

## Parada 3 · Casos de prueba y medidas de la v1 (`v2-p3`, 26/11/2026)

**Hecho**
- `casos/`: único caso CASO-F. CASO-P se descartó porque su carpeta solo contiene el PROY-X-PE (decisión del BIM Manager).
- Valores esperados de CASO-F sacados de Drive y del libro central, sin usar el código del visor (`casos/scripts/contar_paquete.py`):
  - 584 láminas y 584 versiones;
  - 34 publicaciones válidas de 42;
  - 2 modelos con 38 vínculos y 257 copias;
  - 1 comunicación (COM-0001, envío abierto).
- Medidas en ordenador (Playwright + Edge, 3 en frío y 3 en caliente) en `casos/medidas-ordenador.md`:
  - frío: abrir proyecto 32 s, plano 12,6 s, modelo 9,6 min;
  - caliente: proyecto 0,1 s, plano 2,1 s, modelo 2,9 s.
- Comprobado en pantalla: borrar la lámina 00 dejó ocultas las 6 láminas de la publicación 20261028_1242. No se arregla en la v1 (lo resuelve el BIM Manager desde Revit). Es el requisito CA-21 de la v2 y la lección 23.
- Spec: CA-04, CA-06 y la pregunta 6 de §8 pasan a CASO-F; nuevo CA-21. `AGENTS.md` y la lección 11: único caso CASO-F.
- El repositorio es público: regla nueva en `AGENTS.md`. Se reescribieron `v2-p2` y `v2-p3` con alias (27/11/2026, antes de subir `v2-p3`). La tabla de alias y los originales están en `.scratchpad/privado/`, con copia en la carpeta de pruebas de Drive. El método está en `casos/README.md`, «Datos anonimizados».

**Escrituras en producción aceptadas por el BIM Manager para medir**
- Filas en «Registro».
- Los `.crgeo` de 2 vínculos de CASO-F subidos a `_visor_procesado`.

**Pendiente**
- El BIM Manager anota iPhone, Android y tablet en `casos/medidas-dispositivos.md`.
- Puntos de control plano↔modelo de CASO-F (tabla vacía en `casos/caso-f.md`): los da el BIM Manager.
- Confirmar la red del ordenador en las medidas.
- Medir una incidencia con capturas: COM-0001 no tiene, así que no sirve para CA-09.
- C-02: ¿22 o 21 vínculos? C-04: PDF de 197–260 MB.
- El apartado 1.1 de la spec aún cita la v0.23, el servidor v0.17 y los `.crimg` (para la parada 7).

**Siguiente: parada 4 (REA)**

**Notas**
- Edge solo entra solo con Google una vez cada 10 minutos (hipótesis comprobada solo con los tiempos). `medir_v1.js` separa las repeticiones 11 minutos.
- Listados y descargas de Drive en `.scratchpad/casos-raw/`; Playwright en `.scratchpad/medir/` (fuera de git).
- La primera tanda falló porque Edge se cerró a las 16:40. La causa no está comprobada: no fue el borrado de datos.

## Parada 2 · Cómo se hace hoy (`v2-p2`, 26/11/2026)

**Hecho**
- `docs/como-se-hace-hoy.md`: lista de funciones y reglas de la v1 publicada, con su línea de código, y dudas marcadas como PENDIENTE.
- Apartado 16: funciones de la v0.22–v0.23 que se perdieron y no están en el código (`.crimg` con «range», aviso de versión nueva).
- Lección 22 en `docs/referencia/lecciones.md`: subir a git y a Apps Script el mismo día.

**Decidido por el BIM Manager**
- La base de la v2 es lo publicado: `sw.js` 0.21 y servidor v0.16. La v0.23 y el servidor v0.17 se perdieron.
- Las órdenes solo las emiten la DF y los JP del despacho. El código publicado lo cumple.
- Guardar sin cobertura es un fallo conocido de la v1. No se arregla en la v1; es el CA-10 de la v2.

**Abierto para la parada 5**
- P-05 a P-14 de `docs/como-se-hace-hoy.md`. P-14: ¿hacen falta los `.crimg` solo para la tablet?

**Siguiente: parada 3**
- Medir la v1 publicada (`sw.js` 0.21, servidor v0.16), en ordenador, tablet y móvil, anotando dispositivo, red y hora. (Hecho en la parada 3, solo con CASO-F.)

**Notas**
- `index.html` y `sw.js` de la v1 se leyeron de la raíz de la rama `v2` (iguales a `main`). `Código.gs` está en `.scratchpad/v1/`, fuera de git.
- El encabezado «De la v1 (v0.23 · servidor v0.17 · Revit v0.19)» de `lecciones.md` cita versiones perdidas. No se ha cambiado.
- `.gitignore` estaba en UTF-16 (lo crea así `echo >>` en Windows PowerShell 5.1) y git no ignoraba `.scratchpad/`. Se ha reescrito en UTF-8 y se ha comprobado con `git check-ignore`.
- Git no tenía identidad (nombre y correo) en este equipo, así que la parada 1 se quedó sin commit. El commit de la parada 2 la incluye.
