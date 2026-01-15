const d = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"

export default () => {
    return (
        <svg viewBox="0 0 24 24" aria-label="点赞">
            <g>
                {/* 未点赞状态：空心心形 */}
                <path fill="transparent" stroke="rgb(111, 134, 159)" strokeWidth="1.5" d={d}>
                    {/* 点击时隐藏空心，显示实心 */}
                    <animate
                        attributeName="opacity"
                        from="1"
                        to="0"
                        begin="click"
                        dur="0.2s"
                        fill="freeze"
                    />
                </path>
                {/* 已点赞状态：实心心形（初始隐藏） */}
                <path fill="rgb(249, 24, 128)" opacity="0" d={d}>
                    {/* 点击时显示 */}
                    <animate
                        attributeName="opacity"
                        from="0"
                        to="1"
                        begin="click"
                        dur="0.2s"
                        fill="freeze"
                    />
                </path>
            </g>
        </svg>
    )
}
