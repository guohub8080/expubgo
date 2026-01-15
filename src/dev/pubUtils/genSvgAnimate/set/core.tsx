import React from 'react';
import { defaultTo } from 'es-toolkit/compat';
import { getSvgBegin } from '../../common/getSvgBegin';
import type { GenSetOptions, GenSetVisibilityOptions, GenSetOpacityOptions, GenSetDisplayOptions } from './types';

/**
 * 通用 <set> 元素生成器
 */
export function genSet(options: GenSetOptions): React.ReactElement | null {
  const { attributeName, to } = options;
  const beginType = defaultTo(options.beginType, undefined);
  const delay = defaultTo(options.delay, 0);
  const isFreeze = defaultTo(options.isFreeze, false);
  const durRaw = defaultTo(options.dur, 'indefinite');
  const durStr = typeof durRaw === 'number' ? `${durRaw}s` : durRaw;

  const begin = getSvgBegin(beginType, delay);

  return (
    <set
      attributeName={attributeName}
      to={to}
      dur={durStr}
      fill={isFreeze ? 'freeze' : 'remove'}
      {...(begin && { begin })}
    />
  );
}

/**
 * 瞬间切换 visibility
 */
export function genSetVisibility(options: GenSetVisibilityOptions): React.ReactElement | null {
  return genSet({ attributeName: 'visibility', to: options.to, ...options });
}

/**
 * 瞬间切换 opacity
 */
export function genSetOpacity(options: GenSetOpacityOptions): React.ReactElement | null {
  return genSet({ attributeName: 'opacity', to: String(options.to), ...options });
}

/**
 * 瞬间切换 display
 */
export function genSetDisplay(options: GenSetDisplayOptions): React.ReactElement | null {
  return genSet({ attributeName: 'display', to: options.to, ...options });
}
