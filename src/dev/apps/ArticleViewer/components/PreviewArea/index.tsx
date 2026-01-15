/** @jsxImportSource react */
import { Outlet, useLocation } from 'react-router';
import { useEffect, useRef } from 'react';
import { useArticleViewerStore, ARTICLE_VIEWER_LAYOUT } from '@apps/ArticleViewer/store/useArticleViewerStore';

/**
 * 中栏：文章预览区组件
 * 功能：显示选中文章的预览内容
 */

export default function PreviewArea() {
  const { previewWidth, previewPadding, previewBorderColor, previewBackgroundColor, setPreviewContentRef } = useArticleViewerStore();
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // 将 ref 设置到 store 中，供 ActionPanel 使用
  useEffect(() => {
    setPreviewContentRef(contentRef.current);
  }, [setPreviewContentRef]);

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

          <article
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
        </div>
      </div>
    </div>
  );
}
