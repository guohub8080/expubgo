// ============================================ Arrow Constants ============================================

/** 箭头尺寸 */
export const ARROW_SIZE = 12

/** 边框偏移量（用于形成边框效果） */
export const BORDER_OFFSET = 0.5

/** clip-path 路径 */
export const CLIP_PATH = {
    /** 左箭头：顶点在左侧 */
    LEFT: "polygon(0 50%, 100% 0, 100% 100%)",
    /** 右箭头：顶点在右侧 */
    RIGHT: "polygon(100% 50%, 0 0, 0 100%)",
} as const
