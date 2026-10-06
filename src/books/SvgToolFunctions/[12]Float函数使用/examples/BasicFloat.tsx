import React from "react";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { transformFloat } from "@guohub8080/expub-tool/behaviors";

// ============================================ BasicFloat Component ============================================

export const BasicFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {transformFloat({ floatRangeY: 20, duration: 4 })}
                    <circle cx="100" cy="100" r="50" fill="blue" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ VerticalFloat Component ============================================

export const VerticalFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {transformFloat({ floatRangeY: 30, duration: 3 })}
                    <circle cx="100" cy="100" r="50" fill="green" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ HorizontalFloat Component ============================================

export const HorizontalFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {transformFloat({ floatRangeX: 30, floatRangeY: 0, duration: 3 })}
                    <circle cx="100" cy="100" r="50" fill="orange" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ DiagonalFloat Component ============================================

export const DiagonalFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {transformFloat({ floatRangeX: 20, floatRangeY: 20, duration: 3 })}
                    <circle cx="100" cy="100" r="50" fill="purple" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ FastFloat Component ============================================

export const FastFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {transformFloat({ floatRangeY: 15, duration: 1.5 })}
                    <circle cx="100" cy="100" r="50" fill="red" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ SlowFloat Component ============================================

export const SlowFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {transformFloat({ floatRangeY: 25, duration: 6 })}
                    <circle cx="100" cy="100" r="50" fill="teal" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ GentleFloat Component ============================================

export const GentleFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {transformFloat({ floatRangeY: 10, duration: 4 })}
                    <circle cx="100" cy="100" r="50" fill="pink" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ StrongFloat Component ============================================

export const StrongFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {transformFloat({ floatRangeY: 40, duration: 3 })}
                    <circle cx="100" cy="100" r="50" fill="indigo" />
                </g>
            </svg>
        </SvgWrapper>
    );
};
