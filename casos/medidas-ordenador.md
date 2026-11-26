# Medidas en ordenador · v1 publicada · CASO-F

[BORRADOR IA — EN REVISIÓN]

Tiempos de la v1 publicada (`sw.js` 0.21, servidor v0.16) con CASO-F, medidos con Playwright el 26/11/2026. Son las cifras que la v2 no puede empeorar (CA-11). Método y definición de cada tiempo en [README.md](README.md) y en la cabecera de `scripts/medir_v1.js`.

## Condiciones

| Campo | Valor |
|---|---|
| Fecha y horas | 26/11/2026, de 16:51 a 19:10 (hora de Madrid) |
| Dispositivo | Ordenador del BIM Manager (Windows 11 Pro), Edge 158, ventana de 1440 × 900 |
| Cuenta y rol | el BIM Manager, rol «Equipo CEL-RAS» |
| Red | No consta qué red era (cable o wifi del despacho): **PENDIENTE, lo confirma el BIM Manager**. Edge la estima como «4g», 1,4 Mb/s y 100 ms; es una estimación del navegador, no una medida |
| Lámina | IE02-30 (PDF de 4/11/2026) |
| Comunicación | COM-0001 (envío, sin capturas ni adjuntos) |
| Modelo | 38 modelos (17 + 21 vínculos), 257 copias, 210.471 elementos |
| Frío | Antes de cada repetición se borra lo que el visor guarda en el navegador. La sesión de Google se mantiene |
| Caliente | Sin borrar nada, justo después de una carga completa |

## Resumen

| Acción | Frío: mediana (mín–máx) | n | Caliente: mediana (mín–máx) | n |
|---|---|---|---|---|
| Entrar con Google (automática) | 9,1 s (7,5–10,4) | 7 | 4,5 s (4,2–4,5) | 4 |
| Abrir proyecto | 32,1 s (23,2–36,2) | 6 | 0,1 s (0,1–0,2) | 4 |
| Abrir plano IE02-30 | 12,6 s (10,7–14,8) | 3 | 2,1 s (2,0–2,1) | 3 |
| Cargar modelo | **576,7 s ≈ 9,6 min** (567,4–594,1) | 6 | 2,9 s (2,6–3,3) | 4 |
| Abrir COM-0001 | 0,1 s (0,1–0,1) | 3 | 0,1 s (0,1–0,1) | 3 |

- «Abrir proyecto» y «Cargar modelo» se cuentan desde que aparece el usuario, y van a la vez: el modelo empieza a cargar mientras se abre el proyecto.
- «Abrir plano» y «Abrir COM-0001» se miden después de cargar el modelo, sin nada más descargando.
- **Abrir COM-0001 no sirve como referencia para CA-09**: no tiene capturas, así que solo mide abrir el diálogo. Para medir una incidencia con recorte hay que crear una en la copia de pruebas (PENDIENTE).

## Primera carga con procesado (aparte)

| Hora de inicio | Entrar | Abrir proyecto | Modelo visible | Subida de las versiones procesadas terminada |
|---|---|---|---|---|
| 16:51:21 | 9,1 s | 38,3 s | 606,7 s | ≈ 1402 s (23 min) |

- En esta carga, 2 vínculos de `ORIGEN-B` (`VINC-B18` y `VINC-B2`) no tenían versión procesada. La v1 procesó sus IFC en el navegador y subió los `.crgeo` a `_visor_procesado` (escritura aceptada por el BIM Manager).
- El modelo se vio a los 607 s; la subida siguió en segundo plano hasta los ~23 min.
- Desde entonces, las 38 versiones procesadas están en Drive.

## Todas las repeticiones

Tiempos en segundos. «—» = no medido.

| Tanda | Rep. | Hora de inicio | Entrar | Abrir proyecto | Abrir plano | Cargar modelo | Abrir COM-0001 | Notas |
|---|---|---|---|---|---|---|---|---|
| Primera | 1 | 16:51:21 | 9,1 | 38,3 | — | 606,7 | — | Procesa 2 IFC. Plano sin medir (fallo del script) |
| Frío A | 1 | 17:15:22 | 8,3 | 32,4 | — | 567,4 | — | Plano sin medir (fallo del script) |
| Frío A | 2 | 17:25:28 | 7,5 | 23,2 | — | 582,8 | — | Ídem |
| Frío A | 3 | 17:35:49 | 7,8 | 31,9 | — | 569,0 | — | Ídem |
| Caliente A | 1 | 17:45:56 | 4,2 | 0,1 | — | 3,0 | — | Ídem |
| Caliente A | 2 | 17:46:33 | — | — | — | — | — | Sin entrada automática de Google |
| Caliente A | 3 | 17:48:34 | — | — | — | — | — | Sin entrada automática de Google |
| Frío B | 1 | 17:56:48 | 10,4 | 29,4 | 12,6 | 570,6 | 0,1 | |
| Frío B | 2 | 18:06:48 | — | — | — | — | — | Sin entrada automática de Google |
| Frío B | 3 | 18:16:48 | 9,3 | 34,0 | 10,7 | 590,1 | 0,1 | |
| Caliente B | 1 | 18:26:58 | 4,5 | 0,1 | 2,1 | 2,6 | 0,1 | |
| Caliente B | 2 | 18:36:58 | — | — | — | — | — | Sin entrada automática de Google |
| Caliente B | 3 | 18:46:58 | 4,5 | 0,1 | 2,0 | 3,3 | 0,1 | |
| Frío C | 1 | 18:58:26 | 10,0 | 36,2 | 14,8 | 594,1 | 0,1 | |
| Caliente C | 1 | 19:09:31 | 4,5 | 0,2 | 2,1 | 2,9 | 0,1 | |

- **Fallo del script (tanda A):** buscaba la lámina por un texto que lleva pegada la fecha de publicación. Se corrigió antes de la tanda B.
- **Sin entrada automática:** ver «Entrada automática de Google» en el README. Las repeticiones que fallan no cuentan en el resumen.
- Datos en bruto: `datos/medidas_ordenador_caso-f.jsonl`.

## Lo que dice la propia v1 (panel «Paquete»)

El panel «Paquete» de la v1 coincide con los valores esperados ([caso-f.md](caso-f.md)):
- «Láminas 584»;
- «Publicaciones 31 (+8 sin completar)»;
- 38 modelos.

Sus tiempos internos van en la misma línea que los medidos, por ejemplo «Modelo en 548–571 s (38 versiones procesadas)». No se usan como medida: salen del código que se está midiendo.

## Lectura (hipótesis, sin comprobar)

- **El modelo en frío (~9,6 min) es lo que más pesa.** Hipótesis: descargar ≈ 231 MB de `.crgeo` a través de Apps Script, en trozos de 8 MB codificados en base64. Se comprueba midiendo la descarga de un `.crgeo` grande directamente desde Drive y comparándola con la del visor.
- **Abrir un plano en frío (~12 s)** incluye descargar el PDF por el servidor y dibujarlo; el panel de la v1 da «preparar 8,5–10,5 s · dibujar 1,9 s». Se comprueba igual, con la descarga directa del PDF.
