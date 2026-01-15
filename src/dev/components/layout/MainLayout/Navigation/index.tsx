import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useNavigate, useLocation } from "react-router"
import { useWindowScroll } from "@uidotdev/usehooks"
import { useWindowSize } from "react-use"
import { BookText, BookOpen, PanelLeftOpen, PanelLeftClose, PanelRightOpen, PanelRightClose, X } from "lucide-react"
import { IoLogoGithub } from "react-icons/io5"
import { isUndefined } from "es-toolkit/predicate"
import logoUrl from "@assets/svgs/logoSvg/favicon.svg"
import PureText from "@assets/svgs/logoSvg/PureText.tsx"
import useGlobalSettings from "@dev/store/useGlobalSettings"
import { useArticleViewerStore } from "@apps/ArticleViewer/store/useArticleViewerStore"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@shadcn/components/ui/sheet.tsx"
import NavigationPanel from "./NavigationPanel.tsx"
import { cn } from "@shadcn/lib/utils.ts"
import { allCards } from "@apps/Home/cardsConfig.tsx"

export default function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const { navigationHeight, isBookTocShow, toggleBookTocShow, isBookPage, isNavigationPanelOpen, setIsNavigationPanelOpen } = useGlobalSettings()

  const [{ y: scrollY }] = useWindowScroll()

  // 宽度检测：≥640 走居中 modal（宽屏浮层），<640 走 Sheet（侧边抽屉）
  const { width: winWidth } = useWindowSize()
  const isWideScreen = winWidth >= 640

  // 断点切换时强制关闭面板，避免 modal/Sheet 争夺同一个 open 状态
  useEffect(() => {
    setIsNavigationPanelOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWideScreen])

  // 计算icon大小（导航栏高度的45%）
  const iconSize = navigationHeight * 0.45

  // 根据滚动位置判断是否显示模糊效果
  const isScrolled = scrollY > 0

  // 判断是否是 home 页面
  const isHomePage = location.pathname === '/home' || location.pathname === '/home/' || location.pathname === '/'

  // 判断是否是 view 页面
  const isViewPage = location.pathname.startsWith('/view')

  // ArticleViewer 状态
  const { showSideList, showActionPanel, toggleSideList, toggleActionPanel, setMobileSideList, setMobileActionPanel } = useArticleViewerStore()

  // 检测是否应该使用抽屉模式
  // <1280px 左侧使用抽屉，<1024px 右侧使用抽屉
  const [shouldUseLeftDrawer, setShouldUseLeftDrawer] = useState(false)
  const [shouldUseRightDrawer, setShouldUseRightDrawer] = useState(false)
  useEffect(() => {
    const checkDrawerMode = () => {
      const width = window.innerWidth
      setShouldUseLeftDrawer(width < 1280)
      setShouldUseRightDrawer(width < 1024)
    }
    checkDrawerMode()
    window.addEventListener('resize', checkDrawerMode)
    return () => window.removeEventListener('resize', checkDrawerMode)
  }, [])

  // 获取当前页面 title - 从 Home 卡片配置中匹配
  const [pageTitle, setPageTitle] = useState<string>('')

  useEffect(() => {
    if (isHomePage) {
      setPageTitle('')
      return
    }

    // 从 Home 卡片配置中匹配当前路径
    const currentPath = location.pathname.replace(/^#/, '').replace(/\/$/, '') || '/'

    // 查找匹配的卡片
    const matchedCard = allCards.find(card => {
      // 处理卡片 href
      let cardPath = card.href
      // 移除开头的 # 和 /
      cardPath = cardPath.replace(/^#?\/?/, '/')
      // 确保以 / 开头
      if (!cardPath.startsWith('/')) {
        cardPath = '/' + cardPath
      }
      // 移除末尾的 /
      cardPath = cardPath.replace(/\/$/, '') || '/'

      // 精确匹配或路径匹配
      return cardPath === currentPath || currentPath.startsWith(cardPath + '/')
    })

    if (matchedCard) {
      setPageTitle(matchedCard.title)
    } else {
      // 如果找不到匹配的卡片，从路径推断
      const pathParts = location.pathname.split('/').filter(Boolean)
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1]
        const inferredTitle = lastPart
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        setPageTitle(inferredTitle)
      } else {
        setPageTitle('')
      }
    }
  }, [location.pathname, isHomePage])

  // —— 胶囊/ modal 两阶段时序编排 ——
  // 打开：胶囊先极速淡出（75ms），90ms 时 modal 才弹出；关闭：modal 完全淡完（300ms），330ms 时胶囊才回来
  // 两者任何时刻不并存，滚动条消失引起的基准跳变完全发生在胶囊不可见期间
  const [pillHidden, setPillHidden] = useState(false)
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 宽屏打开序列：先藏胶囊，再开 modal（由胶囊 onClick 调用）
  const openNavModal = () => {
    if (isNavigationPanelOpen) return
    setPillHidden(true)
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    openTimerRef.current = setTimeout(() => {
      openTimerRef.current = null
      setIsNavigationPanelOpen(true)
    }, 90)
  }

  // modal 关闭后（任何路径：ESC/遮罩/导航/断点），330ms 时胶囊复原
  useEffect(() => {
    if (isNavigationPanelOpen) return
    const t = setTimeout(() => setPillHidden(false), 330)
    return () => clearTimeout(t)
  }, [isNavigationPanelOpen])

  // 卸载清理 pending 打开
  useEffect(() => () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
  }, [])

  // 宽屏 modal：ESC 关闭（打开等待期内按 ESC 取消打开并复原胶囊）
  useEffect(() => {
    if (!isWideScreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current)
        openTimerRef.current = null
        setPillHidden(false)
        return
      }
      setIsNavigationPanelOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isWideScreen, setIsNavigationPanelOpen])

  // 宽屏 modal：打开时锁定 body 滚动 + 等宽 padding 补偿（成熟库标准方案，react-remove-scroll/Bootstrap 同款）——
  // header 及其 absolute 胶囊是文档流尺寸，补偿后宽度稳定，滚动条消失不再引起任何跳变
  useEffect(() => {
    if (!isWideScreen || !isNavigationPanelOpen) return
    const prevOverflow = document.body.style.overflow
    const prevPad = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPad
    }
  }, [isWideScreen, isNavigationPanelOpen])

  return (
    <header
      className={`sticky top-0 z-50 flex w-full flex-shrink-0 items-center justify-center transition-all duration-300 relative ${isScrolled
          ? 'border-b border-border/30 backdrop-blur-[8px] bg-background/60 shadow-sm'
          : 'border-b border-transparent backdrop-blur-none bg-transparent shadow-none'
        }`}
      style={{ height: `${navigationHeight}px` }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1400px] items-center min-[1800px]:max-w-[1536px]">
        <div className="flex w-full items-center px-4 max-lg:gap-4 sm:px-6 lg:px-8">
          {/* Logo 区域 */}
          <div className="flex-shrink-0">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/home/'); }}>
              <div className={cn(
                "flex items-center gap-4 hover:scale-105 transition-all duration-300 cursor-pointer",
                isHomePage && !isScrolled && "opacity-0 pointer-events-none hover:scale-100 cursor-default"
              )}>
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="drop-shadow-[0_0_8px_rgba(59,130,246,0.3)] hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all duration-300"
                  style={{
                    width: `${iconSize}px`,
                    height: `${iconSize}px`
                  }}
                />
                <div className="h-[22px] w-auto -ml-2.5 transition-all duration-300 max-[550px]:hidden flex items-start pt-[5px]">
                  <PureText />
                </div>
              </div>
            </a>
          </div>

          {/* 中间区域 - 页面标题或空白 */}
          <div className="flex-1"></div>

          {/* 中间居中的页面标题按钮 - absolute 于 sticky header（跟随文档流内容区居中，配合锁滚动的 padding 补偿实现零跳变） */}
          {!isHomePage && pageTitle && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 flex items-center justify-center pointer-events-none"
              style={{ zIndex: 50, height: `${navigationHeight}px` }}
            >
              {/* 标题按钮（宽屏触发居中 modal，窄屏触发 Sheet）+ 对应面板 */}
              {isWideScreen ? (
                <>
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={isNavigationPanelOpen}
                    className={cn(
                      "text-sm font-medium text-foreground hover:text-foreground transition-all duration-200",
                      "px-4 py-2 rounded-full hover:bg-accent",
                      "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "relative z-[50] flex items-center justify-center gap-2 pointer-events-auto",
                      "hover:shadow-[inset_0_0_0_1.5px_rgb(148_163_184/0.3)]",
                      // 两阶段时序：modal 打开期间胶囊保持隐藏（pillHidden 由编排控制，先于 modal 隐藏、后于 modal 复原）
                      pillHidden && "opacity-0 scale-95 pointer-events-none duration-75"
                    )}
                    onClick={openNavModal}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openNavModal();
                      }
                    }}
                  >
                    {(() => {
                      const matchedCard = allCards.find(card => {
                        let cardPath = card.href.replace(/^#?\/?/, '/');
                        if (!cardPath.startsWith('/')) {
                          cardPath = '/' + cardPath;
                        }
                        cardPath = cardPath.replace(/\/$/, '') || '/';
                        const currentPath = location.pathname.replace(/^#/, '').replace(/\/$/, '') || '/';
                        return cardPath === currentPath || currentPath.startsWith(cardPath + '/');
                      });
                      if (matchedCard?.icon) {
                        return (
                          <div className="w-4 h-4 flex items-center justify-center" style={{ color: matchedCard.color }}>
                            {matchedCard.icon}
                          </div>
                        );
                      }
                      return null;
                    })()}
                    <div className="h-5 flex items-center justify-center">{pageTitle}</div>
                  </div>
                  {/* 居中 modal（iOS 风格）：全屏毛玻璃遮罩 + 居中卡片，常驻 DOM 用 opacity/scale 过渡 */}
                  {!isUndefined(document) && createPortal(
                    <>
                      <div
                        className="fixed inset-0 z-40 bg-black/25 backdrop-blur-xl transition-opacity duration-300"
                        style={{
                          opacity: isNavigationPanelOpen ? 1 : 0,
                          pointerEvents: isNavigationPanelOpen ? 'auto' : 'none',
                        }}
                        onClick={() => setIsNavigationPanelOpen(false)}
                      />
                      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
                        <div
                          role="dialog"
                          aria-modal="true"
                          aria-label="站点导航"
                          className={cn(
                            "pointer-events-auto w-[640px] max-w-full max-h-[82vh] flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl transition-all duration-300 ease-out",
                            // 内部细滚动条（伪元素作用于面板的 overflow-y-auto，需用后代选择器）
                            "[&_*::-webkit-scrollbar]:w-1.5 [&_*::-webkit-scrollbar-track]:transparent [&_*::-webkit-scrollbar-thumb]:rounded-full [&_*::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&_*::-webkit-scrollbar-thumb]:hover:bg-muted-foreground/50"
                          )}
                          style={{
                            opacity: isNavigationPanelOpen ? 1 : 0,
                            transform: isNavigationPanelOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(12px)',
                            pointerEvents: isNavigationPanelOpen ? 'auto' : 'none',
                          }}
                        >
                          {/* 标题栏：滚动时保持置顶 */}
                          <div className="flex items-center justify-between shrink-0 px-5 py-4 border-b border-border/50">
                            <span className="text-base font-medium">导航</span>
                            <button
                              onClick={() => setIsNavigationPanelOpen(false)}
                              className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                              aria-label="关闭导航"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                          <NavigationPanel onNavigate={() => setIsNavigationPanelOpen(false)} />
                        </div>
                      </div>
                    </>,
                    document.body
                  )}
                </>
              ) : (
                <>
                  {/* 窄屏标题按钮（触发 Sheet）*/}
                  <div
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "text-sm font-medium text-foreground hover:text-foreground transition-all duration-200",
                      "px-4 py-2 rounded-full hover:bg-accent",
                      "cursor-pointer outline-none",
                      "relative z-[50] flex items-center justify-center gap-2 pointer-events-auto",
                      "hover:shadow-[inset_0_0_0_1.5px_rgb(148_163_184/0.3)]",
                      isNavigationPanelOpen && "bg-accent text-foreground shadow-[inset_0_0_0_1.5px_rgb(148_163_184/0.3)]"
                    )}
                    onClick={() => setIsNavigationPanelOpen(!isNavigationPanelOpen)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setIsNavigationPanelOpen(!isNavigationPanelOpen)
                      }
                    }}
                  >
                    {(() => {
                      const matchedCard = allCards.find(card => {
                        let cardPath = card.href.replace(/^#?\/?/, '/');
                        if (!cardPath.startsWith('/')) {
                          cardPath = '/' + cardPath;
                        }
                        cardPath = cardPath.replace(/\/$/, '') || '/';
                        const currentPath = location.pathname.replace(/^#/, '').replace(/\/$/, '') || '/';
                        return cardPath === currentPath || currentPath.startsWith(cardPath + '/');
                      });
                      if (matchedCard?.icon) {
                        return (
                          <div className="w-4 h-4 flex items-center justify-center" style={{ color: matchedCard.color }}>
                            {matchedCard.icon}
                          </div>
                        );
                      }
                      return null;
                    })()}
                    <div className="h-5 flex items-center justify-center">{pageTitle}</div>
                  </div>
                  <Sheet open={isNavigationPanelOpen} onOpenChange={setIsNavigationPanelOpen}>
                    <SheetContent side="left" className="w-[300px] p-0 overflow-y-auto" hideClose>
                      <SheetTitle className="sr-only">导航菜单</SheetTitle>
                      <SheetDescription className="sr-only">浏览并跳转到各个功能页面</SheetDescription>
                      <NavigationPanel onNavigate={() => setIsNavigationPanelOpen(false)} />
                    </SheetContent>
                  </Sheet>
                </>
              )}
            </div>
          )}

          {/* 右侧操作区 */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Pub 页面侧边栏控制按钮 */}
            {isViewPage && (
              <>
                {/* 左侧文章列表切换 */}
                <button
                  onClick={() => {
                    if (shouldUseLeftDrawer) {
                      // 小于1280px：打开抽屉
                      setMobileSideList(true)
                    } else {
                      // 宽屏：切换内联侧边栏
                      toggleSideList()
                    }
                  }}
                  className="size-6 flex items-center justify-center hover:opacity-80 hover:scale-110 transition-all duration-300"
                  title={showSideList && !shouldUseLeftDrawer ? "隐藏文章列表" : "显示文章列表"}
                >
                  {showSideList && !shouldUseLeftDrawer ? (
                    <PanelLeftClose className="size-5" />
                  ) : (
                    <PanelLeftOpen className="size-5" />
                  )}
                  <span className="sr-only">{showSideList && !shouldUseLeftDrawer ? "隐藏文章列表" : "显示文章列表"}</span>
                </button>

                {/* 右侧操作面板切换 */}
                <button
                  onClick={() => {
                    if (shouldUseRightDrawer) {
                      // 小于1024px：打开抽屉
                      setMobileActionPanel(true)
                    } else {
                      // 中宽屏：切换内联侧边栏
                      toggleActionPanel()
                    }
                  }}
                  className="size-6 flex items-center justify-center hover:opacity-80 hover:scale-110 transition-all duration-300"
                  title={showActionPanel && !shouldUseRightDrawer ? "隐藏操作面板" : "显示操作面板"}
                >
                  {showActionPanel && !shouldUseRightDrawer ? (
                    <PanelRightClose className="size-5" />
                  ) : (
                    <PanelRightOpen className="size-5" />
                  )}
                  <span className="sr-only">{showActionPanel && !shouldUseRightDrawer ? "隐藏操作面板" : "显示操作面板"}</span>
                </button>
              </>
            )}

            {/* 设置按钮 */}
            <a
              href="/settings"
              onClick={(e) => { e.preventDefault(); navigate('/settings'); }}
              className="size-6 flex items-center justify-center hover:opacity-80 hover:scale-110 transition-all duration-300"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="size-5" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="sr-only">Settings</span>
            </a>

            {/* GitHub 按钮 */}
            <a
              href="https://github.com/guohub8080"
              target="_blank"
              rel="noopener noreferrer"
              className="size-6 flex items-center justify-center hover:opacity-80 hover:scale-110 transition-all duration-300 max-lg:hidden"
            >
              <IoLogoGithub className="w-5 h-5 text-foreground" />
              <span className="sr-only">Github</span>
            </a>

            {/* TOC 切换按钮 - 仅在 book 页面显示 */}
            {isBookPage && (
              <button
                onClick={toggleBookTocShow}
                className="size-6 flex items-center justify-center hover:opacity-80 hover:scale-110 transition-all duration-300"
                title={isBookTocShow ? "隐藏目录" : "显示目录"}
              >
                {isBookTocShow ? (
                  <BookOpen className="size-5" />
                ) : (
                  <BookText className="size-5" />
                )}
                <span className="sr-only">{isBookTocShow ? "隐藏目录" : "显示目录"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
