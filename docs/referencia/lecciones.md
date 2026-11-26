# Lecciones · Visor de obra v2

[BORRADOR IA — EN REVISIÓN]

> El agente las lee antes de cada paso (regla de `AGENTS.md`). Al cerrar cada sesión, en la retrospectiva (parada 18), se añaden las nuevas.

## De la v1 (v0.23 · servidor v0.17 · Revit v0.19)

1. **La mayoría de los fallos reportados eran de entorno, no de código:** sincronización de Drive, subir el archivo equivocado, no tener sesión en GitHub o en Google, abrir el visor con `file://`. Se descartan antes de tocar código.
2. **La lentitud tiene tres tramos:** llamadas a Apps Script (0,5–3 s cada una, más en arranque en frío), descargas desde Drive y trabajo en el dispositivo. Antes de optimizar, se mide cuál pesa más con el diagnóstico de velocidad (Más › Paquete).
3. **Las llamadas al servidor en serie se suman** (proyectos → índice → versiones → comunicaciones). Lo independiente va en paralelo o en una sola llamada.
4. **Las láminas y `.crimg` de una versión publicada no cambian:** se pueden cachear sin caducidad por nombre y versión.
5. **La publicación es todo o nada.** El visor solo enseña publicaciones con marca de completa.
6. **Un vínculo de Revit sin elementos de arquitectura** (por ejemplo, de datos) no debe bloquear la publicación.
7. **El inicio de sesión de Google en iPhone** está sin probar en dispositivo real. Es lo primero que se prueba en móvil.
8. **La app de Google está en modo prueba:** limita los usuarios externos.
9. **Cambiar de dominio** obliga a añadirlo en los orígenes del OAuth Client y a reinstalar la PWA, y se pierde la caché local. Se decide antes de que el equipo instale la app.
10. **El archivo central de COMUNICACIONES está en la unidad compartida** (<carpeta del visor en la unidad compartida> › COMUNICACIONES), nunca en «Mi unidad». Solo accede el BIM Manager.

## Del taller BBTS26 que aplican aquí

11. **Probar cada paso con los dos proyectos desde el principio** (CASO-P y CASO-F), no solo con el pequeño. Es lo que más tiempo ahorró en los ensayos.
12. **Medir pronto con el caso grande** (la federación de CASO-F) para elegir la estrategia de carga.
13. **Cuando un criterio no se cumple, el fallo se deja visible.** No se mueve la tolerancia hasta que pase.
14. **Los valores esperados salen de una fuente independiente**, nunca del código que se prueba, y se calculan con todos los decimales.
15. **Sin aviso de progreso, un proceso largo parece colgado.** Todo lo que tarde más de 2 s enseña en qué fase va.
16. **La huella de la caché solo cubre lo que calcula.** Si cualquier cambio de interfaz la invalida, se reprocesa todo.
17. **El diálogo de archivos del sistema no se automatiza.** En las pruebas, los archivos se cargan por otro camino.
18. **Las cifras se leen de los datos, nunca de una captura**, y los recuentos se hacen con el programa, no a ojo.
19. **Comparar tiempos medidos a horas distintas engaña.** Antes de buscar una regresión, se repite la medida con el código anterior.
20. **Los scripts de edición van en un archivo**, no en heredocs de Bash con comillas y barras.
21. **Tras empalmar un bloque de código, se prueba con clic antes de seguir:** en el taller se perdió una función al empalmar.

## Del arranque de la v2

22. **La v0.23 y el servidor v0.17 se perdieron porque se entregaron como zip y nunca se subieron.** Todo lo que funcione se sube a git y a Apps Script el mismo día.
