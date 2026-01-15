/** @jsxImportSource react */
import { useEffect, useMemo, useState } from 'react';
import { Search, Calendar, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { Input } from '@shadcn/components/ui/input.tsx';
import { Dialog, DialogContent, DialogTitle } from '@shadcn/components/ui/dialog.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@shadcn/components/ui/popover.tsx';
import { cn } from '@shadcn/lib/utils.ts';
import { getArticleListItems, getAllTags, getAllCategories, ArticleListItem, getArticleById } from '@dev/articles/articlesLoader';
import { getDayjs } from '@dev/utils/utDateTime/exDayjs';
import { useArticleViewerStore } from '@apps/ArticleViewer/store/useArticleViewerStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn/components/ui/select.tsx';

const filterArticles = (
  articles: ArticleListItem[],
  query: string,
  selectedCategory: string,
  selectedTags: string[]
): ArticleListItem[] => {
  let filtered = articles;

  if (selectedCategory && selectedCategory !== 'all') {
    filtered = filtered.filter(article => article.category === selectedCategory);
  }

  if (selectedTags.length > 0) {
    filtered = filtered.filter(article =>
      article.tag?.some(tag => selectedTags.includes(tag))
    );
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(article => {
      if (article.title.toLowerCase().includes(q)) return true;
      if (article.author?.toLowerCase().includes(q)) return true;
      if (article.tag?.some(t => t.toLowerCase().includes(q))) return true;
      if (q.length >= 2) {
        try {
          const data = getArticleById(article.id);
          if (data?._textContent?.toLowerCase().includes(q)) return true;
        } catch { /* ignore */ }
      }
      return false;
    });
  }

  return filtered;
};

export default function FullscreenArticleMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showFullscreenMenu, setFullscreenMenu, setMobileSideList } = useArticleViewerStore();

  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const selectedId = useMemo(() => {
    // 统一格式: /view/<publisher>/<id>
    const match = location.pathname.match(/\/view\/[^/]+\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  }, [location.pathname]);

  useEffect(() => {
    setArticles(getArticleListItems());
    setAllCategories(getAllCategories());
    setAllTags(getAllTags());
  }, []);

  const filteredArticles = useMemo(() => {
    return filterArticles(articles, searchQuery, selectedCategory, selectedTags);
  }, [articles, searchQuery, selectedCategory, selectedTags]);

  const handleArticleClick = (path: string) => {
    navigate(path);
    setFullscreenMenu(false);
    setMobileSideList(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Dialog open={showFullscreenMenu} onOpenChange={setFullscreenMenu}>
      <DialogContent
        className="sm:max-w-[96vw] md:max-w-[88vw] lg:max-w-[80vw] h-[90vh] flex flex-col p-0 gap-0"
        showClose={false}
      >
        {/* 标题栏 */}
        <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">搜索文章</DialogTitle>
            <button
              type="button"
              onClick={() => setFullscreenMenu(false)}
              className="h-7 w-7 rounded-md hover:bg-foreground/10 flex items-center justify-center"
              aria-label="关闭"
            >
              <X className="h-4 w-4 text-foreground/60" />
            </button>
          </div>

          {/* 搜索 + 分类 + 标签 */}
          <div className="flex items-center gap-2 mt-2.5">
            {/* 搜索框 - 自动填充剩余宽度 */}
            <div className="relative w-56 shrink-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索标题、作者、标签..."
                className="pl-8 h-8 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            {/* 分类 */}
            {allCategories.length > 0 && (
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-36 shrink-0" size="sm">
                  <SelectValue placeholder="分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {allCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* 标签 Popover */}
            {allTags.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      'h-8 px-3 rounded-md text-xs font-medium transition-colors shrink-0 border',
                      selectedTags.length > 0
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-input hover:bg-accent'
                    )}
                  >
                    标签
                    {selectedTags.length > 0 && (
                      <span className={cn(
                        'ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]',
                        selectedTags.length > 0
                          ? 'bg-white/20'
                          : 'bg-secondary'
                      )}>
                        {selectedTags.length}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-2"
                  align="start"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">选择标签筛选</span>
                    {selectedTags.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedTags([])}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        清除
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-w-xs">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          'px-2.5 py-1 rounded text-xs transition-colors',
                          selectedTags.includes(tag)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* 文章网格 */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredArticles.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-16">
              {searchQuery || selectedCategory !== 'all' || selectedTags.length > 0
                ? '未找到相关文章' : '暂无文章'}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-border border border-border">
              {filteredArticles.map(article => (
                <div
                  key={article.id}
                  className={cn(
                    'cursor-pointer bg-background px-3 py-2.5 transition-colors',
                    'hover:bg-accent',
                    selectedId === article.id && 'bg-primary text-white hover:bg-primary/90'
                  )}
                  onClick={() => handleArticleClick(article.path)}
                >
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <h3 className="text-[13px] font-medium leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    {article.category && (
                      <span className={cn(
                        'shrink-0 text-[10px] px-1 py-0.5 rounded mt-0.5 whitespace-nowrap',
                        selectedId === article.id
                          ? 'bg-white/20 text-white/80'
                          : 'bg-secondary text-muted-foreground'
                      )}>
                        {article.category}
                      </span>
                    )}
                  </div>

                  {article.date && (
                    <div className={cn(
                      'flex items-center gap-1 text-[11px]',
                      selectedId === article.id ? 'text-white/60' : 'text-muted-foreground'
                    )}>
                      <Calendar className="h-2.5 w-2.5" />
                      <span>{getDayjs(article.date).format('YYYY-MM-DD')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部统计 */}
        <div className="flex-shrink-0 px-5 py-2 border-t text-xs text-muted-foreground">
          共 {filteredArticles.length} 篇文章
        </div>
      </DialogContent>
    </Dialog>
  );
}
