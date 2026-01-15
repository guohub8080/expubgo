/**
 * SVG 动画标签生成器（分发器）
 * @description 提供各种类型的 SVG 动画生成函数
 */

import React from 'react';
import { getSvgBegin } from '@pub-utils/common/getSvgBegin';

// ==================== 导入工具类型 ====================
import { 
  getElementBounds,
  getOriginNumByText,
  type ElementBoundsType,
  type OriginPosition
} from '../common/getElementBounds.ts';

// ==================== 导入 ====================
import {
  genAnimateFloat,
  type FloatOptions
} from './float/index.tsx';

import { floatingPresets } from './animatePresetFloat.tsx';

import {
  genAnimateTranslate,
  translatePresets,
  movePresets,
  loopPresets,
  pathPresets,
  effectPresets,
  TranslateDirection,
  genAnimateTranslateByDirection,
  genAnimateTranslateLoop,
  genAnimateTranslatePath,
  type TranslateAnimationConfig,
  type TranslateTimelineSegment,
  type Point2D,
} from './translate/index.tsx';

import {
  genAnimateSoftBlink,
  softBlinkPresets,
  genAnimateHardBlink,
  hardBlinkPresets,
  type SoftBlinkOptions,
  type HardBlinkOptions,
} from './blink/index.tsx';

import {
  genAnimateScale,
  scalePresets,
  centerScaleStyle,
  ScaleValue,
  genAnimateScaleSimple,
  genAnimateScaleLoop,
  genAnimateScalePulse,
  genAnimateScalePath,
  genAnimateScaleBounce,
  type ScaleAnimationConfig,
  type ScaleTimelineSegment,
} from './scale/index.tsx';

import {
  genAnimateBreathe,
  breathePresets,
  centerBreatheStyle,
  type BreatheOptions
} from './breathe/index.tsx';

import {
  genAnimateRotate,
  rotatePresets,
  getCenterRotateStyle,
  RotateDirection,
  genAnimateRotateByAngle,
  genAnimateRotateLoop,
  genAnimateRotateSwing,
  genAnimateRotatePath,
  type RotateAnimationConfig,
  type RotateTimelineSegment,
  type RotateOrigin,
} from './rotate/index.tsx';

import {
  genAnimateOpacity,
  opacityPresets,
  OpacityValue,
  genAnimateOpacityFade,
  genAnimateOpacityLoop,
  genAnimateOpacityPath,
  type OpacityAnimationConfig,
  type OpacityTimelineSegment,
} from './opacity/index.tsx';

import {
  genAnimateSkewX,
  skewXPresets,
  SkewXAngle,
  genAnimateSkewXSimple,
  genAnimateSkewXLoop,
  genAnimateSkewXSwing,
  genAnimateSkewXPath,
  type SkewXAnimationConfig,
  type SkewXTimelineSegment,
} from './skewX/index.tsx';

import {
  genAnimateSkewY,
  skewYPresets,
  SkewYAngle,
  genAnimateSkewYSimple,
  genAnimateSkewYLoop,
  genAnimateSkewYSwing,
  genAnimateSkewYPath,
  type SkewYAnimationConfig,
  type SkewYTimelineSegment,
} from './skewY/index.tsx';

import {
  genAnimatePathMotion,
  genAnimatePathMotionLoop,
  genAnimatePathMotionSlide,
  type PathMotionAnimationConfig,
  type PathMotionRotateMode,
} from './pathMotion/index.tsx';

import {
  genAnimatePathStroke,
  type PathStrokeAnimationConfig,
  type PathStrokeTimelineSegment,
} from './pathStroke/index.tsx';

import {
  genAnimateExtrude,
  type extrudeOptions,
} from './extrude/index.tsx';

import {
  genSet,
  genSetVisibility,
  genSetOpacity,
  genSetDisplay,
  type SetOptions,
  type GenSetOptions,
  type GenSetVisibilityOptions,
  type GenSetOpacityOptions,
  type GenSetDisplayOptions,
} from './set/index.tsx';

