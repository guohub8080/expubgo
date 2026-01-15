import SectionEx from "@pub-html/basicEx/SectionEx";
import { genAnimateTranslate } from "@svg-anim/translate";
import { ReplayButton } from "../ReplayButton";

export const HorizontalBounce = () => {
    return (
        <SectionEx className="translate-examples">
            <ReplayButton>
                <svg width="300" height="100" viewBox="0 0 300 100">
                    <circle cx="150" cy="50" r="20" fill="red">
                        {genAnimateTranslate({
                            initValue: { x: 0, y: 0 },
                            timeline: [
                                { toValue: { x: 80, y: 0 }, durationSeconds: 1 },
                                { toValue: { x: -80, y: 0 }, durationSeconds: 1 },
                                { toValue: { x: 0, y: 0 }, durationSeconds: 1 }
                            ],
                            loopCount: 0
                        })}
                    </circle>
                </svg>
            </ReplayButton>
        </SectionEx>
    );
};
