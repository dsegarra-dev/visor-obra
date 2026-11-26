# Casos de prueba · Visor de obra v2

[BORRADOR IA — EN REVISIÓN]

Valores esperados y medidas de la **v1 publicada** (`sw.js` 0.21, servidor v0.16), que es la base que la v2 no puede empeorar (CA-05 y CA-11 de la spec).

| Archivo | Qué tiene |
|---|---|
| [caso-f.md](caso-f.md) | Único caso de prueba (federación): valores esperados |
| [medidas-ordenador.md](medidas-ordenador.md) | Tiempos de la v1 en ordenador, medidos con Playwright |
| [medidas-dispositivos.md](medidas-dispositivos.md) | Plantilla para que el BIM Manager anote iPhone, Android y tablet |
| `datos/` | Salida del recuento (`*_recuento.json`) |
| `scripts/contar_paquete.py` | Recuento del paquete publicado |
| `scripts/medir_v1.js` | Medida de tiempos en ordenador |
| `scripts/anonimizar.py` | Cambia los datos reales por alias y comprueba que no queda ninguno en git |

## Datos anonimizados

El repositorio es público (`AGENTS.md`). Por eso aquí solo hay alias, nunca datos reales de obra, personas o clientes:
- `CASO-F` es el caso de federación y `CASO-P`, el pequeño que se descartó. `PROY-X` es otro proyecto.
- `ORIGEN-A` y `ORIGEN-B` son los archivos de Revit de origen, y `VINC-…`, sus vínculos.
- `<carpeta-…>`, `<usuario>` y `<cuenta…>` sustituyen IDs de Drive, rutas, usuarios de Windows y correos.
- En `datos/medidas_ordenador_caso-f.jsonl` se ha quitado la lista de IFC del panel «Paquete».

La tabla de alias y los originales están fuera de git, en `.scratchpad/privado/`, con copia en la carpeta de pruebas de Drive. Para ejecutar los scripts con datos reales, usa los valores de la tabla de alias, por ejemplo el código real del proyecto en `medir_v1.js`. Pasa por `anonimizar.py aplicar` todo lo que vaya a git.

Antes de cada push:
```
python -I casos/scripts/anonimizar.py comprobar .scratchpad/privado/alias.json main..v2
```

## Por qué solo CASO-F

CASO-P se descartó el 26/11/2026 (decisión del BIM Manager). La carpeta del visor asignada a CASO-P solo contiene publicaciones del archivo de Revit `PROY-X-PE`: sus manifiestos e índices dicen proyecto PROY-X. No servía como caso de CASO-P. Las pruebas se hacen solo con CASO-F.

## Cómo se han sacado los valores esperados

Ningún valor sale del código del visor. Todos salen de Drive y de los libros de comunicaciones, con estos pasos:

1. **Listado de Drive.** Conector de Google Drive de Claude, búsqueda `'<carpeta del visor>' in ancestors` (archivos no borrados).
   - La paginación del conector repetía archivos entre páginas (557 de 1000 repetidos en CASO-F). Por eso el listado de CASO-F se pidió en cinco partes que no se solapan y caben en una página: PDF antes y después del 27/10/2026, JSON antes y después del 27/10/2026, y el resto de tipos.
   - Comprobación: 1442 archivos, ninguno repetido; coincide con la unión de las páginas solapadas.
2. **Archivos de control.** Se descargaron tal cual 92 archivos: marcas `*_PUBLICACION.json` y `*_EN_CURSO.json`, índices `*_INDICE.json`, manifiestos `*_MODELO.json` y una muestra de `_LOC.json` por carpeta sin índice.
   - Cada descarga se asignó a su archivo por el tamaño, en lotes sin tamaños repetidos. Las 92 se asignaron sin ambigüedad.
   - En marcas e índices, la fecha `generated` coincide con la de su carpeta en los 65 casos comprobables.
3. **Recuento.** `scripts/contar_paquete.py` aplica las reglas del contrato de publicación (ver la cabecera del script y `docs/como-se-hace-hoy.md`, apartado 3).
   - Una publicación es válida si está completa (todo lo que lista su marca está, con el mismo tamaño) o si es antigua (sin marca ni señal).
   - Versión = un PDF en una publicación válida. Lámina = par (modelo de origen, número). Modelo publicado = el manifiesto más reciente de cada origen.
   - Las publicaciones antiguas sin `source` toman el origen del campo `file` del índice o manifiesto, quitando el usuario de Windows del final. Se marcan como «deducido del nombre».
