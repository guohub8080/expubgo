import React from "react";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimateFloat } from "@svg-anim/float";

// ============================================ BasicFloat Component ============================================

export const BasicFloat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {genAnimateFloat({ floatRangeY: 20, durationSeconds: 4 })}
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
                    {genAnimateFloat({ floatRangeY: 30, durationSeconds: 3 })}
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
                    {genAnimateFloat({ floatRangeX: 30, floatRangeY: 0, durationSeconds: 3 })}
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
                    {genAnimateFloat({ floatRangeX: 20, floatRangeY: 20, durationSeconds: 3 })}
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
                    {genAnimateFloat({ floatRangeY: 15, durationSeconds: 1.5 })}
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
                    {genAnimateFloat({ floatRangeY: 25, durationSeconds: 6 })}
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
                    {genAnimateFloat({ floatRangeY: 10, durationSeconds: 4 })}
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
                    {genAnimateFloat({ floatRangeY: 40, durationSeconds: 3 })}
                    <circle cx="100" cy="100" r="50" fill="indigo" />
                </g>
            </svg>
        </SvgWrapper>
    );
};
