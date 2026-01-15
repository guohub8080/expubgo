import SectionEx from "@pub-html/basicEx/SectionEx";
import FadeSwitch from "@pub-svg/C3_MultiDisplay/FadeSwitch"
import pic4 from "@book-svg-tool/data/assets/300x300/4.jpg"
import pic5 from "@book-svg-tool/data/assets/300x300/5.jpg"
import pic6 from "@book-svg-tool/data/assets/300x300/6.jpg"

export const QuickSwitchExample = () => {
    const maxWidth = 350;
    return (
        <SectionEx className="multi-display-presets">
            <div style={{ maxWidth, margin: '0 auto' }}>
                <FadeSwitch
                    pics={[
                        { url: pic4, fadeDuration: 0.3, stayDuration: 0.5 },
                        { url: pic5, fadeDuration: 0.3, stayDuration: 0.5 },
                        { url: pic6, fadeDuration: 0.3, stayDuration: 0.5 },
                    ]}
                />
            </div>
        </SectionEx>
    );
};
