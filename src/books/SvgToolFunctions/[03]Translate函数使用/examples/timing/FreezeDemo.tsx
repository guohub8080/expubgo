import SectionEx from "@pub-html/basicEx/SectionEx";
import { ReplayButton } from "../ReplayButton";
import { genAnimateTranslate } from "@svg-anim/translate";

export const FreezeDemo = () => {
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
                        {/* 第一行：isFreeze: false */}
                        <text x="20" y="55" fontSize="14" fill="#333" dominantBaseline="middle">isFreeze: false（默认）</text>
                        <circle cx="200" cy="50" r="15" fill="#3498db">
                            {genAnimateTranslate({
                                initValue: { x: 0, y: 0 },
                                timeline: [
                                    { toValue: { x: 350, y: 0 }, durationSeconds: 2 }
                                ],
                                isFreeze: false
                            })}
                        </circle>

                        {/* 第二行：isFreeze: true */}
                        <text x="20" y="105" fontSize="14" fill="#333" dominantBaseline="middle">isFreeze: true</text>
                        <circle cx="200" cy="100" r="15" fill="#e74c3c">
                            {genAnimateTranslate({
                                initValue: { x: 0, y: 0 },
                                timeline: [
                                    { toValue: { x: 350, y: 0 }, durationSeconds: 2 }
                                ],
                                isFreeze: true
                            })}
                        </circle>
                    </svg>
                </ReplayButton>
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    对比 isFreeze 参数：上方圆形动画结束后回到原位，下方圆形保持最终位置
                </div>
            </div>
        </SectionEx>
    );
};
