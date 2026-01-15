import SectionEx from "@pub-html/basicEx/SectionEx";
import CoverIn from "@pub-svg/C3_MultiDisplay/CoverIn"
import { getEaseBezier, getPowerBezier, getLinearBezier } from "@pub-utils/getBezier/index.ts"
import pic1 from "@book-svg-tool/data/assets/300x300/1.jpg"
import pic2 from "@book-svg-tool/data/assets/300x300/2.jpg"
import pic3 from "@book-svg-tool/data/assets/300x300/3.jpg"
import pic4 from "@book-svg-tool/data/assets/300x300/4.jpg"
import pic5 from "@book-svg-tool/data/assets/300x300/5.jpg"
import pic6 from "@book-svg-tool/data/assets/300x300/6.jpg"

export const GridExample = () => {
    const maxWidth = 700;
    return (
        <SectionEx className="multi-display-presets">
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 0,
                maxWidth,
                margin: '0 auto'
            }}>
                {/* 左上 - 3张图 */}
                <CoverIn
                    pics={[
                        { url: pic1, direction: "B", coverInDuration: 0.5, stayDuration: 0.8, keySplines: getLinearBezier() },
                        { url: pic2, direction: "R", coverInDuration: 0.7, stayDuration: 1.1, keySplines: getEaseBezier({ isIn: true, isOut: false }) },
                        { url: pic3, direction: "T", coverInDuration: 0.4, stayDuration: 0.9, keySplines: getPowerBezier({ power: 2, isIn: false, isOut: true }) },
                    ]}
                />
                {/* 右上 - 4张图 */}
                <CoverIn
                    pics={[
                        { url: pic4, direction: "L", coverInDuration: 0.6, stayDuration: 1.2, keySplines: getEaseBezier({ isIn: true, isOut: true }) },
                        { url: pic5, direction: "B", coverInDuration: 0.9, stayDuration: 0.7, keySplines: getLinearBezier() },
                        { url: pic6, direction: "R", coverInDuration: 0.5, stayDuration: 1.4, keySplines: getPowerBezier({ power: 3, isIn: true, isOut: false }) },
                        { url: pic1, direction: "T", coverInDuration: 0.8, stayDuration: 1.0, keySplines: getEaseBezier({ isIn: false, isOut: true }) },
                    ]}
                />
                {/* 左下 - 2张图 */}
                <CoverIn
                    pics={[
                        { url: pic2, direction: "R", coverInDuration: 1.0, stayDuration: 0.6, keySplines: getPowerBezier({ power: 4, isIn: true, isOut: true }) },
                        { url: pic3, direction: "B", coverInDuration: 0.4, stayDuration: 1.5, keySplines: getLinearBezier() },
                    ]}
                />
                {/* 右下 - 5张图 */}
                <CoverIn
                    pics={[
                        { url: pic4, direction: "T", coverInDuration: 0.3, stayDuration: 1.3, keySplines: getEaseBezier({ isIn: true, isOut: false }) },
                        { url: pic5, direction: "L", coverInDuration: 0.8, stayDuration: 0.9, keySplines: getPowerBezier({ power: 2, isIn: false, isOut: true }) },
                        { url: pic6, direction: "B", coverInDuration: 0.6, stayDuration: 1.1, keySplines: getLinearBezier() },
                        { url: pic1, direction: "R", coverInDuration: 0.9, stayDuration: 0.7, keySplines: getEaseBezier({ isIn: true, isOut: true }) },
                        { url: pic2, direction: "T", coverInDuration: 0.5, stayDuration: 1.2, keySplines: getEaseBezier({ isIn: false, isOut: true }) },
                    ]}
                />
            </div>
        </SectionEx>
    );
};
