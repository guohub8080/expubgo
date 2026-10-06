import React from "react";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { transformBreathe } from "@guohub8080/expub-tool/behaviors";

// ============================================ NormalBreathe Component ============================================

export const NormalBreathe = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {/* 配方：标准呼吸（原 normal 预设） */}
                    {transformBreathe({ pivot: [100, 100] })}
                    <circle cx="100" cy="100" r="50" fill="blue" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ FastBreathe Component ============================================

export const FastBreathe = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {/* 配方：快速呼吸（原 fast 预设） */}
                    {transformBreathe({
                        onceBreatheDurationSeconds: 1,
                        toScale: 1.15,
                        pivot: [100, 100]
                    })}
                    <circle cx="100" cy="100" r="50" fill="orange" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ SlowBreathe Component ============================================

export const SlowBreathe = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {/* 配方：慢速呼吸（原 slow 预设） */}
                    {transformBreathe({
                        onceBreatheDurationSeconds: 3,
                        toScale: 1.08,
                        keySplines: '0.37 0 0.63 1',
                        pivot: [100, 100]
                    })}
                    <circle cx="100" cy="100" r="50" fill="green" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ GentleBreathe Component ============================================

export const GentleBreathe = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {/* 配方：轻微呼吸（原 gentle 预设） */}
                    {transformBreathe({
                        onceBreatheDurationSeconds: 2.5,
                        toScale: 1.05,
                        pivot: [100, 100]
                    })}
                    <circle cx="100" cy="100" r="50" fill="purple" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ StrongBreathe Component ============================================

export const StrongBreathe = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {/* 配方：强烈呼吸（原 strong 预设） */}
                    {transformBreathe({
                        onceBreatheDurationSeconds: 1.5,
                        toScale: 1.2,
                        pivot: [100, 100]
                    })}
                    <circle cx="100" cy="100" r="50" fill="red" />
                </g>
            </svg>
        </SvgWrapper>
    );
};
