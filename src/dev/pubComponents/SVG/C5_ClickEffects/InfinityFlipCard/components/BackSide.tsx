/**
 * BackSide - 背面内容组件
 * 包含背面图片（预镜像处理）
 */

interface BackSideProps {
  /** 背面图片 URL */
  backUrl: string
  /** ViewBox 宽度 */
  viewBoxW: number
  /** ViewBox 高度 */
  viewBoxH: number
}

const BackSide = ({backUrl, viewBoxW, viewBoxH}: BackSideProps) => {
  const contentX = 0
  const contentY = 0
  const contentW = viewBoxW
  const contentH = viewBoxH

  return (
    <g transform={`translate(${viewBoxW} 0) scale(-1 1)`}>
      <foreignObject x={contentX} y={contentY} width={contentW} height={contentH}>
        <svg
          viewBox={`0 0 ${contentW} ${contentH}`}
          style={{
            display: "block",
            width: "100%",
            marginTop: 0,
            background: `url("${backUrl}") 0 0 / 100% 100% no-repeat`,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </foreignObject>
    </g>
  )
}

export default BackSide
