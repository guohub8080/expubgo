import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type ColorMode = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'oklch';

export interface ColorControlState {
  colorMode: ColorMode;
  enableAlpha: boolean;
  alpha: number;
}

const STORAGE_KEY = 'color-control-state';

const defaultState: ColorControlState = {
  colorMode: 'hex',
  enableAlpha: false,
  alpha: 1,
};

// 持久化状态（单 key 裸 JSON，与旧 useState 版存储格式一致，老数据无缝兼容）
export const colorControlAtom = atomWithStorage<ColorControlState>(STORAGE_KEY, defaultState);

/** 设置颜色模式 */
export const setColorModeAtom = atom(null, (get, set, mode: ColorMode) => {
  set(colorControlAtom, { ...get(colorControlAtom), colorMode: mode });
});

/**
 * 开关透明度（原 useEffect 联动语义收进 write atom）：
 * 开启且 alpha 为 1 → 落到半透明 0.5；关闭 → 强制 alpha 为 1
 */
export const setEnableAlphaAtom = atom(null, (get, set, enable: boolean) => {
  const prev = get(colorControlAtom);
  let alpha = prev.alpha;
  if (enable && alpha === 1) alpha = 0.5;
  if (!enable) alpha = 1;
  set(colorControlAtom, { ...prev, enableAlpha: enable, alpha });
});

/** 设置透明度（clamp 0-1） */
export const setAlphaAtom = atom(null, (get, set, alpha: number) => {
  set(colorControlAtom, { ...get(colorControlAtom), alpha: Math.max(0, Math.min(1, alpha)) });
});

// ---- 消费侧薄 hook（保持原 useColorControl API，组件零改动）----
// 状态本体是全局 atom：多组件共享同一份状态（旧 useState 版每实例一份副本，仅靠 localStorage 弱同步）
export function useColorControl() {
  const state = useAtomValue(colorControlAtom);
  const setColorMode = useSetAtom(setColorModeAtom);
  const setEnableAlpha = useSetAtom(setEnableAlphaAtom);
  const setAlpha = useSetAtom(setAlphaAtom);
  return { ...state, setColorMode, setEnableAlpha, setAlpha };
}
