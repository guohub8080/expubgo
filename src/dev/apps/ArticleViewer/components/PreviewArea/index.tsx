/** @jsxImportSource react */
import { Outlet, useLocation } from 'react-router';
import { useEffect, useRef } from 'react';
import { useArticleViewerStore, ARTICLE_VIEWER_LAYOUT } from '@apps/ArticleViewer/store/useArticleViewerStore';
import { getArticleById } from '@dev/articles/articlesLoader';
import XRayLayoutLayer from '../XRayLayoutLayer';

/**
 * 中栏：文章预览区组件
 * 功能：显示选中文章的预览内容
 */

export default function PreviewArea() {
  const { previewWidth, previewPadding, previewBorderColor, previewBackgroundColor, setPreviewContentRef, previewRefreshNonce, svgXRay, previewScrollRestore, setPreviewScrollRestore } = useArticleViewerStore();
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  // 当前文章的 SVG 标记（与 ActionPanel 同逻辑：hash 解析 /view/:publisher/:id）
  const articleId = location.pathname.split('/')[3] ?? '';
  const isSvgArticle = (articleId ? getArticleById(articleId) : undefined)?.isSvgArticle === true;

  // 刷新预览的滚动还原：nonce 变化（非首载）且带着还原位 → 等内容长回再跳回原阅读处。
  // 重挂载瞬间内容高度塌陷，窗口滚动被钳到顶；网络文章的 iframe 更是异步长高，rAF 轮询等
  // 高度够到还原位（10s 兜底，文章变短时也照跳，scrollTo 自会钳制）。
  const lastNonceRef = useRef(previewRefreshNonce);
  useEffect(() => {
    if (lastNonceRef.current === previewRefreshNonce) return; // 首载/无关渲染不动
    lastNonceRef.current = previewRefreshNonce;
    const y = previewScrollRestore;
    if (y == null) return;
    const started = Date.now();
    const tryScroll = () => {
      const tallEnough = document.documentElement.scrollHeight >= y + window.innerHeight;
      if (tallEnough || Date.now() - started > 10000) {
        window.scrollTo({ top: y });
        setPreviewScrollRestore(null); // 一次性消费
      } else {
        requestAnimationFrame(tryScroll);
      }
    };
    requestAnimationFrame(tryScroll);
    // previewScrollRestore 刻意不入 deps：只在 nonce 变化那一拍消费，平时变更不触发
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewRefreshNonce]);

  // 将 ref 设置到 store 中，供 ActionPanel 使用（nonce 变化=重挂载后重新绑定新 DOM）
  useEffect(() => {
    setPreviewContentRef(contentRef.current);
  }, [setPreviewContentRef, previewRefreshNonce]);

  // 路由变化时滚动到顶部
  useEffect(() => {
    // 使用 requestAnimationFrame 确保在渲染完成后滚动
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [location.pathname]);

  return (
    <div className="h-auto pb-0 flex flex-col items-center" style={{ marginBottom: 50 }}>
      {/* 画布容器 - 宽度由 slider 控制 */}
      <div
        className="relative flex flex-col"
        style={{
          width: `${previewWidth}px`,
          maxWidth: '100%',
          backgroundColor: previewBackgroundColor,
          transition: 'background-color 0.3s ease-in-out, width 0.2s ease-out',
          boxShadow: previewBackgroundColor !== 'transparent'
            ? '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)'
            : 'none',
        }}
      >
        {/* 内容区域 - padding 在这里 */}
        <div
          className="relative"
          style={{
            padding: previewPadding,
            transition: 'padding 0.2s ease-out',
          }}
        >
          {/* 动态边框 - 框住内容 */}
          {previewBorderColor !== 'transparent' && (
            <svg
              style={{
                position: 'absolute',
                top: previewPadding,
                left: previewPadding,
                width: `calc(100% - ${previewPadding * 2}px)`,
                height: `calc(100% - ${previewPadding * 2}px)`,
                pointerEvents: 'none',
                overflow: 'hidden',
              }}
            >
              <rect
                x="1"
                y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                fill="none"
                stroke={previewBorderColor}
                strokeWidth="2"
                strokeDasharray="8 4"
                style={{
                  animation: 'border-dash-flow 120s linear infinite',
                  transition: 'stroke 0.3s ease-in-out',
                }}
              />
            </svg>
          )}

          {/* key=nonce：刷新预览时整棵文章子树按 React 正规流程重挂载（全新 DOM、
              SMIL 时间线与事件基归零），替代旧 innerHTML 手术 hack。
              XRay 透视拖拽（isSvgArticle+开关）包裹文章层：框选 data-layout-key 元素可视化调位 */}
          <XRayLayoutLayer active={isSvgArticle && svgXRay} rootRef={contentRef}>
          <article
            key={previewRefreshNonce}
            ref={contentRef}
            className="prose prose-slate dark:prose-invert max-w-none"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              overflowWrap: 'break-word',
            }}
          >
            <Outlet />
          </article>
          </XRayLayoutLayer>
        </div>
      </div>
    </div>
  );
}
