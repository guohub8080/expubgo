/**
 * BookSidebar - 图书布局侧边栏（internal）
 */
import * as React from "react";
import { useNavigate, useLocation } from 'react-router';
import { BookText } from "lucide-react";
import useGlobalSettings from "../../../../store/useGlobalSettings";
import { BookSidebarWrapper } from "./BookSidebarWrapper.tsx";
import { useBookLayoutConfig } from "./BookLayoutContext.tsx";
import type { LucideIcon } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../../../../shadcn/components/ui/sidebar.tsx";
import type { BookLoader } from "../types/BookLoader.ts";
import { useBookSidebar } from "./BookSidebarProvider.tsx";
import googleColors from "../../../../styles/static/googleColors.ts";

interface BookSidebarProps extends React.ComponentProps<typeof BookSidebarWrapper> {
  loader: BookLoader;
}

export function BookSidebar({ loader, ...props }: BookSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { navigationHeight } = useGlobalSettings();
  const { setOpenMobile, isMobile, openMobile } = useBookSidebar();

  const { categories, allArticles } = loader.getNavigationData();

  const config = useBookLayoutConfig();
  type SidebarNavItem = { title: string; routePath: string; isActive: boolean; uniqueKey: string };
  type SidebarNavCategory = { title: string; icon: LucideIcon; isActive: boolean; items: SidebarNavItem[] };
  const lowerPath = location.pathname.toLowerCase();
  const basePrefix = (config?.basePrefix || "").toLowerCase();

  // 使用动态的 basePrefix 来处理路径
  const segments = lowerPath.split("/").filter(Boolean);
  const prefixWithoutSlash = basePrefix.replace(/^\/+|\/+$/g, ''); // 移除前后的斜杠
  const routeSegments = prefixWithoutSlash && segments[0] === prefixWithoutSlash
    ? segments.slice(1)
    : segments;
  const routePart = routeSegments.join("/");

  const isActivePath = (routePath: string) => routePart === routePath.toLowerCase();
  const hasActiveItem = (categoryPath: string) => routePart.startsWith(categoryPath.toLowerCase());
  const navData: SidebarNavCategory[] = categories.map((category) => ({
    title: category.categoryName,
    icon: category.icon || BookText,
    isActive: hasActiveItem(category.categoryPath),
    items: category.articles.map((article) => ({
      title: article.title,
      routePath: `${basePrefix}/${article.routePath}`,
      isActive: isActivePath(article.routePath),
      // 添加层级key：路由路径-文件夹名-文章slug
      uniqueKey: `${basePrefix.replace(/^\/+|\/+$/g, '')}-${category.categoryPath}-${article.routePath.split('/').pop()}`,
    })),
  }));

  // 手风琴：每章独立开合，持久化到 localStorage（key 按书 slug 区分）；
  // 初始状态——全部展开（无存档时）
  const storageKey = `book-toc-folded:${basePrefix.replace(/^\/+|\/+$/g, '')}`;
  const [folded, setFolded] = React.useState<Record<string, boolean>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      if (Object.keys(saved).length > 0) return saved;
    } catch { /* 忽略坏数据 */ }
    return {}; // 默认全展开（无 folded 记录）
  });
  const toggleFold = (title: string) => {
    setFolded((prev) => {
      const next = { ...prev, [title]: !prev[title] };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* 存储失败不影响交互 */ }
      return next;
    });
  };

  // 侧栏滚动位置记忆：切换文章时滚动容器会被重置，挂载时恢复上次位置（按书持久化）。
  // ref 传递在 SidebarContent（函数组件 + spread props）链路上不可靠，改用 data-slot 查询
  const scrollKey = `book-toc-scroll:${basePrefix.replace(/^\/+|\/+$/g, '')}`;
  React.useEffect(() => {
    const el = document.querySelector('[data-slot="sidebar-content"]') as HTMLDivElement | null;
    if (!el) return;
    const saved = parseFloat(localStorage.getItem(scrollKey) || '0');
    if (saved > 0) el.scrollTop = saved;
    const onScroll = () => {
      try { localStorage.setItem(scrollKey, String(el.scrollTop)); } catch { /* 忽略 */ }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BookSidebarWrapper
      variant="floating"
      collapsible="none"
      {...props}

      style={{
        "--nav-height": `${navigationHeight}px`,
        // 合并外部传入的 style（如移动端清零 padding）——
        // 此前显式 style 写在 {...props} 之后会把 props.style 整个覆盖，外部覆盖全部失效
        ...(props.style as React.CSSProperties),
      } as React.CSSProperties}
    >
      <SidebarHeader className="bg-card border-b rounded-t-lg">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex aspect-square size-10 items-center justify-center">
            <loader.config.icon />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold text-base">{loader.config.title}</span>
            <span className="text-xs text-muted-foreground">共 {allArticles.length} 篇文章</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-0">
            {navData.map((item, index) => (
              <SidebarMenuItem
                key={item.title}
                // 间距看上一章：上一章折叠（内容已收走）→ 本章 mt-0 完全贴上其标题块；上一章展开 → mt-2 呼吸
                className={index === 0 ? "-mt-2" : folded[navData[index - 1].title] ? "mt-0" : "mt-2"}
              >
                {/* 分节分隔线：紧贴下方灰底标题块（间隙为零，线与色块连成一体） */}
                {index > 0 && (
                  <div className="h-px bg-border/70 -mx-2" aria-hidden />
                )}
                {/* 章节标题行：手风琴头——点击开合。底色用前景色 5% 透明度的 alpha 灰：
                    与卡片底色自动同色温（亮暗主题通吃），又有可见的区分度（此前 #EEE 色温不合、
                    muted token 又与卡片同值毫无区分） */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={!folded[item.title]}
                  onClick={() => toggleFold(item.title)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFold(item.title); } }}
                  className="flex items-center gap-2 px-2 py-2 font-medium text-sm -mx-2 cursor-pointer select-none text-foreground bg-foreground/[0.05] hover:bg-foreground/[0.09] transition-colors"
                >
                  <item.icon className="size-4" />
                  <span className="flex-1">{item.title}</span>
                  <svg
                    className={`size-3.5 shrink-0 transition-transform duration-200 ${folded[item.title] ? '-rotate-90' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
                {item.items?.length ? (
                  <div
                    className="grid transition-[grid-template-rows] duration-200 ease-out"
                    style={{ gridTemplateRows: folded[item.title] ? '0fr' : '1fr' }}
                  >
                    <div className="overflow-hidden min-h-0">
                      <SidebarMenuSub className="ml-0 mr-0 border-l-0 px-1.5 mt-2">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.uniqueKey}>
                        <SidebarMenuSubButton
                          isActive={subItem.isActive}
                          onClick={() => {
                            if (isMobile) {
                              setOpenMobile(false);
                            }
                            navigate(subItem.routePath);
                          }}
                          className={`cursor-pointer h-auto py-2 px-2 ${isMobile ? '' : ''}`}
                          /* 条目文字保持 gray800：具体文章是主要阅读目标，比章节标题（muted）更醒目；
                             h-auto + py-2 + px-2：蓝底高亮四周留白上下左右同为 8px */
                          style={subItem.isActive ? { backgroundColor: "#1976D2", color: "#ffffff", fontWeight: 500 } : { color: googleColors.gray800 }}
                        >
                          <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap" title={subItem.title}>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                      </SidebarMenuSub>
                    </div>
                  </div>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </BookSidebarWrapper>
  );
}


