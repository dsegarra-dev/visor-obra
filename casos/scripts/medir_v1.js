// [BORRADOR IA — EN REVISIÓN]
// Mide la v1 publicada (https://dsegarra-dev.github.io/visor-obra/) en ordenador, desde fuera:
// solo espera a lo que se ve en pantalla; no llama a funciones del visor.
//
// Requisito: Edge abierto con depuración remota y la sesión de Google ya iniciada a mano
// (ver casos/README.md). Playwright se conecta a ese navegador.
//
// Uso:
//   set NODE_PATH=.scratchpad\medir\node_modules
//   node casos/scripts/medir_v1.js <código> <lámina> <comunicación> <frio|caliente> <repeticiones> <salida.jsonl>
// Ejemplo:
//   node casos/scripts/medir_v1.js CASO-F IE02-30 COM-0001 frio 3 .scratchpad/medir/resultados.jsonl
//
// Qué se mide (milisegundos, reloj de Node):
//   sesion   desde la navegación hasta que aparece el usuario (entrada automática de Google)
//   proyecto desde que aparece el usuario hasta que el panel «Paquete» muestra la fila «Apertura»
//            (el visor ha terminado de leer índices y localizaciones)
//   modelo   desde que aparece el usuario hasta que el texto de progreso muestra «… elementos»
//   plano    desde el clic en la lámina hasta que su título deja de estar «cargando» (dibujada)
//   incidencia desde el clic en la comunicación hasta que el diálogo está abierto y sus capturas cargadas
// «frio»: antes de cada repetición se borra lo guardado por el visor en el navegador
//         (IndexedDB, Cache Storage, service worker, localStorage). La sesión de Google no se toca.
const { chromium } = require("playwright-core");
const fs = require("fs");

const URL_V1 = "https://dsegarra-dev.github.io/visor-obra/";
const ORIGEN = "https://dsegarra-dev.github.io";
const [code, lamina, com, modo, reps, salida, etiqueta] = process.argv.slice(2);
if (!salida) { console.error("Faltan argumentos. Ver la cabecera del script."); process.exit(2); }

