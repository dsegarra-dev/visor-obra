# Caso CASO-P (pequeño)

[BORRADOR IA — EN REVISIÓN]

Segundo caso de prueba, desde el 27/11/2026 (spec 5.0, punto D-08 del abogado del diablo). Cubre lo que CASO-F no tiene: láminas con varias versiones, un solo modelo sin vínculos y publicaciones antiguas.

Datos de Drive del 26/11/2026, comprobados de nuevo el 27/11/2026: mismos 144 archivos, mismos nombres, tamaños y fechas. Método en [README.md](README.md).

**Ojo:** la carpeta del visor de CASO-P solo contiene publicaciones del archivo de Revit `PROY-X-PE`, y sus manifiestos dicen proyecto PROY-X. Por eso se descartó el 26/11/2026. Se usa tal como está, como caso pequeño: lo que se prueba es el visor, no el contenido.

## Paquete publicado

Recuento con `scripts/contar_paquete.py`. Salida en `datos/caso-p_recuento.json`.

| Valor | Esperado | Cómo se ha sacado |
|---|---|---|
| Archivos en la carpeta (sin papelera) | 144 | Listado de Drive (2 partes: PDF y el resto) |
| Publicaciones | 3, todas antiguas (sin marca ni señal, anteriores al 27/10/2026) | Marca y señal de cada subcarpeta `*_VisorObra` |
| Publicaciones que la v1 debe mostrar | 3 | Antiguas |
| Modelos de origen | 1: `PROY-X-PE` (deducido del nombre) | Campo `file` del índice y de los `_LOC.json` |
| Láminas | 19 (M01 a M19) | Pares (origen, número) distintos |
| Versiones | 57: **cada lámina tiene 3 versiones** | PDF en publicaciones válidas |
| Versiones sin `_LOC.json` | 0 | Nombre del PDF + `_LOC.json` |
| PDF fuera del índice | 19: la publicación 20261020 no tiene índice | PDF sin entrada en un `_INDICE.json` de su carpeta |
| Entradas de índice sin PDF | 19: todas de un mismo índice (20261021_105531) de la carpeta 20261021_VisorObra, cuyas entradas no traen el nombre del PDF. Esa carpeta guarda 5 índices de 5 publicaciones del mismo día (formato antiguo) | Índices descargados frente al listado |
| Modelos publicados | 1, sin vínculos ni anfitrión: un único IFC | Manifiesto más reciente (20261021_1136) |
| IFC en toda la carpeta | 4 (0,96 GB) | Listado de Drive |
| Versiones procesadas `.crgeo` | 4 | `_visor_procesado` |

## Comunicaciones (libro central de producción)

| Tipo | Abierta | En curso | Respondida | Cerrada | Total |
|---|---|---|---|---|---|
| Incidencia | 1 | 0 | 0 | 0 | 1 |
| Consulta, orden, envío, aviso | 0 | 0 | 0 | 0 | 0 |

- La única es **INC-001**: incidencia abierta sobre la lámina M01, con disciplina Arquitectura.
  - Tiene la numeración antigua de la v1 (`INC-` en vez de `COM-`), porque se migró de la hoja de incidencias anterior.
  - Tiene captura de plano y de modelo (`_incidencias_imagenes`). Sirve de referencia para el CA-09, que en CASO-F no se puede medir.
- «Láminas eliminadas»: ninguna.
- Lectura con el conector de Google Sheets el 27/11/2026, solo lectura.

## Qué cubre y qué no

- **Cubre:** versiones vigentes y superadas (CA-35), un modelo único sin federación, publicaciones antiguas con y sin índice, una incidencia de la v1 con capturas y numeración antigua.
- **No cubre:** un proyecto sin modelo y una federación con anfitrión que tenga elementos. Se prueban con un paquete preparado cuando haga falta (spec 5.0).

## Medidas

Ver [medidas-ordenador.md](medidas-ordenador.md) (lámina M01, incidencia INC-001).
