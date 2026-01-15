import {CSSProperties, ReactNode, useEffect, useRef, HTMLAttributes} from "react";
import waterMark from "./basicExWatermark.ts";
import { isEmpty } from "es-toolkit/compat";

const SpanEx = (props: {
  style?: CSSProperties
  children?: ReactNode
  important?: [string, string | null | undefined][]
} & HTMLAttributes<HTMLElement>) => {
  const ref = useRef(null)
  const { style, children, important, ...rest } = props
  useEffect(() => {
    if (important && ref.current) {
      important.map((x) => {
        ref.current.style.setProperty(x[0], x[1], "important")
      })
    }
  }, [important])

  if (isEmpty(important)) {
    return <span style={style} {...waterMark} {...rest}>
      {children}
    </span>
  }

  return <span style={style} ref={ref} {...waterMark} {...rest}>
    {children}
  </span>
}
export default SpanEx
