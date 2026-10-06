import { transformScale } from "@guohub8080/expub-tool/smil";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const ClickTriggerDemo = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="3" fill="#ccc" />
                <text x="100" y="170" textAnchor="middle" fontSize="14" fill="#666">点击放大</text>

                <circle cx="100" cy="80" r="25" fill="purple">
                    {transformScale({
                        pivot: [100, 80],
                        timeline: [
                            { toAbs: 1.8, durationSeconds: 2 }
                        ],
                        begin: 'click',
                        isFreeze: true
                    })}
                </circle>
            </svg>
        </SvgWrapper>
    );
};
