/** @jsxImportSource react */
/**
 * 微信封面制作 —— 占位页
 * 规划中：公众号封面图制作（模板/尺寸/导出）。当前仅注册路由与入口卡片，功能待实现。
 */
import WechatCoverIcon from './icon'

const WechatCoverMaker = () => {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-6">
      <WechatCoverIcon className="w-24 h-24" />
      <h1 className="text-2xl font-bold text-foreground">微信封面制作</h1>
      <p className="text-sm text-muted-foreground">功能筹备中，敬请期待</p>
    </section>
  )
}

export default WechatCoverMaker
