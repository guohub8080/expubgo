import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { cloneElement, isValidElement, ReactNode } from "react";

interface SvgWrapperProps {
    children: ReactNode;
    showReplayButton?: boolean;
}

/**
 * SVG 预览包装组件
 *
 * 为 SVG 动画示例提供统一的预览样式和重播功能
 */
export const SvgWrapper = ({ children, showReplayButton = false }: SvgWrapperProps) => {
    const [replayKey, setReplayKey] = useState(0);

    const handleReplay = () => {
        setReplayKey(prev => prev + 1);
    };

    const svgContent = (() => {
        if (isValidElement(children) && children.type === 'svg') {
            return cloneElement(children, {
                style: {
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb',
                    padding: '8px',
                    ...children.props.style
                }
            });
        }
        return children;
    })();

    if (!showReplayButton) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {svgContent}
            </div>
        );
    }

    return (
        <div>
            <div key={replayKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {svgContent}
            </div>
            <button
                onClick={handleReplay}
                className="replay-button"
                style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    background: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    color: '#666',
                    transition: 'all 0.2s',
                    margin: '10px auto 0'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.borderColor = '#999';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#ddd';
                }}
            >
                <RefreshCw size={16} />
                重播动画
            </button>
        </div>
    );
};
