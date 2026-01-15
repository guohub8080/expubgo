import SectionEx from "@pub-html/basicEx/SectionEx";
import AnyPush from "@pub-svg/C3_MultiDisplay/AnyPush/index";
import pic1 from "@book-svg-tool/data/assets/300x300/1.jpg";
import pic2 from "@book-svg-tool/data/assets/300x300/2.jpg";
import pic3 from "@book-svg-tool/data/assets/300x300/3.jpg";
import pic4 from "@book-svg-tool/data/assets/300x300/4.jpg";
import pic5 from "@book-svg-tool/data/assets/300x300/5.jpg";
import pic6 from "@book-svg-tool/data/assets/300x300/6.jpg";
import { getEaseBezier, getPowerBezier, getLinearBezier } from "@pub-utils/getBezier";

// ============================================ ComprehensiveExample Component ============================================

export const ComprehensiveExample = () => {
    const maxWidth = 350;
    return (
        <SectionEx className="multi-display-presets">
            <div style={{ maxWidth, margin: '0 auto' }}>
                <AnyPush
                    pics={[
                        {
                            url: pic1,
                            direction: "R",
                            switchDuration: 0.8,
                            stayDuration: 1.2,
                            keySplines: getEaseBezier({ isIn: true, isOut: true })
                        },
                        {
                            url: pic2,
                            direction: "B",
                            switchDuration: 0.6,
                            stayDuration: 1,
                            keySplines: getPowerBezier({ power: 2, isIn: true, isOut: true })
                        },
                        {
                            url: pic3,
                            direction: "L",
                            switchDuration: 0.7,
                            stayDuration: 1.5,
                            keySplines: getEaseBezier({ isIn: false, isOut: true })
                        },
                        {
                            url: pic4,
                            direction: "T",
                            switchDuration: 0.5,
                            stayDuration: 0.8,
                            keySplines: getLinearBezier()
                        },
                        {
                            url: pic5,
                            direction: "R",
                            switchDuration: 1,
                            stayDuration: 1,
                            keySplines: getPowerBezier({ power: 4, isIn: true, isOut: false })
                        },
                        {
                            url: pic6,
                            direction: "B",
                            switchDuration: 0.4,
                            stayDuration: 1.3,
                            keySplines: getEaseBezier({ isIn: true, isOut: false })
                        },
                    ]}
                />
            </div>
        </SectionEx>
    );
};
