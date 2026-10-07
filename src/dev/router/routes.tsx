import React, { lazy } from 'react'
import { isNil, isNotNil } from 'es-toolkit/predicate'
import { Navigate, type RouteObject } from 'react-router'
import MainLayout from '../components/layout/MainLayout'
import Home from '../apps/Home'
import Settings from '../apps/Settings'
import { generateUserDocumentRoutes } from "@books/UserDocument/data/userDocumentLoader";
import { generateSvgToolFunctionsRoutes } from "@books/SvgToolFunctions/data/svgToolFunctionsLoader";
import { generateSvgComponentsDocRoutes } from "@books/SvgComponentsDoc/data/svgComponentsDocLoader";
import { generateArticleRoutes } from "@dev/articles/articlesLoader";
import { generatePublisherToolRoutes } from "@dev/tools/publisherToolsLoader";
import { Lazy } from './routeComponents'
import NotFound from '../apps/NotFound'
import routerPaths from './paths'

// 直接加载：Home、Settings、MainLayout（含 Navigation）首屏必须就位
// 其他页面懒加载
const Color = lazy(() => import('../apps/Color'))
const ShadowTool = lazy(() => import('../apps/ShadowTool'))
const Rotate3D = lazy(() => import('../apps/Rotate3D'))
const WechatCoverMaker = lazy(() => import('../apps/WechatCoverMaker'))
const SvgReactConverter = lazy(() => import('../apps/SvgReactConverter'))
const ClassToInline = lazy(() => import('../apps/ClassToInline'))
const ArticleViewer = lazy(() => import('../apps/ArticleViewer'))
const EmptyArticle = lazy(() => import('../apps/ArticleViewer/components/EmptyArticle'))
// 网络连接制度：一键连接页 + 网络源文章 iframe 渲染页（见 AGENTS.md「网络连接制度」）
const ConnectPage = lazy(() => import('../apps/Connect'))
const NetworkArticlePage = lazy(() => import('@dev/articles/NetworkArticlePage'))

//
// 路由树本体（纯数据 + JSX 元素，与运行环境无关）：
// - 浏览器入口：router/index.tsx 用 createBrowserRouter 消费（真路径，无井号）
// - 预渲染入口：scripts/prerender/entry.server.tsx 用 createStaticHandler 消费
// 两侧同树，水合天然对齐
//
export const mainRoutes: RouteObject[] = [
    {
        path: "",
        element: <Navigate to="/home/" replace />
    },
    {
        path: "/",
        element: <MainLayout/>,
        children:  [
            {
                path: "home",
                element: <Home />
            },
            ...generateUserDocumentRoutes(),
            ...generateSvgToolFunctionsRoutes(),
            ...generateSvgComponentsDocRoutes(),
            ...generatePublisherToolRoutes(),
            {
                path: "settings",
                element: <Settings />
            },
            {
                path: "color",
                element: <Lazy><Color /></Lazy>
            },
            {
                path: "shadow-tool",
                element: <Lazy><ShadowTool /></Lazy>
            },
            {
                path: "rotate3d",
                element: <Lazy><Rotate3D /></Lazy>
            },
            {
                path: "wechat-cover-maker",
                element: <Lazy><WechatCoverMaker /></Lazy>
            },
            {
                path: "svg-react",
                element: <Lazy><SvgReactConverter /></Lazy>
            },
            {
                path: "class-inline",
                element: <Lazy><ClassToInline /></Lazy>
            },
            {
                path: "view",
                element: <Lazy><ArticleViewer /></Lazy>,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/view/expubgo/default" replace />
                    },
                    ...generateArticleRoutes(),
                    {
                        // 网络源文章（运行时数据，参数路由；本地静态路由在前优先匹配，publisher id 冲突时本地遮蔽网络）
                        path: ":netPublisher/:netArticle",
                        element: <Lazy><NetworkArticlePage /></Lazy>,
                    },
                    {
                        path: "*",
                        element: <Lazy><EmptyArticle /></Lazy>
                    }
                ]
            },
            {
                // 内容源一键连接（/#/connect?source=<源地址>）
                path: routerPaths.connect,
                element: <Lazy><ConnectPage /></Lazy>,
            }
        ]
    },
    {
        // 顶层兜底：未知路径渲染 404 页（独立满屏，无导航栏——错地址不打断视觉聚焦）。
        // 宿主以 404.html 应答 → 浏览器路由水合 → 命中此处
        path: "*",
        element: <NotFound />
    }
]

/**
 * 预渲染路径枚举：从路由树静态推导全部可预渲染的叶子路径。
 * 跳过：参数段（:x，运行时数据）、通配（*）、根重定向（空段）、
 * 无 path 的 index 路由（默认跳转，无独立内容）。
 * 父路由有孩子时不下钻后仍会经孩子产出叶子路径；纯参数孩子的父（如 view）自然无产出。
 */
export function listPrerenderPaths(): string[] {
    const paths: string[] = []
    const walk = (routes: RouteObject[], prefix: string): void => {
        for (const route of routes) {
            const seg = route.path
            if (isNil(seg)) continue
            if (seg === '' || seg.includes(':') || seg.includes('*')) continue
            const full = `${prefix}/${seg}`.replace(/\/{2,}/g, '/')
            if (isNotNil(route.children) && route.children.length > 0) {
                walk(route.children, full)
            } else {
                paths.push(full)
            }
        }
    }
    walk(mainRoutes, '')
    return paths
}
