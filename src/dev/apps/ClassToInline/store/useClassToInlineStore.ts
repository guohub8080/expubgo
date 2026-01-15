import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// ────── 输入内容（持久化；旧 zustand key class-to-inline-store 由 migrateZustandStorage 迁移）──────
export const htmlInputAtom = atomWithStorage<string>('class-to-inline.htmlInput', '');
export const cssInputAtom = atomWithStorage<string>('class-to-inline.cssInput', '');

// ────── 输出结果（纯内存，不持久化）──────
export const resultOutputAtom = atom<string>('');

export const setHtmlInputAtom = atom(null, (_get, set, value: string) => set(htmlInputAtom, value));
export const setCssInputAtom = atom(null, (_get, set, value: string) => set(cssInputAtom, value));
export const setResultOutputAtom = atom(null, (_get, set, value: string) => set(resultOutputAtom, value));

/**
 * 消费侧薄 hook（保持原 useClassToInlineStore API，组件零改动）
 */
export function useClassToInlineStore() {
  const htmlInput = useAtomValue(htmlInputAtom);
  const cssInput = useAtomValue(cssInputAtom);
  const resultOutput = useAtomValue(resultOutputAtom);

  const setHtmlInput = useSetAtom(setHtmlInputAtom);
  const setCssInput = useSetAtom(setCssInputAtom);
  const setResultOutput = useSetAtom(setResultOutputAtom);

  return {
    htmlInput,
    cssInput,
    resultOutput,
    setHtmlInput,
    setCssInput,
    setResultOutput,
  };
}
