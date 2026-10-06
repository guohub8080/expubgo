import SectionEx from "@pub-html/basicEx/SectionEx";
import { ReplayButton } from "../ReplayButton";
import { transformTranslate } from "@guohub8080/expub-tool/smil";

export const LoopDemo = () => {
    return (
        <SectionEx className="translate-examples">
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <ReplayButton>
                    <svg width="600" height="200" viewBox="0 0 600 200" style={{
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                        padding: '8px'
                    }}>
                        {/* 第一行：播放 1 次 */}
                        <text x="20" y="55" fontSize="14" fill="#333" dominantBaseline="middle">播放 1 次</text>
                        <circle cx="120" cy="50" r="15" fill="#3498db">
                            {transformTranslate({
                                initValue: { x: 0, y: 0 },
                                timeline: [
                                    { toRel: { x: 450, y: 0 }, durationSeconds: 2 }
                                ],
                                loopCount: 1
                            })}
                        </circle>

                        {/* 第二行：播放 3 次 */}
                        <text x="20" y="115" fontSize="14" fill="#333" dominantBaseline="middle">播放 3 次</text>
                        <circle cx="120" cy="110" r="15" fill="#e74c3c">
                            {transformTranslate({
                                initValue: { x: 0, y: 0 },
                                timeline: [
                                    { toRel: { x: 450, y: 0 }, durationSeconds: 2 }
                                ],
                                loopCount: 3
                            })}
                        </circle>

                        {/* 第三行：无限循环 */}
                        <text x="20" y="175" fontSize="14" fill="#333" dominantBaseline="middle">无限循环</text>
                        <circle cx="120" cy="170" r="15" fill="#2ecc71">
                            {transformTranslate({
                                initValue: { x: 0, y: 0 },
                                timeline: [
                                    { toRel: { x: 450, y: 0 }, durationSeconds: 2 },
                                    { toRel: { x: 0, y: 0 }, durationSeconds: 0.5 }
                                ],
                                loopCount: 0
                            })}
                        </circle>
                    </svg>
                </ReplayButton>
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    三个圆形以不同的循环次数移动
                </div>
            </div>
        </SectionEx>
    );
};
