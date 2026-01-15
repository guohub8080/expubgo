// ============================================ 微信聊天组合式组件 ============================================
// 所有组件都是独立的，可以自由拼装

// ============================================ Components ============================================
export { default as ChatMessageSelf } from "./components/ChatMessageSelf/index.tsx";
export { default as ChatMessageOther } from "./components/ChatMessageOther/index.tsx";

// ============================================ Collections: Messages ============================================
// export { default as MessageText } from "./collections/Messages/MessageText/index";
// export { default as MessageImage } from "./collections/Messages/MessageImage/index";

// 导出常量（如果外部需要自定义样式）
export {
    CHAT_MSG_CONSTANTS,
    baseStyle,
    baseFlexStyle,
} from "./constants.ts";
