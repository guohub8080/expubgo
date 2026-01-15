import * as React from 'react';
import iro from '@jaames/iro';
import { parseHexColor, toHex } from '../utils/color';

export const TestIroComponent: React.FC = () => {
  const pickerRef = React.useRef<HTMLDivElement>(null);
  const [color, setColor] = React.useState('#ff0000');
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    if (pickerRef.current && !isInitialized) {
      try {
        const colorPicker = new iro.ColorPicker(pickerRef.current, {
          width: 280,
          color: color,
          padding: 5
        });

        colorPicker.on('color:change', (newColor: any) => {
          const hex = newColor.hexString || '#ff0000';
          setColor(hex);
        });

        setIsInitialized(true);
      } catch (error) {
        console.error('Error creating test iro.js ColorPicker:', error);
      }
    }

    return () => {
      setIsInitialized(false);
    };
  }, [isInitialized]);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">iro.js 测试组件</h3>
      <div className="mb-4">
        <div>当前颜色: {color}</div>
        <div
          className="w-20 h-20 rounded border mt-2"
          style={{ backgroundColor: color }}
        />
      </div>
      <div ref={pickerRef} style={{ width: 280, height: 280 }} />
    </div>
  );
};

export default TestIroComponent;