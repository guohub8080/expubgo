import { ReactNode } from "react";
import SectionEx from "@pub-html/basicEx/SectionEx";
import { defaultTo } from "es-toolkit/compat";
import { mpBlank, mpGet, mpProps } from "@styles/funcs/mp";

const EquallyDividedSlideContainer = (props: {
    comps?: ReactNode[]
    isReverse?: boolean
    mp?: mpProps
}) => {
    const isReverse = defaultTo(props.isReverse, false)
    const mpResult = mpGet(defaultTo(props.mp, mpBlank))
    const comps = defaultTo(props.comps, [])
    if (comps.length === 0) return null

    const groupCount = comps.length
    const totalWidthPercent = groupCount * 100
    const childWidthPercent = 100 / groupCount

    return (
        <SectionEx data-label="equally-divided-slide-container"
            style={{
                WebkitTouchCallout: "none",
                userSelect: "text",
                overflow: "hidden",
                textAlign: "center",
                lineHeight: 0,
                ...mpResult
            }}
        >
            <section
                style={{
                    overflow: "scroll hidden",
                    margin: 0,
                    lineHeight: 0,
                    direction: isReverse ? "rtl" : "ltr",
                }}
            >
                <SectionEx
                    important={[["width", `${totalWidthPercent}%`], ["max-width", `${totalWidthPercent}%`]]}
                    style={{
                        whiteSpace: "nowrap",
                        lineHeight: 0,
                        display: "flex",
                    }}
                >
                    {comps.map((comp, idx) => (
                        <section
                            key={idx}
                            style={{
                                width: `${childWidthPercent}%`,
                                flex: `0 0 ${childWidthPercent}%`,
                                verticalAlign: "top",
                                lineHeight: 0,
                                overflow: "hidden",
                            }}
                        >
                            {comp}
                        </section>
                    ))}
                </SectionEx>
            </section>
        </SectionEx>
    )
}


export default EquallyDividedSlideContainer
