import React from 'react';
import { genAnimatePathMotion, genAnimatePathMotionLoop, genAnimatePathMotionSlide } from '@svg-anim';

/**
 * 路径运动动画测试组件
 */
export const PathMotionTest: React.FC = () => {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* 测试1：纸飞机（8字形往返，自动旋转） */}
      <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
          测试1：纸飞机（8字形往返，自动旋转）
        </h3>
        <svg width="400" height="200" viewBox="0 0 400 200" style={{ background: '#f5f5f5', borderRadius: '4px' }}>
          <g>
            {/* 纸飞机图形 */}
            <g transform="scale(1.5)">
              <path d="M 60 0 L -40 -5 L -50 -35 Z" fill="#94a3b8"></path>
              <path d="M 55 0 L -25 5 L -15 28 Z" fill="#334155"></path>
              <path d="M 60 0 L -40 -5 L -55 20 Z" fill="#ffffff"></path>
              <path d="M 60 0 L -40 -5 L -30 -2 Z" fill="#e2e8f0"></path>
            </g>
            {/* 路径运动动画 */}
            {genAnimatePathMotionLoop(
              "M 50 100 C 120 40 280 160 350 100 C 280 40 120 160 50 100",
              6
            )}
          </g>
        </svg>
      </div>

      {/* 测试2：滑动的方块（不旋转） */}
      <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
          测试2：滑动的方块（不旋转，保持最终状态）
        </h3>
        <svg width="400" height="100" viewBox="0 0 400 100" style={{ background: '#f5f5f5', borderRadius: '4px' }}>
          <rect x="0" y="35" width="30" height="30" fill="#3b82f6" rx="4">
            {genAnimatePathMotionSlide(
              "M 20 50 L 360 50",
              3,
              true
            )}
          </rect>
          {/* 路径参考线（虚线） */}
          <path d="M 20 50 L 360 50" stroke="#ccc" strokeWidth="1" strokeDasharray="5,5" fill="none"/>
        </svg>
      </div>

      {/* 测试3：点击触发的圆形 */}
      <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
          测试3：点击触发的圆形（缓动效果）
        </h3>
        <svg width="400" height="100" viewBox="0 0 400 100" style={{ background: '#f5f5f5', borderRadius: '4px' }}>
          <circle cx="20" cy="50" r="15" fill="#ef4444">
            {genAnimatePathMotion({
              path: "M 20 50 L 360 50",
              durationSeconds: 2,
              rotate: 0,
              isBeginWithClick: true,
              calcMode: 'spline',
              keySplines: "0.42 0 0.58 1"
            })}
          </circle>
          <text x="20" y="90" fontSize="12" fill="#666">点击红色圆形开始动画</text>
        </svg>
      </div>
    </div>
  );
};

export default PathMotionTest;
