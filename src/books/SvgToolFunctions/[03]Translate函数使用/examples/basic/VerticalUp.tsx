import SectionEx from "@pub-html/basicEx/SectionEx";
import { ReplayButton } from "../ReplayButton";
import { genAnimateTranslate } from "@svg-anim/translate";

export const VerticalUp = () => {
    const maxWidth = 400;
    return (
        <SectionEx className="translate-examples">
            <ReplayButton>
                <svg width="200" height="200" viewBox="0 0 200 200">
                    <rect x="80" y="140" width="40" height="40" fill="orange">
                        {genAnimateTranslate({
                            initValue: { x: 0, y: 0 },
                            timeline: [
                                { toValue: { x: 0, y: -100 }, durationSeconds: 2 }
                            ]
                        })}
                    </rect>
                </svg>
            </ReplayButton>
        </SectionEx>
    );
};
