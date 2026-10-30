const CACHE='ak74-v1';
const LOCAL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const REMOTE=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js',
 'https://fonts.googleapis.com/css2?family=PT+Sans+Narrow:wght@400;700&family=PT+Serif:wght@400;700&display=swap'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(async c=>{
    await c.addAll(LOCAL);
    await Promise.allSettled(REMOTE.map(u=>fetch(new Request(u,{mode:'no-cors'})).then(r=>c.put(u,r))));
  }).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(r=>{
    if(r&&(r.ok||r.type==='opaque')){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}
    return r;
  }).catch(()=>caches.match('./index.html'))));
});
