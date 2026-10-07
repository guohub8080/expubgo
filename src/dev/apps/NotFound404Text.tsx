/** @jsxImportSource react */
/**
 * "404" 矢量大字——字形轮廓固化自品牌字体 minsans-v 的 wght 700 实例
 * （fontTools instancer + SVGPathPen 提取，UPM=1000，字宽 4/0/4 = 665/686/665）。
 * 好处：预渲染 HTML 即最终视觉（不依赖运行时字体加载），任何设备渲染一致。
 * 填充为品牌渐变（primary → cyan-400，色值走 CSS 变量保持主题跟随）。
 */
import React from 'react'

const DIGIT_4 = 'M554 -20H368V693H437L240 292H651V118H24V232L297 770H554Z'
const DIGIT_0 = 'M343 -34Q197 -34 119.5 70.0Q42 174 42 374Q42 575 119.5 679.5Q197 784 343 784Q489 784 566.5 679.5Q644 575 644 374Q644 174 566.5 70.0Q489 -34 343 -34ZM343 140Q397 140 425.5 199.0Q454 258 454 374Q454 491 425.5 550.5Q397 610 343 610Q289 610 260.5 550.5Q232 491 232 374Q232 258 260.5 199.0Q289 140 343 140Z'

const NotFound404Text: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 2016 818"
        className={className}
        role="img"
        aria-label="404"
    >
        <defs>
            {/* 整体渐变的防弹实现：渐变作用在铺满 viewBox 的 rect 上（objectBoundingBox
                即全图，一条对角贯穿），字形以白色 mask 裁形。避开两个实现差异坑：
                逐 path fill 渐变 = objectBoundingBox 逐字各来一遍；
                userSpaceOnUse 坐标系在翻转 transform 下的求值空间各浏览器有歧义 */}
            <linearGradient id="notfound-404-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1976D2" />
                <stop offset="50%" stopColor="#1976D2" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <mask id="notfound-404-mask">
                {/* 字形 y 向上（全包围盒：顶 784、底 -34），翻转平移 784 后紧贴
                    viewBox（高 818）；白色 = mask 全显，裁出 404 形状 */}
                <g transform="translate(0,784) scale(1,-1)" fill="#fff">
                    <path d={DIGIT_4} />
                    <path d={DIGIT_0} transform="translate(665,0)" />
                    <path d={DIGIT_4} transform="translate(1351,0)" />
                </g>
            </mask>
        </defs>
        <rect x="0" y="0" width="2016" height="818" fill="url(#notfound-404-grad)" mask="url(#notfound-404-mask)" />
    </svg>
)

export default NotFound404Text
