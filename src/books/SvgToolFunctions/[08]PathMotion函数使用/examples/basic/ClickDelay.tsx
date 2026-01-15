import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimatePathMotion } from "@svg-anim/pathMotion";

export const ClickDelay = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="400" height="200" viewBox="0 0 400 200">
                {/* 弯曲路径参考线 */}
                <path
                    d="M 50 100 C 100 50, 150 50, 200 100 S 300 150, 350 100"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                />
                {/* 点击触发 + 延迟 */}
                <g transform="translate(50, 100)">
                    <circle r="12" fill="#f59e0b" />
                    {genAnimatePathMotion({
                        path: "m 0 0 c 50 -50, 100 -50, 150 0 s 100 50, 150 0",
                        durationSeconds: 3,
                        delay: 1,
                        beginType: 'click',
                        rotate: 0
                    })}
                </g>
                {/* 提示文字 */}
                <text x="200" y="180" fontSize="13" fill="#9ca3af" textAnchor="middle">
                    点击橙色圆形，1秒后开始运动
                </text>
            </svg>
        </SvgWrapper>
    );
};
