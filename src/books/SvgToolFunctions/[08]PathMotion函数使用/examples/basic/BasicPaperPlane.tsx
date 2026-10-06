import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { animateMotion } from "@guohub8080/expub-tool/smil";

export const BasicPaperPlane = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="400" height="200" viewBox="0 0 400 200">
                {/* 路径参考线（虚线） */}
                <path
                    d="M 50 100 C 120 40 280 160 350 100 C 280 40 120 160 50 100"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                />
                <g>
                    {/* 纸飞机图形 */}
                    <g transform="scale(0.8)">
                        <path d="M 60 0 L -40 -5 L -50 -35 Z" fill="#94a3b8"></path>
                        <path d="M 55 0 L -25 5 L -15 28 Z" fill="#334155"></path>
                        <path d="M 60 0 L -40 -5 L -55 20 Z" fill="#bfdbfe"></path>
                        <path d="M 60 0 L -40 -5 L -30 -2 Z" fill="#e2e8f0"></path>
                    </g>
                    {/* 路径运动动画：8字形往返，自动旋转（rotate/loopCount 默认即 'auto'/无限循环） */}
                    {animateMotion({
                        path: "M 50 100 C 120 40 280 160 350 100 C 280 40 120 160 50 100",
                        durationSeconds: 6,
                        rotate: "auto",
                        loopCount: 0
                    })}
                </g>
            </svg>
        </SvgWrapper>
    );
};
