# Cómo se hace hoy · Visor de obra v1

[BORRADOR IA — EN REVISIÓN]

Lista de las funciones y reglas que **ya cumple la v1**, sacada solo de su código. No añade nada. Las dudas van marcadas como **PENDIENTE** al final.

## Fuentes leídas

| Archivo | De dónde | Versión que declara |
|---|---|---|
| `index.html` (código propio: HTML y script, sin las librerías three.js, OrbitControls ni pdf.js) | Raíz de la rama `v2`, igual a `main` (commit `ee80114`, 12/11/2026) | No declara versión |
| `sw.js` | Raíz de la rama `v2`, igual a `main` | Caché `visor-obra-0.21-74699` (`sw.js:4`) |
| `Código.gs` | `.scratchpad/v1/` | Servidor v0.16 (`Código.gs:3`, `Código.gs:41`) |

No se han leído `lib/` (lector IFC, pdf-lib) ni `manifest.webmanifest`.

**Esta es la base de la v2.** La v0.23 y el servidor v0.17 se perdieron: nunca se subieron. Lo publicado (`sw.js` 0.21, servidor v0.16) es lo que usan hoy las obras, y es lo que se mide en la parada 3. Lo que solo existía en las versiones perdidas está en el apartado 16.

### Proceso actual, según el BIM Manager (no está en el código)

- Se publica desde Revit con «Exportar lámina obra».
- La v1 enseña la publicación desde Drive a través de Apps Script.
- La DF, el JP y la constructora abren incidencias, consultas y órdenes sobre plano.
- Todo se archiva en la carpeta central de COMUNICACIONES.
- En obra, los jefes de obra usan el móvil, a menudo sin cobertura.
- El BIM Manager apunta las visitas a mano y redacta el acta después.

---

## 1. Acceso y sesión

1. Se entra con la cuenta de Google («Iniciar sesión con Google»), con selección automática de cuenta (`index.html:1791`).
2. El servidor verifica cada petición con Google: audiencia igual al Client ID, emisor de Google, correo verificado y sesión no caducada. Guarda la sesión verificada hasta 6 h (`Código.gs:63`).
3. Si la sesión caduca, la v1 pide entrar de nuevo y repite la petición una sola vez (`index.html:1816`, `index.html:1837`).
4. El visor solo recibe el nombre y el correo de la persona (texto de la pantalla de entrada, `index.html:639`).
5. «Salir» borra los archivos guardados en el dispositivo y desactiva la entrada automática (`index.html:1917`).
6. Hay un modo de desarrollo que solo se activa con un servidor local (`?api=http://localhost…`). Permite entrar con un correo sin Google y expone un acceso para las pruebas automáticas (`index.html:1774`, `index.html:2705`).

## 2. Proyectos y permisos

1. Los proyectos salen de la pestaña «Proyectos» de la hoja de registro. Columnas: A código, B nombre, C carpeta del visor, D activo («NO» lo oculta), E jefes de proyecto (correos separados por comas). Se guarda en caché 5 min (`Código.gs:84`).
2. El rol de cada persona sale del permiso de Drive sobre la carpeta del visor del proyecto (`Código.gs:153`):
   - propietario, gestor o editor → **equipo**;
   - comentarista → **agente**;
   - lector → **consulta**.
3. Cuentan los permisos por usuario, por dominio y por grupo de Google. Si hay varios, gana el rol más alto (`Código.gs:169`).
4. Un enlace público («cualquiera con el enlace») **no** da acceso (`Código.gs:175`).
5. Los permisos se guardan en caché 5 min (`Código.gs:33`).
6. Quien no tiene acceso a ningún proyecto no entra. Ve un mensaje que le dice que pida al JP la carpeta compartida (`index.html:1909`).
7. Cada acción del servidor comprueba el rol mínimo antes de hacer nada (`Código.gs:183`).
8. El servidor solo entrega archivos de la carpeta del proyecto, o adjuntos y capturas de sus comunicaciones. Si un archivo no está en el listado, lo vuelve a leer una vez de Drive por si es nuevo (`Código.gs:245`, `Código.gs:718`).
9. Si alguien pierde el permiso durante la sesión, la siguiente sincronización le avisa y recarga el visor (`index.html:2238`).
10. La v1 recuerda el último proyecto abierto en el dispositivo (`index.html:1912`).