4. **Comunicaciones.** Lectura con el conector de Google Sheets del libro central de producción, `<código>_Libro_comunicaciones`, en `<carpeta del visor en la unidad compartida> › COMUNICACIONES › <código> · <nombre>`:
   - pestaña «Libro», columnas Número, Tipo y Estado;
   - cruce con «Datos (no editar)», columnas id, número y estado;
   - pestaña «Láminas eliminadas».
   Solo lectura: no se escribió nada.

Fecha de los listados y lecturas: 26/11/2026.

### Para repetirlo

Los listados y descargas quedan en `.scratchpad/casos-raw/`, fuera de git. Con ellos:

```
python -I casos/scripts/contar_paquete.py .scratchpad/casos-raw CASO-F caso-f_otros.json caso-f_pdf_antes1027.json caso-f_pdf_desde1027.json caso-f_json_antes1027.json caso-f_json_desde1027.json
```

## Cómo se mide en ordenador

1. Abrir Edge con un perfil aparte y depuración remota:
   ```
   "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --remote-debugging-port=9333 --user-data-dir=<repo>\.scratchpad\medir\perfil --no-first-run https://dsegarra-dev.github.io/visor-obra/
   ```
2. **Paso manual:** El BIM Manager entra con su cuenta de Google en esa ventana y la deja abierta. Google no deja iniciar sesión en un navegador controlado por Playwright; por eso Playwright se conecta después a un Edge abierto a mano.
3. Medir (Playwright 1.49.1, `playwright-core`, instalado en `.scratchpad/medir/`):
   ```
   set NODE_PATH=.scratchpad\medir\node_modules
   node casos/scripts/medir_v1.js CASO-F IE02-30 COM-0001 frio 3 .scratchpad/medir/resultados_caso-f.jsonl frio
   ```
   Qué mide cada tiempo y qué significa «frío» está en la cabecera de `scripts/medir_v1.js`.

### Entrada automática de Google: 10 minutos entre repeticiones

El 26/11/2026, las repeticiones en caliente que empezaban menos de 10 minutos después de la anterior se quedaban en la pantalla de entrada, con el botón «Inicia sesión como…» y sin entrada automática.
- **Hipótesis:** Edge solo hace la entrada automática con la cuenta de Google una vez cada 10 minutos, contados desde la entrada anterior.
- **Datos que la apoyan** (separación entre el inicio de una repetición y la entrada anterior que funcionó):
  - entraron las separadas 10 min 10 s, 10 min 52 s y 20 min;
  - fallaron las separadas 37 s, 5 min 35 s y exactamente 600 s (dos veces);
  - la entrada llega unos 4–10 s después del inicio, así que 600 s desde el inicio se quedan cortos.
- Comprobado solo de forma indirecta, con estos tiempos. No se ha confirmado en la documentación de Edge.

Por eso `medir_v1.js` espera 11 minutos desde el inicio de la repetición anterior. Esa espera no forma parte de ninguna medida.

**Qué supone para la v2 (hipótesis):** quien recargue el visor dos veces en menos de 10 minutos no entra solo; tiene que pulsar «Inicia sesión como…».

### Escrituras en producción aceptadas para medir

Decisión del BIM Manager del 26/11/2026. La v1 publicada solo tiene el servidor de producción, así que medirla con su cuenta escribe en producción:
1. filas en la pestaña «Registro» de la hoja de proyectos (accesos, aperturas, descargas), igual que el uso diario;
2. ~~la lectura del BIM Manager en INC-001 de CASO-P~~: no aplica, CASO-P se descartó antes de medir;
3. los `.crgeo` de los dos vínculos de CASO-F que no tenían versión procesada (`VINC-B18`, `VINC-B2`), que la v1 sube a `_visor_procesado` al cargar el modelo con rol equipo. Por eso la primera carga en frío de CASO-F incluye procesar esos dos IFC y las siguientes no.

## Entornos de comunicaciones

Hay dos libros por proyecto:
- **Producción**: `<carpeta del visor en la unidad compartida> › COMUNICACIONES` (10/11/2026). Es el que usa la v1 publicada.
- **Pruebas**: `<carpeta de pruebas> › COMUNICACIONES` (24/11/2026). Hoy es una copia exacta del de producción.
