# WeChatMsg - 微信聊天组件系统

微信聊天的 React 组件库，支持组合式使用，完全兼容微信公众号。

## 目录结构

```
WeChatMsg/
├── components/           # 基础组件
│   ├── ChatAvatar/      # 头像组件
│   ├── ChatMessage/     # 消息组件
│   └── ChatTimestamp/   # 时间戳组件
├── collections/          # 组合组件
│   └── Messages/        # 消息类型
│       ├── MessageText/ # 文本消息
│       └── MessageImage/ # 图片消息
├── constants.ts         # 常量配置
└── index.ts            # 统一导出
```

## 设计规范

- **容器最大宽度**: 414px（移动端标准）
- **头像尺寸**: 42px，圆角 6px
- **气泡颜色**:
  - 自己的消息: #95EC69（微信绿）
  - 对方的消息: #FFFFFF（白色）
- **文字颜色**:
  - 自己的消息: #FFFFFF（白色）
  - 对方的消息: #111111（黑色）

## 使用示例

```typescript
import { ChatAvatar, MessageText } from "@sns/WeChatMsg";

// 文本消息（对方）
<MessageText
  type="other"
  avatar="https://example.com/avatar.jpg"
  username="张三"
  content="你好！"
  timestamp={new Date()}
/>

// 文本消息（自己）
<MessageText
  type="self"
  content="你好，有什么可以帮助你的吗？"
  timestamp={new Date()}
/>
```

## 特点

- ✅ 完全兼容微信公众号（无 position、无 calc）
- ✅ 组合式设计，灵活自由
- ✅ TypeScript 类型安全
- ✅ 支持多种消息类型（文本、图片等）
- ✅ 内置微信官方样式规范
