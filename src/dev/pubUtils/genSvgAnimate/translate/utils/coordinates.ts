/**
 * 平移动画工具函数
 */

import { isUndefined } from 'es-toolkit/predicate';
import { defaultTo } from 'es-toolkit/compat';
import { genSvgKeySplines, SvgTimelineSegment } from '@pub-utils/genSvgKeySplines';
import { Point2D, TranslateTimelineSegment } from '../types.ts';

/**
 * 构建完整的坐标序列
 * @param initX 初始 X 坐标
 * @param initY 初始 Y 坐标
 * @param timeline 时间线配置
 * @param isRelativeMove 是否相对移动模式
 * @returns 坐标序列数组
 */
export function buildCoordinates(
  initX: number,
  initY: number,
  timeline: TranslateTimelineSegment[],
  isRelativeMove: boolean
): Point2D[] {
  const coordinates: Point2D[] = [{ x: initX, y: initY }];
  let lastX = initX;
  let lastY = initY;

  timeline.forEach((segment) => {
    let newX: number;
    let newY: number;

    if (isRelativeMove) {
      // 相对移动模式：toValue 是增量，需要累加
      const deltaX = defaultTo(segment.toValue?.x, 0);
      const deltaY = defaultTo(segment.toValue?.y, 0);
      newX = lastX + deltaX;
      newY = lastY + deltaY;
    } else {
      // 累积移动模式：toValue 是绝对坐标
      newX = !isUndefined(segment.toValue?.x) ? segment.toValue.x : lastX;
      newY = !isUndefined(segment.toValue?.y) ? segment.toValue.y : lastY;
    }

    coordinates.push({ x: newX, y: newY });
    lastX = newX;
    lastY = newY;
  });

  return coordinates;
}

/**
 * 生成 X 和 Y 轴的时间线配置
 * @param timeline 原始时间线
 * @param coordinates 坐标序列
 * @returns X 和 Y 轴的时间线
 */
export function buildXYTimelines(
  timeline: TranslateTimelineSegment[],
  coordinates: Point2D[]
): {
  xTimeline: SvgTimelineSegment[];
  yTimeline: SvgTimelineSegment[];
} {
  const xTimeline: SvgTimelineSegment[] = timeline.map((segment, index) => ({
    keySplines: defaultTo(segment.keySplines, '0.42 0 0.58 1'),
    toValue: coordinates[index + 1].x,
    durationSeconds: segment.durationSeconds,
  }));

  const yTimeline: SvgTimelineSegment[] = timeline.map((segment, index) => ({
    keySplines: defaultTo(segment.keySplines, '0.42 0 0.58 1'),
    toValue: coordinates[index + 1].y,
    durationSeconds: segment.durationSeconds,
  }));

  return { xTimeline, yTimeline };
}

/**
 * 合并 X 和 Y 的 values 为 SVG translate 格式
 * @param xKeys X 轴动画参数
 * @param yKeys Y 轴动画参数
 * @returns 合并后的 values 字符串（格式："x1 y1;x2 y2;..."）
 */
export function combineXYValues(
  xKeys: ReturnType<typeof genSvgKeySplines>,
  yKeys: ReturnType<typeof genSvgKeySplines>
): string {
  const xValues = xKeys.values.split(';');
  const yValues = yKeys.values.split(';');
  return xValues.map((v, i) => `${v} ${yValues[i]}`).join(';');
}

/**
 * 计算动画总时长
 * @param timeline 时间线配置
 * @returns 总时长（秒）
 */
export function calculateTotalDuration(timeline: TranslateTimelineSegment[]): number {
  return timeline.reduce((sum, segment) => sum + segment.durationSeconds, 0);
}