### Quién puede hacer qué (lo comprueba el servidor)

| Acción | consulta | agente | equipo | JP (columna E) |
|---|---|---|---|---|
| Ver planos, modelo y comunicaciones | Sí | Sí | Sí | Sí |
| Añadir un comentario a una comunicación existente | Sí | Sí | Sí | Sí |
| Crear comunicaciones | No | Sí | Sí | Sí |
| Emitir órdenes | No | No | Sí | Sí |
| Subir adjuntos | No | Sí | Sí | Sí |
| Editar asunto, descripción, destinatarios, plazo… | No | Solo las suyas | Todas | Todas |
| Cambiar el estado | No | Ver 6.8 | Cualquier cambio | Cualquier cambio |
| Acusar recibo | Si es destinatario | Si es destinatario | Si es destinatario | Si es destinatario |
| Eliminar comunicaciones | No | No | Sí | Sí |
| Guardar la versión procesada del modelo | No | No | Sí | Sí |
| Organizar planos | No | No | No (además debe ser JP) | Sí, si también es equipo |
| Eliminar láminas | No | No | No (además debe ser JP) | Sí, si también es equipo |

## 3. Lectura de la publicación de Revit

1. La v1 lista la carpeta del visor del proyecto hasta 6 niveles de subcarpetas. Guarda el listado en caché 2 min (`Código.gs:192`, `Código.gs:234`).
2. Solo usa archivos `.pdf`, `.json`, `.ifc`, `.crgeo` y `.json.gz` (`Código.gs:691`).
3. Reconoce estos archivos de la publicación (`index.html:2128`):
   - `*_INDICE.json`: índice con todas las láminas de la publicación;
   - `*_LOC.json`: localización de una lámina (publicaciones antiguas);
   - `*_MODELO.json`: manifiesto del modelo (IFC, federación de vínculos, propiedades, coordenadas, control de exportación);
   - `.ifc`, `*_PROPS.json.gz` y `.crgeo` (versión procesada del modelo, ver 5.2).
4. **La publicación es todo o nada** (`index.html:2029`):
   - con marca de publicación completa (`*_visorobra_publicacion.json`), se muestra solo si están todos los archivos que lista y con el tamaño indicado;
   - con señal «en curso» (`*_visorobra_en_curso.json`) y sin marca, se ignora;
   - sin marca ni señal, se trata como publicación antigua y se muestra.
5. Si hay publicaciones incompletas, la v1 avisa y las cuenta aparte en el panel «Paquete» (`index.html:2121`).
6. Cada publicación vive en su propia carpeta. Una lámina publicada N veces tiene N versiones. Se ordenan por fecha de publicación y revisión; la última es la **vigente** (`index.html:2456`).
7. La v1 admite varios modelos de origen (varios archivos de Revit). Una publicación antigua sin origen se asigna por el nombre del archivo (`index.html:2274`).
8. Coordenadas: el modelo de referencia es el del manifiesto más antiguo. Los demás se colocan con sus coordenadas compartidas. Si alguno no las tiene, avisa y lo coloca con sus coordenadas internas (`index.html:2282`, `index.html:2190`).
9. Si faltan modelos del manifiesto en Drive, avisa: «¿aún subiéndose?» (`index.html:2191`).
10. Una lámina sin localización se ve, pero no se enlaza con el modelo, y la v1 avisa (`index.html:2641`).
11. Las láminas que ha eliminado el JP no se muestran (`index.html:2447`).
12. Si el proyecto no tiene modelo, la v1 dice que se exporte con «Exportar lámina obra» (`index.html:2203`).

## 4. Planos

