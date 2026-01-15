import type {CSSProperties, ReactNode} from "react"
import SectionEx from "@pub-html/basicEx/SectionEx"
import {mpGet, mpProps} from "@styles/funcs/mp"

/**
 * ExtrudeContainer 组件的 Props。
 *
 * @property {ReactNode} children 必填。要在容器中渲染的内容。
 * @property {mpProps} [mp] 可选。用于快速设置 margin/padding 的样式输入（会被解析并合并到外层容器）。
 */

/*
 * 挤出容器：用于包裹挤出动画的内容，
 * 外层负责对齐、用户选择行为与溢出控制。
 */
const ExtrudeContainer = (props: {
  children: ReactNode,
  mp?: mpProps
}) => {
  /** 由 mp 参数解析得到的 margin/padding 样式对象 */
  const mpResult = mpGet(props.mp)

  return (
    <SectionEx data-label="extrude-container" style={{...mpResult, ...outerStyle}}>
      {/* 外层容器 */}
      <section style={innerStyle}>
        {props.children}
      </section>
    </SectionEx>
  )
}

export default ExtrudeContainer


/**  ================================================== Style ===================================================== */
/**
 * 外层 Section 的基础样式：
 * - 禁用 iOS 长按呼出菜单；
 * - 允许文本选择；
 * - 居中对齐，隐藏溢出；
 * - 行高置 0 以避免垂直方向意外间距。
 */
const outerStyle: CSSProperties = {
  WebkitTouchCallout: "none",
  userSelect: "none",
  overflow: "hidden",
  textAlign: "center",
  lineHeight: 0,
  fontSize: 0,
  display: "block",
}

/**
 * 内层 section：行高 0，块级显示，无边距，隐藏溢出。
 */
const innerStyle: CSSProperties = {
  lineHeight: 0,
  display: "block",
  overflow: "hidden",
}
