import SectionEx from "@pub-html/basicEx/SectionEx";
import { ReplayButton } from "../ReplayButton";
import { genAnimateTranslate } from "@svg-anim/translate";
import { getEaseBezier } from "@pub-utils/getBezier";

export const EasingComparison = () => {
    return (
        <SectionEx className="translate-examples">
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <ReplayButton>
                    <svg width="600" height="150" viewBox="0 0 600 150" style={{
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                        padding: '8px'
                    }}>
                        {/* 加速移动 */}
                        <text x="20" y="55" fontSize="14" fill="#333" dominantBaseline="middle">加速</text>
                        <circle cx="120" cy="50" r="15" fill="#FF6B6B">
                            {genAnimateTranslate({
                                initValue: { x: 0, y: 0 },
                                timeline: [
                                    { toValue: { x: 430, y: 0 }, durationSeconds: 2, keySplines: getEaseBezier({ isIn: true }) }
                                ],
                                isFreeze: true
                            })}
                        </circle>

                        {/* 减速移动 */}
                        <text x="20" y="105" fontSize="14" fill="#333" dominantBaseline="middle">减速</text>
                        <circle cx="120" cy="100" r="15" fill="#4ECDC4">
                            {genAnimateTranslate({
                                initValue: { x: 0, y: 0 },
                                timeline: [
                                    { toValue: { x: 430, y: 0 }, durationSeconds: 2, keySplines: getEaseBezier({ isOut: true }) }
                                ],
                                isFreeze: true
                            })}
                        </circle>
                    </svg>
                </ReplayButton>
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    两个圆形用相同时长移动相同距离，但缓动曲线不同
                </div>
            </div>
        </SectionEx>
    );
};
