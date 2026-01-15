import SectionEx from "@pub-html/basicEx/SectionEx";
import { ReplayButton } from "../ReplayButton";
import { genAnimateTranslate } from "@svg-anim/translate";

export const LShapePath = () => {
    return (
        <SectionEx className="translate-examples">
            <div style={{ maxWidth: 420, margin: '0 auto' }}>
                <ReplayButton>
                    <svg width="360" height="240" viewBox="0 0 360 240" style={{
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                        padding: '8px'
                    }}>
                        {/* L形路径参考线 */}
                        <polyline points="80,70 230,70 230,170" fill="none" stroke="#ccc" strokeWidth="2" strokeDasharray="5,5" />
                        {/* 路径标注 */}
                        <text x="155" y="60" fontSize="12" fill="#999" textAnchor="middle">→ 向右</text>
                        <text x="240" y="120" fontSize="12" fill="#999" textAnchor="start">↓ 向下</text>
                        {/* 起点标注 */}
                        <text x="65" y="75" fontSize="12" fill="#999" textAnchor="end">起点</text>
                        {/* 移动的矩形 - 从左上角开始 */}
                        <rect x="80" y="70" width="40" height="40" fill="#DC143C" rx="4">
                            {genAnimateTranslate({
                                initValue: { x: 0, y: 0 },
                                timeline: [
                                    { toValue: { x: 110, y: 0 }, durationSeconds: 1 },   // 向右移动 110，终点x=190，矩形右边=230
                                    { toValue: { x: 0, y: 60 }, durationSeconds: 1 }     // 向下移动 60，终点y=130，矩形底边=170
                                ],
                                isFreeze: true
                            })}
                        </rect>
                    </svg>
                </ReplayButton>
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    深红色矩形先向右移动，再向下移动，形成 L 形路径
                </div>
            </div>
        </SectionEx>
    );
};
