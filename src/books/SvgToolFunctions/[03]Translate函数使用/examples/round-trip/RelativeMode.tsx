import SectionEx from "@pub-html/basicEx/SectionEx";
import { ReplayButton } from "../ReplayButton";
import { genAnimateTranslate } from "@svg-anim/translate";

export const RelativeMode = () => {
    return (
        <SectionEx className="translate-examples">
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <ReplayButton>
                    <svg width="600" height="90" viewBox="0 0 600 90" style={{
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                        padding: '8px'
                    }}>
                        {/* 参考线 */}
                        <line x1="80" y1="45" x2="530" y2="45" stroke="#e5e7eb" strokeWidth="2" />
                        <circle cx="80" cy="45" r="4" fill="#9ca3af" />
                        <circle cx="380" cy="45" r="4" fill="#9ca3af" />
                        <circle cx="80" cy="45" r="4" fill="#9ca3af" />
                        <circle cx="230" cy="45" r="4" fill="#9ca3af" />

                        {/* 路径标注 */}
                        <text x="80" y="65" fontSize="11" fill="#9ca3af" textAnchor="middle">起点</text>
                        <text x="380" y="65" fontSize="11" fill="#9ca3af" textAnchor="middle">+300</text>
                        <text x="80" y="80" fontSize="11" fill="#9ca3af" textAnchor="middle">返回</text>
                        <text x="230" y="80" fontSize="11" fill="#9ca3af" textAnchor="middle">+150</text>

                        {/* 移动的圆形 */}
                        <circle cx="80" cy="45" r="16" fill="#3498db">
                            {genAnimateTranslate({
                                initValue: { x: 0, y: 0 },
                                isRelativeMove: true,
                                timeline: [
                                    { toValue: { x: 300, y: 0 }, durationSeconds: 1 },
                                    { toValue: { x: -300, y: 0 }, durationSeconds: 0.5 },
                                    { toValue: { x: 150, y: 0 }, durationSeconds: 1 }
                                ],
                                isFreeze: true
                            })}
                        </circle>
                    </svg>
                </ReplayButton>
            </div>
        </SectionEx>
    );
};
