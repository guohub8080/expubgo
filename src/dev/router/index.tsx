import { createBrowserRouter, createHashRouter } from 'react-router'
import { mainRoutes } from './routes'

//
// 路由器协议双模式：
// - 正常构建（docs/ 多镜像部署）：BrowserRouter 真路径（无井号）。basename 从
//   vite BASE_URL 推导（GH Pages 构建 = /expubgo，根域镜像 = /）
// - 单文件产物（SINGLE_FILE=true，file:// 双击直开）：HashRouter——无服务器，
//   真路径没有文件可命中，hash 是唯一可用的客户端路由空间
//
// 路由树本体在 ./routes.tsx，与预渲染入口共享
const baseUrl = import.meta.env.BASE_URL
const basename = baseUrl !== '/' ? baseUrl.replace(/\/+$/, '') : undefined

declare const __SINGLE_FILE__: boolean

const future = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
} as const

const router = __SINGLE_FILE__
    ? createHashRouter(mainRoutes, { future })
    : createBrowserRouter(mainRoutes, { basename, future })

export default router
