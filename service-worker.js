// Service Worker for Progressive Web App
const CACHE_NAME = 'akila-portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/animate.css',
  '/css/aos.css',
  '/css/bootstrap.min.css',
  '/css/flaticon.css',
  '/css/icomoon.css',
  '/css/ionicons.min.css',
  '/css/magnific-popup.css',
  '/css/owl.carousel.min.css',
  '/css/owl.theme.default.min.css',
  '/js/main.js',
  '/js/app.js',
  '/js/jquery.min.js',
  '/js/bootstrap.min.js',
  '/js/aos.js',
  '/js/owl.carousel.min.js',
  '/images/bg_1.png',
  '/images/bg_2.png',
  '/images/icon.png'
];

// Install event - cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  return self.clients.claim();
});

// Background sync for contact form (if supported)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncMessages() {
  // Implement message syncing logic here
  console.log('Syncing messages...');
}

// Push notification support
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/images/icon.png',
    badge: '/images/icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Akila Portfolio', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
