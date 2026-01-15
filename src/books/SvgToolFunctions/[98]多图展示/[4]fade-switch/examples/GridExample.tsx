import SectionEx from "@pub-html/basicEx/SectionEx";
import FadeSwitch from "@pub-svg/C3_MultiDisplay/FadeSwitch"
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
                <FadeSwitch
                    pics={[
                        { url: pic1, fadeDuration: 0.5, stayDuration: 1 },
                        { url: pic2, fadeDuration: 0.7, stayDuration: 1.2 },
                        { url: pic3, fadeDuration: 0.4, stayDuration: 0.8 },
                    ]}
                />
                {/* 右上 - 4张图 */}
                <FadeSwitch
                    pics={[
                        { url: pic4, fadeDuration: 0.6, stayDuration: 1.5 },
                        { url: pic5, fadeDuration: 0.9, stayDuration: 0.7 },
                        { url: pic6, fadeDuration: 0.5, stayDuration: 1.3 },
                        { url: pic1, fadeDuration: 0.8, stayDuration: 1 },
                    ]}
                />
                {/* 左下 - 2张图 */}
                <FadeSwitch
                    pics={[
                        { url: pic2, fadeDuration: 1, stayDuration: 2 },
                        { url: pic3, fadeDuration: 0.4, stayDuration: 1.5 },
                    ]}
                />
                {/* 右下 - 5张图 */}
                <FadeSwitch
                    pics={[
                        { url: pic4, fadeDuration: 0.3, stayDuration: 0.8 },
                        { url: pic5, fadeDuration: 0.8, stayDuration: 0.9 },
                        { url: pic6, fadeDuration: 0.6, stayDuration: 1.1 },
                        { url: pic1, fadeDuration: 0.9, stayDuration: 0.7 },
                        { url: pic2, fadeDuration: 0.5, stayDuration: 1.2 },
                    ]}
                />
            </div>
        </SectionEx>
    );
};
