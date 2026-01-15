/**
 * BackgroundLayer - 静态背景层组件
 * 始终显示在最底层，不受翻转动画影响
 */

interface BackgroundLayerProps {
  /** 背景图 URL（可选） */
  bgUrl?: string
  /** ViewBox 宽度 */
  viewBoxW: number
  /** ViewBox 高度 */
  viewBoxH: number
}

const BackgroundLayer = ({bgUrl, viewBoxW, viewBoxH}: BackgroundLayerProps) => {
  return (
      <svg
        viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
        style={{
          display: "block",
          width: "100%",
          marginTop: 0,
          background: bgUrl ? `url("${bgUrl}") 0 0 / 100% 100% no-repeat` : undefined,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
  )
}

export default BackgroundLayer
