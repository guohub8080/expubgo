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

// 初始化 Logger
logger.init();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App/>
)

// web 字体不再在此处加载：默认系统字体栈零流量，
// 启用了 web 字体时由 GlobalSettingsEffects 按族懒注入（见 webfontLoader.ts）
