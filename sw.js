const CACHE_NAME = 'book-quiz-v4';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(STATIC_ASSETS.map(url => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.hostname.includes('googleapis.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (event.request.method === 'GET' && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});

// ─── Reminder config (received from app via postMessage) ─────────────────────
let reminderTime = '09:00'; // default, overridden by app

self.addEventListener('message', event => {
  if (event.data?.type === 'REMINDER_CONFIG') {
    reminderTime = event.data.time || '09:00';
  }
});

// ─── Daily reminder via Periodic Background Sync ─────────────────────────────
self.addEventListener('periodicsync', event => {
  if (event.tag === 'daily-quiz-reminder') {
    event.waitUntil(maybeShowReminder());
  }
});

async function maybeShowReminder() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

  // Check if already notified today
  const lastShown = await getStore('reminder_last_shown');
  if (lastShown === today) return;

  // Check if we're past the user's preferred time (allow up to 6h window)
  const [prefHour, prefMin] = reminderTime.split(':').map(Number);
  const prefMinutes = prefHour * 60 + prefMin;
  const nowMinutes  = now.getHours() * 60 + now.getMinutes();
  if (nowMinutes < prefMinutes || nowMinutes > prefMinutes + 360) return;

  await setStore('reminder_last_shown', today);
  await showDailyReminder();
}

async function showDailyReminder() {
  const messages = [
    { title: '📚 Quiz time!',       body: 'Your daily chapter is waiting. Keep the streak going!' },
    { title: '🧠 Time to study!',   body: 'A few questions a day keeps forgetting away.' },
    { title: '📖 Daily quiz ready', body: 'Open the app and test yourself on a new chapter.' },
    { title: '🎓 Study reminder',   body: "Don't break your streak — quiz yourself today!" },
    { title: '⚡ Quick quiz!',      body: '5 minutes of focused questions. You\'ve got this.' },
  ];
  const msg = messages[Math.floor(Math.random() * messages.length)];
  await self.registration.showNotification(msg.title, {
    body: msg.body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: 'daily-quiz',
    renotify: true,
    data: { url: self.registration.scope },
  });
}

// ─── Tiny IndexedDB helpers for SW ───────────────────────────────────────────
function openSwDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open('sw-store', 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('kv');
    req.onsuccess = e => res(e.target.result);
    req.onerror   = e => rej(e.target.error);
  });
}
async function getStore(key) {
  const db = await openSwDB();
  return new Promise((res, rej) => { const r = db.transaction('kv','readonly').objectStore('kv').get(key); r.onsuccess = e => res(e.target.result); r.onerror = e => rej(e.target.error); });
}
async function setStore(key, val) {
  const db = await openSwDB();
  return new Promise((res, rej) => { const r = db.transaction('kv','readwrite').objectStore('kv').put(val, key); r.onsuccess = () => res(); r.onerror = e => rej(e.target.error); });
}

// ─── Tap notification → open app ─────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const appUrl = event.notification.data?.url || self.registration.scope;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // Focus if already open
      for (const client of list) {
        if (client.url.startsWith(appUrl) && 'focus' in client) return client.focus();
      }
      // Otherwise open a new window
      return clients.openWindow(appUrl);
    })
  );
});
