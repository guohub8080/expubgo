/** @jsxImportSource react */
/**
 * 首页组件 - 使用 Kanban 风格的横向卡片布局
 */
import React, { useState } from "react"
import { useNavigate } from "react-router"
import Hero from "./Hero"
import PublisherAccountManager from "./PublisherAccountManager"
import {
  KanbanProvider,
  KanbanBoard,
  KanbanCards,
  KanbanCard,
} from "../../shadcn/components/ui/kanban.tsx"
import { CardData, columns, initialCards } from "./cardsConfig.tsx"

export default function Home() {
  const [cards, setCards] = useState<CardData[]>(initialCards);
  const navigate = useNavigate();
  const ICP_LINK = "https://beian.miit.gov.cn/";
  
  const handleCardClick = (href: string) => {
    // 如果是外部链接，在新窗口打开
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      // 内部链接使用 navigate
      // 移除开头的 # 和 /
      const path = href.replace(/^#?\/?/, '/');
      navigate(path);
    }
  };
  
  return (
    <>
      <div className="container mx-auto max-w-6xl relative z-10 pb-20 px-4">

        <Hero />

        {/* 推文频道 */}
        <div className="mt-6">
          <PublisherAccountManager />
        </div>

        {/* 工具和手册 */}
        <div className="mt-12">
            <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-0 mx-auto w-fit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
              <span className="text-xs font-medium">工具和手册</span>
            </div>
            <KanbanProvider columns={columns} data={cards} onDataChange={setCards}>
              {(column) => (
                <KanbanBoard id={column.id} key={column.id}>
                  <KanbanCards id={column.id}>
                    {(card: CardData) => (
                      <KanbanCard
                        column={card.column}
                        id={card.id}
                        key={card.id}
                        name={card.title}
                      >
                        <div
                          onClick={() => handleCardClick(card.href)}
                          className="block no-underline group cursor-pointer h-full"
                        >
                          <div className="flex items-center gap-3 h-full">
                            <div
                              className="shrink-0 w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                              style={{ color: card.color }}
                            >
                              {card.icon}
                            </div>
                            <div className="flex flex-col gap-1 flex-1 justify-center">
                              <p className="m-0 font-normal text-base">
                                {card.title}
                              </p>
                              <p className="m-0 text-muted-foreground text-sm">
                                {card.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </KanbanCard>
                    )}
                  </KanbanCards>
                </KanbanBoard>
              )}
            </KanbanProvider>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="w-full bg-neutral-800 text-neutral-300">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="flex flex-col items-center gap-5 text-xs text-neutral-400">

            {/* 区域1: 品牌介绍 */}
            <span className="text-sm font-semibold text-neutral-200 tracking-wide">ExPubGo</span>
            <span className="text-center leading-relaxed max-w-xs text-neutral-500">
              基于 React + TypeScript + Vite 的可扩展内容定制化框架
              <br />
              通过 Channels 机制接入多个内容源，
              <br />
              提供文章预览、创作者工具箱等一站式服务
              <br />
              定制你的微信公众号发布模块
            </span>

            {/* 区域2: 五条功能特性 */}
            <div className="flex flex-col items-center gap-5 mt-4">
              {[
                {
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
                  title: '文章预览与编辑',
                  desc: '实时预览，一键复制 HTML 发布'
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
                  title: 'Channels 扩展',
                  desc: '多账号独立管理，内容隔离'
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>,
                  title: '创作者工具箱',
                  desc: '色彩、阴影、样式转换等辅助工具'
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
                  title: '一键导出',
                  desc: '复制 HTML 直接粘贴到公众号编辑器'
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
                  title: '开放可定制',
                  desc: '开源框架，自由扩展和二次开发'
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">{item.icon}</span>
                    <span className="text-neutral-300 font-medium">{item.title}</span>
                  </div>
                  <span className="text-neutral-500">{item.desc}</span>
                </div>
              ))}
            </div>

            {/* 区域3: 部署地址 */}
            <div className="flex flex-col items-center gap-2 mt-8">
              <span className="text-neutral-300 font-medium">部署地址</span>
              <div className="flex flex-col items-center gap-1.5">
                {[
                  { name: 'GitHub Pages', url: 'https://guohub8080.github.io/expubgo/' },
                  { name: 'Cloudflare Pages', url: 'https://expubgo.pages.dev' },
                  { name: 'Netlify', url: 'https://expubgo.netlify.app' },
                  { name: 'Vercel', url: 'https://expubgo.vercel.app' },
                ].map((mirror, i) => (
                  <a key={i} href={mirror.url} target="_blank" rel="noreferrer" className="px-3 py-0.5 rounded-full border border-neutral-600 text-neutral-400 hover:text-white hover:border-neutral-400 transition-colors">{mirror.name}</a>
                ))}
              </div>
            </div>

            {/* 作者 */}
            <div className="flex flex-col items-center gap-2 mt-8">
              <svg viewBox="0 0 480 554" className="w-5 h-5 text-neutral-500" xmlns="http://www.w3.org/2000/svg">
                <path d="M53.253,199.859L53.253,384.338L213.026,476.578L213.026,292.114L53.253,199.859ZM186.4,30.746L239.667,0L479.32,138.366L479.32,169.113L266.279,292.114L266.294,476.592L426.052,384.338L426.052,322.845L319.546,384.338L319.546,322.845L479.305,230.606L479.32,415.085L239.667,553.451L0,415.085L0,138.366L26.641,122.986L239.667,245.987L399.426,153.747L186.4,30.746Z" fill="currentColor" fillRule="nonzero" />
              </svg>
              <span className="text-[11px] text-neutral-600">Built by guohub8080</span>
            </div>

          </div>
        </div>
      </footer>
    </>
  )
}

