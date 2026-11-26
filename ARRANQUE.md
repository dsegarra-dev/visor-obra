# Arranque del visor v2 con Claude Code

[BORRADOR IA — EN REVISIÓN]

Sigue `METODO COMPLETO.md` del kit BBTS26 (las 18 paradas), adaptado a este proyecto. Esta guía cubre de la rama a la spec aprobada. Lo que va entre llaves `{así}` lo rellenas tú.

## 0. Crear la rama v2

En la carpeta local del repositorio `dsegarra-dev/visor-obra`, desde el terminal de VS Code:

```bash
git checkout main
git pull
git checkout -b v2
```

Copia en la raíz del repositorio `AGENTS.md`, `CLAUDE.md` y la carpeta `docs/` de este paquete. Luego:

```bash
echo ".scratchpad/" >> .gitignore
git add AGENTS.md CLAUDE.md docs .gitignore
git commit -m "v2: reglas del proyecto, spec borrador y lecciones"
git tag v2-p1
git push -u origin v2 --tags
```

GitHub Pages sigue publicando desde `main`, así que la v1 no se toca.

## 1. Comprobar las reglas (parada 1)

Abre Claude Code en una sesión nueva y pega:

```
¿Qué reglas tienes para este proyecto y de qué archivo las lees? Resume también las lecciones de docs/referencia/lecciones.md en cinco líneas. No cambies nada.
```

Qué debes ver: las reglas de `AGENTS.md`, leídas a través de `CLAUDE.md`.

## 2. Cómo se hace hoy (parada 2)

```
Hoy funciona así: publico planos y modelos desde Revit con «Exportar lámina obra»; el visor v0.23 los enseña desde Drive a través de Apps Script; la DF, el JP y la constructora abren incidencias, consultas y órdenes sobre plano; todo se archiva en la carpeta central de COMUNICACIONES. En obra, los jefes de obra usan el móvil, a menudo sin cobertura, y apunto las visitas a mano para redactar el acta después. Lee index.html, sw.js y el Código.gs del servidor que te adjunto en .scratchpad/v1/. Conviértelo en una lista ordenada de funciones y reglas que ya cumple la v1, sin añadir nada. Marca cada duda como PENDIENTE y pregúntame solo las que impidan seguir. Guárdalo en docs/como-se-hace-hoy.md. No escribas código.
```

Antes de pegarlo, copia el `Código.gs` del servidor en `.scratchpad/v1/`.

## 3. Casos de prueba y medidas de la v1 (parada 3)

```
Crea casos/ con CASO-P y CASO-F. Para cada uno, anota el resultado esperado contando el paquete publicado en Drive con un script aparte, nunca con el código del visor: número de láminas, versiones, modelos y vínculos, y número de comunicaciones por tipo y estado en el libro central. Mide con la v1 en ordenador, tablet y móvil: tiempo de abrir el proyecto, de abrir un plano, de cargar el modelo y de abrir una incidencia. Anota dispositivo, red y hora de cada medida. Anota también tres puntos de control plano↔modelo por proyecto. Guárdalo en casos/ y apunta cómo has sacado cada valor.
```

Las cifras de esta parada son las que la v2 no puede empeorar (CA-05 y CA-11 de la spec).

## 4. Aprender de lo que existe (parada 4)

```
Paso REA. No escribas código todavía.
A) Comportamiento de programas comerciales, solo con documentación pública: Aelion (notas de voz que crean, cambian y cierran incidencias y generan el acta, con validación), Dalux Field y Revizto (incidencias sobre plano y modelo, uso en móvil sin cobertura) y Autodesk Viewer (sencillez). Para cada uno: qué hace, qué idea adoptamos y cómo la haremos nosotros con Drive y Apps Script.
B) Nuestra v1: qué partes se conservan tal cual y cuáles se reescriben.
Escribe docs/rea-visor-obra.md con una tabla: fuente · idea · ¿la adoptamos? · cómo. Regla: aprender y reescribir con nuestras palabras, sin copiar código ni textos.
```

## 5. Entrevista sobre la spec (parada 5)

```
Lee docs/specs/CR_ESP_VisorObra_PO_v2.0.md, docs/como-se-hace-hoy.md y docs/rea-visor-obra.md. Fríeme a preguntas hasta cerrar todos los PENDIENTE de la spec y lo que haya quedado abierto en la REA. Pregunta primero lo que condiciona lo demás y recomienda siempre una respuesta. Al final, resume lo acordado en docs/entrevista.md. No escribas código.
```

## 6. Cerrar la spec (parada 7)

```
Actualiza docs/specs/CR_ESP_VisorObra_PO_v2.0.md con lo acordado en docs/entrevista.md y las medidas de casos/. Sustituye cada «medir en p3» por la cifra medida y cómo se midió. Cada criterio debe poder fallar y decir cómo se comprueba. Mantén el TL;DR sin lenguaje técnico y los diagramas. No escribas código.
```

## 7. Abogado del diablo (parada 8)

```
Haz un análisis de abogado del diablo de la spec con un subagente que no la haya escrito. Semáforo ROJO NARANJA AMARILLO. Busca contradicciones, casos olvidados (incidencia creada sin cobertura y editada por otro a la vez, plano eliminado con incidencias abiertas, usuario que pierde el permiso, nota de voz que mezcla dos obras), criterios imposibles de comprobar, alcance oculto y seguridad, sobre todo permisos y datos enviados a la IA. Cada punto con un ejemplo de cómo fallaría y el arreglo mínimo. Guarda el informe en .scratchpad/. No cambies la spec.
```

```
Añade o cambia en la spec los puntos {números elegidos}.
```

Con la spec revisada, quítale la etiqueta de borrador, firma con `[REVISADO POR: …]` y etiqueta el commit. A partir de aquí sigue con la parada 9 (plan con esqueleto) de `METODO COMPLETO.md`.
