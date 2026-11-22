const CACHE='la-esquinita-shell-v1';
const CORE=['../index.html','../css/styles.css','../js/app.js','../js/config.js','../js/pwa.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.pathname.includes('/api/'))return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
  if(response.ok&&url.origin===location.origin){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));}
  return response;
 }).catch(()=>caches.match('../index.html'))));
});
