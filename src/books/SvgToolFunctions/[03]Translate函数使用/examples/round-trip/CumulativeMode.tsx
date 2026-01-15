import SectionEx from "@pub-html/basicEx/SectionEx";
import { ReplayButton } from "../ReplayButton";
import { genAnimateTranslate } from "@svg-anim/translate";

export const CumulativeMode = () => {
    return (
        <SectionEx className="translate-examples">
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <ReplayButton>
                    <svg width="600" height="120" viewBox="0 0 600 120" style={{
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                        padding: '8px'
                    }}>
                        {/* 参考线 */}
                        <line x1="80" y1="60" x2="520" y2="60" stroke="#e5e7eb" strokeWidth="2" />
                        <circle cx="80" cy="60" r="4" fill="#9ca3af" />
                        <circle cx="180" cy="60" r="4" fill="#9ca3af" />
                        <circle cx="280" cy="60" r="4" fill="#9ca3af" />
                        <circle cx="380" cy="60" r="4" fill="#9ca3af" />

                        {/* 路径标注 */}
                        <text x="80" y="80" fontSize="11" fill="#9ca3af" textAnchor="middle">0</text>
                        <text x="180" y="80" fontSize="11" fill="#9ca3af" textAnchor="middle">100</text>
                        <text x="280" y="80" fontSize="11" fill="#9ca3af" textAnchor="middle">100</text>
                        <text x="380" y="80" fontSize="11" fill="#9ca3af" textAnchor="middle">150</text>

                        {/* 移动的圆形 */}
                        <circle cx="80" cy="60" r="16" fill="#e74c3c">
                            {genAnimateTranslate({
                                initValue: { x: 0, y: 0 },
                                isRelativeMove: false,
                                timeline: [
                                    { toValue: { x: 100, y: 0 }, durationSeconds: 1 },
                                    { toValue: { x: 100, y: 0 }, durationSeconds: 0.5 },
                                    { toValue: { x: 150, y: 0 }, durationSeconds: 1 }
                                ],
                                isFreeze: true
                            })}
                        </circle>

                        {/* 说明文字 */}
                        <text x="300" y="105" fontSize="12" fill="#666" textAnchor="middle">每次移动都是相对于初始位置的绝对坐标</text>
                    </svg>
                </ReplayButton>
            </div>
        </SectionEx>
    );
};