1. Lista de láminas con búsqueda por número o nombre (`index.html:2528`).
2. Se pueden agrupar por: organización del proyecto, modelo de origen, prefijo del número, sin agrupar o cualquier parámetro de la lámina. Por defecto se agrupan por la organización; si no hay, por un parámetro de grupo, disciplina o categoría; si no, por prefijo (`index.html:2501`).
3. Casilla «Ver revisiones superadas» (`index.html:2532`).
4. Cada lámina vigente muestra cuántas incidencias tiene pendientes y cuántas versiones hay (`index.html:2554`).
5. Selector de versión. Si se abre una versión superada, aparece un aviso con la vigente y el botón «Ver la vigente» (`index.html:2598`).
6. Lámina anterior y siguiente, también con Re Pág y Av Pág (`index.html:2589`).
7. Zoom con +, −, «Ajustar», Ctrl + rueda, pellizco y doble toque, entre el 25 % y el 1600 % del ajuste (`index.html:3085`, `index.html:4608`).
8. La primera vez que se dibuja una lámina se guarda una vista previa en el dispositivo. Las siguientes veces se ve al instante (`index.html:2645`).
9. Precarga de las láminas vecinas: 3 en ordenador, 1 en pantalla táctil. No precarga con ahorro de datos, con 2G ni láminas de más de 30 MB (`index.html:2673`).
10. En móvil y tablet la lámina se dibuja con menos píxeles para que vaya más rápida (`index.html:3059`).
11. **Plano → modelo**: un clic en una vista de la lámina lleva a ese punto del modelo (`index.html:3154`):
    - en planta, a la altura del plano de corte (o nivel + 1200 mm);
    - en sección o alzado, en la dirección de la vista;
    - enseña X, Y, Z internas, selecciona el elemento tocado y mueve la cámara;
    - opción «Cortar como el plano» para cortar el 3D igual que el plano.
12. **Medir en el plano**: distancia y área con la escala real de cada vista; fuera de las vistas, en mm de papel. Mayúsculas fuerza horizontal o vertical. Las medidas no se guardan al cambiar de proyecto (`index.html:3391`).

## 5. Modelo 3D

1. Orden de carga del modelo (`index.html:3609`):
   1. caché del dispositivo;
   2. versión procesada `.crgeo` guardada en Drive;
   3. el IFC, procesado en el navegador.
2. Si alguien del equipo procesa un IFC que no tiene versión procesada, la v1 la sube a la carpeta `_visor_procesado` del proyecto para que el resto no tenga que procesarlo (`index.html:3624`, `Código.gs:741`).
3. No abre IFC de más de 1,5 GB y propone publicar con federación de vínculos o una vista 3D más ligera (`index.html:3613`).
4. Federación: modelo anfitrión y vínculos, cada uno con sus copias (también simétricas) (`index.html:3671`).
5. En pantalla compacta, el modelo solo se carga al abrir la pestaña «Modelo» (`index.html:2206`).
6. Barra y texto de progreso mientras carga: modelo N de M, descarga en %, procesado (`index.html:3505`, `index.html:3652`).
7. **Selección**: un clic resalta el elemento y muestra (`index.html:3980`):
   - origen (disciplina, modelo, copia);
   - categoría, familia, tipo e Id de Revit;
   - parámetros de ejemplar y de tipo del `_PROPS.json.gz`, por grupos (los `CR_` abiertos);
   - botón «Ver propiedades IFC».
8. **Modelo → planos**: al tocar el modelo, la v1 lista hasta 10 vistas de láminas vigentes donde aparece ese punto. En plantas, solo si el punto está entre −150 mm y +6000 mm sobre el nivel. Enseña también las coordenadas compartidas (`index.html:3874`).
9. **Medir en el modelo**: distancia (con desnivel), altura (con distancia en planta) y área (con perímetro), con ajuste a vértice y arista (`index.html:3261`).
10. **Sección**: caja de sección en X, Y y Z; corte por una cara con desplazar e invertir; «Quitar cortes». Selector de coordenadas del IFC: internas o compartidas (`index.html:4024`).
11. **Visibilidad**: ocultar y aislar la selección (teclas H, I, Esc), y casillas por modelo, planta y categoría. Espacios y huecos van ocultos de inicio. En vínculos repetidos, lo oculto se oculta en todas las copias (`index.html:4106`).
12. «Ver todo» encuadra el modelo (`index.html:3242`).
13. **Control de exportación**: compara la posición de muros, ventanas y puertas del IFC con la que da Revit en el manifiesto. Tolerancia 30 mm. Enseña cuántos están bien, desplazados o sin encontrar, el desfase vertical por nivel, el caso de alféizar doble y los 30 peores con enlace al elemento. No se aplica si todo el modelo está en vínculos (`index.html:4204`).

