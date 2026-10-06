/* dev 预览专用 Service Worker:把页面发出的微信图片直链(mmbiz.qpic.cn)
 * 在网络层透明转发到 vite 代理 /api/wechat-img(代理转发时补微信 Referer,
 * 绕开 CDN 防盗链)。页面 DOM 里的链接保持原样不动——「复制」产物不受影响。
 * 仅由 dev 入口在开发模式注册;无缓存,纯转发。 */
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)
  if (url.hostname !== 'mmbiz.qpic.cn') return
  event.respondWith(
    fetch('/api/wechat-img' + url.pathname + url.search, {
      method: req.method,
      headers: req.headers,
      body: req.body,
      redirect: 'follow',
    })
  )
})
