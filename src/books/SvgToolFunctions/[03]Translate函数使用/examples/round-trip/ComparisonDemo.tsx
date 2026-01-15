import SectionEx from "@pub-html/basicEx/SectionEx";
import { ReplayButton } from "../ReplayButton";
import { genAnimateTranslate } from "@svg-anim/translate";

export const ComparisonDemo = () => {
    return (
        <SectionEx className="translate-examples">
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <ReplayButton>
                    <svg width="600" height="140" viewBox="0 0 600 140" style={{
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                        padding: '8px'
                    }}>
                        {/* 相对移动模式 */}
                        <text x="30" y="50" fontSize="13" fill="#333" dominantBaseline="middle">相对移动</text>
                        <line x1="120" y1="50" x2="450" y2="50" stroke="#e5e7eb" strokeWidth="2" />
                        <circle cx="120" cy="50" r="4" fill="#9ca3af" />
                        <circle cx="220" cy="50" r="4" fill="#9ca3af" />
                        <text x="120" y="67" fontSize="10" fill="#9ca3af" textAnchor="middle">起点</text>
                        <text x="220" y="67" fontSize="10" fill="#9ca3af" textAnchor="middle">+100</text>
                        <circle cx="120" cy="50" r="14" fill="#3498db">
                            {genAnimateTranslate({
                                initValue: { x: 0, y: 0 },
                                isRelativeMove: true,
                                timeline: [
                                    { toValue: { x: 100, y: 0 }, durationSeconds: 1 },
                                    { toValue: { x: 0, y: 0 }, durationSeconds: 1 }
                                ],
                                isFreeze: true
                            })}
                        </circle>

                        {/* 累积移动模式 */}
                        <text x="30" y="105" fontSize="13" fill="#333" dominantBaseline="middle">累积移动</text>
                        <line x1="120" y1="105" x2="450" y2="105" stroke="#e5e7eb" strokeWidth="2" />
                        <circle cx="120" cy="105" r="4" fill="#9ca3af" />
                        <circle cx="220" cy="105" r="4" fill="#9ca3af" />
                        <circle cx="120" cy="105" r="4" fill="#9ca3af" />
                        <text x="120" y="122" fontSize="10" fill="#9ca3af" textAnchor="middle">0</text>
                        <text x="220" y="122" fontSize="10" fill="#9ca3af" textAnchor="middle">100</text>
                        <circle cx="120" cy="105" r="14" fill="#e74c3c">
                            {genAnimateTranslate({
                                initValue: { x: 0, y: 0 },
                                isRelativeMove: false,
                                timeline: [
                                    { toValue: { x: 100, y: 0 }, durationSeconds: 1 },
                                    { toValue: { x: 0, y: 0 }, durationSeconds: 1 }
                                ],
                                isFreeze: true
                            })}
                        </circle>

                        {/* 说明文字 */}
                        <text x="480" y="77" fontSize="11" fill="#666" textAnchor="start">
                            <tspan x="480" dy="0">相对移动：</tspan>
                            <tspan x="480" dy="14">{'{x:0}'}=保持不动</tspan>
                            <tspan x="480" dy="28">累积移动：</tspan>
                            <tspan x="480" dy="14">{'{x:0}'}=返回起点</tspan>
                        </text>
                    </svg>
                </ReplayButton>
            </div>
        </SectionEx>
    );
};
