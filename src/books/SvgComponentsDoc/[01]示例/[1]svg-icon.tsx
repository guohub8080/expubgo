/**
 * SVG 图标组件示例
 * 展示如何使用 SVG 图标，并提供效果预览
 */

const articleMeta = {
    title: "SVG 图标组件",
    author: "ExPubGo",
    tag: ["组件", "SVG", "图标"],
}

const SvgIconExample = () => {
    return (
        <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
            <h1>SVG 图标组件示例</h1>

            <section style={{ marginBottom: 30 }}>
                <h2>基础用法</h2>
                <p>直接内联 SVG 代码，设置固定尺寸：</p>

                <div style={{ padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                    <h3>效果预览：</h3>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                        {/* 示例 1: 32x32 尺寸 */}
                        <svg
                            style={{ display: 'inline-block', width: 32, height: 32 }}
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01"></path>
                            <path d="M682.666667 204.8h238.933333a34.133333 34.133333 0 0 1 34.133333 34.133333v648.533334a68.266667 68.266667 0 0 1-68.266666 68.266666h-204.8V204.8z" fill="#FFAA44"></path>
                            <path d="M68.266667 921.6a34.133333 34.133333 0 0 0 34.133333 34.133333h785.066667a68.266667 68.266667 0 0 1-68.266667-68.266666V102.4a34.133333 34.133333 0 0 0-34.133333-34.133333H102.4a34.133333 34.133333 0 0 0-34.133333 34.133333v819.2z" fill="#11AA66"></path>
                            <path d="M238.933333 307.2a34.133333 34.133333 0 0 0 0 68.266667h136.533334a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h409.6a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h204.8a34.133333 34.133333 0 1 0 0-68.266667H238.933333z" fill="#FFFFFF"></path>
                        </svg>

                        {/* 示例 2: 48x48 尺寸 */}
                        <svg
                            style={{ display: 'inline-block', width: 48, height: 48 }}
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01"></path>
                            <path d="M682.666667 204.8h238.933333a34.133333 34.133333 0 0 1 34.133333 34.133333v648.533334a68.266667 68.266667 0 0 1-68.266666 68.266666h-204.8V204.8z" fill="#FFAA44"></path>
                            <path d="M68.266667 921.6a34.133333 34.133333 0 0 0 34.133333 34.133333h785.066667a68.266667 68.266667 0 0 1-68.266667-68.266666V102.4a34.133333 34.133333 0 0 0-34.133333-34.133333H102.4a34.133333 34.133333 0 0 0-34.133333 34.133333v819.2z" fill="#11AA66"></path>
                            <path d="M238.933333 307.2a34.133333 34.133333 0 0 0 0 68.266667h136.533334a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h409.6a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h204.8a34.133333 34.133333 0 1 0 0-68.266667H238.933333z" fill="#FFFFFF"></path>
                        </svg>

                        {/* 示例 3: 64x64 尺寸 */}
                        <svg
                            style={{ display: 'inline-block', width: 64, height: 64 }}
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01"></path>
                            <path d="M682.666667 204.8h238.933333a34.133333 34.133333 0 0 1 34.133333 34.133333v648.533334a68.266667 68.266667 0 0 1-68.266666 68.266666h-204.8V204.8z" fill="#FFAA44"></path>
                            <path d="M68.266667 921.6a34.133333 34.133333 0 0 0 34.133333 34.133333h785.066667a68.266667 68.266667 0 0 1-68.266667-68.266666V102.4a34.133333 34.133333 0 0 0-34.133333-34.133333H102.4a34.133333 34.133333 0 0 0-34.133333 34.133333v819.2z" fill="#11AA66"></path>
                            <path d="M238.933333 307.2a34.133333 34.133333 0 0 0 0 68.266667h136.533334a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h409.6a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h204.8a34.133333 34.133333 0 1 0 0-68.266667H238.933333z" fill="#FFFFFF"></path>
                        </svg>
                    </div>

                    <h3 style={{ marginTop: 20 }}>代码：</h3>
                    <pre style={{
                        backgroundColor: '#2d2d2d',
                        color: '#f8f8f2',
                        padding: 15,
                        borderRadius: 6,
                        overflow: 'auto',
                        fontSize: 14
                    }}>
{`<svg
    style={{ display: 'inline-block', width: 32, height: 32 }}
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
>
    <path d="..." fill="#FFAA44"></path>
    <path d="..." fill="#11AA66"></path>
</svg>`}
                    </pre>
                </div>
            </section>

            <section style={{ marginBottom: 30 }}>
                <h2>关键点说明</h2>
                <ul>
                    <li><strong>viewBox</strong>: 必须设置，定义 SVG 的坐标系统（如 viewBox="0 0 1024 1024"）</li>
                    <li><strong>width/height</strong>: 通过 style 设置，可以灵活控制尺寸</li>
                    <li><strong>display</strong>: 设置为 inline-block 使图标可以与文字同行显示</li>
                    <li><strong>path</strong>: 使用 path 元素绘制图形，fill 属性设置填充颜色</li>
                </ul>
            </section>

            <section>
                <h2>使用场景</h2>
                <ul>
                    <li>导航栏图标</li>
                    <li>按钮图标</li>
                    <li>状态指示器</li>
                    <li>装饰性图标</li>
                </ul>
            </section>
        </div>
    );
};

export default {
    jsx: <SvgIconExample />,
    ...articleMeta
}
