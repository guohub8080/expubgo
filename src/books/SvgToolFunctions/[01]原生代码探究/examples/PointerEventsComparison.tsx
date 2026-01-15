export const PointerEventsComparison = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', padding: '20px 0' }}>
            <div style={{ flex: 1, minWidth: '280px', maxWidth: '400px' }}>
                <div style={{ background: '#fef2f2', border: '2px solid #ef4444', borderRadius: '8px', padding: '16px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#991b1b', textAlign: 'center' }}>
                        ❌ pointer-events: auto（不推荐）
                    </h4>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <svg
                            width="250"
                            height="200"
                            viewBox="0 0 250 200"
                            style={{ pointerEvents: 'auto', border: '2px solid #fca5a5', background: '#fef2f2', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            <animate attributeName="opacity" values="1;0.5;1" begin="click" dur="0.5s" />
                            <rect x="75" y="50" width="100" height="100" fill="#ef4444" />
                            <text x="125" y="170" textAnchor="middle" fontSize="11" fill="#991b1b">
                                整个区域都可点击
                            </text>
                        </svg>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, minWidth: '280px', maxWidth: '400px' }}>
                <div style={{ background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '8px', padding: '16px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#166534', textAlign: 'center' }}>
                        ✅ pointer-events: none（推荐）
                    </h4>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <svg
                            width="250"
                            height="200"
                            viewBox="0 0 250 200"
                            style={{ pointerEvents: 'none', border: '2px solid #86efac', background: '#f0fdf4', borderRadius: '4px' }}
                        >
                            <rect
                                x="75"
                                y="50"
                                width="100"
                                height="100"
                                fill="#22c55e"
                                style={{ pointerEvents: 'visiblePainted', cursor: 'pointer' }}
                            >
                                <animate attributeName="opacity" values="1;0.5;1" begin="click" dur="0.5s" />
                            </rect>
                            <text x="125" y="170" textAnchor="middle" fontSize="11" fill="#166534">
                                只有绿色区域可点击
                            </text>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
