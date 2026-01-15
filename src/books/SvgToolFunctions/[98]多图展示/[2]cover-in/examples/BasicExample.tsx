import SectionEx from "@pub-html/basicEx/SectionEx";
import CoverIn from "@pub-svg/C3_MultiDisplay/CoverIn"
import pic1 from "@book-svg-tool/data/assets/300x300/1.jpg"
import pic2 from "@book-svg-tool/data/assets/300x300/2.jpg"
import pic3 from "@book-svg-tool/data/assets/300x300/3.jpg"

export const BasicExample = () => {
    const maxWidth = 350;
    return (
        <SectionEx className="multi-display-presets">
            <div style={{ maxWidth, margin: '0 auto' }}>
                <CoverIn
                    pics={[
                        { url: pic1 },
                        { url: pic2 },
                        { url: pic3 },
                    ]}
                />
            </div>
        </SectionEx>
    );
};
