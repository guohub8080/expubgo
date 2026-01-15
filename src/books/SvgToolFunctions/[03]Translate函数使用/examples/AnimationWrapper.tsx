import { useState } from "react";
import { RefreshCw } from "lucide-react";

interface AnimationWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export const AnimationWrapper = ({ children, className = "" }: AnimationWrapperProps) => {
    const [key, setKey] = useState(0);

    const handleReplay = () => {
        setKey(prev => prev + 1);
    };

    return (
        <div className={`animation-wrapper ${className}`}>
            <div key={key} className="animation-content">
                {children}
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