## 6. Comunicaciones

1. Cinco tipos: incidencia (INC), consulta (CON), orden o instrucción (ORD), envío de documentación (ENV) y aviso o información (AVI) (`Código.gs:299`).
2. El servidor asigna el número, correlativo por proyecto: `COM-0001`, `COM-0002`… (`Código.gs:833`).
3. Formas de crear una comunicación:
   - «+ Nueva»: consulta por defecto, sin plano (`index.html:4485`);
   - dibujar una nube sobre el plano: incidencia (`index.html:4748`);
   - en táctil, mantener pulsado medio segundo sobre el plano (`index.html:4620`);
   - botón «Incidencia» desde el 3D (`index.html:4806`);
   - en móvil, botón flotante «+» (`index.html:4605`).
4. Una incidencia desde una nube guarda (`index.html:4796`):
   - la lámina: número, nombre, revisión, fecha de publicación, versión y modelo de origen;
   - el recuadro de la nube en mm de lámina;
   - la vista y el punto del modelo;
   - la cámara, la visibilidad y el corte del 3D;
   - una captura del plano y otra del modelo (máx. 720 px; el servidor rechaza más de 1,5 MB).
5. Una incidencia desde el 3D guarda la cámara, la captura y el punto. Además busca la lámina donde aparece el punto y le pone una nube pequeña (`index.html:4806`).
6. Campos: tipo, para, copia, asunto (140 caracteres), descripción (4000), adjuntos, agente o disciplina, prioridad (Alta, Media o Baja), estado, fecha límite y comentario (`index.html:527`, `Código.gs:657`).
   - «Para» y «Copia» solo ofrecen personas y grupos con permiso en la carpeta del visor (`Código.gs:620`).
   - «Agente o disciplina» es una lista fija: Arquitectura, Dirección de ejecución, Constructora, Ing. estructuras, Ing. instalaciones, Propiedad / PM (`index.html:4300`).
7. Plazo por defecto: incidencia, 2 días laborables; consulta, 3. El resto, sin plazo. Laborable = de lunes a viernes (`index.html:4352`).
8. Estados: Abierta, En curso, Respondida y Cerrada. Reglas (`Código.gs:859`):
   - el equipo puede hacer cualquier cambio;
   - el agente puede pasar incidencias y consultas a «En curso» o «Respondida» si no están cerradas;
   - quien crea una consulta puede cerrarla;
   - un aviso nace cerrado;
   - quien no es equipo no puede crear una comunicación ya cerrada.
9. Cada cambio de estado, cada adjunto nuevo y cada acuse queda como mensaje en el hilo, con autor y hora (`Código.gs:868`).
10. **Adjuntos** (`Código.gs:934`, `index.html:4668`):
    - máximo 300 MB por archivo y 30 por guardado;
    - subida a trozos de 8 MB que se puede reanudar;
    - botón «Hacer foto» con la cámara; las fotos se reducen a 2560 px antes de subir;
    - se archivan en la carpeta de su comunicación.
11. **Lecturas**: se anota la primera lectura de cada persona, sin cambiar la fecha de «actualizada». Se ve quién la ha leído y quién falta (`Código.gs:887`, `index.html:4438`).
12. **Acuse de recibo**: solo en órdenes y envíos, y solo para sus destinatarios (para y copia). Un envío se cierra solo cuando todos los de «para» han acusado recibo (`Código.gs:906`).
13. **Eliminar**: solo el equipo. Queda una marca de borrado para que el resto de visores la quiten; en el libro aparece como «Eliminada» (`Código.gs:1008`).
14. **Ir al punto**: abre la versión exacta de la lámina, centra la nube y devuelve el 3D a la cámara, visibilidad y corte guardados (`index.html:4917`).
15. **Nubes en el plano** (`index.html:4733`):
    - color según el estado;
    - en trazo discontinuo y con su revisión si se crearon sobre otra versión;
    - el filtro «Pendientes» oculta las cerradas.
