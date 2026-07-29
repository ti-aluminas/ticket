// Aluminas Tickets - service worker de notificacao
// Precisa ficar na MESMA pasta do index.html e ser servido por https (GitHub Pages serve).

const VERSAO = 'aluminas-sw-v1';

self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });

// Clique na notificacao: foca a aba ja aberta, ou abre uma nova
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const alvo = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((lista) => {
      for (const c of lista) {
        if ('focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(alvo);
    })
  );
});

// Espaco reservado para Web Push (fase futura, exige servidor + VAPID)
self.addEventListener('push', (event) => {
  let dados = { titulo: 'Aluminas Tickets', corpo: 'Nova atualizacao' };
  try { if (event.data) dados = Object.assign(dados, event.data.json()); } catch (e) {}
  event.waitUntil(
    self.registration.showNotification(dados.titulo, {
      body: dados.corpo,
      tag: 'aluminas-push-' + Date.now(),
      requireInteraction: true
    })
  );
});
