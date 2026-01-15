import React from "react";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimateBreathe, centerBreatheStyle } from "@svg-anim/breathe";

// ============================================ DelayBreathe Component ============================================

export const DelayBreathe = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g style={centerBreatheStyle}>
                    {genAnimateBreathe({
                        delay: 2,
                        onceBreatheDurationSeconds: 2
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
                <g style={centerBreatheStyle}>
                    {genAnimateBreathe({
                        repeatCount: 3,
                        onceBreatheDurationSeconds: 2
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
                    <g style={centerBreatheStyle}>
                        {genAnimateBreathe({
                            beginType: 'click',
                            onceBreatheDurationSeconds: 2
                        })}
                        <circle cx="100" cy="100" r="50" fill="orange" />
                    </g>
                </g>
            </svg>
        </SvgWrapper>
    );
};
