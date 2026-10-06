import SectionEx from "@pub-html/basicEx/SectionEx";
import { CoverOut } from "@guohub8080/expub-tool/svg"
import { getEaseBezier, getPowerBezier, getLinearBezier } from "@guohub8080/expub-tool/smil"
import pic1 from "@book-svg-tool/data/assets/300x300/1.jpg"
import pic2 from "@book-svg-tool/data/assets/300x300/2.jpg"
import pic3 from "@book-svg-tool/data/assets/300x300/3.jpg"
import pic4 from "@book-svg-tool/data/assets/300x300/4.jpg"

export const ComprehensiveExample = () => {
    const maxWidth = 350;
    return (
        <SectionEx className="multi-display-presets">
            <div style={{ maxWidth, margin: '0 auto' }}>
                <CoverOut
                    canvasSize={{ w: 300, h: 300 }}
                    childItems={[
                        {
                            url: pic1,
                            direction: "B",
                            switchDuration: 0.8,
                            stayDuration: 1.2,
                            keySplines: getEaseBezier({ isIn: true, isOut: true })
                        },
                        {
                            url: pic2,
                            direction: "L",
                            switchDuration: 0.6,
                            stayDuration: 1,
                            keySplines: getPowerBezier({ power: 2, isIn: true, isOut: true })
                        },
                        {
                            url: pic3,
                            direction: "T",
                            switchDuration: 0.7,
                            stayDuration: 1.5,
                            keySplines: getEaseBezier({ isIn: false, isOut: true })
                        },
                        {
                            url: pic4,
                            direction: "R",
                            switchDuration: 0.5,
                            stayDuration: 0.8,
                            keySplines: getLinearBezier()
                        },
                    ]}
                />
            </div>
        </SectionEx>
    );
};
