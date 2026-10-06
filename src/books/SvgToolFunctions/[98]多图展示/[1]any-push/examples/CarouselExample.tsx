import SectionEx from "@pub-html/basicEx/SectionEx";
import { AnyPush } from "@guohub8080/expub-tool/svg";
import { getLinearBezier } from "@guohub8080/expub-tool/smil";
import pic1 from "@book-svg-tool/data/assets/300x300/1.jpg";
import pic2 from "@book-svg-tool/data/assets/300x300/2.jpg";
import pic3 from "@book-svg-tool/data/assets/300x300/3.jpg";
import pic4 from "@book-svg-tool/data/assets/300x300/4.jpg";
import pic5 from "@book-svg-tool/data/assets/300x300/5.jpg";

// ============================================ CarouselExample Component ============================================

export const CarouselExample = () => {
    const maxWidth = 350;
    return (
        <SectionEx className="multi-display-presets">
            <div style={{ maxWidth, margin: '0 auto' }}>
                <AnyPush
                    childItems={[
                        { url: pic1, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
                        { url: pic2, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
                        { url: pic3, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
                        { url: pic4, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
                        { url: pic5, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
                    ]}
                />
            </div>
        </SectionEx>
    );
};
