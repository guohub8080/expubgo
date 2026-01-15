// ============================================ 朋友圈组合式组件 ============================================
// 所有组件都是独立的，可以自由拼装

// ============================================ Components ============================================
export { default as MomentAvatar } from "./components/MomentAvatar/index";
export { default as MomentContent } from "./components/MomentContent/index";
export { default as MomentTimestamp } from "./components/MomentTimestamp/index";
export { default as MomentLocation } from "./components/MomentLocation/index";
export { default as InteractionBar } from "./components/InteractionBar/index";
export { default as MomentMediaFrame } from "./components/MomentMediaFrame/index";
export { default as LikeButton } from "./components/LikeButton/index";
export { default as MomentComment } from "./components/MomentComment/index";
export type { CommentItem } from "./components/MomentComment/index";

// ============================================ Collections: Images ============================================
export { default as MomentImg1 } from "./collections/Images/MomentImg1/index";
export { default as MomentImg2 } from "./collections/Images/MomentImg2/index";
export { default as MomentImg3 } from "./collections/Images/MomentImg3/index";
export { default as MomentImg4 } from "./collections/Images/MomentImg4/index";
export { default as MomentImg56 } from "./collections/Images/MomentImg56/index";
export { default as MomentImg789 } from "./collections/Images/MomentImg789/index";

// 导出常量（如果外部需要自定义样式）
export {
    MOMENT_CONSTANTS,
    baseStyle,
    baseFlexStyle,
} from "./constants";
