import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimatePathStroke } from "@svg-anim/pathStroke";

export const ToValueDemo = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="400" height="200" viewBox="0 0 400 200">
                {/* 示例1: toValue = 0 (完全显示) */}
                <g transform="translate(0, 0)">
                    <text x="60" y="15" fontSize="11" fill="#6b7280">toValue = 0</text>
                    <path d="M 30 50 L 170 50" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                    {genAnimatePathStroke({
                        pathLength: 200,
                        initOffset: 200,
                        timeline: [
                            { durationSeconds: 1.5, toValue: 0 }
                        ],
                        element: <line x1="30" y1="50" x2="170" y2="50" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                    })}
                </g>

                {/* 示例2: toValue = 100 (半显示) */}
                <g transform="translate(220, 0)">
                    <text x="280" y="15" fontSize="11" fill="#6b7280">toValue = 100</text>
                    <path d="M 250 50 L 390 50" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                    {genAnimatePathStroke({
                        pathLength: 200,
                        initOffset: 200,
                        timeline: [
                            { durationSeconds: 1.5, toValue: 100 }
                        ],
                        element: <line x1="250" y1="50" x2="390" y2="50" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                    })}
                </g>

                {/* 示例3: toValue = 200 (完全隐藏) */}
                <g transform="translate(0, 100)">
                    <text x="60" y="115" fontSize="11" fill="#6b7280">toValue = 200</text>
                    <path d="M 30 150 L 170 150" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                    {genAnimatePathStroke({
                        pathLength: 200,
                        initOffset: 0,
                        timeline: [
                            { durationSeconds: 1.5, toValue: 200 }
                        ],
                        element: <line x1="30" y1="150" x2="170" y2="150" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                    })}
                </g>

                {/* 示例4: toValue = pathLength (完全隐藏，另一种方式) */}
                <g transform="translate(220, 100)">
                    <text x="280" y="115" fontSize="11" fill="#6b7280">toValue = pathLength</text>
                    <path d="M 250 150 L 390 150" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                    {genAnimatePathStroke({
                        pathLength: 200,
                        initOffset: 0,
                        timeline: [
                            { durationSeconds: 1.5, toValue: 200 }
                        ],
                        element: <line x1="250" y1="150" x2="390" y2="150" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                    })}
                </g>
            </svg>
        </SvgWrapper>
    );
};