16. **Lista lateral**: filtros de estado, tipo, lámina, agente y «Para mí». Cuenta las no leídas (`index.html:4934`).
17. **Vista «Comunicaciones»** a pantalla completa (`index.html:4540`):
    - tabla ordenable por columnas;
    - búsqueda en número, asunto, personas, texto, adjuntos y mensajes;
    - filtros: pendientes, vencidas, sin leer, todas; tipo; «Para mí»;
    - contadores de sin leer y vencidas.
18. **Sincronización**: cada 20 s con la pestaña visible y al volver a ella. Solo baja lo cambiado. La organización de planos solo viaja si ha cambiado (`index.html:2224`, `Código.gs:788`).

## 7. Archivo central de COMUNICACIONES (servidor)

1. Todo lo de las comunicaciones vive en una carpeta central, nunca en las carpetas de proyecto compartidas con los agentes. Por defecto, la carpeta COMUNICACIONES dentro de «<carpeta del visor en la unidad compartida>». Si la carpeta estaba en otro sitio, el servidor la mueve a su sitio (`Código.gs:294`, `Código.gs:309`).
2. Por proyecto, una carpeta «código · nombre» con (`Código.gs:348`, `Código.gs:419`):
   - el libro `<código>_Libro_comunicaciones`, con las pestañas «Libro» (legible), «Hilo», «Datos (no editar)», «Organizacion» y «Láminas eliminadas»;
   - una carpeta por año y, dentro, una por comunicación (`número_asunto`) con su ficha PDF y sus adjuntos;
   - `_adjuntos_entrada`, `_capturas` y `_copias`.
3. La ficha PDF de cada comunicación se genera en segundo plano, con una tarea cada 5 min (`Código.gs:485`).
4. Copia diaria a las 23 h del libro de cada proyecto, en Excel y PDF. Se conservan los 180 archivos más recientes (`Código.gs:513`).
5. Los textos del hilo que empiezan por `=`, `+`, `@` o `-` se guardan como texto para que la hoja no los ejecute como fórmula (`Código.gs:402`).
6. Las escrituras usan un bloqueo para que dos personas a la vez no se pisen (`Código.gs:822`).
7. El servidor migra la hoja antigua de incidencias, que estaba en la carpeta compartida del proyecto (`Código.gs:361`).

## 8. Registro de actividad

1. Pestaña «Registro» de la hoja de proyectos, con fecha, correo, acción, proyecto y detalle (`Código.gs:258`).
2. Se anota: acceso, abrir proyecto, descargas, leer comunicación, crear y editar comunicación, acuse de recibo, eliminar comunicación, organizar planos, eliminar lámina, guardar versión procesada, imprimir y descargar paquete PDF.
3. Las descargas y lecturas se agrupan y se escriben de 40 en 40 para no ralentizar (`Código.gs:281`).

## 9. Organizar planos

1. Solo el JP. Crea grupos, los ordena y coloca las láminas: arrastrando, con «Mover a» o generando grupos según un criterio (`index.html:2712`, `Código.gs:801`).
2. Se guarda para todo el proyecto. Las láminas nuevas aparecen en «Sin clasificar».
3. Si otra persona ha guardado mientras tanto, la v1 avisa, carga la versión actual y pide revisar y volver a guardar (`Código.gs:807`, `index.html:2858`).
4. Límites: 300 grupos y 6000 láminas (`Código.gs:560`).

## 10. Eliminar láminas

1. Solo el JP. Se elige «solo esta versión» o «la lámina entera» (`index.html:4492`, `Código.gs:972`).
2. El motivo es obligatorio (500 caracteres).
3. El PDF y su `_LOC.json` van a la papelera de Drive (recuperables 30 días). Los índices no se tocan.
4. Queda anotado en «Láminas eliminadas»: fecha, quién, lámina, modelo, publicación, revisión, alcance, motivo y archivos.
5. Las comunicaciones que citan la lámina se conservan.
6. **Efecto comprobado (26/11/2026):** al mandar el PDF a la papelera, la marca de publicación deja de cuadrar y la v1 trata toda la publicación como incompleta (apartado 3.4). En CASO-F, eliminar la lámina 00 dejó sin ver también CO01-02 a CO01-06. Requisito de la v2: borrar una lámina nunca invalida el resto de su publicación (CA-21).

## 11. Impresión

