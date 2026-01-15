# CSS 函数快捷预设

本目录包含模仿 Tailwind CSS 的快捷预设函数，用于简化常用样式的设置。

## 使用示例

```typescript
import {px, py, mt, rounded, bgColor} from "@pub-utils/cssFunctions"

// 组合使用，展开到样式中
const style: CSSProperties = {
    ...px(20),        // 左右内边距各 10px
    ...py(10),        // 上下内边距各 5px
    ...mt(15),        // 上外边距 15px
    ...rounded(8),    // 圆角 8px
    ...bgColor("white")
}
```

## 可用函数

### 间距类 (Padding & Margin)

| 函数 | 说明 |
|------|------|
| `p(value)` | 内边距 - 所有方向 |
| `px(value)` | 内边距 - 水平方向 (左右各一半) |
| `py(value)` | 内边距 - 垂直方向 (上下各一半) |
| `pt/pr/pb/pl(value)` | 内边距 - 上/右/下/左 |
| `m(value)` | 外边距 - 所有方向 |
| `mx(value)` | 外边距 - 水平方向 (左右各一半) |
| `my(value)` | 外边距 - 垂直方向 (上下各一半) |
| `mt/mr/mb/ml(value)` | 外边距 - 上/右/下/左 |

### 边框类 (Border)

| 函数 | 说明 |
|------|------|
| `borderWidth(value)` | 边框宽度 - 所有方向 |
| `borderX/borderY(value)` | 边框宽度 - 水平/垂直方向 |
| `borderTop/Right/Bottom/Left(value)` | 边框宽度 - 单边 |
| `borderColor(color)` | 边框颜色 |
| `rounded(value)` | 圆角 - 所有方向 |
| `roundedTl/Tr/Br/Bl(value)` | 圆角 - 单角 |
| `roundedT/R/B/L(value)` | 圆角 - 顶部/右侧/底部/左侧 |

### 尺寸类 (Size)

| 函数 | 说明 |
|------|------|
| `w/h(value)` | 宽度/高度 |
| `maxW/maxH(value)` | 最大宽度/高度 |
| `minW/minH(value)` | 最小宽度/高度 |

### 布局类 (Layout)

| 函数 | 说明 |
|------|------|
| `display(value)` | 显示方式 |
| `flexDir(value)` | Flex 方向 |
| `justify(value)` | Flex 主轴对齐 |
| `items(value)` | Flex 交叉轴对齐 |
| `position(value)` | 定位方式 |
| `top/right/bottom/left(value)` | 位置偏移 |
| `z(value)` | Z轴层级 |

### 颜色类 (Color)

| 函数 | 说明 |
|------|------|
| `textColor(color)` | 文字颜色 |
| `bgColor(color)` | 背景颜色 |
| `borderColor(color)` | 边框颜色 |

### 文字类 (Typography)

| 函数 | 说明 |
|------|------|
| `textSize(value)` | 字体大小 |
| `fontWeight(value)` | 字体粗细 |
| `textAlign(value)` | 文字对齐 |
| `leading(value)` | 行高 |

### 其他

| 函数 | 说明 |
|------|------|
| `opacity(value)` | 透明度 (0-1) |

## 注意事项

- `px`, `py`, `mx`, `my` 等函数会将值平分到两侧，例如 `px(30)` 返回 `{paddingLeft: 15, paddingRight: 15}`
- 所有函数返回 `CSSProperties` 对象，可以使用展开运算符 `...` 合并到样式中
