import SectionEx from "@pub-html/basicEx/SectionEx";
import { genAnimateTranslate } from "@svg-anim/translate";

export const ClickTriggerDemo = () => {
    const maxWidth = 600;
    return (
        <SectionEx className="translate-examples">
            <div style={{ maxWidth, margin: '0 auto' }}>
                <svg width="600" height="150" viewBox="0 0 600 150">
                    {/* 提示文字 */}
                    <text x="20" y="30" fill="#333" fontSize="14" fontWeight="bold">点击圆形触发动画</text>

                    {/* 箭头指示 */}
                    <path d="M 80 60 L 80 80 L 75 75 M 80 80 L 85 75" stroke="#999" strokeWidth="2" fill="none" />

                    {/* 可点击的圆形 */}
                    <circle cx="100" cy="100" r="20" fill="#3498db" style={{ cursor: 'pointer' }}>
                        {genAnimateTranslate({
                            initValue: { x: 0, y: 0 },
                            timeline: [
                                { toValue: { x: 200, y: 0 }, durationSeconds: 2 }
                            ],
                            beginType: 'click',
                            isFreeze: true
                        })}
                    </circle>

                    {/* 提示文字 */}
                    <text x="350" y="105" fill="#666" fontSize="12">← 点击这个圆形</text>
                </svg>
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    使用 beginType: 'click' 实现点击触发动画
                </div>
            </div>
        </SectionEx>
    );
};