1. «Imprimir» (lámina abierta) o «Paquete de impresión» (varias láminas vigentes, con filtro y por grupos) (`index.html:2867`).
2. Opciones (`index.html:2988`):
   - portada con índice: número, nombre, revisión e incidencias pendientes (solo con más de una lámina);
   - nubes de las incidencias pendientes estampadas en cada lámina;
   - pie de trazabilidad: proyecto, lámina, quién y cuándo, y «Copia de consulta: compruebe la revisión vigente».
3. Se imprime en una pestaña nueva o se descarga como `AAAAMMDD_<proyecto>_<lámina o paquete>.pdf` (`index.html:3029`).
4. Los paquetes con nombre se guardan en el dispositivo, por proyecto (`index.html:2869`).
5. Cada impresión o descarga queda en el registro del servidor (`index.html:3037`).

## 12. Sin cobertura y caché

1. App instalable (PWA). El trabajador de servicio (`sw.js`):
   - la página, primero de la red (5 s máximo) y, si no hay, la guardada;
   - las partes del visor (lector IFC, generador de PDF, iconos), de la caché.
2. Con conexión, la v1 guarda en el dispositivo la sesión y lo último de cada proyecto abierto (`index.html:1856`).
3. Sin conexión, abre con eso y muestra un aviso con la fecha de lo guardado. Lo ya descargado (láminas, modelos, adjuntos) se ve igual (`index.html:1862`).
4. Un proyecto que nunca se abrió con conexión en ese dispositivo no se puede ver sin ella (`index.html:1778`).
5. Al volver la red, aparece el botón «Reconectar», que recarga el visor (`index.html:1876`).
6. **Sin conexión no se puede guardar**: crear, responder, acusar o cambiar el estado dan el error «Sin conexión: se podrá hacer cuando vuelva la cobertura» (`index.html:1826`). Ver PENDIENTE P-04.
7. Caché de archivos en el dispositivo de hasta 3 GB. Al pasarse, borra los menos usados hasta el 80 % (`index.html:1923`).
8. Cada archivo se guarda por proyecto, id y fecha de modificación: lo publicado se reutiliza sin caducidad (`index.html:1971`).
9. Al abrir un proyecto, enseña al instante lo guardado y pregunta al servidor si hay novedades. Si las hay, avisa y recarga (`index.html:2085`).
10. Descargas: trozos de 8 MB, 6 en paralelo, comprimidos si son texto, 5 reintentos con espera creciente y 2 min máximo por trozo (`index.html:1970`).
11. Los JSON se piden en lotes de 60, 3 lotes en paralelo (`index.html:2049`).

## 13. Pantallas

1. Ordenador: vistas «Dividida», «Plano», «Modelo 3D» y «Comunicaciones» (teclas 1 a 4) y panel lateral con comunicaciones, punto, elemento, control de exportación y paquete (`index.html:349`).
2. Pantalla compacta (hasta 820 px de ancho): una vista cada vez, pestañas abajo (Planos, Modelo, Comunicaciones, Más). La lista de planos se cierra al elegir una lámina (`index.html:4591`).
3. Respeta el modo oscuro del sistema y la preferencia de reducir animaciones (`index.html:1753`).

## 14. Diagnóstico

1. Panel «Paquete»: láminas vigentes y versiones, publicaciones (y sin completar), láminas sin localización, modelo, manifiesto y tiempos (`index.html:4286`).
2. «Copiar diagnóstico de velocidad»: dispositivo, pantalla, conexión, memoria y tiempos de proyecto, lámina y modelo (`index.html:4263`).
3. En el servidor, la función `diagnostico()` comprueba la hoja de proyectos, los permisos y el rol calculado (`Código.gs:1027`).

## 15. Modo local (desactivado en producción)

1. Con `ALLOW_LOCAL = false` (`index.html:1770`) están ocultos: abrir una carpeta local, arrastrar archivos y guardar incidencias solo en el dispositivo.
2. En línea, el equipo ve «Guardar paquete» (descarga las comunicaciones en un JSON); «Abrir paquete» está oculto (`index.html:2016`, `index.html:1907`).

## 16. Funciones de la v0.22–v0.23 perdidas

Según el BIM Manager, existían en la v0.22–v0.23 y se perdieron con ella. **No está en el código.** Solo quedan las que faltan en el código publicado.

