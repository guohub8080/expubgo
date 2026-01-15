import { atom, useAtomValue, useSetAtom } from 'jotai'

export interface TransformState {
  rotateX: number
  rotateY: number
  rotateZ: number
  perspective: number
  translateX: number
  translateY: number
  translateZ: number
  scaleX: number
  scaleY: number
  scaleZ: number
  skewX: number
  skewY: number
  transformOrigin: string
}

export const defaultTransform: TransformState = {
  rotateX: 0, rotateY: 0, rotateZ: 0, perspective: 800,
  translateX: 0, translateY: 0, translateZ: 0,
  scaleX: 1, scaleY: 1, scaleZ: 1,
  skewX: 0, skewY: 0,
  transformOrigin: "50% 50%",
}

// ────── transform（纯内存）──────
export const transformAtom = atom<TransformState>(defaultTransform)

export const updateTransformAtom = atom(
  null,
  (get, set, updates: Partial<TransformState>) => {
    set(transformAtom, { ...get(transformAtom), ...updates })
  }
)

export const resetTransformAtom = atom(null, (_get, set) => {
  set(transformAtom, defaultTransform)
})

/**
 * 消费侧薄 hook（保持原 useRotate3DStore API，组件零改动）
 */
export function useRotate3DStore() {
  const transform = useAtomValue(transformAtom)
  const update = useSetAtom(updateTransformAtom)
  const reset = useSetAtom(resetTransformAtom)
  return { transform, update, reset }
}
