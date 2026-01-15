/**
 * 全局设置默认值
 * 集中管理所有设置的初始值
 */
export const DEFAULT_VALUES = {
  theme: 'light' as const,
  mainDynamicBackround: 'theme' as const,
  navigationHeight: 56,

  // 字体默认值 —— 站长优先字体在这里配置
  // 中文默认 minsans-v（MiSans VF，真实多字重）；其余 null 走系统栈，访客可在 Settings 里自行切换
  // 想让站点默认呈现某个 web 字体（渐进增强：CSS 懒注入 + swap，不阻塞渲染），
  // 改成对应 family 名即可（注册表见 webfontLoader.ts）：
  // CJK：'minsans-v' / 'syht-cn-v' / 'syst-cn-v'；拉丁 VF：'inter-v' / 'source-sans-3-v' /
  // 'source-serif-4-v' / 'cascadia-mono-v' 等；静态：'ibm-plex-sans' / 'jb-mono' 等
  chineseFontFamily: 'minsans-v',
  englishFontFamily: null, // 跟随中文
  codeFontFamily: null, // 系统等宽栈；可用 'jb-mono'（JetBrains Mono）
  japaneseFontFamily: null, // 跟随中文（JP 字族已从字体仓库移除，中文场景用不上）

  // 字体权重默认值 - 全局设置（body 使用 font-normal）
  // Tailwind 字重类默认值
  fontWeightLight: 300,
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,

  // 文章行高默认值
  articleLineHeight: 30,

  // 书籍布局相关
  bookSideWidth: 280,
  bookContentWidth: 850,
  bookContentPadding: 40,
  bookSideContentGap: 10,

  // 书籍目录显示控制
  isBookTocShow: true,

  // 页面类型管理
  // 当前是否为书籍页面
  isBookPage: false,

  // 最后访问的 URL
  lastVisitedUrl: '',

  // 导航面板显示控制
  isNavigationPanelOpen: false,
} as const;

export type DefaultValues = typeof DEFAULT_VALUES;
