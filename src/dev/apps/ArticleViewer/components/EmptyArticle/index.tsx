import React from 'react'

/**
 * 无文章提示组件
 * 当当前 publisher 没有文章时显示
 */
export default function EmptyArticle() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center min-h-[400px]">
      {/* 虚线框 - 表示空白内容 */}
      <div className="w-24 h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/40">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <line x1="10" y1="9" x2="8" y2="9"/>
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-1.5">暂无文章</h3>
      <p className="text-sm text-muted-foreground">
        当前发布者还没有创建任何文章
      </p>
    </div>
  )
}
