/**
 * 书页移动端断点（px）：窗口宽于此走桌面布局（fixed 侧栏），否则走移动分支（右侧抽屉）。
 * 三处消费：BookLayout 主分支、BookSidebarProvider、ArticleContent——改动只改这里。
 */
export const BOOK_MOBILE_BREAKPOINT = 650;

/**
 * 黄盒（内容行）最大宽度（px）：占位块与正文都在其中打包。
 * 两处消费：BookLayout（黄盒容器 maxWidth + bodyInset 动态计算）、BookSide（fixed 侧栏的同构行
 * 必须用同一宽度规则计算居中偏移，否则侧栏与黄盒错位、中缝异常）——改动只改这里。
 */
export const BOOK_CONTENT_ROW_MAX_WIDTH = 1030;
