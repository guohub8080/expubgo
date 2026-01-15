/**
 * 字体堆栈构建工具
 * 负责根据用户设置构建完整的 font-family 堆栈
 * 英文字体按官方 category 接风格匹配的系统回退栈（webfontCatalog 数据）
 */
import { defaultTo } from 'es-toolkit/compat';
import { isNotNil } from 'es-toolkit/predicate';
import { WEBFONT_CATALOG } from './webfontCatalog.ts';

/** category → 匹配风格的系统回退栈（拉丁字体未加载/未覆盖字符时） */
const CATEGORY_FALLBACKS: Record<string, string[]> = {
  serif: ['Georgia', 'Times New Roman', 'serif'],
  monospace: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
  handwriting: ['cursive'],
  display: ['sans-serif'],
  'sans-serif': [],
};

/**
 * 展开拉丁字体：主字体与风格回退分开返回。
 * 关键约束：风格回退（含 serif/monospace 等通用关键字）**必须排在中文字体之后**——
 * 通用关键字会被系统解析为覆盖中文的字体（如 serif → 宋体），排前会截走中文渲染。
 */
const expandLatin = (fontName: string | null): { primary: string[]; fallbacks: string[] } => {
  if (!fontName) return { primary: [], fallbacks: [] }
  const meta = WEBFONT_CATALOG[fontName]
  if (isNotNil(meta) && !meta.coversChinese) {
    return { primary: [`'${fontName}'`], fallbacks: defaultTo(CATEGORY_FALLBACKS[meta.category], []) }
  }
  return { primary: [`'${fontName}'`], fallbacks: [] }
};

/** 旧接口兼容：主字体 + 回退直接拼接（仅用于无中文槽竞争的场景） */
const expandWithFallback = (fontName: string): string[] => {
  const { primary, fallbacks } = expandLatin(fontName)
  return [...primary, ...fallbacks]
};

/**
 * 展开分片字体的 range-0（用于英文，无中文槽竞争的分支）：主字体 + 风格回退
 */
const expandEnglishRange = expandWithFallback;

/**
 * 构建字体堆栈的辅助函数（用于中文，展开所有 range）
 */
const buildFullFontStack = (primaryFont: string | null, fallbackFonts: string[] = []): string => {
  const fonts = [];
  if (primaryFont) {
    // 展开所有分片字体 range
    fonts.push(...expandWithFallback(primaryFont));
  }
  fonts.push(...fallbackFonts);
  return fonts.join(', ');
};

/**
 * 系统字体 fallback 列表（不包含自定义 web 字体）
 */
const SYSTEM_FONTS = [
  'PingFang SC',
  'Hiragino Sans GB',
  'Microsoft YaHei',
  'WenQuanYi Micro Hei',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  'sans-serif'
];

/**
 * 系统等宽字体 fallback 列表
 */
const SYSTEM_MONOSPACE_FONTS = [
  'ui-monospace',
  'SFMono-Regular',
  'Consolas',
  'Liberation Mono',
  'Menlo',
  'monospace'
];

/**
 * 日文字体映射：中文字体 -> 对应的日文字体
 */
const CHINESE_TO_JAPANESE_FONT_MAP: Record<string, string> = {
  'minsans-v': 'minsans-v',      // MiSans 中日通用
  'syht-cn-v': 'syht-jp-v',      // 思源黑体 CN -> JP
  'syst-cn-v': 'syst-jp-v',      // 思源宋体 CN -> JP
};

/**
 * 构建主题字体堆栈
 * 英文字体按官方 category 接风格匹配的系统回退栈（webfontCatalog 数据），
 * 中文回退统一用 SYSTEM_FONTS
 */
