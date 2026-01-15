# SVG React 转换器

一个强大的SVG到React组件转换工具，支持自动转换、代码优化和多种导出格式。**默认支持无障碍访问**，生成的组件符合Web无障碍标准。

## 主要功能

### 🔄 双向转换
- **SVG → React**: 将纯SVG代码转换为可复用的React组件
- **React → SVG**: 从React组件中提取SVG部分

### 🎨 语法高亮编辑器
- 支持XML/JSX语法高亮
- VS Code暗色主题
- 纯文本/语法高亮模式切换
- 全屏代码查看功能

### ⚙️ 丰富的转换选项
- 组件名称自定义或匿名模式
- TypeScript类型定义（Interface/行内Type）
- Props展开策略
- 多种导出格式
- SVG代码优化

## 转换选项详解

### 基础配置

#### 组件名称
- **命名组件**: 输入组件名称，生成标准的React组件
- **匿名模式**: 留空则生成匿名箭头函数，适合一次性使用

```typescript
// 命名组件
const MyIcon: React.FC<MyIconProps> = (props) => <svg>...</svg>;
export default MyIcon;

// 匿名组件
export default (props: React.SVGProps<SVGSVGElement>) => <svg>...</svg>;
```

#### 图标模式
- **标准模式**: 保留完整的SVG结构和属性
- **图标模式**: 优化为图标使用，移除尺寸限制，适合图标库

#### 保留尺寸
- **启用**: 保留原始SVG的width/height属性
- **禁用**: 移除固定尺寸，让组件可通过props控制大小

#### Title/Desc支持
🌟 **默认开启** - 为SVG添加可访问性属性，提升无障碍体验：

```typescript
// 默认生成的组件支持title/desc
<MyIcon
  title="删除图标"
  desc="点击删除当前项目，此操作不可撤销"
  width={24}
  height={24}
/>

// 渲染结果
<svg width="24" height="24">
  <title>删除图标</title>
  <desc>点击删除当前项目，此操作不可撤销</desc>
  <!-- 图标内容 -->
</svg>
```

**作用说明**:
- **Title**: 为图形提供简短标题，鼠标悬停显示tooltip
- **Desc**: 为复杂图形提供详细描述，帮助视障用户理解
- **无障碍**: 屏幕阅读器会朗读title和desc内容
- **标准**: 符合Web无障碍标准(WCAG)

### 代码格式

#### SVG优化
自动清理SVG代码，减少文件体积：
- 移除注释 (`<!-- -->`)
- 移除元数据 (`<metadata>`)
- 移除DOCTYPE声明
- 移除XML处理指令
- 清理开发工具生成的冗余信息

**优化前后对比**:
```xml
<!-- 优化前 -->
<!-- Generator: Adobe Illustrator 24.0.0 -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN">
<svg xmlns="http://www.w3.org/2000/svg">
  <metadata>Created by Adobe Illustrator</metadata>
  <!-- 这是注释 -->
  <circle cx="50" cy="50" r="40"/>
</svg>

<!-- 优化后 -->
<svg xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40"/>
</svg>
```

#### 行内Type vs Interface
TypeScript类型定义的两种方式：

**Interface模式** (推荐用于复杂组件):
```typescript
interface MyIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
  desc?: string;
}

const MyIcon: React.FC<MyIconProps> = (props) => (
  <svg>{props.title && <title>{props.title}</title>}</svg>
);
```

**行内Type模式** (适合简单组件):
```typescript
const MyIcon: React.FC<{ title?: string; desc?: string; } & React.SVGProps<SVGSVGElement>> = (props) => (
  <svg>{props.title && <title>{props.title}</title>}</svg>
);
```

#### 代码格式化
- **Prettier**: 自动格式化代码，统一风格
- **单引号/双引号**: 选择字符串引号风格
- **缩进大小**: 设置代码缩进空格数

### Props展开策略

#### Props在前
```typescript
const MyIcon = (props) => (
  <svg {...props} width="24" height="24">
    {/* 默认属性在props后面 */}
  </svg>
);
```

#### Props在后
```typescript
const MyIcon = (props) => (
  <svg width="24" height="24" {...props}>
    {/* 默认属性在props前面 */}
  </svg>
);
```

#### 不展开
```typescript
const MyIcon = (props) => (
  <svg width="24" height="24">
    {/* 不展开props，需要手动传递 */}
  </svg>
);
```

### 导出方式

- **默认导出**: `export default MyIcon;`
- **命名导出**: `export { MyIcon };`
- **两者都有**: 同时支持两种导出方式

## 快速预设

### 基础组件
适合标准的React组件开发，保留完整的SVG结构。

### 图标组件
优化图标使用场景：
- 移除固定尺寸
- 启用Title/Desc支持
- 启用SVG优化
- 适合图标库开发

### 内联SVG
适合直接在代码中嵌入的SVG：
- 图标模式
- 保留尺寸
- 自定义样式类
- 最大程度优化

### TypeScript
严格TypeScript开发：
- 展开Props
- 完整类型定义
- 格式化代码
- 严格语法检查

## 使用示例

### 1. 基础图标转换
**输入SVG**:
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
</svg>
```

**输出React组件**:
```typescript
import React from 'react';

interface StarIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const StarIcon: React.FC<StarIconProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
};

export default StarIcon;
```

### 2. 在项目中使用
```typescript
// 基础使用
<StarIcon width={32} height={32} />

// 带颜色
<StarIcon fill="gold" stroke="orange" />

// 带可访问性描述
<StarIcon
  title="收藏"
  desc="点击收藏此项目"
  className="star-button"
  onClick={handleFavorite}
/>
```

## 最佳实践

1. **图标开发**: 使用"图标组件"预设，充分利用默认的Title/Desc支持
2. **复杂图形**: 使用Interface模式，保持代码清晰
3. **性能优化**: 启用SVG优化，减少文件体积
4. **无障碍**: 默认已支持无障碍，建议为重要图标添加有意义的title/desc
5. **代码风格**: 启用Prettier，保持团队代码风格统一

## 注意事项

- SVG中的 `class` 属性会自动转换为 `className`
- 某些SVG工具生成的元数据会被优化功能清理
- 匿名组件适合简单场景，复杂组件建议使用命名方式
- Title/Desc属性对屏幕阅读器友好，建议为重要图标添加