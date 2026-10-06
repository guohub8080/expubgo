import React from "react";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { transformFloat } from "@guohub8080/expub-tool/behaviors";

// ============================================ DelayFloat Component ============================================

export const DelayFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {transformFloat({ floatRangeY: 20, duration: 3, begin: '2s' })}
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
                    {transformFloat({ floatRangeY: 20, duration: 2, loopCount: 3 })}
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
                    {transformFloat({ floatRangeY: 20, duration: 3, begin: 'click' })}
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
                    {transformFloat({ floatRangeY: 20, duration: 3, begin: 'click+0.5s' })}
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
                    {transformFloat({ floatRangeY: 30, duration: 4, loopCount: 1 })}
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
                    {transformFloat({ floatRangeY: 15, duration: 1, loopCount: 0 })}
                    <circle cx="100" cy="100" r="50" fill="teal" />
                </g>
            </svg>
        </SvgWrapper>
    );
};
