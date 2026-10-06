/**
 * SVG 组件文档 · 占位页
 * 本书将系统文档化 @guohub8080/expub-tool/svg 的全部交互组件，施工中。
 */

const articleMeta = {
    title: "施工中：组件文档规划",
    author: "ExPubGo",
    tag: ["占位", "规划"],
}

const cardStyle = {
    padding: "14px 18px",
    borderRadius: 8,
    backgroundColor: "#f7f8fa",
    marginBottom: 12,
} as const;

const listStyle = {
    margin: "6px 0 0",
    paddingLeft: 20,
    lineHeight: 1.9,
    color: "#555",
    fontSize: 14,
} as const;

const PlaceholderDoc = () => {
    return (
        <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
            <h1>施工中</h1>

            <p style={{ color: "#555", lineHeight: 1.8 }}>
                这本书将系统文档化 <code>@guohub8080/expub-tool/svg</code> 的全部微信交互组件——
                每个组件一页：用法、props 表、可交互预览、微信兼容注意事项。目前还在规划阶段，
                先放一个占位页，规划目录如下。
            </p>

            <section style={{ marginTop: 24 }}>
                <h2>规划目录</h2>

                <div style={cardStyle}>
                    <strong>容器类</strong>
                    <ul style={listStyle}>
                        <li>ZeroHeightContainer（零高容器）/ OverlayContainer（覆盖容器）</li>
                        <li>Container180 / TopPinedFrame / BottomAlignedContainer / CollapsibleBox</li>
                        <li>SwipeViewX/Y · SnapSwipeViewX/Y · LongImgSwipeX（滑动系列）</li>
                    </ul>
                </div>

                <div style={cardStyle}>
                    <strong>元素类</strong>
                    <ul style={listStyle}>
                        <li>SeamlessImg（无缝长图）/ ShutterBlade（百叶窗）/ PlaceHolder</li>
                    </ul>
                </div>

                <div style={cardStyle}>
                    <strong>多图展示类</strong>
                    <ul style={listStyle}>
                        <li>AnyPush / CoverIn / CoverOut</li>
                        <li>CoverFlowX/Y · SpinZoomCarousel · FlashSlideCarousel</li>
                        <li>StackCarousel · SwipePager · MultiPageSwipe</li>
                        <li>AnyCarousel · CubeCarouselX/Y · AnyLoopDisplay</li>
                    </ul>
                </div>

                <div style={cardStyle}>
                    <strong>点击交互类</strong>
                    <ul style={listStyle}>
                        <li>ClickFlipInfinity / ClickFlipOnce（点击翻转）</li>
                        <li>ClickPopup / ClickCascade / ClickZoom / ModalImg</li>
                    </ul>
                </div>
            </section>

            <p style={{ marginTop: 24, color: "#999", fontSize: 13 }}>
                动画函数（transform* / animate* / behaviors）的文档在「SVG工具函数」一书，已完工。
            </p>
        </div>
    );
};

export default {
    jsx: <PlaceholderDoc />,
    ...articleMeta
}
