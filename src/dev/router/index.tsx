import React, { lazy, Suspense } from 'react'
import { createHashRouter, Navigate, useLocation } from 'react-router'
import MainLayout from '../components/layout/MainLayout'
import Home from '../apps/Home'
import Settings from '../apps/Settings'
import { generateUserDocumentRoutes } from "@books/UserDocument/data/userDocumentLoader";
import { generateSvgToolFunctionsRoutes } from "@books/SvgToolFunctions/data/svgToolFunctionsLoader";
import { generateSvgComponentsDocRoutes } from "@books/SvgComponentsDoc/data/svgComponentsDocLoader";
import { generateArticleRoutes } from "@dev/articles/articlesLoader";
import { generatePublisherToolRoutes } from "@dev/tools/publisherToolsLoader";
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

// 加载占位
const LoadingFallback = () => (
	<div className="flex items-center justify-center min-h-[60vh]">
		<div className="flex gap-2">
			<div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
			<div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
			<div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
		</div>
	</div>
)

// 懒加载包装
const Lazy = ({ children }: { children: React.ReactNode }) => (
	<Suspense fallback={<LoadingFallback />}>
		{children}
	</Suspense>
)

// 未匹配路由时：打印错误地址并跳转到首页
const BadRouteRedirect: React.FC = () => {
    const location = useLocation()

    React.useEffect(() => {
        console.warn(`访问了不存在的路由: ${location.pathname}`)
    }, [location.pathname])

    return <Navigate to="/home/" replace />
}

//

export default createHashRouter([
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
                // 内容源一键连接（/#/connect?source=<源地址>，由 pub:push 打开）
                path: routerPaths.connect,
                element: <Lazy><ConnectPage /></Lazy>,
            }
        ]
    },
    {
        path: "*",
        element: <BadRouteRedirect />
    }
], {
    future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
    }
})
