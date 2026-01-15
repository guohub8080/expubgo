import { CSSProperties, ReactNode } from "react";

interface SvgDemoBoxProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

/**
 * SVG 动画演示容器组件
 * 提供统一的边框、背景和居中样式
 */
export const SvgDemoBox = ({ children, className = "", style }: SvgDemoBoxProps) => {
    const containerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
        ...style
    };

    return (
        <div className={className} style={containerStyle}>
            {children}
        </div>
    );
};

/**
 * SVG 元素的外框样式
 * 可以直接应用到 SVG 元素的 style 属性
 */
export const svgBoxStyle: CSSProperties = {
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
    padding: '8px',
};

export default SvgDemoBox;
