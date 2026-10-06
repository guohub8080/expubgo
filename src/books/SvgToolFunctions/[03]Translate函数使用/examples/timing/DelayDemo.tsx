import SectionEx from "@pub-html/basicEx/SectionEx";
import { ReplayButton } from "../ReplayButton";
import { transformTranslate } from "@guohub8080/expub-tool/smil";

export const DelayDemo = () => {
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
                        {/* 第一行：无延迟 */}
                        <text x="20" y="55" fontSize="14" fill="#333" dominantBaseline="middle">无延迟</text>
                        <circle cx="120" cy="50" r="15" fill="#3498db">
                            {transformTranslate({
                                initValue: { x: 0, y: 0 },
                                timeline: [
                                    { toRel: { x: 450, y: 0 }, durationSeconds: 2 }
                                ],
                                begin: '0s'
                            })}
                        </circle>

                        {/* 第二行：延迟 1s */}
                        <text x="20" y="115" fontSize="14" fill="#333" dominantBaseline="middle">延迟 1s</text>
                        <circle cx="120" cy="110" r="15" fill="#e74c3c">
                            {transformTranslate({
                                initValue: { x: 0, y: 0 },
                                timeline: [
                                    { toRel: { x: 450, y: 0 }, durationSeconds: 2 }
                                ],
                                begin: '1s'
                            })}
                        </circle>

                        {/* 第三行：延迟 2s */}
                        <text x="20" y="175" fontSize="14" fill="#333" dominantBaseline="middle">延迟 2s</text>
                        <circle cx="120" cy="170" r="15" fill="#2ecc71">
                            {transformTranslate({
                                initValue: { x: 0, y: 0 },
                                timeline: [
                                    { toRel: { x: 450, y: 0 }, durationSeconds: 2 }
                                ],
                                begin: '2s'
                            })}
                        </circle>
                    </svg>
                </ReplayButton>
        
            </div>
        </SectionEx>
    );
};
