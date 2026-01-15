import React from "react";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimateFloat } from "@svg-anim/float";

// ============================================ DelayFloat Component ============================================

export const DelayFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {genAnimateFloat({ floatRangeY: 20, durationSeconds: 3, delay: 2 })}
                    <circle cx="100" cy="100" r="50" fill="blue" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ LimitedFloat Component ============================================

export const LimitedFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {genAnimateFloat({ floatRangeY: 20, durationSeconds: 2, repeatCount: 3 })}
                    <circle cx="100" cy="100" r="50" fill="green" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ ClickFloat Component ============================================

export const ClickFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g style={{ cursor: 'pointer' }}>
                    {genAnimateFloat({ floatRangeY: 20, durationSeconds: 3, beginType: 'click' })}
                    <circle cx="100" cy="100" r="50" fill="orange" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ ClickDelayFloat Component ============================================

export const ClickDelayFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g style={{ cursor: 'pointer' }}>
                    {genAnimateFloat({ floatRangeY: 20, durationSeconds: 3, beginType: 'click', delay: 0.5 })}
                    <circle cx="100" cy="100" r="50" fill="purple" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ OnceFloat Component ============================================

export const OnceFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {genAnimateFloat({ floatRangeY: 30, durationSeconds: 4, repeatCount: 1 })}
                    <circle cx="100" cy="100" r="50" fill="red" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ InfiniteFastFloat Component ============================================

export const InfiniteFastFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {genAnimateFloat({ floatRangeY: 15, durationSeconds: 1, repeatCount: 0 })}
                    <circle cx="100" cy="100" r="50" fill="teal" />
                </g>
            </svg>
        </SvgWrapper>
    );
};
