# genAnimateTranslate

平移动画生成器 - 这是最基础的位移动画生成器，具有普遍基准意义。基于 `genSvgKeys` 的设计理念，支持复杂的时间线配置。

## 📁 文件结构

```
genAnimateTranslate/
├── index.tsx      # 统一导出入口
├── types.ts       # 类型定义
├── core.tsx       # 核心函数
├── presets.tsx    # 预设效果
├── helpers.tsx    # 辅助函数和常量
└── README.md      # 说明文档（本文件）
```

## 🚀 快速开始

### 基本使用

```tsx
import { genAnimateTranslate } from '@/utils/genSvgAnimateTransform/genAnimateTranslate';

// 简单平移
<svg>
  <g>
    {genAnimateTranslate({
      timeline: [
        { durationSeconds: 2, toValue: { x: 100, y: 50 } }
      ]
    })}
    <rect width="50" height="50" fill="red" />
  </g>
</svg>
```

### 使用预设

```tsx
import { translatePresets } from '@/utils/genSvgAnimateTransform/genAnimateTranslate';

// 左右摇摆
{translatePresets.swingHorizontal(50, 1)}

// 上下浮动
{translatePresets.floatVertical(20, 3)}

// S 形路径
{translatePresets.sPath(100, 50, 3)}
```

## 📖 核心概念

### 时间线配置

基于 `genSvgKeys` 的时间线思想，每个动画由多个时间段组成：

```tsx
genAnimateTranslate({
  initX: 0,      // 起点 X
  initY: 0,      // 起点 Y
  timeline: [
    // 第一段：向右移动
    { 
      durationSeconds: 1,                    // 持续 1 秒
      toValue: { x: 100 },               // 移动到 x=100
      keySplines: '0.42 0 0.58 1'        // 缓动曲线
    },
    // 第二段：向下移动
    { 
      durationSeconds: 1, 
      toValue: { y: 50 }                 // 移动到 y=50（x 保持 100）
    },
    // 第三段：保持位置
    { 
      durationSeconds: 2                     // 停留 2 秒（不提供 toValue）
    },
    // 第四段：回到原点
    { 
      durationSeconds: 1, 
      toValue: { x: 0, y: 0 } 
    }
  ],
  loopCount: 0  // 无限循环
})
```

### 特点

1. **自动坐标补全**：只写 `{ x: 100 }`，Y 自动保持上次的值
2. **位置保持**：不写 `toValue` 就保持当前位置（用于延迟效果）
3. **独立 X/Y 控制**：X 和 Y 可以有不同的运动节奏
4. **时间跨度驱动**：基于 `durationSeconds` 而非绝对时间

## 📚 API 文档

### 核心函数

#### `genAnimateTranslate(config)`

生成平移动画的主函数。

**参数：**

```typescript
interface TranslateAnimationConfig {
  initX?: number;                    // 初始 X 坐标，默认 0
  initY?: number;                    // 初始 Y 坐标，默认 0
  timeline: TranslateTimelineSegment[];  // 时间线段数组（必填）
  delay?: number;                    // 初始延迟（秒），默认 0
  additive?: boolean;                // 是否累加变换，默认 true
  beginType?: SvgBeginEventType;     // 触发事件类型，默认 undefined（自动开始）
  calcMode?: 'spline' | 'linear' | 'discrete' | 'paced';  // 动画模式
  freeze?: boolean;                  // 是否保持最终状态，默认 false
  loopCount?: number;                // 循环次数，0=无限，默认 1
}

interface TranslateTimelineSegment {
  keySplines?: string;               // 缓动曲线，默认 "0.42 0 0.58 1"
  durationSeconds: number;               // 时间跨度（秒）
  toValue?: { x?: number; y?: number };  // 目标位置（可选）
}
```

### 预设效果

```tsx
import { translatePresets } from '@/utils/genSvgAnimateTransform/genAnimateTranslate';

translatePresets.moveRight(distance, duration)     // 向右移动
translatePresets.moveLeft(distance, duration)      // 向左移动
translatePresets.moveUp(distance, duration)        // 向上移动
translatePresets.moveDown(distance, duration)      // 向下移动
translatePresets.swingHorizontal(distance, dur)    // 左右摇摆
translatePresets.floatVertical(distance, dur)      // 上下浮动
translatePresets.sPath(width, height, dur)         // S 形路径
translatePresets.zPath(width, height, dur)         // Z 字形路径
translatePresets.circlePath(radius, dur)           // 圆形路径（近似）
translatePresets.parabola(distance, height, dur)   // 抛物线
translatePresets.delayedBounce(dist, move, stay)   // 移动-停留-返回
translatePresets.elastic(distance, dur)            // 弹性效果
translatePresets.stepped(steps, stepDur)           // 阶梯跳转
translatePresets.shake(intensity, dur)             // 抖动
translatePresets.scrollHorizontal(distance, dur)   // 无限滚动
translatePresets.onClick(x, y, dur)                // 点击触发
```

