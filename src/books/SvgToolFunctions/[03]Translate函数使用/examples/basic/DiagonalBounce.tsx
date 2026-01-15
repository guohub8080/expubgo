import SectionEx from "@pub-html/basicEx/SectionEx";
import { ReplayButton } from "../ReplayButton";
import { genAnimateTranslate } from "@svg-anim/translate";

export const DiagonalBounce = () => {
    return (
        <SectionEx className="translate-examples">
            <div style={{ maxWidth: 420, margin: '0 auto' }}>
                <ReplayButton>
                    <svg width="400" height="250" viewBox="0 0 400 250" style={{
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                        padding: '8px'
                    }}>
                        {/* 对角线路径参考线 */}
                        <line x1="100" y1="80" x2="300" y2="170" stroke="#ccc" strokeWidth="2" strokeDasharray="5,5" />
                        {/* 起点和终点标注 */}
                        <text x="90" y="75" fontSize="12" fill="#999" textAnchor="end">起点</text>
                        <text x="310" y="175" fontSize="12" fill="#999" textAnchor="start">终点</text>
                        {/* 移动的圆形 - 从左上角开始 */}
                        <circle cx="100" cy="80" r="25" fill="#4B0082">
                            {genAnimateTranslate({
                                initValue: { x: 0, y: 0 },
                                timeline: [
                                    { toValue: { x: 200, y: 90 }, durationSeconds: 1.5 },   // 向右下移动
                                    { toValue: { x: -200, y: -90 }, durationSeconds: 1.5 }  // 返回左上
                                ],
                                loopCount: 0
                            })}
                        </circle>
                    </svg>
                </ReplayButton>
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    靛蓝圆形沿对角线往返移动
                </div>
            </div>
        </SectionEx>
    );
};
