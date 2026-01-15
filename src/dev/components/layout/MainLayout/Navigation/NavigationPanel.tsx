/** @jsxImportSource react */
/**
 * 导航面板组件 - 显示所有可用的页面卡片
 */
import React from "react"
import { useNavigate } from "react-router"
import { useWindowSize } from "react-use"
import { Home } from "lucide-react"
import { IoLogoGithub } from "react-icons/io5"
import { initialCards, systemPages, type CardData } from "../../../../apps/Home/cardsConfig.tsx"
import { cn } from "../../../../shadcn/lib/utils.ts"
import routerPaths from "../../../../router/paths.ts"

interface NavigationPanelProps {
  onNavigate?: () => void
}

export default function NavigationPanel({ onNavigate }: NavigationPanelProps) {
  const navigate = useNavigate()
  const { width } = useWindowSize()

  const handleCardClick = (href: string) => {
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      const path = href.replace(/^#?\/?/, '/');
      navigate(path);
    }
    onNavigate?.();
  };

  // 从系统页面中提取设置和编辑器卡片
  const settingsCard = systemPages.find(page => page.id === 'settings')!;
  const editorCard = systemPages.find(page => page.id === 'editor')!;

  // 合并所有卡片：主页 -> 设置 -> GitHub -> 编辑器 -> 其他工具
  const allCards: CardData[] = [
    // 主页卡片
    {
      id: 'home',
      column: '',
      title: '主页',
      description: '返回首页',
      icon: <Home className="w-8 h-8" />,
      href: `/${routerPaths.home}/`,
      color: '#3b82f6'
    },
    // 设置
    settingsCard,
    // GitHub
    {
      id: 'github',
      column: '',
      title: 'GitHub',
      description: '访问项目仓库',
      icon: <IoLogoGithub className="w-8 h-8" />,
      href: 'https://github.com/guohub8080',
      color: '#24292e'
    },
    // 编辑器
    editorCard,
    // 其他工具卡片
    ...initialCards,
  ];

  // 移动端：单列，全宽（Sheet / 窄屏 modal 共用；尺寸与滚动由外层壳统一控制）
  if (width < 768) {
    return (
      <div className="w-full flex-1 min-h-0 overflow-y-auto p-4 [scrollbar-width:thin] [scrollbar-color:color-mix(in_oklab,var(--color-muted-foreground)_40%,transparent)_transparent]">
        <div className="grid grid-cols-1 gap-2">
          {allCards.map((card: CardData) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.href)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer",
                "hover:bg-accent transition-colors",
                "border border-transparent hover:border-border",
                "active:scale-[0.98] transition-transform"
              )}
            >
              <div
                className="shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-300"
                style={{ color: card.color }}
              >
                {card.icon}
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="m-0 font-medium text-sm truncate">
                  {card.title}
                </p>
                <p className="m-0 text-muted-foreground text-xs truncate">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 平板：两列
  if (width < 1024) {
    return (
      <div className="w-full flex-1 min-h-0 overflow-y-auto p-4 [scrollbar-width:thin] [scrollbar-color:color-mix(in_oklab,var(--color-muted-foreground)_40%,transparent)_transparent]">
        <div className="grid grid-cols-2 gap-2">
          {allCards.map((card: CardData) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.href)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer",
                "hover:bg-accent transition-colors",
                "border border-transparent hover:border-border",
                "active:scale-[0.98] transition-transform"
              )}
            >
              <div
                className="shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-300"
                style={{ color: card.color }}
              >
                {card.icon}
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="m-0 font-medium text-sm truncate">
                  {card.title}
                </p>
                <p className="m-0 text-muted-foreground text-xs truncate">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 桌面端：三列
  return (
    <div className="w-full flex-1 min-h-0 overflow-y-auto p-4 [scrollbar-width:thin] [scrollbar-color:color-mix(in_oklab,var(--color-muted-foreground)_40%,transparent)_transparent]">
      <div className="grid grid-cols-3 gap-2">
        {allCards.map((card: CardData) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.href)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg cursor-pointer",
              "hover:bg-accent transition-colors",
              "border border-transparent hover:border-border",
              "active:scale-[0.98] transition-transform"
            )}
          >
            <div
              className="shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-300"
              style={{ color: card.color }}
            >
              {card.icon}
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <p className="m-0 font-medium text-sm truncate">
                {card.title}
              </p>
              <p className="m-0 text-muted-foreground text-xs truncate">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

