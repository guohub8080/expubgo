/** @jsxImportSource react */
import React from "react"
import PureTextAnimated from "@assets/svgs/logoSvg/PureTextAnimated.tsx"
import RotateCube from "../RotateCube"

export default function Hero() {
  return (
    <div className="text-center max-w-[1152px] mx-auto px-6 pb-4">
      {/* Logo + 文字：宽屏左右并排，窄于400px上下 */}
      <div className="flex flex-row max-[400px]:flex-col items-center justify-center pt-6 gap-10 max-[400px]:gap-3">
        {/* 3D 旋转立方体 */}
        <RotateCube size={48} />

        {/* 主标题 */}
        <h1 className="flex items-center tracking-tight leading-tight m-0 max-[400px]:mt-3">
          <div className="h-9 w-[180px]">
            <PureTextAnimated className="w-full h-full" />
          </div>
        </h1>
      </div>
    </div>
  )
}