function hora() { return new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" }); }

(async () => {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  const cdp = await ctx.newCDPSession(page);
  // abre directamente el proyecto pedido (el visor recuerda el último proyecto en localStorage)
  await page.addInitScript(c => { try { localStorage.setItem("cr_visorobra_proyecto", c); localStorage.setItem("cr_visorobra_vista", "split"); } catch (e) {} }, code);
  // anota los avisos (toasts) que muestra la pantalla, para saber cuándo termina la subida de versiones procesadas
  await page.addInitScript(() => {
    window.__avisos = [];
    document.addEventListener("DOMContentLoaded", () => {
      const t = document.getElementById("toast");
      if (t) new MutationObserver(() => { if (!t.hidden && t.textContent) window.__avisos.push({ ms: Date.now(), texto: t.textContent }); })
        .observe(t, { childList: true, characterData: true, subtree: true, attributes: true });
    });
  });

  let ultimoInicio = 0;
  for (let r = 1; r <= Number(reps); r++) {
    // Edge solo hace la entrada automática de Google una vez cada 10 min, contados desde la entrada: se separan 11 min
    const espera = ultimoInicio ? 660000 - (Date.now() - ultimoInicio) : 0;
    if (espera > 0) await page.waitForTimeout(espera);
    ultimoInicio = Date.now();
    const fila = { proyecto: code, lamina, comunicacion: com, modo, etiqueta: etiqueta || "", repeticion: r, hora_inicio: hora() };
    try {
      if (modo === "frio") {
        await cdp.send("Storage.clearDataForOrigin", { origin: ORIGEN, storageTypes: "indexeddb,cache_storage,service_workers,local_storage" });
      }
      const t0 = Date.now();
      await page.goto(URL_V1, { waitUntil: "domcontentloaded" });
      await page.locator("#userChip").waitFor({ state: "visible", timeout: 120000 });
      const t1 = Date.now(); fila.sesion_ms = t1 - t0;
      fila.proyecto_abierto = await page.locator("#projSel").inputValue();
      if (fila.proyecto_abierto !== code) throw new Error("se ha abierto otro proyecto: " + fila.proyecto_abierto);

      await page.locator("#pkgBox td", { hasText: /^Apertura$/ }).waitFor({ timeout: 600000 });
      fila.proyecto_ms = Date.now() - t1;

      await page.waitForFunction(() => /elementos/.test(document.getElementById("progress").textContent) && document.getElementById("bar").hidden, null, { timeout: 1800000, polling: 200 });
      fila.modelo_ms = Date.now() - t1;
      fila.modelo_texto = (await page.locator("#progress").textContent()).trim();
      fila.rol = (await page.locator("#roleBadge").textContent()).trim();
      // si se ha procesado algún IFC, la v1 sube su versión procesada: se espera a sus avisos de «guardada»
      const m = /(\d+) IFC procesad/.exec(fila.modelo_texto);
      if (m) {
        const n = Number(m[1]);
        await page.waitForFunction(k => window.__avisos.filter(a => /Versión procesada del modelo guardada/.test(a.texto)).length >= k, n, { timeout: 1800000, polling: 500 })
          .then(() => { fila.subida_procesadas_ms = Date.now() - t1; }, () => { fila.subida_procesadas_ms = null; });
      }

      // la casilla .num lleva el número y, pegada, la fecha de publicación: se compara solo su primer texto
      const clave = await page.evaluate(n => {
        const li = Array.from(document.querySelectorAll("#sheetList li[data-key]")).find(x => {
          const num = x.querySelector(".num");
          const t = num && num.firstChild ? num.firstChild.textContent.trim() : "";
          return t === n || t.indexOf(n + " ") === 0;
        });
        return li ? li.dataset.key : null;
      }, lamina);
      if (!clave) throw new Error("no está la lámina " + lamina + " en la lista");
      const li = page.locator(`#sheetList li[data-key=${JSON.stringify(clave)}]`);
      await li.scrollIntoViewIfNeeded();
      const t2 = Date.now();
      await li.click();
      await page.waitForFunction(n => { const t = document.getElementById("sheetTitle"); return t.textContent.indexOf(n) === 0 && !t.classList.contains("loading"); }, lamina, { timeout: 300000, polling: 50 });
      fila.plano_ms = Date.now() - t2;

      const it = page.locator("#incList li[data-id]", { hasText: com }).first();
      const t3 = Date.now();
      await it.click();
      await page.waitForFunction(() => {
        const d = document.getElementById("incDlg");
        if (!d.open) return false;
        const imgs = Array.from(document.querySelectorAll("#incShots img"));
        return imgs.every(i => i.complete && i.naturalWidth > 0);
      }, null, { timeout: 120000, polling: 50 });
      fila.incidencia_ms = Date.now() - t3;
      fila.incidencia_capturas = await page.locator("#incShots img").count();
      await page.keyboard.press("Escape");

      fila.entorno = await page.evaluate(() => {
        const c = navigator.connection || {};
        return { navegador: navigator.userAgent, pantalla: innerWidth + "x" + innerHeight, red: c.effectiveType || "", downlink_mbps: c.downlink || null, rtt_ms: c.rtt || null };
      });
      fila.paquete = await page.locator("#pkgBox").innerText();
      fila.avisos = await page.evaluate(() => Array.from(new Set(window.__avisos.map(a => a.texto))));
    } catch (e) {
      fila.error = String(e && e.message || e).split("\n")[0];
      fila.pantalla_login = await page.locator("#loginMsg").textContent().catch(() => null);
      await page.screenshot({ path: salida.replace(/\.jsonl$/, "") + "_error_" + (etiqueta || modo) + "_" + r + ".png" }).catch(() => {});
    }
    fila.hora_fin = hora();
    fs.appendFileSync(salida, JSON.stringify(fila) + "\n");
    console.log(JSON.stringify({ r, sesion: fila.sesion_ms, proyecto: fila.proyecto_ms, modelo: fila.modelo_ms, plano: fila.plano_ms, incidencia: fila.incidencia_ms, error: fila.error }));
  }
  await page.close();
  process.exit(0);   // se sale sin cerrar Edge: la sesión de Google sigue abierta para la siguiente tanda
})().catch(e => { console.error("ERROR", e && e.message || e); process.exit(1); });
