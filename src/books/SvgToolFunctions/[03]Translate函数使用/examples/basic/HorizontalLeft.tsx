import SectionEx from "@pub-html/basicEx/SectionEx";
import { ReplayButton } from "../ReplayButton";
import { transformTranslate } from "@guohub8080/expub-tool/smil";

export const HorizontalLeft = () => {
    const maxWidth = 400;
    return (
        <SectionEx className="translate-examples">
            <ReplayButton>
                <svg width="300" height="100" viewBox="0 0 300 100">
                    <circle cx="250" cy="50" r="20" fill="purple">
                        {transformTranslate({
                            initValue: { x: 0, y: 0 },
                            timeline: [
                                { toRel: { x: -150, y: 0 }, durationSeconds: 2 }
                            ]
                        })}
                    </circle>
                </svg>
            </ReplayButton>
        </SectionEx>
    );
};
