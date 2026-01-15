export const ClickEventDemo = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
            <svg
                width="300"
                height="200"
                viewBox="0 0 300 200"
                style={{ pointerEvents: 'none', border: '2px dashed #9ca3af', background: '#f9fafb', borderRadius: '8px' }}
            >
                <animate attributeName="width" from="300" to="400" begin="click" dur="1s" fill="freeze" />

                <rect
                    x="50"
                    y="50"
                    width="100"
                    height="100"
                    fill="#3b82f6"
                    style={{ pointerEvents: 'visiblePainted', cursor: 'pointer' }}
                >
                    <animate attributeName="height" from="100" to="50" begin="click" dur="1s" fill="freeze" />
                </rect>

                <text x="100" y="170" textAnchor="middle" fontSize="12" fill="#6b7280">
                    点击蓝色矩形
                </text>
            </svg>
        </div>
    );
};
