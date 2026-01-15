import {CSSProperties, ReactNode} from "react";
import SvgEx from "@pub-html/basicEx/SvgEx";
import SectionEx from "@pub-html/basicEx/SectionEx";
import {defaultTo} from "es-toolkit/compat";

// ============================================ Types ============================================

export type FlipCardProps = {
  // 背面图片 URL（翻转后显示）
  backImageUrl: string;
  // 正面图片 URL（翻转前显示）
  frontImageUrl: string;
  // 静态背景节点（始终显示在最底层，不受翻转影响）
  bgNode?: ReactNode;
  // ViewBox 宽度（可选），默认 1080
  viewBoxW?: number;
  // ViewBox 高度（可选），默认 1920
  viewBoxH?: number;
  // 翻转动画时长（秒），默认 1
  durationSeconds?: number;
};

// ============================================ Styles ============================================

const frameStyle: CSSProperties = {
  WebkitTouchCallout: "none",
  userSelect: "text",
  overflow: "visible",
  textAlign: "center",
  lineHeight: 0,
  marginBottom: 0,
};

// ============================================ FlipCard Component ============================================

/**
 * FlipCard - 点击翻转卡片组件
 *
 * 点击后通过 scale(1 → -1) 实现水平翻转效果
 *
 * @example
 * <FlipCard
 *   backImageUrl="背面图片.jpg"
 *   frontImageUrl="正面图片.jpg"
 * />
 *
 * @example
 * // 带静态背景
 * <FlipCard
 *   backImageUrl="背面图片.jpg"
 *   frontImageUrl="正面图片.jpg"
 *   bgNode={<img src="背景.jpg" alt="" />}
 * />
 *
 * @example
 * // 自定义翻转时长为 2 秒
 * <FlipCard
 *   backImageUrl="背面图片.jpg"
 *   frontImageUrl="正面图片.jpg"
 *   durationSeconds={2}
 * />
 */
const FlipCard = (props: FlipCardProps) => {
  // 尺寸配置
  const viewBoxW = defaultTo(props.viewBoxW, 1080);
  const viewBoxH = defaultTo(props.viewBoxH, 1920);
  const centerX = viewBoxW / 2;
  const centerY = viewBoxH / 2;

  // 动画时长配置
  const durationSeconds = defaultTo(props.durationSeconds, 1);
  const halfDuration = durationSeconds / 2;

  // 背面配置：翻转后显示
  const backConfig = {
    imageUrl: props.backImageUrl,
    transform: `scale(-1,1) translate(-${viewBoxW}, -${viewBoxH * 2})`,
    translateAnim: `0 ${viewBoxH * 2}`,
  };

  // 正面配置：翻转前显示，翻转后隐藏
  const frontConfig = {
    imageUrl: props.frontImageUrl,
    opacityBegin: `click+${halfDuration}s`,
    opacityValues: "1; 0",
  };

  // SVG 图片通用样式
  const svgImgStyle = {
    backgroundAttachment: "scroll",
    boxSizing: "border-box",
    display: "inline-block",
    outline: "none",
    userSelect: "none",
    verticalAlign: "top",
    width: "100%",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
  } as CSSProperties;

  return (
    <section style={frameStyle}>
      {/* 占位符 */}
      {/*<section style={{height: 0, opacity: 0, margin: 0}}>·</section>*/}

      <SectionEx
        style={{
          backgroundPosition: "center top",
          backgroundRepeat: "repeat",
          backgroundSize: "100% auto",
          fontSize: 0,
          lineHeight: 0,
          margin: 0,
          overflow: "hidden",
          padding: 0,
        }}
        important={[
          ["font-size", "0"],
          ["line-height", "0"],
          ["margin", "0"],
          ["padding", "0"],
        ]}
      >
        <section style={{margin: 0, padding: 0, transform: "rotateZ(0deg) scale(1)"}}>
          <section style={{fontSize: 0, lineHeight: 0, margin: 0, padding: 0, transform: "scale(1)"}}>
            {/* 零高容器占位 */}
            <section style={{fontSize: 0, height: 0, lineHeight: 0}}>
              <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} style={{width: "100%"}}/>
            </section>

            {/* ========== 静态背景（可选，始终显示在最底层） ========== */}
            {props.bgNode}

            {/* 翻转卡片 SVG */}
            <SvgEx
              viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
              style={{pointerEvents: "none"}}
              important={[["enable-background", "new 0 0 1080 1920"]]}
            >
              {/* 翻转容器：移动到中心点 */}
              <g transform={`translate(${centerX} ${centerY})`}>
                <g>
                  {/* ========== 水平翻转动画 ========== */}
                  {/* 初始：正常显示 (1 1) → 点击后：水平翻转 (-1 1) */}
                  <animateTransform
                    attributeName="transform"
                    begin="click"
                    dur={`${durationSeconds}s`}
                    fill="freeze"
                    keyTimes="0; 1"
                    restart="never"
                    type="scale"
                    values="1 1; -1 1"
                  />

                  {/* 移回原点 */}
                  <g transform={`translate(-${centerX} -${centerY})`}>
                    <g>
                      {/* 点击后移位动画 */}
                      <animateTransform
                        attributeName="transform"
                        begin={`click+${halfDuration}s`}
                        calcMode="discrete"
                        dur="1ms"
                        fill="freeze"
                        restart="never"
                        type="translate"
                        values={backConfig.translateAnim}
                      />

                      {/* ========== 背面内容（翻转后显示） ========== */}
                      {/* 预先镜像存储，翻转时正常显示 */}
                      {/* 翻转后移出视野 */}
                      <g transform={backConfig.transform}>
                        <foreignObject x="0" y="0" width={viewBoxW} height={viewBoxH}>
                          <SvgEx
                            viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
                            style={{
                              ...svgImgStyle,
                              background: `url("${backConfig.imageUrl}") 0 0/100% 100% no-repeat`,
                            }}
                          />
                        </foreignObject>
                      </g>

                      {/* ========== 正面内容（翻转前显示） ========== */}
                      {/* 初始可见，翻转后隐藏 */}
                      <g>
                        {/* 点击后隐藏动画 */}
                        <animate
                          attributeName="opacity"
                          begin={frontConfig.opacityBegin}
                          calcMode="discrete"
                          dur="1ms"
                          fill="freeze"
                          values={frontConfig.opacityValues}
                        />

                        <foreignObject x="0" y="0" width={viewBoxW} height={viewBoxH}>
                          <SvgEx
                            viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
                            style={{
                              ...svgImgStyle,
                              background: `url("${frontConfig.imageUrl}") 0% 0%/100% 100% no-repeat`,
                            }}
                          />
                        </foreignObject>

                        {/* ========== 点击热区 ========== */}
                        <rect
                          height={viewBoxH}
                          opacity={0}
                          style={{pointerEvents: "visible"}}
                          width={viewBoxW / 2}
                          x="0"
                          y="0"
                        >
                          {/* 点击后隐藏热区，防止重复触发 */}
                          <set
                            attributeName="visibility"
                            begin="click"
                            from="visible"
                            to="hidden"
                          />
                        </rect>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </SvgEx>
          </section>
        </section>
      </SectionEx>
    </section>
  );
};

export default FlipCard;
