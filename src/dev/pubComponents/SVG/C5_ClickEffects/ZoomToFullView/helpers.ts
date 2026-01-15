import { max } from "es-toolkit/compat";

export interface InitViewRect {
	zoom: number;
	focusX: number;
	focusY: number;
}

/** 从 initViewPosition 计算出 zoom、focusX、focusY，并校验边界 */
export function calcInitView(
	x1: number,
	x2: number,
	y: number,
	W: number,
	H: number,
): InitViewRect {
	const initW = x2 - x1;
	if (initW <= 0) throw new Error(`initViewPosition: x2 (${x2}) must be greater than x1 (${x1})`);

	const zoom = W / initW;
	const initH = H / zoom;
	const focusX = (x1 + x2) / 2;
	const focusY = y + initH / 2;

	if (x1 < 0 || x2 > W || y < 0 || y + initH > H) {
		throw new Error(
			`initViewPosition (${x1}, ${y}, ${x2}) 超出图片范围 (0, 0, ${W}, ${H})，` +
			`底部边界 ${y + initH} > ${H}`,
		);
	}

	return { zoom, focusX, focusY };
}

/** 基于 viewBox 和 zoom 计算偏移量，确保元素完全移出可视区域 */
export function calcOffScreenOffset(w: number, h: number, zoom: number): number {
	return max([w, h])! * max([zoom, 1])! * 100;
}

/** 根据 zoom 和焦点计算 foreignObject 参数 */
export function calcForeignObject(
	w: number,
	h: number,
	zoom: number,
	focusX: number,
	focusY: number,
) {
	return {
		foW: w * zoom,
		foH: h * zoom,
		foX: Math.round(w / 2 - focusX * zoom),
		foY: Math.round(h / 2 - focusY * zoom),
	};
}

/** 计算缩放后平移目标（基于 foreignObject 偏移） */
export function calcZoomTarget(foX: number, foY: number, scale: number) {
	return {
		x: Math.round(-foX * scale),
		y: Math.round(-foY * scale),
	};
}
