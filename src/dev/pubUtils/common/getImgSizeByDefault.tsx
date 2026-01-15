import { useMemo } from "react"
import { defaultTo } from "es-toolkit/compat"
import getImgSizeAsync from "./getImgSizeAsync.ts"

const getImgSizeByDefault = (url: string, w?: number, h?: number) => {
    const imgSizeAutoGet = getImgSizeAsync(url)
    // 该函数约定在组件渲染期无条件调用（等价自定义 hook），沿用 logiguo 的既有模式
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const imgSize = useMemo(() => {
        const imgW = defaultTo(w, 0)
        const imgH = defaultTo(h, 0)
        if (imgW + imgH > 0) return { w: imgW, h: imgH }
        if (imgSizeAutoGet.isSuccess) return { w: imgSizeAutoGet.w, h: imgSizeAutoGet.h }
        return { w: imgW, h: imgH }
    }, [imgSizeAutoGet, w, h])
    return imgSize
}

export default getImgSizeByDefault
