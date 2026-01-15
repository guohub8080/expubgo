/** @jsxImportSource react */
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, UserRound, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { Card } from '@shadcn/components/ui/card.tsx';
import { Dialog, DialogContent, DialogTitle } from '@shadcn/components/ui/dialog.tsx';
import { cn } from '@shadcn/lib/utils.ts';
import { isString } from 'es-toolkit/predicate';
import { BookCard } from '@apps/Home/PublisherAccountManager/index.tsx';
import { getArticleListItems, ArticleListItem, getPublisherLatestArticleId } from '@dev/articles/articlesLoader';
import { getDayjs } from '@dev/utils/utDateTime/exDayjs';
import { useArticleViewerStore } from '@apps/ArticleViewer/store/useArticleViewerStore';
import defaultPublisherConfig from '@dev/articles/default.publisher.tsx';
import { publisherConfigModules, publisherImageModules } from '@dev/articles/publisherBranches.generated';
import FullscreenArticleMenu from './FullscreenArticleMenu';

// 加载 publisher 配置与图片资源：按名字拆分的 glob 分支在生成文件中（含本地目录名，已 gitignore）
const configModules = publisherConfigModules as Record<string, unknown>;

// 扫描启用 publisher 目录下的图片文件，用于解析相对路径 avatar
const imageModules = publisherImageModules;

// 解析 avatar 路径：如果是相对路径，拼接成绝对路径后查找对应的模块
function resolveAvatar(
  avatar: string | React.ReactNode | undefined,
  configFilePath: string
): string | React.ReactNode | undefined {
  if (!avatar || !isString(avatar)) return avatar;
  if (!avatar.startsWith("./")) return avatar;

  const publisherDir = configFilePath.replace("/publisher.config.ts", "");
  const fullPath = publisherDir + avatar.replace(/^\./, "");
  return imageModules[fullPath];
}

interface PublisherConfig {
  publisherId: string;
  publisherName: string | string[];
  avatar?: string | React.ReactNode;
  avatarRadius?: string;
  theme?: {
    spine: [string, string];
    cover: [string, string];
  };
  alias: Record<string, string>;
}

/**
 * 左栏：文章列表组件
 * 功能：显示所有文章，按 publisher 分组，点击搜索图标打开全屏文章列表
 */

interface SideListProps {
  inDrawer?: boolean;
}

