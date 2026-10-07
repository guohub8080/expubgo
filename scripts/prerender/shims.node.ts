/**
 * Node 预渲染垫片——必须在所有路由模块导入前求值（ESM 按导入顺序执行模块体，
 * 本文件永远是 entry.server.tsx 的第一条 import）。
 *
 * 路由树依赖链里存在模块作用域/渲染期访问浏览器 API 的代码（UA 嗅探、storage、
 * matchMedia、观察器等），垫片保证「渲染到字符串」在构建机的 Node 里能跑通；
 * 垫片值刻意取「空/未命中」语义，渲染产物里不会出现依赖浏览器的分支内容。
 */

import { isNil } from 'es-toolkit/predicate'
import { defaultTo } from 'es-toolkit/compat'

type AnyFn = (...args: never[]) => unknown
const noop: AnyFn = () => undefined

const createInMemoryStorage = (): Storage => {
    const map = new Map<string, string>()
    return {
        getItem: (key: string) => defaultTo(map.get(key), null),
        setItem: (key: string, value: string) => { map.set(key, value) },
        removeItem: (key: string) => { map.delete(key) },
        clear: () => { map.clear() },
        key: (index: number) => defaultTo([...map.keys()][index], null),
        get length() { return map.size },
    }
}

const createStubElement = (tag: string): HTMLElement => {
    const el: Record<string, unknown> = {
        // React 19 的 createPortal 在 SSR 会校验容器节点（nodeType 1 = ELEMENT_NODE），
        // 缺它直接抛「Target container is not a DOM element」
        nodeType: 1,
        tagName: tag.toUpperCase(),
        style: {},
        dataset: {},
        children: [],
        textContent: '',
        innerHTML: '',
        className: '',
        setAttribute: noop,
        removeAttribute: noop,
        getAttribute: () => null,
        appendChild: (child: unknown) => child,
        removeChild: noop,
        insertBefore: (child: unknown) => child,
        addEventListener: noop,
        removeEventListener: noop,
        dispatchEvent: () => false,
        getContext: () => null,
        getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) }),
        querySelector: () => null,
        querySelectorAll: () => [],
        focus: noop,
        blur: noop,
        click: noop,
        contains: () => false,
    }
    el.ownerDocument = el
    return el as unknown as HTMLElement
}

const g = globalThis as unknown as Record<string, unknown>

// Node 21+ 的 navigator 等全局是 getter-only，直接赋值抛错；
// 可配置则 defineProperty 覆盖，不可配置则保留 Node 自带值（其值本就是合法垫片）
const defineGlobal = (name: string, value: unknown): void => {
    try {
        Object.defineProperty(globalThis, name, { value, configurable: true, writable: true })
    } catch {
        /* 保留原生值 */
    }
}

if (isNil(g.window)) {
    // matchMedia：全部不命中（暗色探测、响应式分支落到默认态）
    const matchMediaStub = (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: noop,
        removeListener: noop,
        addEventListener: noop,
        removeEventListener: noop,
        dispatchEvent: () => false,
    }) as unknown as MediaQueryList
    defineGlobal('matchMedia', defaultTo(g.matchMedia, matchMediaStub))

    class IntersectionObserverStub {
        observe = noop
        unobserve = noop
        disconnect = noop
        takeRecords = () => []
        root = null
        rootMargin = ''
        thresholds = []
    }
    defineGlobal('IntersectionObserver', defaultTo(g.IntersectionObserver, IntersectionObserverStub))

    class ResizeObserverStub {
        observe = noop
        unobserve = noop
        disconnect = noop
    }
    defineGlobal('ResizeObserver', defaultTo(g.ResizeObserver, ResizeObserverStub))

    class MutationObserverStub {
        observe = noop
        disconnect = noop
        takeRecords = () => []
    }
    defineGlobal('MutationObserver', defaultTo(g.MutationObserver, MutationObserverStub))

    const rafStub = (cb: (t: number) => void): number => setTimeout(() => cb(Date.now()), 0) as unknown as number
    defineGlobal('requestAnimationFrame', defaultTo(g.requestAnimationFrame, rafStub))
    defineGlobal('cancelAnimationFrame', defaultTo(g.cancelAnimationFrame, clearTimeout))

    defineGlobal('localStorage', defaultTo(g.localStorage, createInMemoryStorage()))
    defineGlobal('sessionStorage', defaultTo(g.sessionStorage, createInMemoryStorage()))

    const navigatorStub = {
        userAgent: 'expubgo-prerender',
        language: 'zh-CN',
        languages: ['zh-CN', 'zh'],
        platform: 'MacIntel',
        vendor: '',
        clipboard: { writeText: noop, readText: () => Promise.resolve('') },
        onLine: true,
        maxTouchPoints: 0,
    }
    defineGlobal('navigator', defaultTo(g.navigator, navigatorStub))

    const locationStub = {
        href: 'http://prerender.local/',
        origin: 'http://prerender.local',
        protocol: 'http:',
        host: 'prerender.local',
        hostname: 'prerender.local',
        port: '',
        pathname: '/',
        search: '',
        hash: '',
        assign: noop,
        replace: noop,
        reload: noop,
    }
    defineGlobal('location', defaultTo(g.location, locationStub))

    const documentStub = {
        createElement: createStubElement,
        createTextNode: (text: string) => ({ textContent: text }),
        createDocumentFragment: createStubElement.bind(null, '#document-fragment'),
        getElementById: () => null,
        getElementsByClassName: () => [],
        getElementsByTagName: () => [],
        querySelector: () => null,
        querySelectorAll: () => [],
        addEventListener: noop,
        removeEventListener: noop,
        dispatchEvent: () => false,
        body: createStubElement('body'),
        head: createStubElement('head'),
        documentElement: createStubElement('html'),
        title: '',
        cookie: '',
        visibilityState: 'visible',
        hidden: false,
        readyState: 'complete',
        currentScript: null,
        styleSheets: [],
    }
    defineGlobal('document', defaultTo(g.document, documentStub))

    // window === globalThis：裸调用与 window.xxx 访问同源命中同一批垫片
    defineGlobal('window', globalThis)
}
