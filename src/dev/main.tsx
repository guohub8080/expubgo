// 首先引入全局控制台日志捕获器（必须在最前面）
import './utils/consoleLogger';

// 一次性迁移 Zustand persist 的单 key 到 Jotai 的多 key（必须在 React 挂载、任何 atom 读 storage 前）
import { migrateZustandStorage } from './utils/migrateZustandStorage';
migrateZustandStorage();

import React from 'react'
import ReactDOM from 'react-dom/client'
import "./styles/global.css"
import App from "./App.tsx";
import { logger } from './utils/logger';
import { restoreNetworkSources } from './articles/networkSources';

// 初始化 Logger
logger.init();

// 网络内容源启动恢复：拉已存源的 manifest 并注册网络文章（异步不阻塞渲染；
// 此前恢复只挂在 Home 挂载 effect，直接进文章列表的会话看不到网络文章）
restoreNetworkSources();

// dev 预览:注册 mmbiz 图片 Service Worker(网络层把微信图直链转 vite 代理补 Referer;
// 页面 DOM/复制产物保持原样,详见 public/sw-mmbiz.js)
// ══════ 【临时注释 2026-10-06】SW 注册——纯插件模式测试，看完还原 ══════
// 还原：删除本标记块，恢复下方 if 块的注释即可。
// 注意：SW 注册是持久的——注释后已注册的仍活着，需在
// DevTools → Application → Service Workers 手动 Unregister 一次才真正生效
// if (import.meta.env.DEV && 'serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw-mmbiz.js').catch(() => {})
// }

// 注意:不做任何鼠标→触摸的事件桥——预览需与微信行为一致(touchstart 只来自真实触摸)。
// 桌面测试请用浏览器开发者工具的设备模拟(触摸模式),与手机微信同路径。

// 水合分支：预渲染页（构建期已把路由渲染进 HTML，root 带 data-prerendered）
// 走 hydrateRoot 复用静态标记；普通 SPA 壳（root 内是加载屏占位）走 createRoot 整体替换
const rootEl = document.getElementById('root')!

if (rootEl.dataset.prerendered === 'true') {
    ReactDOM.hydrateRoot(rootEl, <App/>)
} else {
    ReactDOM.createRoot(rootEl).render(<App/>)
}

// web 字体不再在此处加载：默认系统字体栈零流量，
// 启用了 web 字体时由 GlobalSettingsEffects 按族懒注入（见 webfontLoader.ts）
