var cacheName = 'developpeurs-v-1-5';
var filesToCache = [
'',
'index.html',
'developpeurs.html',
'contact.html',
'developpeurs_Alaric.html',
'developpeurs_Fabien.html',
'images/face.png',
'scripts/app.js',
'scripts/jquery-3.1.1.min.js',
'scripts/materialize/materialize.js',
'scripts/materialize/materialize.min.js',
'styles/inline.css',
'styles/font-awesome.min.css',
'styles/materialize.min.css',
'styles/materialize.css'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('beforeinstallprompt', function(e) {
  // beforeinstallprompt Event fired

  // e.userChoice will return a Promise. 
  // For more details read: https://developers.google.com/web/fundamentals/getting-started/primers/promises
  e.userChoice.then(function(choiceResult) {

    console.log(choiceResult.outcome);

    if(choiceResult.outcome == 'dismissed') {
      console.log('User cancelled home screen install');
    }
    else {
      console.log('User added to home screen');
    }
  });
});

self.addEventListener('activate', function(e) {
console.log('[ServiceWorker] Activate');
e.waitUntil(
caches.keys().then(function(keyList) {
  return Promise.all(keyList.map(function(key) {
    if (key !== cacheName) {
      console.log('[ServiceWorker] Removing old cache', key);
      return caches.delete(key);
    }
  }));
})
);
return self.clients.claim();
});