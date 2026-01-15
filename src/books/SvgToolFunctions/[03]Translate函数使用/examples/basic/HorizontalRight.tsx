import SectionEx from "@pub-html/basicEx/SectionEx";
import { genAnimateTranslate } from "@svg-anim/translate";
import { ReplayButton } from "../ReplayButton";

export const HorizontalRight = () => {
    return (
        <SectionEx className="translate-examples">
            <ReplayButton>
                <svg width="300" height="100" viewBox="0 0 300 100">
                    <circle cx="50" cy="50" r="20" fill="blue">
                        {genAnimateTranslate({
                            initValue: { x: 0, y: 0 },
                            timeline: [
                                { toValue: { x: 200, y: 0 }, durationSeconds: 2 }
                            ]
                        })}
                    </circle>
                </svg>
            </ReplayButton>
        </SectionEx>
    );
};
