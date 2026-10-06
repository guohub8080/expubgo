import React from "react";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { animateSoftBlink } from "@guohub8080/expub-tool/behaviors";

// ============================================ ClickDelayBlink Component ============================================

export const ClickDelayBlink = () => {
    return (
        <SvgWrapper showReplayButton={false}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g style={{ cursor: 'pointer' }}>
                    <rect width="200" height="200" fill="transparent" />
                    <path
                        d="M100 20 L120 80 L180 80 L130 120 L150 180 L100 140 L50 180 L70 120 L20 80 L80 80 Z"
                        fill="yellow"
                    >
                        {animateSoftBlink({
                            begin: 'click+0.5s',
                            onceBlinkDurationSeconds: 1.2
                        })}
                    </path>
                </g>
            </svg>
        </SvgWrapper>
    );
};
