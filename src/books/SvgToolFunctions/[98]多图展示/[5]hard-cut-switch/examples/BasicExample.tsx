import SectionEx from "@pub-html/basicEx/SectionEx";
import HardCutSwitch from "@pub-svg/C3_MultiDisplay/HardCutSwitch"
import pic1 from "@book-svg-tool/data/assets/300x300/1.jpg"
import pic2 from "@book-svg-tool/data/assets/300x300/2.jpg"
import pic3 from "@book-svg-tool/data/assets/300x300/3.jpg"

export const BasicExample = () => {
    const maxWidth = 350;
    return (
        <SectionEx className="multi-display-presets">
            <div style={{ maxWidth, margin: '0 auto' }}>
                <HardCutSwitch
                    pics={[
                        { url: pic1, stayDuration: 1.2 },
                        { url: pic2, stayDuration: 1.2 },
                        { url: pic3, stayDuration: 1.2 },
                    ]}
                />
            </div>
        </SectionEx>
    );
};
