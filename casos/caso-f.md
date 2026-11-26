# Caso CASO-F (federación)

[BORRADOR IA — EN REVISIÓN]

Carpeta del visor: `<carpeta-visor-CASO-F>`. Datos de Drive a 26/11/2026. Método en [README.md](README.md).

## Paquete publicado

| Valor | Esperado | Cómo se ha sacado |
|---|---|---|
| Archivos en la carpeta (sin papelera) | 1442 | Listado de Drive en 5 partes sin solape |
| Publicaciones | 42: 32 completas, 2 antiguas, 1 incompleta, 7 en curso | Marca y señal de cada subcarpeta `*_VisorObra` |
| Publicaciones que la v1 debe mostrar | 34 | Completas + antiguas |
| Modelos de origen | 2: `ORIGEN-A` (30 publicaciones) y `ORIGEN-B` (4, deducido del nombre) | `source` de la marca o del índice; `file` en las antiguas |
| Láminas | 584: 216 de `ORIGEN-A` y 368 de `ORIGEN-B` | Pares (origen, número) distintos |
| Versiones | 584 (ninguna lámina tiene más de una) | PDF en publicaciones válidas. Hay 589 PDF en total; los 5 de la publicación incompleta no cuentan |
| Versiones sin `_LOC.json` | 0 | Nombre del PDF + `_LOC.json` |
| Modelos publicados | 2 | Manifiesto más reciente de cada origen |
| `ORIGEN-A` | 17 vínculos, 114 copias, sin anfitrión | Manifiesto de 20261105_1409 (5/11/2026 14:11) |
| `ORIGEN-B` | 21 vínculos, 143 copias, sin anfitrión | Manifiesto de 20261028_0900 (28/10/2026 09:13) |
| Total | 38 vínculos, 257 copias | Suma |
| IFC en las carpetas de los dos modelos | 18 + 22. En cada una hay 1 IFC del anfitrión que el manifiesto no usa | Listado de Drive frente a `federation` |
| IFC en toda la carpeta | 87 (4,73 GB) | Listado de Drive |
| Versiones procesadas `.crgeo` | 38. Falta la de 2 vínculos de `ORIGEN-B`: `VINC-B18` y `VINC-B2` | `_visor_procesado` frente a los IFC del manifiesto |
| Descarga de `.crgeo` de los dos modelos | ≈ 231 MB | Suma de tamaños en el listado |
| Tamaño de los PDF | Mediana 1,7 MB; máximo 260 MB (`CO01-01.pdf`); otros dos de 217 y 197 MB (`PGN 01`, `PGN 02`) | Listado de Drive |

### Publicación incompleta: 20261028_1242

- Su marca lista 13 archivos y faltan `00.pdf` y `00_LOC.json`.
- En «Láminas eliminadas» consta que el 10/11/2026 se eliminó la lámina «0» de esa publicación, con alcance «versión». La hoja guardó «00» como el número 0.
- **Consecuencia:** eliminar una lámina manda su PDF a la papelera, la marca deja de cuadrar y la v1 trata la publicación entera como incompleta. Las otras 5 láminas de esa publicación (su índice tiene 6; quedan 5 PDF en la carpeta) dejan de verse.
- **Comprobado en pantalla** el 26/11/2026 por la tarde, con Playwright en Edge, cuenta del BIM Manager (`.scratchpad/medir/comprobar_1242.js`):
  - no se ve ninguna de las 6 (00, CO01-02, CO01-03, CO01-04, CO01-05, CO01-06), ni entre las vigentes ni con «Ver revisiones superadas»;
  - al buscar «CO01-0» solo salen CO01-01, CO01-07, CO01-08 y CO01-09;
  - el panel «Paquete» dice «Láminas 584» y «Publicaciones 31 (+8 sin completar)». Coincide con el recuento: 584 láminas; 34 publicaciones válidas menos 3 que solo traen modelo = 31; 7 en curso + 1 incompleta = 8.
- No se arregla en la v1: El BIM Manager lo resuelve desde Revit. En la v2 es el requisito CA-21.

## Comunicaciones (libro central de producción)

| Tipo | Abierta | En curso | Respondida | Cerrada | Total |
|---|---|---|---|---|---|
| Incidencia | 0 | 0 | 0 | 0 | 0 |
| Consulta | 0 | 0 | 0 | 0 | 0 |
| Orden | 0 | 0 | 0 | 0 | 0 |
| Envío | 1 | 0 | 0 | 0 | 1 |
| Aviso | 0 | 0 | 0 | 0 | 0 |

- La única es **COM-0001**, envío de documentación, sin lámina, sin adjuntos ni capturas. Ya consta como leída por su autor.
- «Datos (no editar)» tiene la misma única fila. «Láminas eliminadas»: 1 (la del apartado anterior).
- Con una sola comunicación y sin capturas, «abrir una incidencia» en CASO-F no mide la carga de capturas.

## Puntos de control plano ↔ modelo

PENDIENTE: los da el BIM Manager (paso 4 de la parada 3).

| Nº | Lámina | Vista | Punto en la lámina (descripción) | Elemento del modelo esperado | Coordenadas esperadas (si se conocen) |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

## PENDIENTE

- **C-02 · ¿22 o 21 vínculos?** `AGENTS.md` habla de «federación de 22 vínculos». El manifiesto de `ORIGEN-B` tiene 21 vínculos; en su carpeta hay 22 IFC, contando el del anfitrión, que el manifiesto no usa. Y el otro origen (`ORIGEN-A`) añade 17 vínculos más.
- ~~C-03 · Lámina 00.~~ Resuelto: no se ve ninguna de las 6 láminas; el BIM Manager lo arregla desde Revit (26/11/2026).
- **C-04 · PDF de 200–260 MB.** `CO01-01`, `PGN 01` y `PGN 02` pesan entre 197 y 260 MB. Es probable que sean el caso peor al abrir un plano.