// ==================== 导出工具类型 ====================
export {
  getElementBounds,
  getOriginNumByText,
  type ElementBoundsType,
  type OriginPosition
};

// ==================== 导出浮动动画 ====================
export {
  genAnimateFloat,
  floatingPresets,
  type FloatOptions
};

// ==================== 导出平移动画 ====================
export {
  genAnimateTranslate,
  translatePresets,
  movePresets,
  loopPresets,
  pathPresets,
  effectPresets,
  TranslateDirection,
  genAnimateTranslateByDirection,
  genAnimateTranslateLoop,
  genAnimateTranslatePath,
  type TranslateAnimationConfig,
  type TranslateTimelineSegment,
  type Point2D,
};

// ==================== 导出闪烁动画 ====================
export {
  genAnimateSoftBlink,
  softBlinkPresets,
  genAnimateHardBlink,
  hardBlinkPresets,
  type SoftBlinkOptions,
  type HardBlinkOptions,
};

// ==================== 导出缩放动画 ====================
export {
  genAnimateScale,
  scalePresets,
  centerScaleStyle,
  ScaleValue,
  genAnimateScaleSimple,
  genAnimateScaleLoop,
  genAnimateScalePulse,
  genAnimateScalePath,
  genAnimateScaleBounce,
  type ScaleAnimationConfig,
  type ScaleTimelineSegment,
};

// ==================== 导出呼吸动画 ====================
export {
  genAnimateBreathe,
  breathePresets,
  centerBreatheStyle,
  type BreatheOptions
};

// ==================== 导出旋转动画 ====================
export {
  genAnimateRotate,
  rotatePresets,
  getCenterRotateStyle,
  RotateDirection,
  genAnimateRotateByAngle,
  genAnimateRotateLoop,
  genAnimateRotateSwing,
  genAnimateRotatePath,
  type RotateAnimationConfig,
  type RotateTimelineSegment,
  type RotateOrigin,
};

// ==================== 导出不透明度动画 ====================
export {
  genAnimateOpacity,
  opacityPresets,
  OpacityValue,
  genAnimateOpacityFade,
  genAnimateOpacityLoop,
  genAnimateOpacityPath,
  type OpacityAnimationConfig,
  type OpacityTimelineSegment,
};

// ==================== 导出水平斜切动画 ====================
export {
  genAnimateSkewX,
  skewXPresets,
  SkewXAngle,
  genAnimateSkewXSimple,
  genAnimateSkewXLoop,
  genAnimateSkewXSwing,
  genAnimateSkewXPath,
  type SkewXAnimationConfig,
  type SkewXTimelineSegment,
};

// ==================== 导出垂直斜切动画 ====================
export {
  genAnimateSkewY,
  skewYPresets,
  SkewYAngle,
  genAnimateSkewYSimple,
  genAnimateSkewYLoop,
  genAnimateSkewYSwing,
  genAnimateSkewYPath,
  type SkewYAnimationConfig,
  type SkewYTimelineSegment,
};

// ==================== 导出路径运动动画 ====================
export {
  genAnimatePathMotion,
  genAnimatePathMotionLoop,
  genAnimatePathMotionSlide,
  type PathMotionAnimationConfig,
  type PathMotionRotateMode,
};

// ==================== 导出路径描边动画 ====================
export {
  genAnimatePathStroke,
  type PathStrokeAnimationConfig,
  type PathStrokeTimelineSegment,
};

// ==================== 导出挤出动画 ====================
export {
  genAnimateExtrude,
  type extrudeOptions,
};

// ==================== 导出瞬间切换（set） ====================
export {
  genSet,
  genSetVisibility,
  genSetOpacity,
  genSetDisplay,
  type SetOptions,
  type GenSetOptions,
  type GenSetVisibilityOptions,
  type GenSetOpacityOptions,
  type GenSetDisplayOptions,
};

// ==================== 自定义变换 ====================

