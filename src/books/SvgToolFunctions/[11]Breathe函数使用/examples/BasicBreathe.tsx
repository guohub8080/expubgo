import React from "react";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { transformBreathe } from "@guohub8080/expub-tool/behaviors";

// ============================================ BasicBreathe Component ============================================

export const BasicBreathe = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {transformBreathe({ pivot: [100, 100] })}
                    <circle cx="100" cy="100" r="50" fill="blue" />
                </g>
            </svg>
        </SvgWrapper>
    );
};
