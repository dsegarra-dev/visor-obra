/* CEL-RAS · Visor de obra · trabajador de servicio
   Guarda la aplicación en el dispositivo para que se abra sin conexión. Las peticiones al servidor
   (Apps Script) y a Google no pasan por aquí: los datos de los proyectos los guarda el propio visor. */
var CACHE = "visor-obra-0.21-74699";
var SHELL = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k.indexOf("visor-obra-") === 0 && k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
function fromNetwork(req, ms){
  return new Promise(function(res, rej){
    var t = setTimeout(function(){ rej(new Error("tiempo")); }, ms);
    fetch(req).then(function(r){ clearTimeout(t); res(r); }, function(e){ clearTimeout(t); rej(e); });
  });
}
self.addEventListener("fetch", function(e){
  var req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  // la página: primero la red (para recibir versiones nuevas) y, sin cobertura, la guardada
  if (req.mode === "navigate" || /\/(index\.html)?$/.test(url.pathname)){
    e.respondWith(fromNetwork(req, 5000).then(function(r){
      if (r.ok){ var copy = r.clone(); caches.open(CACHE).then(function(c){ c.put("index.html", copy); }); }
      return r;
    }).catch(function(){ return caches.match("index.html").then(function(r){ return r || caches.match("./"); }); }));
    return;
  }
  // partes del visor (lector IFC, generador de PDF, iconos): de la caché y, si no están, de la red
  e.respondWith(caches.match(req).then(function(hit){
    return hit || fetch(req).then(function(r){
      if (r.ok){ var copy = r.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
      return r;
    });
  }));
});