export interface CustomTransformOptions {
  /** 变换类型，默认 'translate' */
  type?: 'translate' | 'rotate' | 'scale' | 'skewX' | 'skewY';
  /** 关键帧值数组（必填） */
  values: string[];
  /** 动画时长（秒），默认 4 */
  duration?: number;
  /** 贝塞尔曲线数组（长度应为 values.length - 1） */
  keySplines?: string[];
  /** 重复次数，0 表示无限循环，默认 1 */
  repeatCount?: number;
  /** 初始延迟（秒），默认 0 */
  delay?: number;
  /** 触发事件类型，如 'click' */
  beginType?: SvgBeginEventType;
  /** 动画结束后是否保持最终状态，默认 false */
  restart?: 'always' | 'whenNotActive' | 'never';
  isFreeze?: boolean;
}

/**
 * 生成自定义关键帧的 animateTransform React 元素
 * @returns 返回 React <animateTransform> 元素
 * @example
 * ```tsx
 * <svg>
 *   <g>
 *     {genAnimateCustom({
 *       type: 'translate',
 *       values: ['0 0', '100 50', '0 0'],
 *       duration: 3,
 *     })}
 *     <rect width="100" height="100" fill="blue" />
 *   </g>
 * </svg>
 * ```
 */
export function genAnimateCustom(options: CustomTransformOptions) {
  const {
    type = 'translate',
    values,
    duration = 4,
    keySplines,
    repeatCount = 1,
    delay = 0,
    beginType,
    isFreeze = false,
    restart,
  } = options;

  const valuesStr = values.join(';');
  const keySplinesStr = keySplines?.join(';');
  const repeatCountValue = repeatCount === 0 ? 'indefinite' : repeatCount;
  const beginValue = getSvgBegin(beginType, delay);

  return (
    <animateTransform
      attributeName="transform"
      type={type}
      values={valuesStr}
      repeatCount={repeatCountValue}
      {...(keySplines && { calcMode: 'spline' as const, keySplines: keySplinesStr })}
      dur={`${duration}s`}
      {...(beginValue && { begin: beginValue })}
      fill={isFreeze ? 'freeze' : 'remove'}
      {...(restart && { restart })}
    />
  );
}

// ==================== 默认导出 ====================

export default {
  // 工具函数
  getElementBounds,
  getOriginNumByText,
  // 动画生成器
  genAnimateFloat,
  genAnimateTranslate,
  TranslateDirection,
  genAnimateTranslateByDirection,
  genAnimateTranslateLoop,
  genAnimateTranslatePath,
  translatePresets,
  genAnimateCustom,
  genAnimateSoftBlink,
  genAnimateHardBlink,
  genAnimateScale,
  centerScaleStyle,
  ScaleValue,
  genAnimateScaleSimple,
  genAnimateScaleLoop,
  genAnimateScalePulse,
  genAnimateScalePath,
  genAnimateScaleBounce,
  genAnimateBreathe,
  centerBreatheStyle,
  genAnimateRotate,
  getCenterRotateStyle,
  RotateDirection,
  genAnimateRotateByAngle,
  genAnimateRotateLoop,
  genAnimateRotateSwing,
  genAnimateRotatePath,
  genAnimateOpacity,
  OpacityValue,
  genAnimateOpacityFade,
  genAnimateOpacityLoop,
  genAnimateOpacityPath,
  genAnimateSkewX,
  SkewXAngle,
  genAnimateSkewXSimple,
  genAnimateSkewXLoop,
  genAnimateSkewXSwing,
  genAnimateSkewXPath,
  genAnimateSkewY,
  SkewYAngle,
  genAnimateSkewYSimple,
  genAnimateSkewYLoop,
  genAnimateSkewYSwing,
  genAnimateSkewYPath,
  genAnimatePathMotion,
  genAnimatePathMotionLoop,
  genAnimatePathMotionSlide,
  genAnimatePathStroke,
  genAnimateExtrude,
  genSet,
  genSetVisibility,
  genSetOpacity,
  genSetDisplay,
  floatingPresets,
  softBlinkPresets,
  hardBlinkPresets,
  scalePresets,
  breathePresets,
  rotatePresets,
  opacityPresets,
  skewXPresets,
  skewYPresets,
};
