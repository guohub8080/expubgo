import React from "react";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimateBreathe, breathePresets, centerBreatheStyle } from "@svg-anim/breathe";

// ============================================ NormalBreathe Component ============================================

export const NormalBreathe = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g style={centerBreatheStyle}>
                    {breathePresets.normal()}
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
                <g style={centerBreatheStyle}>
                    {breathePresets.fast()}
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
                <g style={centerBreatheStyle}>
                    {breathePresets.slow()}
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
                <g style={centerBreatheStyle}>
                    {breathePresets.gentle()}
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
                <g style={centerBreatheStyle}>
                    {breathePresets.strong()}
                    <circle cx="100" cy="100" r="50" fill="red" />
                </g>
            </svg>
        </SvgWrapper>
    );
};
