import { CSSProperties, useMemo } from "react";
import { defaultTo } from "es-toolkit/compat";
import getImgSizeByDefault from "@pub-utils/common/getImgSizeByDefault";
import { mpBlank, mpGet } from "@styles/funcs/mp";
import svgURL from "@pub-utils/common/svgURL";
import {
	genAnimateCustom,
	genAnimateOpacity,
	genAnimateOpacityFade,
	genAnimateSoftBlink,
	genAnimateTranslate,
} from "@svg-anim/index.tsx";
import type { ZoomToFullViewProps } from "./types";
import { calcInitView, calcForeignObject, calcOffScreenOffset, calcZoomTarget } from "./helpers";

const ZoomToFullView = (props: ZoomToFullViewProps) => {
	const bgPic = props.bgPic;
	const overlayPic = props.overlayPic;
	const promptPic = props.promptPic;
	const initView = props.initViewPosition;
	const zoomDuration = defaultTo(props.zoomDuration, 3.25);
	const zoomKeySplines = props.zoomKeySplines;
	const overlayDelay = defaultTo(props.overlayDelay, 0.85);
	const overlayKeySplines = props.overlayKeySplines;
	const promptBlinkMinOpacity = defaultTo(props.promptBlinkMinOpacity, 0.235);
	const promptBlinkDuration = defaultTo(props.promptBlinkDuration, 2.15);
	const mpResult = mpGet(defaultTo(props.mp, mpBlank));

	const { w, h } = getImgSizeByDefault(bgPic, props.viewBoxW, props.viewBoxH);
	const W = defaultTo(props.viewBoxW, w);
	const H = defaultTo(props.viewBoxH, h);

	const { zoom, focusX, focusY } = useMemo(
		() => calcInitView(initView.x1, initView.x2, initView.y, W, H),
		[initView.x1, initView.x2, initView.y, W, H],
	);
	const scaleTarget = 1 / zoom;

	const { foW, foH, foX, foY } = useMemo(
		() => calcForeignObject(W, H, zoom, focusX, focusY),
		[W, H, zoom, focusX, focusY],
	);
	const offScreen = useMemo(() => calcOffScreenOffset(W, H, zoom), [W, H, zoom]);
	const { x: zoomTargetX, y: zoomTargetY } = useMemo(
		() => calcZoomTarget(foX, foY, scaleTarget),
		[foX, foY, scaleTarget],
	);

	const promptFadeDuration = 1.65;
	const overlayFadeDuration = 2.5;

	const foStyle = (url: string): CSSProperties => ({
		backgroundImage: svgURL(url),
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		width: "100%",
		height: "100%",
	});

	return (
		<section style={{
			overflow: "hidden", textAlign: "center", lineHeight: 0,
			WebkitTouchCallout: "none", userSelect: "text", ...mpResult,
		}}>
			<svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%" }} xmlns="http://www.w3.org/2000/svg">
				{/* 整体平移 */}
				<g>
					{genAnimateTranslate({
						timeline: [{ toValue: { x: zoomTargetX, y: zoomTargetY }, durationSeconds: zoomDuration, keySplines: zoomKeySplines }],
						beginType: "click", delay: 0.75, isFreeze: true, restart: "never", isAdditive: false,
					})}

					{/* 缩放 */}
					<g>
						{genAnimateCustom({
							type: "scale",
							values: ["1", `${scaleTarget}`],
							duration: zoomDuration,
							keySplines: zoomKeySplines ? [zoomKeySplines] : undefined,
							beginType: "click", delay: 0.75, isFreeze: true, restart: "never",
						})}

						{/* 背景图 */}
						<g>
							<foreignObject x={foX} y={foY} width={foW} height={foH}>
								<svg viewBox={`0 0 ${W} ${H}`} style={foStyle(bgPic)} />
							</foreignObject>
						</g>

						{/* 交互区 */}
						<g>
							{/* 覆盖图淡入 */}
							<g>
								{overlayPic && genAnimateOpacity({
									initOpacity: 0,
									timeline: [
										{ toValue: 0.55, durationSeconds: overlayFadeDuration / 2, keySplines: overlayKeySplines },
										{ toValue: 1, durationSeconds: overlayFadeDuration / 2, keySplines: overlayKeySplines },
									],
									beginType: "click", delay: overlayDelay, isFreeze: true, restart: "never",
								})}

								{/* 覆盖图滑入 + 提示图 */}
								<g>
									{overlayPic && genAnimateTranslate({
										timeline: [{ toValue: { x: -offScreen, y: 0 }, durationSeconds: 0.001 }],
										beginType: "click", delay: overlayDelay, isFreeze: true, restart: "never", isAdditive: false,
									})}

									{/* 覆盖图（静态偏移到屏幕外） */}
									{overlayPic && (
										<g transform={`translate(${offScreen} 0)`}>
											<foreignObject x={foX} y={foY} width={foW} height={foH}>
												<svg viewBox={`0 0 ${W} ${H}`} style={foStyle(overlayPic)} />
											</foreignObject>
										</g>
									)}

									{/* 提示图 */}
									<g>
										<g>
											{genAnimateTranslate({
												timeline: [{ toValue: { x: offScreen * 2, y: 0 }, durationSeconds: 0.001 }],
												beginType: "click", delay: promptFadeDuration, isFreeze: true, restart: "never", isAdditive: false,
											})}

											<g>
												{genAnimateOpacityFade(0, promptFadeDuration, { beginType: "click", isFreeze: true, restart: "never" })}

												<g>
													{genAnimateSoftBlink({
														minOpacity: promptBlinkMinOpacity,
														maxOpacity: 1,
														onceBlinkDurationSeconds: promptBlinkDuration,
															restart: "whenNotActive",
													})}

													<g>
														{promptPic
															? <foreignObject x={0} y={0} width={W} height={H}>
																<svg viewBox={`0 0 ${W} ${H}`} style={foStyle(promptPic)} />
															</foreignObject>
															: <rect x={0} y={0} width={W} height={H} style={{ opacity: 0.001, pointerEvents: "visiblePainted" }} />
														}
													</g>
												</g>
											</g>
										</g>
									</g>
								</g>
							</g>
						</g>
					</g>
				</g>
			</svg>
		</section>
	);
};

export default ZoomToFullView;