### 辅助函数

#### `genAnimateTranslateByDirection(direction, distance, duration?, options?)`

根据方向快速创建动画。

```tsx
import { 
  genAnimateTranslateByDirection, 
  TranslateDirection 
} from '@/utils/genSvgAnimateTransform/genAnimateTranslate';

// 向右移动 100px
genAnimateTranslateByDirection(TranslateDirection.RIGHT, 100, 2);

// 左上移动 50px
genAnimateTranslateByDirection(TranslateDirection.LEFT_UP, 50, 1);
```

#### `genAnimateTranslateLoop(x, y, duration?, options?)`

创建往返循环动画。

```tsx
// 水平往返
genAnimateTranslateLoop(100, 0, 1.5);

// 对角线往返
genAnimateTranslateLoop(100, 100, 2);
```

#### `genAnimateTranslatePath(path, totalDuration?, options?)`

根据路径点数组创建动画。

```tsx
// 正方形路径
genAnimateTranslatePath(
  [
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
    { x: 0, y: 0 }
  ],
  4  // 总时长 4 秒
);
```

### 方向常量

```tsx
import { TranslateDirection } from '@/utils/genSvgAnimateTransform/genAnimateTranslate';

TranslateDirection.RIGHT        // { x: 1, y: 0 }
TranslateDirection.LEFT         // { x: -1, y: 0 }
TranslateDirection.UP           // { x: 0, y: -1 }
TranslateDirection.DOWN         // { x: 0, y: 1 }
TranslateDirection.RIGHT_UP     // { x: 1, y: -1 }
TranslateDirection.RIGHT_DOWN   // { x: 1, y: 1 }
TranslateDirection.LEFT_UP      // { x: -1, y: -1 }
TranslateDirection.LEFT_DOWN    // { x: -1, y: 1 }
```

## 🎨 示例

### 1. 简单移动

```tsx
genAnimateTranslate({
  timeline: [
    { durationSeconds: 2, toValue: { x: 100, y: 50 } }
  ]
})
```

### 2. 多段动画

```tsx
genAnimateTranslate({
  timeline: [
    { durationSeconds: 1, toValue: { x: 100 } },      // 向右
    { durationSeconds: 1, toValue: { y: 100 } },      // 向下
    { durationSeconds: 1, toValue: { x: 0 } },        // 向左
    { durationSeconds: 1, toValue: { y: 0 } }         // 向上
  ],
  loopCount: 0
})
```

### 3. 位置保持（延迟效果）

```tsx
genAnimateTranslate({
  timeline: [
    { durationSeconds: 1, toValue: { x: 100 } },  // 移动
    { durationSeconds: 2 },                        // 保持 2 秒
    { durationSeconds: 1, toValue: { x: 0 } }     // 返回
  ],
  loopCount: 0
})
```

### 4. 点击触发

```tsx
genAnimateTranslate({
  timeline: [
    { durationSeconds: 1, toValue: { x: 100, y: 50 } }
  ],
  beginType: 'click',
  freeze: true  // 动画结束后保持最终状态
})
```

### 5. 离散跳转（无过渡）

```tsx
genAnimateTranslate({
  timeline: [
    { durationSeconds: 0.5, toValue: { x: 50 } },
    { durationSeconds: 0.5, toValue: { x: 100 } },
    { durationSeconds: 0.5, toValue: { x: 150 } }
  ],
  calcMode: 'discrete'  // 瞬间跳转
})
```

## 💡 设计理念

### 为什么拆分成文件夹？

1. **模块化**：核心逻辑、预设、辅助函数各司其职
2. **可维护性**：每个文件职责单一，易于修改和扩展
3. **可读性**：不再是 450+ 行的大文件，结构清晰
4. **可扩展性**：新增预设只需修改 `presets.tsx`

### 与其他 gen 函数的一致性

保持与 `genAnimateRotate`、`genAnimateScale` 等函数相同的设计风格：
- 使用 `timeline` 时间线配置
- 支持 `keySplines` 缓动曲线
- 支持 `loopCount`、`delay`、`freeze` 等通用参数
- 提供丰富的预设和辅助函数

## 🔗 相关工具

- `genSvgKeys` - SVG 动画参数生成器（底层依赖）
- `genAnimateRotate` - 旋转动画生成器
- `genAnimateScale` - 缩放动画生成器
- `genAnimateBreathe` - 呼吸动画生成器

