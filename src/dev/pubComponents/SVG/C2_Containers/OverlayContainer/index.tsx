import {defaultTo} from "es-toolkit/compat";
import {ReactNode} from "react";
import ZeroHeightContainer from "@pub-svg/C2_Containers/ZeroHeightContainer";

/**
 * OverlayContainer 组件的 Props。
 *
 * @property {ReactNode} children - 要在容器中渲染的内容。
 * @property {ReactNode} overlayNode - 覆盖在内容上方的节点，通常用于显示遮罩、提示等。
 */

/*
 * 覆盖层容器：用于在内容上方叠加显示其他元素，
 * 内层使用 ZeroHeightContainer 包裹内容，外层叠加 overlayNode。
 * 常用于实现遮罩、提示、浮动按钮等效果。
 */
const OverlayContainer = (props: {
  overlayNode: ReactNode
  backgroundNode: ReactNode
}) => {
  return (<>
    <ZeroHeightContainer>
      {props.backgroundNode}
    </ZeroHeightContainer>
    {props.overlayNode}
  </>)
}


export default OverlayContainer;


/**  ================================================== Style ===================================================== */
// 此组件没有自定义样式，仅作为容器组合使用。
