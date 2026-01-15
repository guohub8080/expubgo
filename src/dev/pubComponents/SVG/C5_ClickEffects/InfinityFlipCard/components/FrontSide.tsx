/**
 * FrontSide - 正面内容组件
 * 包含正面主图片、提示文字（闪烁）和双层热区系统
 */

import { max, defaultTo } from "es-toolkit/compat"

interface FrontSideProps {
  /** 正面图片 URL */
  frontUrl: string
  /** ViewBox 宽度 */
  viewBoxW: number
  /** ViewBox 高度 */
  viewBoxH: number
  /** 缩放动画时长 */
  scaleDur: string
  /** 热区A动画时长 */
  hotZoneADur: string
  /** 热区B动画时长 */
  hotZoneBDur: string
}

const FrontSide = ({
  frontUrl,
  viewBoxW,
  viewBoxH,
  scaleDur,
  hotZoneADur,
  hotZoneBDur,
}: FrontSideProps) => {
  const contentX = 0
  const contentY = 0
  const contentW = viewBoxW
  const contentH = viewBoxH

  // 基于 viewBox 计算远距离偏移值
  const maxDimension = defaultTo(max([viewBoxW, viewBoxH]), viewBoxW)
  const farDistance = maxDimension * 100
  const superFarDistance = farDistance * 1000

  // 提示文字数据（写死）
  const hintUrl = "https://placehold.co/200x40/22c55e/ffffff?text=Click+Me&font=roboto"
  const hintX = 275
  const hintY = 768
  const hintW = 200
  const hintH = 40
  const hintBlinkDur = "1.2s"
  const hintBegin = "0.5s"

  return (
    <>
      {/* 正面主图片 */}
      <g>
        <foreignObject x={contentX} y={contentY} width={contentW} height={contentH}>
          <svg
            viewBox={`0 0 ${contentW} ${contentH}`}
            style={{
              display: "block",
              width: "100%",
              marginTop: 0,
              background: `url("${frontUrl}") 0 0 / 100% 100% no-repeat`,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </foreignObject>
      </g>

      {/* 提示文字（闪烁） */}
      <g>
        <animate
          calcMode="linear"
          attributeName="opacity"
          values="1;0.1;1"
          dur={hintBlinkDur}
          keyTimes="0;0.5;1"
          repeatCount="indefinite"
          restart="never"
          begin={hintBegin}
        />
        <foreignObject x={hintX} y={hintY} width={hintW} height={hintH}>
          <svg
            viewBox={`0 0 ${hintW} ${hintH}`}
            style={{
              display: "block",
              width: "100%",
              marginTop: -1,
              background: `url("${hintUrl}") 0 0 / 100% 100% no-repeat`,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </foreignObject>
      </g>

      {/* 双层热区系统 */}
      <g>
        <animateTransform
          calcMode="discrete"
          attributeName="transform"
          type="translate"
          values={`-${farDistance} 0;-${farDistance} 0;0 0;0 0`}
          dur={scaleDur}
          keyTimes="0;0.6;0.6;1"
          fill="freeze"
          begin="mousedown"
        />
        <animateTransform
          calcMode="discrete"
          attributeName="transform"
          type="translate"
          values={`-${farDistance} 0;-${farDistance} 0;0 0;0 0`}
          dur={scaleDur}
          keyTimes="0;0.6;0.6;1"
          fill="freeze"
          begin="touchstart"
        />
        <animateTransform
          calcMode="discrete"
          attributeName="transform"
          type="translate"
          values={`-${farDistance} 0;-${farDistance} 0;-${farDistance} 0;-${farDistance} 0`}
          dur={scaleDur}
          keyTimes="0;0.6;0.6;1"
          fill="freeze"
          begin="touchmove"
        />
        <animateTransform
          calcMode="discrete"
          attributeName="transform"
          type="translate"
          values="0 0;0 0;-${farDistance} 0;-${farDistance} 0"
          dur={scaleDur}
          keyTimes="0;0.5;0.5;1"
          fill="freeze"
          begin="mouseup"
        />
        <animateTransform
          calcMode="discrete"
          attributeName="transform"
          type="translate"
          values="0 0;0 0;-${farDistance} 0;-${farDistance} 0"
          dur={scaleDur}
          keyTimes="0;0.5;0.5;1"
          fill="freeze"
          begin="click"
        />

        {/* 热区A */}
        <g>
          <rect
            x="0"
            y="0"
            width={viewBoxW}
            height={viewBoxH}
            fill="#39f"
            opacity="0"
            style={{pointerEvents: "visible"}}
          >
            <animate
              attributeName="x"
              dur={hotZoneADur}
              fill="remove"
              restart="always"
              values={`${-superFarDistance}`}
              begin="mouseup"
            />
            <animate
              attributeName="x"
              dur={hotZoneADur}
              fill="remove"
              restart="always"
              values={`${-superFarDistance}`}
              begin="click"
            />
          </rect>
        </g>

        {/* 热区B */}
        <g transform={`translate(${farDistance} 0)`}>
          <g>
            <animateTransform
              calcMode="discrete"
              attributeName="transform"
              type="translate"
              values={`${farDistance} 0;${farDistance} 0;${farDistance} 0`}
              dur={hotZoneBDur}
              keyTimes="0;0.00001;1"
              fill="remove"
              begin="mousedown"
            />
            <animateTransform
              calcMode="discrete"
              attributeName="transform"
              type="translate"
              values={`${farDistance} 0;${farDistance} 0;${farDistance} 0`}
              dur={hotZoneBDur}
              keyTimes="0;0.00001;1"
              fill="remove"
              begin="touchstart"
            />
            <animateTransform
              calcMode="discrete"
              attributeName="transform"
              type="translate"
              values="0 0;0 0;0 0"
              dur={hotZoneBDur}
              keyTimes="0;0.00001;1"
              fill="remove"
              begin="touchmove"
            />
            <rect
              x="0"
              y="0"
              width={viewBoxW}
              height={viewBoxH}
              fill="#000"
              opacity="0"
              style={{pointerEvents: "visible"}}
            />
          </g>
        </g>
      </g>
    </>
  )
}

export default FrontSide
