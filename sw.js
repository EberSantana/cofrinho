/* Cofrinho · service worker: abre offline depois da primeira visita.
   Para publicar uma nova versão do app, aumente CACHE. */
var CACHE = "cofrinho-v1";
var SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png", "./icons/apple-touch-icon.png"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if(!sameOrigin && !isFont) return;
  /* mesma origem e fontes: responde do cache e atualiza em segundo plano */
  e.respondWith(caches.open(CACHE).then(function(cache){
    return cache.match(req, {ignoreSearch: sameOrigin}).then(function(hit){
      var net = fetch(req).then(function(res){
        if(res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
        return res;
      }).catch(function(){ return hit || (req.mode === "navigate" ? cache.match("./index.html") : Response.error()); });
      return hit || net;
    });
  }));
});
