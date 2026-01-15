import React from "react";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimateHardBlink, hardBlinkPresets } from "@svg-anim/blink";

// ============================================ HardBlinkNormal Component ============================================

export const HardBlinkNormal = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <path
                    d="M100 20 L120 80 L180 80 L130 120 L150 180 L100 140 L50 180 L70 120 L20 80 L80 80 Z"
                    fill="yellow"
                >
                    {genAnimateHardBlink({
                        onDurationSeconds: 0.8,
                        offDurationSeconds: 0.3
                    })}
                </path>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ HardBlinkFast Component ============================================

export const HardBlinkFast = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="40" fill="red">
                    {genAnimateHardBlink({
                        onDurationSeconds: 0.5,
                        offDurationSeconds: 0.2
                    })}
                </circle>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ HardBlinkWarning Component ============================================

export const HardBlinkWarning = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <rect x="60" y="60" width="80" height="80" fill="orange">
                    {hardBlinkPresets.warning()}
                </rect>
            </svg>
        </SvgWrapper>
    );
};

// ============================================ HardBlinkSOS Component ============================================

export const HardBlinkSOS = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="50" fill="blue">
                    {hardBlinkPresets.sos()}
                </circle>
            </svg>
        </SvgWrapper>
    );
};
