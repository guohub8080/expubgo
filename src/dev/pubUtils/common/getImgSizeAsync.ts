import { isNil } from 'es-toolkit/predicate';
import { useImageSize } from 'react-image-size';

const getImgSizeAsync = (url: string): {
    w: number,
    h: number,
    status: string
    isSuccess: boolean
} => {
    // 该函数约定在组件渲染期无条件调用（等价自定义 hook），沿用 logiguo 的既有模式
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [dimensions, { loading, error }] = useImageSize(url)
    if (loading) return { w: 0, h: 0, isSuccess: false, status: "loading" }
    if (error) return { w: 0, h: 0, isSuccess: false, status: "error" }
    if (isNil(dimensions?.width)) return { w: 0, h: 0, isSuccess: false, status: "loading" }
    if (isNil(dimensions?.height)) return { w: 0, h: 0, isSuccess: false, status: "loading" }
    return { w: dimensions.width, h: dimensions.height, isSuccess: true, status: "success" }
}
export default getImgSizeAsync
