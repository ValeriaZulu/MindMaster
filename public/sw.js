self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
    const request = event.request

    // Evita intentar cachear peticiones no idempotentes como POST/PUT/PATCH/DELETE.
    if (request.method !== 'GET') {
        event.respondWith(fetch(request))
        return
    }

    event.respondWith(
        caches.open('mindmaster-runtime-v1').then(async (cache) => {
            const cached = await cache.match(request)

            if (cached) {
                return cached
            }

            const response = await fetch(request)

            if (response.ok) {
                cache.put(request, response.clone())
            }

            return response
        }),
    )
})
