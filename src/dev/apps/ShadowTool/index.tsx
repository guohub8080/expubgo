import React, { useState } from 'react';
import ShadowPreview from './components/ShadowPreview';
import ShadowControls from './components/ShadowControls';
import ShadowPresets from './components/ShadowPresets';
import type { ColorFormat } from './utils/shadowUtils';

const ShadowTool: React.FC = () => {
  // 颜色格式状态
  const [colorFormat, setColorFormat] = useState<ColorFormat>('hex');

  return (
    <div className="w-full px-4 pb-4 pt-0">
      <div className="w-full max-w-[1200px] mx-auto">
        {/* 三栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 左侧：预设阴影 */}
          <div className="lg:col-span-3">
            <ShadowPresets />
          </div>

          {/* 中间：预览和代码 */}
          <div className="lg:col-span-6">
            <ShadowPreview colorFormat={colorFormat} />
          </div>

          {/* 右侧：控制面板 */}
          <div className="lg:col-span-3">
            <ShadowControls colorFormat={colorFormat} onColorFormatChange={setColorFormat} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShadowTool;
