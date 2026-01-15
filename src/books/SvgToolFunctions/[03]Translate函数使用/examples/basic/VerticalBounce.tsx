import SectionEx from "@pub-html/basicEx/SectionEx";
import { ReplayButton } from "../ReplayButton";
import { genAnimateTranslate } from "@svg-anim/translate";

export const VerticalBounce = () => {
    const maxWidth = 400;
    return (
        <SectionEx className="translate-examples">
            <ReplayButton>
                <svg width="200" height="300" viewBox="0 0 200 300">
                    <rect x="80" y="130" width="40" height="40" fill="teal">
                        {genAnimateTranslate({
                            initValue: { x: 0, y: 0 },
                            timeline: [
                                { toValue: { x: 0, y: -80 }, durationSeconds: 1 },
                                { toValue: { x: 0, y: 80 }, durationSeconds: 1 },
                                { toValue: { x: 0, y: 0 }, durationSeconds: 1 }
                            ],
                            loopCount: 0
                        })}
                    </rect>
                </svg>
            </ReplayButton>
        </SectionEx>
    );
};
