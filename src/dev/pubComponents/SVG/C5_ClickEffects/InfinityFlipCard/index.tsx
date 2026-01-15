/**
 * InfinityFlipCard - 无限循环翻转卡片
 *
 * 严格按照 infinityBackClick.html 源码一比一复刻
 */

import SvgEx from "@pub-html/basicEx/SvgEx"
import BackgroundLayer from "./components/BackgroundLayer"
import BackSide from "./components/BackSide"
import FrontSide from "./components/FrontSide"
import {mpGet} from "@styles/funcs/mp"
import type {InfinityFlipCardProps} from "./types.ts"

// ============================================ Main Component ============================================

const InfinityFlipCard = (props: InfinityFlipCardProps) => {
  const {
    bgUrl,
    backUrl,
    frontUrl,
    viewBoxW = 750,
    viewBoxH = 850,
    durationSeconds = 1,
    mp,
  } = props

  const centerX = viewBoxW / 2

  // 时间计算（基于 durationSeconds 倍数）
  const scaleDur = `${2 * durationSeconds}s`
  const flipDur = `${1.2 * durationSeconds}s`
  const opacityDur = `${durationSeconds}s`
  const hotZoneBDur = `${1.2 * durationSeconds}s`
  const topInterceptDur = `${0.2 * durationSeconds}s`
  const hotZoneADur = `${durationSeconds}s`

  // mp 样式处理
  const mpResult = mpGet(mp)

  return (
    <section data-label="infinity-flip-card" style={{overflow: "hidden", ...mpResult}}>
      {/* 零高容器1：背景图 */}
      <section style={{height: 0}}>
        <BackgroundLayer bgUrl={bgUrl} viewBoxW={viewBoxW} viewBoxH={viewBoxH}/>
      </section>

      {/* 零高容器2：主动画SVG + 顶层热区 */}
      <section style={{height: 0}}>
        {/* 主动画SVG */}
        <SvgEx
          viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
          important={[["max-width", "none"]]}
          style={{
            display: "block",
            width: "100%",
            marginTop: "-1px",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {/* SVG宽度动画 */}
          <animate calcMode="discrete" attributeName="width" values="200%;200%;100%;100%" dur={scaleDur}
                   keyTimes="0;0.6;0.6;1" fill="freeze" begin="mousedown"/>
          <animate calcMode="discrete" attributeName="width" values="200%;200%;100%;100%" dur={scaleDur}
                   keyTimes="0;0.6;0.6;1" fill="freeze" begin="touchstart"/>
          <animate calcMode="discrete" attributeName="width" values="200%;200%;200%;200%" dur={scaleDur}
                   keyTimes="0;0.6;0.6;1" fill="freeze" begin="touchmove"/>
          <animate calcMode="discrete" attributeName="width" values="100%;100%;200%;200%" dur={scaleDur}
                   keyTimes="0;0.5;0.5;1" fill="freeze" begin="mouseup"/>
          <animate calcMode="discrete" attributeName="width" values="100%;100%;200%;200%" dur={scaleDur}
                   keyTimes="0;0.5;0.5;1" fill="freeze" begin="click"/>

          <g>
            {/* 缩放动画 */}
            <animateTransform calcMode="discrete" attributeName="transform" type="scale" values="0.5;0.5;1;1"
                              dur={scaleDur}
                              keyTimes="0;0.6;0.6;1" fill="freeze" begin="mousedown"/>
            <animateTransform calcMode="discrete" attributeName="transform" type="scale" values="0.5;0.5;1;1"
                              dur={scaleDur}
                              keyTimes="0;0.6;0.6;1" fill="freeze" begin="touchstart"/>
            <animateTransform calcMode="discrete" attributeName="transform" type="scale" values="0.5;0.5;0.5;0.5"
                              dur={scaleDur} keyTimes="0;0.6;0.6;1" fill="freeze" begin="touchmove"/>
            <animateTransform calcMode="discrete" attributeName="transform" type="scale" values="1;1;0.5;0.5"
                              dur={scaleDur}
                              keyTimes="0;0.5;0.5;1" fill="freeze" begin="mouseup"/>
            <animateTransform calcMode="discrete" attributeName="transform" type="scale" values="1;1;0.5;0.5"
                              dur={scaleDur}
                              keyTimes="0;0.5;0.5;1" fill="freeze" begin="click"/>

            <g transform={`translate(${centerX} 0)`}>
              <g>
                {/* 翻转动画 */}
                <animateTransform calcMode="spline" attributeName="transform" type="scale" values="-1 1;-1 1;1 1"
                                  dur={flipDur} keyTimes="0;0.166666;1" keySplines=".42,0,.58,1;.42,0,.58,1"
                                  fill="freeze"
                                  begin="mousedown"/>
                <animateTransform calcMode="spline" attributeName="transform" type="scale" values="-1 1;-1 1;1 1"
                                  dur={flipDur} keyTimes="0;0.166666;1" keySplines=".42,0,.58,1;.42,0,.58,1"
                                  fill="freeze"
                                  begin="touchstart"/>
                <animateTransform calcMode="spline" attributeName="transform" type="scale" values="-1 1;-1 1;-1 1"
                                  dur={flipDur} keyTimes="0;0.166666;1" keySplines=".42,0,.58,1;.42,0,.58,1"
                                  fill="freeze"
                                  begin="touchmove"/>
                <animateTransform calcMode="spline" attributeName="transform" type="scale" values="1 1;-1 1"
                                  dur={opacityDur}
                                  keyTimes="0;1" keySplines=".42,0,.58,1" fill="freeze" begin="mouseup"/>
                <animateTransform calcMode="spline" attributeName="transform" type="scale" values="1 1;-1 1"
                                  dur={opacityDur}
                                  keyTimes="0;1" keySplines=".42,0,.58,1" fill="freeze" begin="click"/>

                <g transform={`translate(-${centerX} 0)`}>
                  {/* 背面图片（预镜像） */}
                  <BackSide
                    backUrl={backUrl}
                    viewBoxW={viewBoxW}
                    viewBoxH={viewBoxH}
                  />

                  {/* 正面图片 + 透明度控制 */}
                  <g>
                    <animate calcMode="linear" attributeName="opacity" values="0;0;1;1" dur={opacityDur}
                             keyTimes="0;0.7;0.7;1"
                             fill="freeze" begin="mousedown"/>
                    <animate calcMode="linear" attributeName="opacity" values="0;0;1;1" dur={opacityDur}
                             keyTimes="0;0.7;0.7;1"
                             fill="freeze" begin="touchstart"/>
                    <animate calcMode="linear" attributeName="opacity" values="0;0;0;0" dur={opacityDur}
                             keyTimes="0;0.7;0.7;1"
                             fill="freeze" begin="touchmove"/>
                    <animate calcMode="linear" attributeName="opacity" values="1;1;0;0" dur={opacityDur}
                             keyTimes="0;0.5;0.5;1"
                             fill="freeze" begin="mouseup"/>
                    <animate calcMode="linear" attributeName="opacity" values="1;1;0;0" dur={opacityDur}
                             keyTimes="0;0.5;0.5;1"
                             fill="freeze" begin="click"/>

                    <FrontSide
                      frontUrl={frontUrl}
                      viewBoxW={viewBoxW}
                      viewBoxH={viewBoxH}
                      scaleDur={scaleDur}
                      hotZoneADur={hotZoneADur}
                      hotZoneBDur={hotZoneBDur}
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </SvgEx>

        {/* 顶层拦截热区 */}
        <section style={{height: 0, transform: "rotate(180deg)"}}>
          <svg
            viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
            style={{
              transform: "rotate(180deg)",
              display: "block",
              width: "100%",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            <g opacity={0}>
              <rect x="0" y="0" width={viewBoxW} height={viewBoxH} style={{pointerEvents: "visible"}} fill="blue"/>
              <animateTransform calcMode="discrete" attributeName="transform" type="translate" values="4000 0"
                                dur={topInterceptDur} begin="mousedown"/>
              <animateTransform calcMode="discrete" attributeName="transform" type="translate" values="4000 0"
                                dur={topInterceptDur} begin="touchstart"/>
            </g>
          </svg>
        </section>
      </section>

      {/* 占位SVG */}
      <svg
        viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
        style={{
          display: "block",
          width: "100%",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </section>
  )
}

export default InfinityFlipCard
export type {InfinityFlipCardProps} from "./types.ts"
