import React, {useEffect, useRef} from 'react';
import {isEmpty, defaultTo} from 'es-toolkit/compat';
import waterMark from "./basicExWatermark.ts";

interface SvgExProps extends React.SVGProps<SVGSVGElement> {
  /** 需要添加 !important 的样式属性 */
  important?: [string, string | null | undefined][];
}

/**
 * SvgEx - SVG 增强组件
 *
 * 自动添加必要的 XML 命名空间声明，简化 SVG 使用
 *
 * @description
 * 默认添加：
 * - xmlns="http://www.w3.org/2000/svg"
 * - xmlnsXlink="http://www.w3.org/1999/xlink"
 *
 * @example
 * // 使用 SvgEx 替代 svg
 * <SvgEx viewBox="0 0 100 100" style={{ width: 100, height: 100 }}>
 *   <circle cx={50} cy={50} r={40} fill="blue" />
 * </SvgEx>
 *
 * @example
 * // 使用 important 设置 !important 样式
 * <SvgEx important={[["max-width", "none"]]}>
 *   <circle cx={50} cy={50} r={40} fill="blue" />
 * </SvgEx>
 */
const SvgEx: React.FC<SvgExProps> = ({children, important, style, ...rest}) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (important && ref.current) {
      important.map((x) => {
        ref.current!.style.setProperty(x[0], defaultTo(x[1], ''), "important");
      });
    }
  }, [important]);

  // 如果没有填入 important
  if (isEmpty(important)) {
    return (
      <svg {...waterMark}
           version='1.1'
           xmlns="http://www.w3.org/2000/svg"
           xmlnsXlink="http://www.w3.org/1999/xlink"
           style={style}
           {...rest}
      >
        {children}
      </svg>
    );
  }

  // 如果填入了 important，证明需要强调一些属性
  return (
    <svg ref={ref}
         {...waterMark}
         version='1.1'
         xmlns="http://www.w3.org/2000/svg"
         xmlnsXlink="http://www.w3.org/1999/xlink"
         style={style}
         {...rest}
    >
      {children}
    </svg>
  );
};

export default SvgEx;

