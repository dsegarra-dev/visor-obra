# Handoff · Visor de obra v2

[BORRADOR IA — EN REVISIÓN]

Estado al cerrar cada parada. Lo último va arriba.

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
- Medir la v1 publicada (`sw.js` 0.21, servidor v0.16) con CASO-P y CASO-F, en ordenador, tablet y móvil, anotando dispositivo, red y hora.

**Notas**
- `index.html` y `sw.js` de la v1 se leyeron de la raíz de la rama `v2` (iguales a `main`). `Código.gs` está en `.scratchpad/v1/`, fuera de git.
- El encabezado «De la v1 (v0.23 · servidor v0.17 · Revit v0.19)» de `lecciones.md` cita versiones perdidas. No se ha cambiado.
- `.gitignore` estaba en UTF-16 (lo crea así `echo >>` en Windows PowerShell 5.1) y git no ignoraba `.scratchpad/`. Se ha reescrito en UTF-8 y se ha comprobado con `git check-ignore`.
- Git no tenía identidad (nombre y correo) en este equipo, así que la parada 1 se quedó sin commit. El commit de la parada 2 la incluye.
