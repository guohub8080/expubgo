/** @jsxImportSource react */
/**
 * 构建期预渲染 SSR 入口（Node 运行，产物为 node_modules/.prerender/entry.server.mjs）。
 *
 * 用 react-router 官方静态渲染三件套（createStaticHandler / createStaticRouter /
 * StaticRouterProvider）把路由树渲染成字符串——与浏览器端 RouterProvider 消费
 * 同一棵树（@dev/router/routes），水合结构天然对齐。
 * 不导入 App/main：GlobalSettingsEffects（渲染期读 matchMedia）与 Toaster 属于
 * 浏览器挂载链，且不影响 root 内联结构。
 */
import './shims.node'
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider, type StaticHandlerContext } from 'react-router'
import { mainRoutes, listPrerenderPaths } from '@dev/router/routes'

export { listPrerenderPaths }

/**
 * 渲染单条路径 → HTML 字符串。
 * 返回 null 表示该路径无静态内容可出（Navigate 重定向根、参数未命中等），
 * 调用方应跳过（该路径回落 SPA 壳）。
 */
export async function renderPath(pathname: string): Promise<string | null> {
    const { query, dataRoutes } = createStaticHandler(mainRoutes)
    const request = new Request(`http://prerender.local${pathname}`)
    const context: StaticHandlerContext | Response = await query(request)
    if (context instanceof Response) return null
    const router = createStaticRouter(dataRoutes, context)
    return renderToString(
        <StaticRouterProvider router={router} context={context} />,
    )
}
