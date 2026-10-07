/** @jsxImportSource react */
/**
 * 404 页（顶层兜底路由，独立满屏无导航栏）：未知路径在原 URL 渲染本页。
 * 版式自上而下：矢量 404 大字 → 品牌图形标 → 品牌文字标 → 文案 → 路径 → 按钮。
 * 背景为 index.html 加载屏同款的上下渐变；配色写死浅色系（背景固定，不随暗色主题）。
 * 不自动跳转——告知发生了什么，把选择权交给用户。
 */
import React from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Home } from 'lucide-react'
import logoUrl from '@assets/svgs/logoSvg/favicon.svg'
import PureText from '@assets/svgs/logoSvg/PureText.tsx'
import NotFound404Text from './NotFound404Text'

const NotFoundPage: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()

    // 出错路径展示：挂载后填充。SSR/预渲染期渲染占位（构建期不知道会错到哪条路径），
    // 客户端首帧同样渲染占位（水合结构对齐），挂载后 effect 填入真实路径
    const [shownPath, setShownPath] = React.useState<string | null>(null)
    React.useEffect(() => {
        console.warn(`访问了不存在的路由: ${location.pathname}`)
        setShownPath(location.pathname)
    }, [location.pathname])

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
            style={{ background: 'linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%)' }}
        >
            {/* 矢量大字（轮廓固化，零字体依赖；高度控宽，viewBox ≈ 2.5:1） */}
            <NotFound404Text className="h-20 w-auto sm:h-24 select-none" />

            {/* 品牌图形标 + 文字标 */}
            <img src={logoUrl} alt="ExPubGo" className="mt-8 h-16 w-16 sm:h-20 sm:w-20" />
            <PureText className="mt-4 h-8 sm:h-9" />

            <p className="mt-7 max-w-md text-sm leading-relaxed text-slate-500">
                您试图访问以下地址，但内容可能不存在或已被移除。
            </p>
            {/* 出错路径：纯文本展示（无框无底，避免长得像输入框；挂载后填充） */}
            <span className="mt-3 max-w-full text-xs text-slate-400 break-all">
                {shownPath ?? '——'}
            </span>

            <button
                onClick={() => navigate('/home/')}
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1976D2] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#1976D2]/90 hover:scale-[1.03] active:scale-[0.98]"
            >
                <Home className="size-4" />
                回到首页
            </button>
        </div>
    )
}

export default NotFoundPage
