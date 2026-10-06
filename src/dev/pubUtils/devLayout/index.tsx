/** @jsxImportSource react */
/**
 * devLayout —— XRay 数据通道的宿主薄包装
 *
 * 库体已迁至 @guohub8080/expub-tool/xray（领域词汇表 + 解值纯函数 + 注册表 store +
 * 绑定 hook；词典与 smil/bezier 生成器同树，单一事实源）。本文件只做两件宿主的事：
 * 1. dev 门控：import.meta.env.DEV 是本仓构建期常量，必须在消费方求值后注入库
 *    （库内烤死会把生产值带进 dist）——生产构建下 hook 零播种、ref 为 undefined，产物零痕迹
 * 2. 原地 re-export：@pub-utils/devLayout 的五个引用点（XRayLayoutLayer/ActionPanel/
 *    aieco 两篇测试文章）import 路径零改动
 */
import { setXRayEnabled } from '@guohub8080/expub-tool/xray'

setXRayEnabled(import.meta.env.DEV)

export * from '@guohub8080/expub-tool/xray'
