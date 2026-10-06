import React from "react";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { transformBreathe } from "@guohub8080/expub-tool/behaviors";

// ============================================ DelayBreathe Component ============================================

export const DelayBreathe = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {transformBreathe({
                        begin: '2s',
                        onceBreatheDurationSeconds: 2,
                        pivot: [100, 100]
                    })}
                    <circle cx="100" cy="100" r="50" fill="blue" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ LimitedBreathe Component ============================================

export const LimitedBreathe = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {transformBreathe({
                        loopCount: 3,
                        onceBreatheDurationSeconds: 2,
                        pivot: [100, 100]
                    })}
                    <circle cx="100" cy="100" r="50" fill="green" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ ClickBreathe Component ============================================

export const ClickBreathe = () => {
    return (
        <SvgWrapper showReplayButton={false}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g style={{ cursor: 'pointer' }}>
                    <rect width="200" height="200" fill="transparent" />
                    <g>
                        {transformBreathe({
                            begin: 'click',
                            onceBreatheDurationSeconds: 2,
                            pivot: [100, 100]
                        })}
                        <circle cx="100" cy="100" r="50" fill="orange" />
                    </g>
                </g>
            </svg>
        </SvgWrapper>
    );
};
