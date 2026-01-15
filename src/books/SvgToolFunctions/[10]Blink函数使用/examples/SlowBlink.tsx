import React from "react";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimateSoftBlink } from "@svg-anim/blink";

// ============================================ SlowBlink Component ============================================

export const SlowBlink = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <path
                    d="M100 20 L120 80 L180 80 L130 120 L150 180 L100 140 L50 180 L70 120 L20 80 L80 80 Z"
                    fill="yellow"
                >
                    {genAnimateSoftBlink({
                        minOpacity: 0.2,
                        onceBlinkDurationSeconds: 3
                    })}
                </path>
            </svg>
        </SvgWrapper>
    );
};
