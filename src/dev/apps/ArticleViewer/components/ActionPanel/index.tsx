/** @jsxImportSource react */
import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router';
import { Copy, FileCode, Check, X, RefreshCw, RotateCcw, Shapes, Pause, Play, Type, Text, Scan, ChevronDown, ChevronRight, HelpCircle, Loader2, Send, PlugZap } from 'lucide-react';
import { Button } from '@shadcn/components/ui/button.tsx';
import { ButtonGroupItem, ButtonTable, ButtonTableRow } from '@shadcn/components/ui/button-group.tsx';
import { Card } from '@shadcn/components/ui/card.tsx';
import { Slider } from '@shadcn/components/ui/slider.tsx';
import { Label } from '@shadcn/components/ui/label.tsx';
import { Switch } from '@shadcn/components/ui/switch.tsx';
import { Input } from '@shadcn/components/ui/input.tsx';
import { Badge } from '@shadcn/components/ui/badge.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@shadcn/components/ui/popover.tsx';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@shadcn/components/ui/dialog.tsx';
import { HexColorPicker } from 'react-colorful';
import toast from 'react-hot-toast';
import { isNotNil } from 'es-toolkit/predicate';
import { useArticleViewerStore, ARTICLE_VIEWER_LAYOUT } from '@apps/ArticleViewer/store/useArticleViewerStore';
import { getArticleById } from '@dev/articles/articlesLoader';
import { useNetworkSources } from '@dev/articles/networkSources';
import { devLayoutStore } from '@pub-utils/devLayout';
import { xrayPanelHost } from '../XRayLayoutLayer';
import { NumberField, NumberFieldGroup, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@shadcn/components/ui/number-field.tsx';
import faviconSvg from '@dev/assets/svgs/logoSvg/favicon.svg';

/**
 * 右栏：操作功能组件
 * 专业的 UI/UX 设计，遵循现代设计原则
 */

// RGB 转 Hex 辅助函数
const rgbToHex = (rgb: string): string => {
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) return '#787878';
  const [, r, g, b] = match;
  return '#' + [r, g, b].map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/** 帮助弹窗里的键盘键帽样式 */
const KBD = 'rounded border border-border bg-muted px-1 py-px font-mono text-[10px] text-muted-foreground';

// 判断颜色是否为浅色（用于决定使用黑色还是白色圆点）
const isLightColor = (color: string): boolean => {
  // 处理 rgb() 格式
  const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    const brightness = (parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1000;
    return brightness > 128;
  }

  // 处理 hex 格式
  const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (hexMatch) {
    const [, r, g, b] = hexMatch;
    const brightness = (parseInt(r, 16) * 299 + parseInt(g, 16) * 587 + parseInt(b, 16) * 114) / 1000;
    return brightness > 128;
  }

  // 默认返回 false（使用白色圆点）
  return false;
};

// 预设画布颜色
const CANVAS_PRESET_COLORS = [
  { value: 'transparent', label: '透明', display: '#ffffff' },
  { value: '#ffffff', label: '白色', display: '#ffffff' },
  { value: '#f8fafc', label: '浅灰', display: '#f8fafc' },
  { value: '#e2e8f0', label: '灰色', display: '#e2e8f0' },
  { value: '#94a3b8', label: '中灰', display: '#94a3b8' },
  { value: '#475569', label: '深灰', display: '#475569' },
  { value: '#1e293b', label: '暗灰', display: '#1e293b' },
  { value: '#000000', label: '黑色', display: '#000000' },
  { value: '#ef4444', label: '红色', display: '#ef4444' },
  { value: '#22c55e', label: '绿色', display: '#22c55e' },
  { value: '#3b82f6', label: '蓝色', display: '#3b82f6' },
] as const;

// 预设边框颜色
const BORDER_PRESET_COLORS = [
  { value: 'transparent', label: '透明', display: '#ffffff' },
  { value: '#ffffff', label: '白色', display: '#ffffff' },
  { value: '#000000', label: '黑色', display: '#000000' },
  { value: '#ef4444', label: '红色', display: '#ef4444' },
  { value: '#3b82f6', label: '蓝色', display: '#3b82f6' },
] as const;

/** 预览选项可折叠区块头：整行即折叠触发区（含标题/结果值/箭头），折叠后仅保留本行 */
function SectionHead({ title, value, collapsed, onToggle }: { title: string; value: string | number; collapsed: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={collapsed ? `展开${title}` : `折叠${title}`}
      className="flex w-full cursor-pointer select-none items-center justify-between"
    >
      <Label className="text-sm font-medium">{title}</Label>
      <div className="flex items-center gap-1">
        <Badge className="text-xs bg-primary text-primary-foreground" style={{ fontFamily: 'var(--guohub-code-font-family)' }}>
          {value}
        </Badge>
        {collapsed
          ? <ChevronRight className="size-4 text-muted-foreground" />
          : <ChevronDown className="size-4 text-muted-foreground" />}
      </div>
    </button>
  );
}

/** XRay 颜色区块（位置框/选中）：SectionHead 折叠 + 预设色板 + 自定义取色 */
const XRAY_COLOR_PRESETS = [
  { value: '#1976D2', label: '蓝' },
  { value: '#7C3AED', label: '紫' },
  { value: '#DC2626', label: '红' },
  { value: '#059669', label: '绿' },
  { value: '#D97706', label: '橙' },
  { value: '#DB2777', label: '粉' },
  { value: '#111827', label: '黑' },
  { value: '#F59E0B', label: '黄' },
] as const;

function XRayColorSection({ title, collapsed, onToggle, color, onChange, opacity, onOpacityChange }: { title: string; collapsed: boolean; onToggle: () => void; color: string; onChange: (c: string) => void; opacity?: number; onOpacityChange?: (v: number) => void }) {
  const isPreset = XRAY_COLOR_PRESETS.some(c => c.value === color);
  return (
    <div className="space-y-4">
      <SectionHead title={title} value={color.toUpperCase()} collapsed={collapsed} onToggle={onToggle} />
      {collapsed !== true && (
        <div className="grid grid-cols-9 gap-1.5">
          {XRAY_COLOR_PRESETS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange(c.value)}
              title={c.label}
              className={`relative aspect-square w-full cursor-pointer rounded-md transition-all duration-200 hover:scale-105
                after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2
                after:w-3/4 after:h-1 after:bg-primary after:rounded-full after:transition-opacity after:duration-200
                ${color.toUpperCase() === c.value ? 'after:opacity-100' : 'after:opacity-0'}`}
              style={{ backgroundColor: c.value }}
            />
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                title="自定义颜色"
                className={`relative aspect-square w-full cursor-pointer overflow-visible rounded-md border-2 border-dashed transition-all duration-200 hover:scale-105
                  after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2
                  after:w-3/4 after:h-1 after:bg-primary after:rounded-full after:transition-opacity after:duration-200
                  ${!isPreset ? 'after:opacity-100 border-primary/60' : 'after:opacity-0 border-muted-foreground/40 hover:border-primary/60'}`}
                style={{ backgroundColor: isPreset ? 'transparent' : color }}
              >
                {isPreset ? (
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 p-1">
                    <div className="rounded-sm" style={{ backgroundColor: '#ef4444' }} />
                    <div className="rounded-sm" style={{ backgroundColor: '#22c55e' }} />
                    <div className="rounded-sm" style={{ backgroundColor: '#3b82f6' }} />
                    <div className="rounded-sm" style={{ backgroundColor: '#f59e0b' }} />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-2 rounded-full" style={{ backgroundColor: isLightColor(color) ? '#000000' : '#ffffff' }} />
                  </div>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-6" align="center" sideOffset={10}>
              <div className="flex flex-col items-center space-y-3">
                <HexColorPicker color={color} onChange={c => onChange(c.toUpperCase())} style={{ width: '240px', height: '180px' }} />
                <div className="flex items-center gap-2" style={{ width: '240px' }}>
                  <div className="h-10 w-10 rounded border-2 border-border flex-shrink-0" style={{ backgroundColor: color }} />
                  <Input
                    type="text"
                    value={color.toUpperCase()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value.toUpperCase())}
                    className="text-sm flex-1"
                    style={{ fontFamily: 'var(--guohub-code-font-family)' }}
                    placeholder="#1976D2"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {isNotNil(opacity) && isNotNil(onOpacityChange) && (
            <div className="col-span-9 flex items-center gap-3 pt-1">
              <span className="shrink-0 text-xs text-muted-foreground select-none">不透明度</span>
              <Slider
                value={[opacity]}
                onValueChange={(v: number[]) => onOpacityChange(v[0])}
                min={0}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="w-9 shrink-0 text-right text-xs text-muted-foreground" style={{ fontFamily: 'var(--guohub-code-font-family)' }}>{opacity}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ActionPanel() {
  const {
    previewWidth,
    setPreviewWidth,
    previewMaxAvailableWidth,
    previewPadding,
    setPreviewPadding,
    showPreviewBorder,
    toggleShowPreviewBorder,
    previewBorderColor,
    setPreviewBorderColor,
    previewBackgroundColor,
    setPreviewBackgroundColor,
    previewContentRef,
    setMobileActionPanel,
    mobileShowActionPanel,
    svgMouseBridge,
    setSvgMouseBridge,
    svgTimeFreeze,
    svgXRay,
    imgPopSim,
    setSvgTimeFreeze,
    setImgPopSim,
    setSvgXRay,
    panelSectionCollapsed,
    togglePanelSection,
    xrayFrameColor,
    setXrayFrameColor,
    xraySelectedColor,
    setXraySelectedColor,
    xrayFillColor,
    setXrayFillColor,
    xrayFillOpacity,
    setXrayFillOpacity,
    refreshPreview,
    setPreviewScrollRestore
  } = useArticleViewerStore();

  // 当前文章的 SVG 交互标记（从 hash 解析 /view/:publisher/:id → 文章数据；
  // 嵌套路由下 useParams 拿不到子路由段，网络源/普通文章为 false）
  const location = useLocation();
  const articleId = location.pathname.split('/')[3] ?? '';
  const article = articleId ? getArticleById(articleId) : undefined;
  const isSvgArticle = article?.isSvgArticle === true;

  // XRay 通道订阅：文章没有 useDevXRay 绑定时，XRay 区只剩空状态红字提示
  //（三个颜色折叠区跟随隐藏——没有可调对象，颜色配置无意义）
  useSyncExternalStore(devLayoutStore.subscribeEntries, devLayoutStore.getEntriesVersion)
  const hasXrayEntries = devLayoutStore.getEntries().length > 0

  // SVG 交互：鼠标事件桥（桌面 mousedown/up → touchstart/end）
  // 配对语义（同真实触摸）：touchstart 记录目标，touchend 派发给同一目标；
  // 按下不在预览区内则整轮忽略——杜绝「按在面板、抬在文章」凭空产生的孤儿 touchend。
  // 派发到命中节点本身（= 热区 rect/音频卡等 pointer-events:painted 元素），
  // 事件沿祖先冒泡触发各动画事件基——派发到背景节点会导致背景组动前景组不动（AGENTS 教训）。
  // touchend 派发时记录主 svg 时间线零点，供「冻结时间」按点击后第 X 秒定位。
  const bridgePressRef = useRef<{ target: Element; x: number; y: number } | null>(null);
  const svgT0Ref = useRef<number | null>(null);
  useEffect(() => {
    if (!isSvgArticle || !svgMouseBridge) return;
    const mainSvg = (): SVGSVGElement | null => {
      const svgs = previewContentRef.current?.querySelectorAll('svg');
      if (!svgs) return null;
      for (const s of svgs) if (s.querySelector('animate, animateTransform')) return s as SVGSVGElement;
      return null;
    };
    const makeTouch = (type: 'touchstart' | 'touchend', target: Element, x: number, y: number) => {
      let ev: Event;
      try {
        const touch = new Touch({ identifier: 1, target: target as EventTarget, clientX: x, clientY: y });
        ev = new TouchEvent(type, { bubbles: true, cancelable: true, composed: true, touches: [touch], targetTouches: [touch], changedTouches: [touch] });
      } catch {
        ev = new TouchEvent(type, { bubbles: true, cancelable: true, composed: true }); // 无 Touch 构造器的浏览器
      }
      target.dispatchEvent(ev);
    };
    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      bridgePressRef.current = null;
      if ((e as MouseEvent & { sourceCapabilities?: { firesTouchEvents?: boolean } }).sourceCapabilities?.firesTouchEvents) return; // 触摸屏合成的 mouse 事件不再回桥
      const target = e.target as Element | null;
      if (!target || !previewContentRef.current?.contains(target)) return;
      bridgePressRef.current = { target, x: e.clientX, y: e.clientY };
      makeTouch('touchstart', target, e.clientX, e.clientY);
    };
    const onUp = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const press = bridgePressRef.current;
      bridgePressRef.current = null;
      if (!press) return; // 无配对 touchstart 的抬起（按在面板外等）不派发
      makeTouch('touchend', press.target, press.x, press.y);
      const svg = mainSvg();
      if (svg) { try { svgT0Ref.current = svg.getCurrentTime(); } catch { /* 无时间线 */ } }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
    };
  }, [isSvgArticle, svgMouseBridge, previewContentRef]);

  // 判断是否在移动端抽屉中（< 1024px 且抽屉打开）
  const [isMobileDrawer, setIsMobileDrawer] = useState(false);
  // SVG 冻结时间（点击后第 X 秒）
  const [freezeSec, setFreezeSec] = useState(30);
  // 图片弹出模拟：当前弹出的图片 src（null=关闭）
  const [imgPopSrc, setImgPopSrc] = useState<string | null>(null);
  // 已连接网络内容源（iframe 图片点击上报的 origin 白名单用）
  const networkSources = useNetworkSources();
  // 查看器底色与缩放模式
  const [imgPopBg, setImgPopBg] = useState<'black-trans' | 'white-trans' | 'black' | 'white' | 'gray'>('black-trans');
  const [imgPopFit, setImgPopFit] = useState<'full' | 'fit'>('fit');

  // 图片弹出模拟：点击预览区内真 <img> → 全屏查看器（模拟微信阅读端行为，任意文章可用）。
  // svg 背景图不是 img 标签，天然不触发——与微信一致；监听挂 document 存活于刷新重挂载。
  // 网络文章走跨域 iframe，click 事件出不来——源页经 postMessage 上报（协议 expub-article-img-click），
  // 此处收消息补弹；origin 只放行已连接内容源。
  useEffect(() => {
    if (!imgPopSim) return;
    const onClick = (e: MouseEvent) => {
      const root = previewContentRef.current;
      if (!root) return;
      const el = e.target as Element | null;
      if (!el || !root.contains(el)) return;
      const img = el.closest('img');
      if (!img || !root.contains(img)) return;
      e.preventDefault();
      const src = img.getAttribute('src');
      if (src) setImgPopSrc(src);
    };
    const onMessage = (e: MessageEvent) => {
      const data = e.data as Record<string, unknown> | null;
      if (!data || data.type !== 'expub-article-img-click') return;
      const src = data.src;
      if (typeof src !== 'string' || !/^https?:\/\//.test(src)) return;
      const fromKnownSource = networkSources.some((s) => {
        try { return new URL(s.url).origin === e.origin } catch { return false }
      });
      if (!fromKnownSource) return;
      setImgPopSrc(src);
    };
    document.addEventListener('click', onClick);
    window.addEventListener('message', onMessage);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('message', onMessage);
    };
  }, [imgPopSim, previewContentRef, networkSources]);

  // Esc 关闭查看器
  useEffect(() => {
    if (!imgPopSrc) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setImgPopSrc(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [imgPopSrc]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDrawer(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 复制成功状态
  const [copyRichTextSuccess, setCopyRichTextSuccess] = useState(false);
  const [copyTitleSuccess, setCopyTitleSuccess] = useState(false);
  const [copySubtitleSuccess, setCopySubtitleSuccess] = useState(false);
  const [copyHTMLSuccess, setCopyHTMLSuccess] = useState(false);
  // 复制中状态:网络文章的复制要先经 postMessage 中继向 iframe 要渲染 DOM(源页未就绪时挂起,
  // 最长 15s),这段等待里按钮转加载态,且两个复制按钮互斥——双击会发出两个中继请求
  const [copying, setCopying] = useState<'rich' | 'html' | null>(null);
  // 发送至 expub-wechat-plugin 中状态（postMessage 本身瞬时，网络文章取 HTML 要等 iframe 中继）
  const [sendToExPubWeChatPlugin, setSendToExPubWeChatPlugin] = useState(false);
  // 插件探测三态：probing（灰+转圈）/ ok（正常发送按钮）/ missing（未检测到，点击出安装说明）
  const [pluginProbe, setPluginProbe] = useState<'probing' | 'ok' | 'missing'>('probing');
  const [showPluginInstallDialog, setShowPluginInstallDialog] = useState(false);

  // 探测：hello 协议（插件回 hello-ack 带 protocolVersion/extVersion，零副作用）；
  // 无回执回落旧口（空 payload 的 inject——旧版插件回 ack(false,'payload 缺少 html')）。
  // 任何回执 = 已装；超时 = 未装，3 秒 CD 后重探。
  // 探测与文章类型无关（任何文章都可发送至插件），不随文章切换重跑。
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const probeOnce = (type: 'expubgo-plugin-hello' | 'expubgo-plugin-inject') =>
      new Promise<boolean>((resolve) => {
        const reqId = `expub-plugin-probe-${Date.now()}-${type}`;
        const ackType = type === 'expubgo-plugin-hello' ? 'expubgo-plugin-hello-ack' : 'expubgo-plugin-inject-ack';
        const onMsg = (e: MessageEvent) => {
          const data = e.data as Record<string, unknown> | null;
          if (!data || data.type !== ackType || data.reqId !== reqId) return;
          cleanup();
          resolve(true);
        };
        const cleanup = () => {
          clearTimeout(timer);
          window.removeEventListener('message', onMsg);
        };
        timer = setTimeout(() => { cleanup(); resolve(false); }, 1500);
        window.addEventListener('message', onMsg);
        window.postMessage(
          type === 'expubgo-plugin-hello'
            ? { type, reqId }
            : { type, reqId, payload: {} },
          window.location.origin,
        );
      });
    const probe = async () => {
      const ok = (await probeOnce('expubgo-plugin-hello')) || (await probeOnce('expubgo-plugin-inject'));
      if (cancelled) return;
      if (ok) {
        setPluginProbe('ok');
      } else {
        setPluginProbe('missing');
        timer = setTimeout(() => { if (!cancelled) probe(); }, 3000); // 3 秒 CD 重探
      }
    };
    probe();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, []);

  // 网络文章(fkg 等内容源)的渲染 DOM 在跨域 iframe 里,父页只能抓到 iframe 标签——
  // 向 iframe 里的源页请求渲染好的文章 DOM(协议:expub-article-get-html → expub-article-html,
  // reqId 对应;源页加载未完成时挂起,完成后再回,所以这里给足超时)。
  const requestIframeArticleHtml = (): Promise<string | null> => {
    return new Promise((resolve) => {
      const iframe = previewContentRef.current?.querySelector('iframe');
      if (!iframe?.contentWindow) { resolve(null); return; }
      const reqId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const onMsg = (e: MessageEvent) => {
        const data = e.data as Record<string, unknown> | null;
        if (!data || data.type !== 'expub-article-html' || data.reqId !== reqId) return;
        clearTimeout(timer);
        window.removeEventListener('message', onMsg);
        resolve(typeof data.html === 'string' ? data.html : null);
      };
      const timer = setTimeout(() => {
        window.removeEventListener('message', onMsg);
        resolve(null);
      }, 15000);
      window.addEventListener('message', onMsg);
      iframe.contentWindow.postMessage({ type: 'expub-article-get-html', reqId }, '*');
    });
  };

  // 复制富文本到剪贴板
  const handleCopyRichText = async () => {
    if (copying) return;
    setCopying('rich');
    try {
      // 网络文章先向源页要渲染 DOM;要不到回落本地预览容器
      const networkHtml = article?._network ? await requestIframeArticleHtml() : null;
      const sourceEl: HTMLElement | null = networkHtml
        ? Object.assign(document.createElement('div'), { innerHTML: networkHtml })
        : previewContentRef.current;
      if (!sourceEl) {
        return;
      }

      // useDevXRay 绑定只经 React ref（非 DOM 属性）+ 通道活值回流，预览 DOM 即文章原样
      // ——复制零过滤（预览页纯度原则：唯一合法变换 = 无变换）
      const htmlContent = sourceEl.innerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const plainText = sourceEl.textContent || '';

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blob,
          'text/plain': new Blob([plainText], { type: 'text/plain' })
        })
      ]);

      setCopyRichTextSuccess(true);
      setTimeout(() => setCopyRichTextSuccess(false), 1000);
    } catch (error) {
      console.error('复制失败:', error);
    } finally {
      setCopying(null);
    }
  };

  // 复制HTML文字到剪贴板
  const handleCopyHTML = async () => {
    if (copying) return;
    setCopying('html');
    try {
      // 网络文章先向源页要渲染 DOM(理由同上,富文本复制处)
      const networkHtml = article?._network ? await requestIframeArticleHtml() : null;
      const rawHtml = networkHtml ?? previewContentRef.current?.innerHTML;
      if (!rawHtml) {
        return;
      }

      const htmlContent = rawHtml
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/\s+\/>/g, '/>')
        .trim();

      await navigator.clipboard.writeText(htmlContent);

      setCopyHTMLSuccess(true);
      setTimeout(() => setCopyHTMLSuccess(false), 1000);
    } catch (error) {
      console.error('复制失败:', error);
    } finally {
      setCopying(null);
    }
  };

  return (<>
      {/* 图片弹出模拟查看器（仿微信：全屏、图片居中、点击/Esc 关闭）——经 Portal 挂 body 防外层 transform 劫持。
          底部工具条：底色（黑半透/白半透/纯黑/纯白/中性灰）× 大小（100%/缩放合适），检验图片在不同底上的观感 */}
      {imgPopSrc && createPortal(
        <div
          onClick={() => setImgPopSrc(null)}
          className={`fixed inset-0 z-[10000] flex flex-col cursor-zoom-out transition-colors ${
            imgPopBg === 'black-trans' ? 'bg-black/90' :
            imgPopBg === 'white-trans' ? 'bg-white/90' :
            imgPopBg === 'black' ? 'bg-black' :
            imgPopBg === 'white' ? 'bg-white' : 'bg-neutral-500'
          }`}
          role="dialog"
          aria-label="图片查看器（点击关闭）"
        >
          {/* 图片区:flex-1 吃掉工具条以外的高度——100% 模式在此区内撑满,先扣 bar 再满;
              四周留 16px 呼吸边,不顶着全屏边沿 */}
          <div className="flex-1 min-h-0 flex items-center justify-center p-4">
            <img
              src={imgPopSrc}
              alt=""
              className={`select-none transition-all ${
                imgPopFit === 'full'
                  ? 'w-full h-full object-contain'
                  : 'max-h-full max-w-full object-contain'
              }`}
              draggable={false}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {/* 底部工具条:流内占位(原 absolute 悬浮会压住图片底部),底色（文字钮）+ 大小（点击不冒泡关闭）——统一文字按钮，选中态高亮反色 */}
          <div
            className="mb-6 self-center flex items-center gap-1 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {([
              ['black-trans', '黑半透'],
              ['white-trans', '白半透'],
              ['black', '纯黑'],
              ['white', '纯白'],
              ['gray', '中性灰'],
            ] as const).map(([key, name]) => (
              <button
                key={key}
                type="button"
                onClick={() => setImgPopBg(key)}
                className={`rounded-full px-2.5 py-2 text-xs leading-none transition-colors ${
                  imgPopBg === key ? 'bg-white text-black font-medium' : 'text-white/80 hover:bg-white/15'
                }`}
              >
                {name}
              </button>
            ))}
            <div className="h-5 w-px bg-white/25 mx-1" />
            {([['full', '100%'], ['fit', '合适大小']] as const).map(([key, name]) => (
              <button
                key={key}
                type="button"
                onClick={() => setImgPopFit(key)}
                className={`rounded-full px-2.5 py-2 text-xs leading-none transition-colors ${
                  imgPopFit === key ? 'bg-white text-black font-medium' : 'text-white/80 hover:bg-white/15'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}

    <div className="min-h-0 flex flex-col">
    {/* // 最外层的p-0不允许做任何修改 */}
    {/* <div className="h-full flex flex-col pt-0 pr-1 overflow-y-auto"> */}
      {/* 整个 ActionPanel 作为一张完整的卡片， pt-0不允许修改 */}
      {/* <Card className="bg-card pt-0 rounded-lg"> */}
        {/* Header 设计 */}
        <div className={`flex-shrink-0 border-b bg-slate-300 relative ${isMobileDrawer ? 'rounded-t-none' : 'rounded-t-lg'}`}>
          <div className="flex items-center justify-center py-3">
            <img
              src={faviconSvg}
              alt="ExPubGo"
              className="w-5 h-5"
            />
            <h2 className="text-sm font-medium text-foreground ml-2">预览选项</h2>
          </div>

          {/* 移动端关闭按钮 */}
          <button
            type="button"
            onClick={() => setMobileActionPanel(false)}
            className="lg:hidden absolute top-1/2 -translate-y-1/2 right-3 p-1.5 rounded-md hover:bg-white/20 transition-all duration-200"
            aria-label="关闭"
          >
            <X className="w-5 h-5 text-foreground/70 hover:text-foreground" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 min-h-0 overflow-y-auto pt-4 pb-2">
          <div className="space-y-6">
          {/* 预览设置区域 */}
          <section className="space-y-4">
            {/* 内容宽度控制  border-b px-6 pb-4 不允许修改*/}
              <div className="space-y-4 border-b px-6 pb-4">
                <SectionHead title="内容宽度" value={previewWidth} collapsed={panelSectionCollapsed.width !== false} onToggle={() => togglePanelSection('width')} />
                {panelSectionCollapsed.width === false && (<>
                  <Slider
                    value={[previewWidth]}
                    onValueChange={(value: number[]) => setPreviewWidth(value[0])}
                    min={ARTICLE_VIEWER_LAYOUT.PREVIEW_MIN_WIDTH}
                    max={previewMaxAvailableWidth}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground" style={{ fontFamily: 'var(--guohub-code-font-family)' }}>
                    <span>{ARTICLE_VIEWER_LAYOUT.PREVIEW_MIN_WIDTH}</span>
                    <span>{previewMaxAvailableWidth}</span>
                  </div>
                </>)}
              </div>

              {/* 内边距控制 border-b px-6 pb-4 不允许修改 */}
              <div className="space-y-4 border-b px-6 pb-4">
                <SectionHead title="内边距" value={previewPadding} collapsed={panelSectionCollapsed.padding !== false} onToggle={() => togglePanelSection('padding')} />
                {panelSectionCollapsed.padding === false && (<>
                  <Slider
                    value={[previewPadding]}
                    onValueChange={(value: number[]) => setPreviewPadding(value[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground" style={{ fontFamily: 'var(--guohub-code-font-family)' }}>
                    <span>0</span>
                    <span>100</span>
                  </div>
                </>)}
              </div>

              {/* 画布颜色 */}
              <div className="space-y-4 border-b px-6 pb-4">
                <SectionHead title="画布颜色" value={previewBackgroundColor.toUpperCase()} collapsed={panelSectionCollapsed.canvas !== false} onToggle={() => togglePanelSection('canvas')} />

                {/* 预设颜色选项（折叠时隐藏） */}
                {panelSectionCollapsed.canvas === false && (
                <div className="grid grid-cols-6 gap-2">
                  {CANVAS_PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setPreviewBackgroundColor(color.value)}
                      className={`relative aspect-square w-full rounded-md border-2 transition-all duration-200 hover:scale-105 cursor-pointer
                        after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2
                        after:w-3/4 after:h-1 after:bg-primary after:rounded-full after:transition-opacity after:duration-200
                        ${previewBackgroundColor === color.value ? 'after:opacity-100' : 'after:opacity-0'}`}
                      style={{
                        backgroundColor: color.display,
                        borderColor: 'rgb(226, 232, 240)',
                      }}
                      title={color.label}
                    >
                      {/* 透明背景的棋盘格 */}
                      {color.value === 'transparent' && (
                        <div
                          className="absolute inset-0 rounded-sm"
                          style={{
                            backgroundImage: `
                              linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                              linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                              linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                              linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
                            `,
                            backgroundSize: '16px 16px',
                            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                          }}
                        />
                      )}
                    </button>
                  ))}

                  {/* 自定义颜色取色器 - 简洁设计 */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={`relative aspect-square w-full rounded-md border-2 border-dashed transition-all duration-200 hover:scale-105 cursor-pointer overflow-hidden
                          after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2
                          after:w-3/4 after:h-1 after:bg-primary after:rounded-full after:transition-opacity after:duration-200
                          ${!CANVAS_PRESET_COLORS.some(c => c.value === previewBackgroundColor) ? 'after:opacity-100 border-primary/60' : 'after:opacity-0 border-muted-foreground/40 hover:border-primary/60'}`}
                        style={{
                          backgroundColor: !CANVAS_PRESET_COLORS.some(c => c.value === previewBackgroundColor)
                            ? previewBackgroundColor
                            : 'transparent',
                        }}
                        title="自定义颜色"
                      >
                        {/* 如果未选自定义颜色，显示4色块网格 */}
                        {CANVAS_PRESET_COLORS.some(c => c.value === previewBackgroundColor) && (
                          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-1.5 gap-1">
                            <div className="rounded-sm" style={{ backgroundColor: '#ef4444' }} />
                            <div className="rounded-sm" style={{ backgroundColor: '#22c55e' }} />
                            <div className="rounded-sm" style={{ backgroundColor: '#3b82f6' }} />
                            <div className="rounded-sm" style={{ backgroundColor: '#f59e0b' }} />
                          </div>
                        )}

                        {/* 如果已选自定义颜色，显示圆圈图标 */}
                        {!CANVAS_PRESET_COLORS.some(c => c.value === previewBackgroundColor) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="w-2 h-2 rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                              style={{
                                backgroundColor: isLightColor(previewBackgroundColor) ? '#000000' : '#ffffff'
                              }}
                            />
                          </div>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-6" align="center" sideOffset={10}>
                      <div className="flex flex-col items-center space-y-3">
                        {/* react-colorful 颜色选择器 - 居中 */}
                        <HexColorPicker
                          color={previewBackgroundColor === 'transparent' ? '#ffffff' : previewBackgroundColor}
                          onChange={(color) => setPreviewBackgroundColor(color.toUpperCase())}
                          style={{ width: '240px', height: '180px' }}
                        />
                        {/* 颜色值输入框 - 与选择器同宽对齐 */}
                        <div className="flex items-center gap-2" style={{ width: '240px' }}>
                          <div
                            className="w-10 h-10 rounded border-2 border-border flex-shrink-0"
                            style={{ backgroundColor: previewBackgroundColor }}
                          />
                          <Input
                            type="text"
                            value={previewBackgroundColor.toUpperCase()}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreviewBackgroundColor(e.target.value.toUpperCase())}
                            className="font-mono text-sm flex-1"
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                )}
              </div>

              {/* 边框颜色 */}
              <div className="space-y-4 border-b px-6 pb-4">
                <SectionHead title="边框颜色" value={previewBorderColor.toUpperCase()} collapsed={panelSectionCollapsed.border !== false} onToggle={() => togglePanelSection('border')} />

                {/* 预设颜色选项（折叠时隐藏） */}
                {panelSectionCollapsed.border === false && (
                <div className="grid grid-cols-6 gap-2">
                  {BORDER_PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setPreviewBorderColor(color.value)}
                      className={`relative aspect-square w-full rounded-md border-2 transition-all duration-200 hover:scale-105 cursor-pointer
                        after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2
                        after:w-3/4 after:h-1 after:bg-primary after:rounded-full after:transition-opacity after:duration-200
                        ${previewBorderColor === color.value ? 'after:opacity-100' : 'after:opacity-0'}`}
                      style={{
                        backgroundColor: color.display,
                        borderColor: 'rgb(226, 232, 240)',
                      }}
                      title={color.label}
                    >
                      {/* 透明背景的棋盘格 */}
                      {color.value === 'transparent' && (
                        <div
                          className="absolute inset-0 rounded-sm"
                          style={{
                            backgroundImage: `
                              linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                              linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                              linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                              linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
                            `,
                            backgroundSize: '16px 16px',
                            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                          }}
                        />
                      )}
                    </button>
                  ))}

                  {/* 自定义颜色取色器 */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={`relative aspect-square w-full rounded-md border-2 border-dashed transition-all duration-200 hover:scale-105 cursor-pointer overflow-hidden
                          after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2
                          after:w-3/4 after:h-1 after:bg-primary after:rounded-full after:transition-opacity after:duration-200
                          ${!BORDER_PRESET_COLORS.some(c => c.value === previewBorderColor) ? 'after:opacity-100 border-primary/60' : 'after:opacity-0 border-muted-foreground/40 hover:border-primary/60'}`}
                        style={{
                          backgroundColor: !BORDER_PRESET_COLORS.some(c => c.value === previewBorderColor)
                            ? previewBorderColor
                            : 'transparent',
                        }}
                        title="自定义颜色"
                      >
                        {/* 如果未选自定义颜色，显示4色块网格 */}
                        {BORDER_PRESET_COLORS.some(c => c.value === previewBorderColor) && (
                          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-1.5 gap-1">
                            <div className="rounded-sm" style={{ backgroundColor: '#ef4444' }} />
                            <div className="rounded-sm" style={{ backgroundColor: '#22c55e' }} />
                            <div className="rounded-sm" style={{ backgroundColor: '#3b82f6' }} />
                            <div className="rounded-sm" style={{ backgroundColor: '#f59e0b' }} />
                          </div>
                        )}

                        {/* 如果已选自定义颜色，显示圆圈图标 */}
                        {!BORDER_PRESET_COLORS.some(c => c.value === previewBorderColor) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="w-2 h-2 rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                              style={{
                                backgroundColor: isLightColor(previewBorderColor) ? '#000000' : '#ffffff'
                              }}
                            />
                          </div>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-6" align="center" sideOffset={10}>
                      <div className="flex flex-col items-center space-y-3">
                        {/* react-colorful 颜色选择器 - 居中 */}
                        <HexColorPicker
                          color={previewBorderColor === 'transparent' ? '#ffffff' : previewBorderColor}
                          onChange={(color) => setPreviewBorderColor(color.toUpperCase())}
                          style={{ width: '240px', height: '180px' }}
                        />
                        {/* 颜色值输入框 - 与选择器同宽对齐 */}
                        <div className="flex items-center gap-2" style={{ width: '240px' }}>
                          <div
                            className="w-10 h-10 rounded border-2 border-border flex-shrink-0"
                            style={{ backgroundColor: previewBorderColor }}
                          />
                          <Input
                            type="text"
                            value={previewBorderColor.toUpperCase()}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreviewBorderColor(e.target.value.toUpperCase())}
                            className="font-mono text-sm flex-1"
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                )}
              </div>
              {/* 图片弹出模拟（任意文章可用）：模拟微信「点 <img> 弹查看器」行为
                  （svg 背景图天然不弹），用于本地验证防误弹/强弹出策略 */}
              <div className="space-y-4 border-b px-6 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="svg-img-pop-sim" className="text-xs text-muted-foreground cursor-pointer">
                    {imgPopSim ? '已开启图片弹出模拟' : '未开启图片弹出功能'}
                    <span className="block text-[11px] text-muted-foreground/70">
                      {imgPopSim ? '点击图片将模拟微信弹出' : '点击图片将不模拟微信弹出'}
                    </span>
                  </Label>
                  <Switch
                    id="svg-img-pop-sim"
                    checked={imgPopSim}
                    onCheckedChange={(v) => setImgPopSim(v)}
                  />
                </div>
              </div>
              {/* SVG 交互文章专属功能区（isSvgArticle=true 才显示） */}
              {isSvgArticle && (
              <div className="space-y-4 border-b px-6 pb-4">
                <div className="flex items-center">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Shapes className="size-4 text-primary" />
                    SVG 专属配置
                  </Label>
                </div>
                {/* 鼠标事件桥：微信里交互走 touch 事件，桌面鼠标点不动；桥接后可在桌面预览触发 */}
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="svg-mouse-bridge" className="text-xs text-muted-foreground cursor-pointer">
                    {svgMouseBridge ? '已开启移动端点击模拟' : '移动端触摸模拟关闭'}
                    <span className="block text-[11px] text-muted-foreground/70">
                      {svgMouseBridge ? '点击事件为 touch 触发' : '点击事件作为 click 触发'}
                    </span>
                  </Label>
                  <Switch
                    id="svg-mouse-bridge"
                    checked={svgMouseBridge}
                    onCheckedChange={(v) => setSvgMouseBridge(v)}
                  />
                </div>
                {/* 冻结时间开关：开后才显示定格检查控件 */}
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="svg-time-freeze" className="text-xs text-muted-foreground cursor-pointer">
                    {svgTimeFreeze ? '已开启冻结时间检查' : '未开启冻结时间功能'}
                    <span className="block text-[11px] text-muted-foreground/70">
                      {svgTimeFreeze ? '可定格在点击后第 X 秒检查画面' : '作品将正常播放'}
                    </span>
                  </Label>
                  <Switch
                    id="svg-time-freeze"
                    checked={svgTimeFreeze}
                    onCheckedChange={(v) => setSvgTimeFreeze(v)}
                  />
                </div>
                {svgTimeFreeze && (
                <div className="flex items-center gap-2">
                  {/* shadcn 风格 NumberField（Base UI 原语封装） */}
                  <NumberField
                    value={freezeSec}
                    onValueChange={(val) => setFreezeSec(Math.max(0, Number(val ?? 0)))}
                    min={0}
                    step={0.5}
                    className="w-20"
                  >
                    <NumberFieldGroup>
                      <NumberFieldInput aria-label="冻结秒数" />
                      <NumberFieldIncrement />
                      <NumberFieldDecrement />
                    </NumberFieldGroup>
                  </NumberField>
                  <span className="text-sm text-muted-foreground shrink-0">秒</span>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      const root = previewContentRef.current;
                      if (!root) return;
                      const target = (svgT0Ref.current ?? 0) + freezeSec;
                      root.querySelectorAll('svg').forEach((s) => {
                        const svg = s as SVGSVGElement;
                        try { svg.setCurrentTime(target); svg.pauseAnimations(); } catch { /* 无时间线 svg 忽略 */ }
                      });
                      toast.success(`已冻结在第 ${freezeSec} 秒`);
                    }}
                  >
                    <Pause className="size-4" />
                    冻结
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const root = previewContentRef.current;
                      if (!root) return;
                      root.querySelectorAll('svg').forEach((s) => {
                        try { (s as SVGSVGElement).unpauseAnimations(); } catch { /* 忽略 */ }
                      });
                    }}
                    aria-label="继续播放"
                  >
                    <Play className="size-4" />
                  </Button>
                </div>
                )}
              </div>
              )}

              {/* XRay 透视拖拽（独立功能区，与 SVG 专属配置平级）：head 右侧即开关；
                  开启后其操作面板（列表/精调/还原/复制）经 Portal 注入下方占位 div，随本栏滚动。
                  区块不加 pb：颜色折叠区自带底部间距；空状态红字的 pb 在 XRayLayoutLayer 内自带 */}
              {isSvgArticle && (
              <div className="space-y-4 border-b px-6">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Scan className="size-4 text-primary" />
                    XRay 透视模式
                  </Label>
                  <div className="flex items-center gap-1.5">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          aria-label="XRay 透视模式使用说明"
                          title="这是什么功能？"
                          className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                          <HelpCircle className="size-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>XRay 透视模式</DialogTitle>
                          <DialogDescription>
                            在预览区给文章里的 SVG 元素套上可拖拽的虚线框，点选、拖动、数值精调完成排版。所有编辑只作用于预览，复制出的文章保持原样。
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 text-sm">
                          <div>
                            <div className="mb-1.5 text-xs font-semibold text-muted-foreground">文章接入（useDevXRay）</div>
                            <ul className="space-y-1.5 leading-relaxed">
                              <li>
                                在文章渲染体组件内调用 <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'const { xRayProperties, ref } = useDevXRay(数据条目)'}</code>——数据条目传引用（字面量先提成常量，保证单一数据源）。
                              </li>
                              <li>
                                把 <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">xRayProperties</code> 展开写进目标元素的 style，<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ref</code> 挂到同一元素（g/rect/image/text…）——该元素即被登记为可调图层。
                              </li>
                              <li>
                                开启本模式后：画布上出现该元素的虚线框，面板出现它的图层与属性。所有编辑只作用于预览排版，复制出的文章保持原样。
                              </li>
                            </ul>
                          </div>
                          <div className="border-t pt-3">
                            <div className="mb-2 text-xs font-semibold text-muted-foreground">操作方式</div>
                            <div className="space-y-2.5">
                              {([
                                {
                                  tag: '画布',
                                  lines: [
                                    <>开启后预览区出现虚线框（右上角名称徽章），点框选中、按住拖动；<kbd className={KBD}>方向键</kbd> ±1、<kbd className={KBD}>Shift</kbd> + <kbd className={KBD}>方向键</kbd> ±10 微调。</>,
                                  ],
                                },
                                {
                                  tag: '面板',
                                  lines: [
                                    <>下拉或 <kbd className={KBD}>‹</kbd> <kbd className={KBD}>›</kbd> 步进选择元素，自动滚动定位到画面。</>,
                                    <>X / Y / Scale / Rotation 数值精调；锁定后该项不再响应拖拽。</>,
                                    <>缩放不动点与旋转支点可分别指定：九宫格锚点，或输入元素本地坐标（viewBox 单位）自定义，默认 center。</>,
                                    <>缓动曲线卡两态：预设态选缓动族与进入/退出缓动，自由态直接调 <kbd className={KBD}>x1/y1/x2/y2</kbd> 四数；<kbd className={KBD}>⇄</kbd> 一键互转。</>,
                                  ],
                                },
                                {
                                  tag: '数据',
                                  lines: [
                                    <>「还原」回到当前项开启时坐标，「全部」全量还原。</>,
                                    <>「复制」导出 {'{ x, y, scale, rot }'} JSON，不直接修改文章，粘贴给其他大模型改代码或调试用。</>,
                                  ],
                                },
                              ] as const).map(g => (
                                <div key={g.tag} className="flex gap-2.5">
                                  <span className="mt-px h-fit shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground select-none">{g.tag}</span>
                                  <ul className="min-w-0 flex-1 space-y-1 leading-relaxed">
                                    {g.lines.map((line, i) => <li key={i}>{line}</li>)}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">知道了</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Switch
                      id="svg-xray"
                      aria-label="XRay 透视模式开关"
                      checked={svgXRay}
                      onCheckedChange={(v) => setSvgXRay(v)}
                    />
                  </div>
                </div>
                {/* 位置框 / 选中颜色（XRay 区最前，可折叠同预览选项风格；仅影响 dev 框线，不进产物）。
                    空状态（无绑定元素）整体隐藏——只剩注入面板的红字提示 */}
                {hasXrayEntries && (<>
                <XRayColorSection
                  title="位置框颜色"
                  collapsed={panelSectionCollapsed.xrayFrame !== false}
                  onToggle={() => togglePanelSection('xrayFrame')}
                  color={xrayFrameColor}
                  onChange={setXrayFrameColor}
                />
                <XRayColorSection
                  title="选中边框颜色"
                  collapsed={panelSectionCollapsed.xraySel !== false}
                  onToggle={() => togglePanelSection('xraySel')}
                  color={xraySelectedColor}
                  onChange={setXraySelectedColor}
                />
                <XRayColorSection
                  title="选中内容颜色"
                  collapsed={panelSectionCollapsed.xrayFill !== false}
                  onToggle={() => togglePanelSection('xrayFill')}
                  color={xrayFillColor}
                  onChange={setXrayFillColor}
                  opacity={xrayFillOpacity}
                  onOpacityChange={setXrayFillOpacity}
                />
                </>)}
                {/* XRay 面板宿主：XRayLayoutLayer 检测到标记元素后把操作面板注入这里 */}
                <div ref={el => { xrayPanelHost.current = el }} />
              </div>
              )}
            </section>

            {/* 功能按钮区——ButtonTable 表格化：行间横线、格间竖线；占满面板宽度贴底。
                （-mt-6 抵消上区块 24px 底距贴上；-mb-2 贴底。表自身不画 border-b——
                贴底后由 Card 外框自带的底边框收尾，天然跟随圆角，宽窄屏一致） */}
            <section className="p-0 -mt-6 -mb-2">
              <ButtonTable className="rounded-none border-0 border-b lg:border-b-0">
              {/* 第一行：刷新预览 + 刷新页面 */}
              <ButtonTableRow>
                <ButtonGroupItem
                  className="h-11"
                  onClick={() => {
                    // nonce+1 令文章容器按 React key 正规重挂载：全新 DOM，SVG/SMIL/HTML 状态全部归零。
                    // 先存当前阅读位(PreviewArea 等内容长回后跳回)——重挂载瞬间高度塌陷会把滚动钳到顶;
                    // 原 scrollIntoView 顶到预览区头就是丢位置的元凶,撤掉
                    setPreviewScrollRestore(window.scrollY);
                    refreshPreview();
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="text-sm font-medium">刷新预览</span>
                </ButtonGroupItem>
                <ButtonGroupItem
                  className="h-11"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-sm font-medium">刷新页面</span>
                </ButtonGroupItem>
              </ButtonTableRow>

              {/* 第二行：复制标题 + 复制副标题 */}
              <ButtonTableRow>
                {/* 复制标题：粘贴到微信编辑器的文章标题栏 */}
                <ButtonGroupItem
                  className="h-11"
                  onClick={async () => {
                      if (!article?.title) return;
                      try {
                        await navigator.clipboard.writeText(article.title);
                        setCopyTitleSuccess(true);
                        setTimeout(() => setCopyTitleSuccess(false), 1000);
                      } catch (error) {
                        console.error('复制失败:', error);
                      }
                    }}
                  >
                    {copyTitleSuccess ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span className="text-sm font-medium">已复制</span>
                      </>
                    ) : (
                      <>
                        <Type className="h-4 w-4" />
                        <span className="text-sm font-medium">复制标题</span>
                      </>
                    )}
                  </ButtonGroupItem>

                {/* 复制副标题：粘贴到微信编辑器的摘要栏（文章 meta.subtitle，缺副标题时禁用） */}
                <ButtonGroupItem
                  className="h-11"
                  disabled={!article?.subtitle}
                  onClick={async () => {
                    if (!article?.subtitle) return;
                    try {
                      await navigator.clipboard.writeText(article.subtitle);
                      setCopySubtitleSuccess(true);
                      setTimeout(() => setCopySubtitleSuccess(false), 1000);
                    } catch (error) {
                      console.error('复制失败:', error);
                    }
                  }}
                >
                  {copySubtitleSuccess ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span className="text-sm font-medium">已复制</span>
                    </>
                  ) : (
                    <>
                      <Text className="h-4 w-4" />
                      <span className="text-sm font-medium">复制副标题</span>
                    </>
                  )}
                </ButtonGroupItem>
              </ButtonTableRow>

              {/* 发送至插件：经 window.postMessage 交给 expub-wechat-plugin 扩展的 content script
                  （其监听后写 chrome.storage.pendingInject，微信编辑器侧「一键导入」消费）。
                  三态：探测中（灰+转圈）/ 未检测到（点击出安装说明）/ 正常发送 */}
              <ButtonTableRow>
                <ButtonGroupItem
                  className="h-11"
                  disabled={sendToExPubWeChatPlugin || pluginProbe === 'probing'}
                  onClick={async () => {
                    if (pluginProbe === 'missing') { setShowPluginInstallDialog(true); return; }
                    if (pluginProbe !== 'ok' || sendToExPubWeChatPlugin) return;
                    setSendToExPubWeChatPlugin(true);
                    try {
                      // 正文 HTML 与「复制富文本」同源：网络文章走 iframe 中继，本地走预览容器
                      const networkHtml = article?._network ? await requestIframeArticleHtml() : null;
                      const html = networkHtml ?? previewContentRef.current?.innerHTML;
                      if (!html) {
                        toast.error('未取得正文 HTML（预览未就绪？）');
                        return;
                      }
                      const reqId = `expub-plugin-${Date.now()}`;
                      // 等 content script 回执：确认扩展收到并写入 storage。
                      // 超时 = 扩展未安装/未注入；ok:false = 旧实例失联（重载扩展后需刷新页面）
                      const ack = await new Promise<{ ok: boolean; error?: string } | null>((resolve) => {
                        const onMsg = (e: MessageEvent) => {
                          const data = e.data as Record<string, unknown> | null;
                          if (!data || data.type !== 'expubgo-plugin-inject-ack' || data.reqId !== reqId) return;
                          clearTimeout(timer);
                          window.removeEventListener('message', onMsg);
                          resolve({ ok: data.ok === true, error: typeof data.error === 'string' ? data.error : void 0 });
                        };
                        const timer = setTimeout(() => {
                          window.removeEventListener('message', onMsg);
                          resolve(null);
                        }, 2000);
                        window.addEventListener('message', onMsg);
                        window.postMessage(
                          {
                            type: 'expubgo-plugin-inject',
                            reqId,
                            payload: {
                              title: article?.title ?? '',
                              subtitle: article?.subtitle ?? '',
                              html,
                              articleId: article?.id ?? '',
                              source: 'expubgo',
                              timestamp: Date.now(),
                            },
                          },
                          window.location.origin,
                        );
                      });
                      if (ack === null) {
                        toast.error('插件未响应：请确认扩展已启用');
                      } else if (!ack.ok) {
                        toast.error(`插件接收失败：${ack.error ?? '未知错误'}`);
                      } else {
                        toast.success('已发送至插件');
                      }
                    } catch (error) {
                      console.error('发送至插件失败:', error);
                      toast.error(`发送失败：${(error as Error).message}`);
                    } finally {
                      setSendToExPubWeChatPlugin(false);
                    }
                  }}
                >
                  {pluginProbe === 'probing' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">检测插件中…</span>
                    </>
                  ) : pluginProbe === 'missing' ? (
                    <>
                      <PlugZap className="h-4 w-4" />
                      <span className="text-sm font-medium">未检测到ExPubGo微信助手插件</span>
                    </>
                  ) : sendToExPubWeChatPlugin ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">发送中…</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span className="text-sm font-medium">发送至ExPubGo微信助手插件</span>
                    </>
                  )}
                </ButtonGroupItem>
              </ButtonTableRow>

              {/* 第三行：复制富文本 + 复制HTML源码——竖排大格：icon 在上、文字在下可换行 */}
              <ButtonTableRow>
                <ButtonGroupItem
                  className="h-[76px] flex-col gap-1 px-2 whitespace-normal"
                  onClick={handleCopyRichText}
                  disabled={isNotNil(copying)}
                >
                  {copying === 'rich' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm font-medium">复制中…</span>
                    </>
                  ) : copyRichTextSuccess ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span className="text-sm font-medium">复制成功</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      <span className="text-sm font-medium">复制富文本</span>
                    </>
                  )}
                </ButtonGroupItem>

                <ButtonGroupItem
                  className="h-[76px] flex-col gap-1 px-2 whitespace-normal"
                  onClick={handleCopyHTML}
                  disabled={isNotNil(copying)}
                >
                  {copying === 'html' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm font-medium">复制中…</span>
                    </>
                  ) : copyHTMLSuccess ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span className="text-sm font-medium">复制成功</span>
                    </>
                  ) : (
                    <>
                      <FileCode className="h-5 w-5" />
                      <span className="text-sm font-medium">复制HTML源码</span>
                    </>
                  )}
                </ButtonGroupItem>
              </ButtonTableRow>
              </ButtonTable>
            </section>

            {/* 插件安装说明——探测未通过时点击按钮弹出 */}
            <Dialog open={showPluginInstallDialog} onOpenChange={setShowPluginInstallDialog}>
              <DialogContent aria-describedby={undefined} className="max-w-md">
                <DialogHeader>
                  <DialogTitle>安装 ExPubGo微信助手插件</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p>方式一 · Edge 扩展商店：打开 Edge 的「扩展」页（地址栏输入 edge://extensions），搜索「ExPubGo微信助手」安装。</p>
                  <p>方式二 · GitHub：到插件的 GitHub 仓库下载 ZIP（Code → Download ZIP）并解压；在扩展页打开「开发人员模式」，点「加载解压缩的扩展」，选中解压后的目录。</p>
                  <p>安装后回到本页刷新（F5），按钮将自动变为「发送至ExPubGo微信助手插件」。</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          </div>
      {/*  </Card> */}
    {/*  </div> */}
    </div>
 </> );
}