export const buildThemeFontStack = (
  chineseFontFamily: string | null,
  englishFontFamily: string | null
): string => {
  // 防御：英文槽不允许 CJK 字体——CSS 栈按字符先到先得，覆盖中文的字体排最前会
  // 截走所有中文渲染，令中文字体设置失效（UI 已过滤，这里兜底历史 localStorage 残留值）
  const englishCoversChinese = isNotNil(WEBFONT_CATALOG[englishFontFamily ?? '']) && WEBFONT_CATALOG[englishFontFamily ?? ''].coversChinese;
  const english = englishCoversChinese ? null : englishFontFamily;

  if (!chineseFontFamily) {
    // 中文选择系统默认：不使用任何自定义字体，直接使用系统字体
    if (!english) {
      // 英文也跟随中文：只用系统字体
      return SYSTEM_FONTS.join(', ');
    } else {
      // 英文设置了：英文字体（只用 range-0）+ 系统字体
      const englishFonts = expandEnglishRange(english);
      return [...englishFonts, ...SYSTEM_FONTS].join(', ');
    }
  } else {
    // 中文设置了自定义字体
    if (!english) {
      // 英文跟随中文：使用中文字体的所有 range + 系统字体
      return buildFullFontStack(chineseFontFamily, SYSTEM_FONTS);
    } else {
      // 英文+中文都设置：英文主字体 → 中文字体 → 英文风格回退 → 系统栈
      // （风格回退放中文之后，防止 serif 等通用关键字解析出的系统 CJK 字体截走中文）
      const { primary: ePrimary, fallbacks: eFallbacks } = expandLatin(english);
      return [...ePrimary, `'${chineseFontFamily}'`, ...eFallbacks, ...SYSTEM_FONTS].join(', ');
    }
  }
};

/**
 * 构建代码字体堆栈
 * 智能字体栈逻辑：
 * 1. 如果code有设置，优先使用code设置（只用range-0），然后fallback中文
 * 2. 如果code没有设置，而英文有设置，先英文，再fallback中文
 * 3. 如果都没有设置，按中文的字符来
 */
export const buildCodeFontStack = (
  codeFontFamily: string | null,
  themeFontStack: string,
  chineseFontFamily: string | null,
  englishFontFamily: string | null
): string => {
  const fonts = [];

  if (codeFontFamily && codeFontFamily !== 'system') {
    // 情况1：code有设置：代码主字体 → 中文 → 代码风格回退 → 系统等宽（风格回退放中文后，防通用关键字截中文）
    const { primary, fallbacks } = expandLatin(codeFontFamily);
    fonts.push(...primary);
    if (chineseFontFamily) fonts.push(`'${chineseFontFamily}'`);
    fonts.push(...fallbacks);
    fonts.push(...SYSTEM_MONOSPACE_FONTS);

  } else if (!codeFontFamily && englishFontFamily) {
    // 情况2：code没有设置而英文有设置：英文主字体 → 中文 → 英文风格回退 → 系统等宽
    const { primary, fallbacks } = expandLatin(englishFontFamily);
    fonts.push(...primary);
    if (chineseFontFamily) fonts.push(`'${chineseFontFamily}'`);
    fonts.push(...fallbacks);
    fonts.push(...SYSTEM_MONOSPACE_FONTS);

  } else {
    // 情况3：都没有设置，按中文的字符来
    if (chineseFontFamily) {
      const chineseFonts = expandWithFallback(chineseFontFamily);
      fonts.push(...chineseFonts);
    }

    // fallback系统字体
    fonts.push(...SYSTEM_MONOSPACE_FONTS);
  }

  return fonts.join(', ');
};

/**
 * 构建日文字体堆栈
 * 逻辑：
 * 1. 如果日文有设置，直接使用日文字体
 * 2. 中文字体作为 fallback
 * 3. 最后 fallback 到系统字体
 */
export const buildJapaneseFontStack = (
  japaneseFontFamily: string | null,
  chineseFontFamily: string | null
): string => {
  const fonts = [];

  // 日文字体
  if (japaneseFontFamily) {
    fonts.push(`'${japaneseFontFamily}'`);
  }

  // 中文字体作为 fallback
  if (chineseFontFamily) {
    fonts.push(`'${chineseFontFamily}'`);
  }

  // 最后 fallback 到系统字体
  fonts.push(...SYSTEM_FONTS);

  return fonts.join(', ');
};
