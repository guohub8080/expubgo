import SectionEx from "@pub-html/basicEx/SectionEx";
import { ReplayButton } from "../ReplayButton";
import { genAnimateTranslate } from "@svg-anim/translate";

export const HorizontalLeft = () => {
    const maxWidth = 400;
    return (
        <SectionEx className="translate-examples">
            <ReplayButton>
                <svg width="300" height="100" viewBox="0 0 300 100">
                    <circle cx="250" cy="50" r="20" fill="purple">
                        {genAnimateTranslate({
                            initValue: { x: 0, y: 0 },
                            timeline: [
                                { toValue: { x: -150, y: 0 }, durationSeconds: 2 }
                            ]
                        })}
                    </circle>
                </svg>
            </ReplayButton>
        </SectionEx>
    );
};
