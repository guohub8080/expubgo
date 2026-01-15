import SectionEx from "@pub-html/basicEx/SectionEx";
import { ReplayButton } from "../ReplayButton";
import { genAnimateTranslate } from "@svg-anim/translate";

export const RectanglePath = () => {
    return (
        <SectionEx className="translate-examples">
            <div style={{ maxWidth: 420, margin: '0 auto' }}>
                <ReplayButton>
                    <svg width="400" height="300" viewBox="0 0 400 300" style={{
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                        padding: '8px'
                    }}>
                        {/* 矩形路径参考线 */}
                        <rect x="125" y="100" width="150" height="100" fill="none" stroke="#ccc" strokeWidth="2" strokeDasharray="5,5" />
                        {/* 路径标注 */}
                        <text x="200" y="90" fontSize="12" fill="#999" textAnchor="middle">上边</text>
                        <text x="290" y="155" fontSize="12" fill="#999" textAnchor="middle">右边</text>
                        <text x="200" y="220" fontSize="12" fill="#999" textAnchor="middle">下边</text>
                        <text x="110" y="155" fontSize="12" fill="#999" textAnchor="middle">左边</text>
                        {/* 移动的矩形 - 从左上角开始 */}
                        <rect x="125" y="100" width="50" height="50" fill="#8B4513" rx="4">
                            {genAnimateTranslate({
                                initValue: { x: 0, y: 0 },
                                timeline: [
                                    { toValue: { x: 100, y: 0 }, durationSeconds: 0.8 },   // 右：沿上边移动 100
                                    { toValue: { x: 0, y: 50 }, durationSeconds: 0.8 },    // 下：沿右边移动 50
                                    { toValue: { x: -100, y: 0 }, durationSeconds: 0.8 },  // 左：沿下边移动 100
                                    { toValue: { x: 0, y: -50 }, durationSeconds: 0.8 }     // 上：沿左边回到起点
                                ]
                            })}
                        </rect>
                    </svg>
                </ReplayButton>
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    棕色矩形沿矩形路径移动：右 → 下 → 左 → 上，最后回到起点
                </div>
            </div>
        </SectionEx>
    );
};
