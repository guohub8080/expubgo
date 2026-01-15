import SectionEx from "@pub-html/basicEx/SectionEx";
import { genAnimateTranslate } from "@svg-anim/translate";

export const SpeedComparison = () => {
    return (
        <SectionEx className="translate-examples">
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <svg width="600" height="160" viewBox="0 0 600 160" style={{
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb',
                    padding: '8px'
                }}>
                    {/* 慢速（4秒） */}
                    <text x="20" y="45" fontSize="14" fill="#333" dominantBaseline="middle">慢速（4秒）</text>
                    <circle cx="130" cy="45" r="15" fill="#FF5733">
                        {genAnimateTranslate({
                            initValue: { x: 0, y: 0 },
                            timeline: [
                                { toValue: { x: 420, y: 0 }, durationSeconds: 4 },
                                { toValue: { x: 0, y: 0 }, durationSeconds: 0.3 }
                            ],
                            loopCount: 0
                        })}
                    </circle>

                    {/* 中速（2秒） */}
                    <text x="20" y="85" fontSize="14" fill="#333" dominantBaseline="middle">中速（2秒）</text>
                    <circle cx="130" cy="85" r="15" fill="#33FF57">
                        {genAnimateTranslate({
                            initValue: { x: 0, y: 0 },
                            timeline: [
                                { toValue: { x: 420, y: 0 }, durationSeconds: 2 },
                                { toValue: { x: 0, y: 0 }, durationSeconds: 0.3 }
                            ],
                            loopCount: 0
                        })}
                    </circle>

                    {/* 快速（0.5秒） */}
                    <text x="20" y="125" fontSize="14" fill="#333" dominantBaseline="middle">快速（0.5秒）</text>
                    <circle cx="130" cy="125" r="15" fill="#3357FF">
                        {genAnimateTranslate({
                            initValue: { x: 0, y: 0 },
                            timeline: [
                                { toValue: { x: 420, y: 0 }, durationSeconds: 0.5 },
                                { toValue: { x: 0, y: 0 }, durationSeconds: 0.3 }
                            ],
                            loopCount: 0
                        })}
                    </circle>
                </svg>
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    三个圆形以不同速度移动相同距离
                </div>
            </div>
        </SectionEx>
    );
};