1. **Láminas como imágenes por niveles (`.crimg`).** No está en el código.
   - Se guardaban en la carpeta `_visor_procesado` del proyecto.
   - Un ordenador del equipo las preparaba solo al abrir una lámina.
   - El móvil pedía solo los trozos que miraba, con una función «range» del servidor. El servidor publicado no tiene esa función: sus acciones son `me`, `open`, `files`, `json`, `chunk`, `geoStart`, `geoChunk`, `logEvent`, `issues`, `saveLayout`, `saveIssue`, `markRead`, `ack`, `attStart`, `attChunk`, `deleteSheet` y `deleteIssue` (`Código.gs:673`).
   - Medida que da el BIM Manager, en móvil simulado: abrir una lámina tardaba 0,5–0,8 s con `.crimg`, frente a 1,7–2,5 s desde el PDF. No constan dispositivo, red ni hora, y no se puede repetir porque el código se perdió. No vale como referencia para la v2.
2. **Aviso de versión nueva de la app.** No está en el código. El trabajador de servicio publicado baja la página nueva en cuanto hay red (`sw.js:24`), pero no avisa a la persona.

Las otras funciones de esa lista ya están en el código publicado:
- pestañas, gestos, foto comprimida y apertura sin conexión (apartados 13, 4, 6.10 y 12);
- eliminar láminas y versiones solo el JP, con papelera y registro (apartado 10);
- vista completa de comunicaciones con la tecla 4 (apartados 6.17 y 13);
- diagnóstico de velocidad en Más › Paquete (apartado 14).

---

## PENDIENTE

### Resueltas

- **P-01 · Versión base.** La v0.23 y el servidor v0.17 se perdieron. La base es lo publicado: `sw.js` 0.21 y servidor v0.16. *(BIM Manager, 26/11/2026)*
- **P-02 · Órdenes.** Solo las emiten la DF y los JP del despacho, nunca la constructora. El código publicado lo cumple: solo deja al rol «equipo». *(BIM Manager, 26/11/2026)*
- **P-03 · `.crimg`.** No está en el código publicado; pasa al apartado 16 y a P-14.
- **P-04 · Sin cobertura.** Fallo conocido de la v1 y no se arregla en ella. Es requisito de la v2: **CA-10** de la spec (la respuesta se guarda en local y se envía sola al volver la red, sin duplicarse). En la v1 no hay cola, guardar sin red falla aunque el aviso diga que «esperarán», y los botones de crear siguen visibles sin conexión (`index.html:1826`, `index.html:1866`, `index.html:1904`). *(BIM Manager, 26/11/2026)*

### Para la entrevista de la parada 5

- **P-05 · Actas de visita.** La v1 no tiene nada para visitas ni actas; hoy se hacen a mano.
- **P-06 · Avisos.** La v1 no envía correo ni notificaciones. Los destinatarios se enteran al abrir el visor.
- **P-07 · Comentarios de «consulta».** El servidor deja comentar al rol consulta (lector en Drive). ¿Es intencionado?
- **P-08 · Eliminar comunicaciones.** Puede cualquiera del equipo, no solo el JP. ¿Es intencionado?
- **P-09 · Agentes o disciplinas.** La lista es fija en el código, igual para todos los proyectos.
- **P-10 · Plazos.** Los días laborables no descuentan festivos.
- **P-11 · Móvil.** La v1 carga planos y modelo en móvil. `AGENTS.md` dice que en la v2 no se cargan.
- **P-12 · Datos en el código.** `index.html` de la v1 lleva la URL del servidor, el Client ID de producción y un correo real como valor por defecto del modo de desarrollo (`index.html:635`, `index.html:1768`). `Código.gs` lleva el id de la carpeta central (`Código.gs:307`). La v2 no puede repetirlo (`AGENTS.md`).
- **P-13 · Lector IFC.** No se ha leído `lib/ifc-worker.js`: no se sabe qué datos del IFC extrae.
- **P-14 · ¿Hacen falta los `.crimg` en la v2?** En el móvil de la v2 ya no hay planos, solo recortes PNG. Los `.crimg` solo servirían para la tablet. ¿Se recuperan para la tablet o basta con el PDF? Depende de lo que se mida en la tablet en la parada 3 (CA-11).