export default function SideList({ inDrawer = false }: SideListProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setMobileSideList, setFullscreenMenu, mobileShowSideList } = useArticleViewerStore();

  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [showPublisherDialog, setShowPublisherDialog] = useState(false);

  // 从路由路径中提取 publisher（匹配 /view/<name>/<id>）
  const currentPublisher = React.useMemo(() => {
    const match = location.pathname.match(/\/view\/([^/]+)\/[A-Za-z0-9_-]+/);
    return match ? match[1] : null;
  }, [location.pathname]);

  // 获取当前 publisher 的头像和圆角
  const currentPublisherInfo = useMemo(() => {
    if (!currentPublisher) return null;

    // 默认 publisher
    if (currentPublisher === 'expubgo') {
      return {
        avatar: defaultPublisherConfig.avatar,
        avatarRadius: defaultPublisherConfig.avatarRadius,
        publisherName: defaultPublisherConfig.publisherName,
      };
    }

    // 查找 publisher 配置
    for (const path in configModules) {
      const module = configModules[path] as { default: PublisherConfig };
      const config = module.default;
      if (config.publisherId === currentPublisher) {
        return {
          avatar: resolveAvatar(config.avatar, path),
          avatarRadius: config.avatarRadius,
          publisherName: config.publisherName,
        };
      }
    }
    return null;
  }, [currentPublisher]);

  // 从当前路由中提取选中的文章ID
  const selectedId = React.useMemo(() => {
    const match = location.pathname.match(/\/view\/[^/]+\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  }, [location.pathname]);

  // 加载文章列表
  useEffect(() => {
    const items = getArticleListItems();
    setArticles(items);
  }, []);

  // 选中文章变化后，滚动列表内部到选中位置（不影响页面滚动）
  const listContainerRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selectedId || !listContainerRef.current) return;
    const timer = setTimeout(() => {
      const el = listContainerRef.current?.querySelector(`[data-article-id="${selectedId}"]`);
      if (el) {
        // 只滚动列表容器内部，不影响页面
        const container = listContainerRef.current;
        if (container) {
          const elTop = (el as HTMLElement).offsetTop;
          const containerScrollTop = container.scrollTop;
          const containerHeight = container.clientHeight;
          const elHeight = (el as HTMLElement).clientHeight;
          // 如果元素在可视区域外，才滚动
          if (elTop < containerScrollTop || elTop + elHeight > containerScrollTop + containerHeight) {
            container.scrollTo({ top: elTop - containerHeight / 2 + elHeight / 2, behavior: 'smooth' });
          }
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedId]);

  // 当抽屉打开时，也滚动列表内部到选中位置
  useEffect(() => {
    if (mobileShowSideList && selectedId && listContainerRef.current) {
      setTimeout(() => {
        const el = listContainerRef.current?.querySelector(`[data-article-id="${selectedId}"]`);
        if (el && listContainerRef.current) {
          const container = listContainerRef.current;
          const elTop = (el as HTMLElement).offsetTop;
          const containerHeight = container.clientHeight;
          const elHeight = (el as HTMLElement).clientHeight;
          container.scrollTo({ top: elTop - containerHeight / 2 + elHeight / 2, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [mobileShowSideList, selectedId]);

  // 按 publisher 分组
  const groupedArticles = useMemo(() => {
    const groups: Record<string, ArticleListItem[]> = {};
    const defaultGroup: ArticleListItem[] = [];

    for (const article of articles) {
      if (article.publisherId) {
        if (!groups[article.publisherId]) {
          groups[article.publisherId] = [];
        }
        groups[article.publisherId].push(article);
      } else {
        defaultGroup.push(article);
      }
    }

    return { groups, defaultGroup };
  }, [articles]);

  // 如果有 currentPublisher，只显示该 publisher 的文章
  const displayArticles = useMemo(() => {
    if (currentPublisher) {
      return { [currentPublisher]: groupedArticles.groups[currentPublisher] || [] };
    }
    return groupedArticles.groups;
  }, [currentPublisher, groupedArticles]);

  // 当前显示的文章数量
  const currentArticleCount = useMemo(() => {
    if (currentPublisher) {
      return groupedArticles.groups[currentPublisher]?.length || 0;
    }
    return articles.length;
  }, [currentPublisher, groupedArticles, articles]);

  // 获取所有 publisher 列表（用于切换），按 weight 降序排序（和 Home 一致）
  const allPublishers = useMemo(() => {
    const result: { publisherId: string; publisherName: string | string[]; avatar?: string | React.ReactNode; avatarRadius?: string; weight?: number; theme?: { spine: [string, string]; cover: [string, string]; textColor?: string } }[] = [];
    result.push({
      publisherId: defaultPublisherConfig.publisherId,
      publisherName: defaultPublisherConfig.publisherName,
      avatar: defaultPublisherConfig.avatar,
      avatarRadius: defaultPublisherConfig.avatarRadius,
      weight: (defaultPublisherConfig as unknown as Record<string, unknown>).weight as number || 0,
      theme: (defaultPublisherConfig as unknown as Record<string, unknown>).theme as { spine: [string, string]; cover: [string, string]; textColor?: string } | undefined,
    });
    for (const path in configModules) {
      const module = configModules[path] as { default: PublisherConfig & { weight?: number } };
      const config = module.default;
      result.push({
        publisherId: config.publisherId,
        publisherName: config.publisherName,
        avatar: resolveAvatar(config.avatar, path),
        avatarRadius: config.avatarRadius,
        weight: config.weight || 0,
        theme: config.theme,
      });
    }
    // 按 weight 降序排序
    result.sort((a, b) => (b.weight || 0) - (a.weight || 0));
    return result;
  }, []);

  const publisherArticleCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const article of articles) {
      const pubId = article.publisherId || 'expubgo'
      counts[pubId] = (counts[pubId] || 0) + 1
    }
    return counts
  }, [articles]);

  const switchPublisher = (publisherId: string) => {
    const latestId = getPublisherLatestArticleId(publisherId);
    if (latestId) {
      navigate(`/view/${publisherId}/${latestId}`);
    } else {
      // 没有文章时，导航到 publisher 的 empty 路径，由 EmptyArticle 显示无文章提示
      navigate(`/view/${publisherId}/_empty`);
    }
  };

  return (
    <>
      <Card className={cn("h-full overflow-hidden p-0", inDrawer && "rounded-none")}>
        <div className="h-full flex flex-col">

          {/* 顶部：标题、搜索图标 */}
          <div className="flex-shrink-0 p-3 pb-2 bg-muted/60">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPublisherDialog(true)}
                className="flex items-center gap-2 cursor-pointer rounded-xl px-3 py-2 -ml-1.5 transition-colors duration-200 hover:bg-foreground/5"
              >
                {/* Publisher 头像 */}
                {currentPublisherInfo?.avatar ? (
                  isString(currentPublisherInfo.avatar) ? (
                    <img
                      src={currentPublisherInfo.avatar}
                      alt={currentPublisher || ''}
                      className="w-8 h-8 object-cover"
                      style={{ borderRadius: currentPublisherInfo.avatarRadius || '9999px' }}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 overflow-hidden"
                      style={{ borderRadius: currentPublisherInfo.avatarRadius || '9999px' }}
                    >
                      {currentPublisherInfo.avatar}
                    </div>
                  )
                ) : (
                  <div
                    className="w-8 h-8 flex items-center justify-center bg-muted-foreground/20 text-muted-foreground text-sm font-medium"
                    style={{ borderRadius: '9999px' }}
                  >
                    {(isString(currentPublisherInfo?.publisherName) ? currentPublisherInfo.publisherName : currentPublisherInfo?.publisherName?.join(''))?.[0] || '?'}
                  </div>
                )}
                <div className="flex flex-col leading-tight">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold">文章列表</h2>
                    <span className="inline-flex items-center px-1.5 py-0 rounded-full bg-primary/10 text-primary text-[10px] font-medium min-w-[18px] h-[18px] justify-center">
                      {currentArticleCount}
                    </span>
                  </div>
                  {currentPublisherInfo?.publisherName && (
                    <span className="text-[11px] text-muted-foreground font-medium text-left">
                      {isString(currentPublisherInfo.publisherName) ? currentPublisherInfo.publisherName : currentPublisherInfo.publisherName.join('')}
                    </span>
                  )}
                </div>
              </button>
              <div className="flex items-center gap-1">
                {/* 搜索图标 - 点击打开全屏文章菜单 */}
                <button
                  type="button"
                  onClick={() => setFullscreenMenu(true)}
                  className="h-8 w-8 p-0 rounded-md hover:bg-foreground/10 transition-all duration-200 flex items-center justify-center"
                  aria-label="搜索"
                >
                  <Search className="h-4 w-4 text-foreground/70 hover:text-foreground" />
                </button>
                {/* 移动端关闭按钮 */}
                <button
                  type="button"
                  onClick={() => setMobileSideList(false)}
                  className="lg:hidden h-8 w-8 p-0 rounded-md hover:bg-foreground/10 transition-all duration-200 flex items-center justify-center"
                  aria-label="关闭"
                >
                  <X className="w-4 h-4 text-foreground/70 hover:text-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* 分割线 */}
          <div className="border-t border-border" />

          {/* 文章列表 - 可以内部滚动 */}
          <div ref={listContainerRef} className="flex-1 overflow-y-auto min-h-0">
            {/* 默认文章 */}
            {groupedArticles.defaultGroup.length > 0 && !currentPublisher && (
              <div className="divide-y divide-border">
                {groupedArticles.defaultGroup.map((article) => (
                  <ArticleItem
                    key={article.id}
                    article={article}
                    selectedId={selectedId}
                    onClick={() => {
                      navigate(article.path);
                      setMobileSideList(false);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Publisher 文章 */}
            {Object.entries(displayArticles).map(([publisherId, publisherArticles]) => (
              <div key={publisherId}>
                <div className="divide-y divide-border">
                  {publisherArticles.map((article) => (
                    <ArticleItem
                      key={article.id}
                      article={article}
                      selectedId={selectedId}
                      onClick={() => {
                        navigate(article.path);
                        setMobileSideList(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* 当前 publisher 无文章 */}
            {currentPublisher && displayArticles[currentPublisher]?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">当前发布者暂无文章</p>
              </div>
            )}

            {articles.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8">
                暂无文章
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 全屏文章菜单 */}
      <FullscreenArticleMenu />

      {/* Publisher 切换面板 */}
      <Dialog open={showPublisherDialog} onOpenChange={setShowPublisherDialog}>
        <DialogContent className="max-w-[900px] w-[calc(100%-32px)] p-0 gap-0" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogTitle className="sr-only">切换发布者</DialogTitle>
          <div className="flex flex-col">
            {/* 头部 */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-border flex-shrink-0">
              <h3 className="text-base font-semibold">切换发布者</h3>
            </div>

            {/* 书本卡片 - 滚动区域贴边 */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-10 px-6 pt-6 pb-10 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 56px)' }}>
              {allPublishers.map((pub, index) => {
                const defaultThemes: { spine: [string, string]; cover: [string, string] }[] = [
                  { spine: ['#b07a7a', '#c49272'], cover: ['#fff5f5', '#fff7ed'] },
                  { spine: ['#8e7aab', '#a08ab8'], cover: ['#f5f3ff', '#faf5ff'] },
                  { spine: ['#6a9e8a', '#7ab09a'], cover: ['#ecfdf5', '#f0fdfa'] },
                  { spine: ['#b0a070', '#c4b480'], cover: ['#fffbeb', '#fefce8'] },
                  { spine: ['#6a96b0', '#7aa8c0'], cover: ['#ecfeff', '#f0f9ff'] },
                ]
                const theme = pub.theme || defaultThemes[index % defaultThemes.length]
                const isCurrent = pub.publisherId === currentPublisher
                return (
                  <div
                    key={pub.publisherId}
                    className={cn(
                      "flex flex-col items-center rounded-xl cursor-pointer transition-all duration-300 pt-4 pl-2 pr-4",
                      isCurrent ? "selected-glow" : "hover:bg-muted/40"
                    )}
                    style={{
                      width: 175,
                      height: 215,
                    }}
                    onClick={() => { setShowPublisherDialog(false); switchPublisher(pub.publisherId) }}
                  >
                    <BookCard
                      onClick={() => {}}
                      initial={(isString(pub.publisherName) ? pub.publisherName : pub.publisherName.join(''))[0]}
                      name={pub.publisherName}
                      avatar={pub.avatar}
                      avatarRadius={pub.avatarRadius}
                      spineColors={theme.spine}
                      coverColors={theme.cover}
                      textColor={pub.theme?.textColor}
                      articleCount={publisherArticleCounts[pub.publisherId] || 0}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <style>{`
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .selected-glow {
          position: relative;
          background: rgba(148, 163, 184, 0.08);
          overflow: hidden;
        }
        .selected-glow::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          transform: translate(-50%, -50%) rotate(0deg);
          background: conic-gradient(from 0deg, rgba(148, 163, 184, 0.2), rgba(100, 116, 139, 0.12) 20%, rgba(148, 163, 184, 0.04) 40%, transparent 50%, rgba(148, 163, 184, 0.04) 60%, rgba(100, 116, 139, 0.12) 80%, rgba(148, 163, 184, 0.2));
          animation: spin 2.5s linear infinite;
          z-index: 0;
        }
        .selected-glow > * {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </>
  );
}

// 文章列表项组件
function ArticleItem({
  article,
  selectedId,
  onClick,
}: {
  article: ArticleListItem;
  selectedId: string | null;
  onClick: () => void;
}) {
  return (
    <div
      data-article-id={article.id}
      className={cn(
        'p-3 cursor-pointer transition-all duration-200',
        'hover:bg-accent',
        selectedId === article.id && 'bg-primary hover:bg-primary/90'
      )}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0 space-y-2">
        {/* 标题 */}
        <h3 className={cn(
          'text-sm font-medium leading-snug text-left',
          selectedId === article.id && 'text-white'
        )}>
          {article.title}
        </h3>

        {/* 标签 */}
        {article.tag && article.tag.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tag.map((tag, index) => (
              <span
                key={index}
                className={cn(
                  'inline-flex items-center px-1.5 py-0.5 rounded text-xs',
                  selectedId === article.id
                    ? 'bg-white/20 text-white'
                    : 'bg-primary/10 text-primary'
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 日期和作者 */}
        <div className="space-y-1 text-xs">
          {/* 日期 */}
          {article.date && (
            <div className={cn(
              'flex items-center gap-1',
              selectedId === article.id ? 'text-white/80' : 'text-muted-foreground'
            )}>
              <Calendar className="h-3 w-3" />
              <span>
                {getDayjs(article.date).format('YYYY-MM-DD')}
                <span className="ml-2">{['周日', '周一', '周二', '周三', '周四', '周五', '周六'][getDayjs(article.date).day()]}</span>
              </span>
            </div>
          )}

          {/* 作者 */}
          {article.author && (
            <div className={cn(
              'flex items-center gap-1',
              selectedId === article.id ? 'text-white/80' : 'text-muted-foreground'
            )}>
              <UserRound className="h-3 w-3" />
              <span>{article.author}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
