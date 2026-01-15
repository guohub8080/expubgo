import { CSSProperties, useEffect, useRef, useState } from 'react'
import right from "./right.svg"
import front from "./front.svg"
import top from "./top.svg"

interface RotateCubeProps {
    size?: number
    maxAngle?: number
    lerpSpeed?: number
    idleTimeout?: number
    style?: CSSProperties
}

export default function RotateCube({
    size = 60,
    maxAngle = 35,
    lerpSpeed = 0.12,
    idleTimeout = 5000,
    style,
}: RotateCubeProps) {
    const defaultRotation = { x: -35, y: -45 }
    const [rotation, setRotation] = useState({ rotateX: -35, rotateY: -45 })
    const half = size / 2
    const containerRef = useRef<HTMLDivElement>(null)
    const targetRef = useRef(defaultRotation)
    const lastMoveRef = useRef(Date.now())

    useEffect(() => {
        let animationId: number
        let idleTimerId: ReturnType<typeof setTimeout>

        const handleMouseMove = (e: MouseEvent) => {
            lastMoveRef.current = Date.now()
            const x = (e.clientX / window.innerWidth - 0.5) * 2
            const y = (e.clientY / window.innerHeight - 0.5) * 2
            targetRef.current = {
                x: -35 - y * maxAngle,
                y: -45 + x * maxAngle,
            }
        }

        const checkIdle = () => {
            if (Date.now() - lastMoveRef.current >= idleTimeout) {
                targetRef.current = defaultRotation
            }
            idleTimerId = setTimeout(checkIdle, 1000)
        }

        const animate = () => {
            setRotation(prev => ({
                rotateX: prev.rotateX + (targetRef.current.x - prev.rotateX) * lerpSpeed,
                rotateY: prev.rotateY + (targetRef.current.y - prev.rotateY) * lerpSpeed,
            }))
            animationId = requestAnimationFrame(animate)
        }

        animationId = requestAnimationFrame(animate)
        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        idleTimerId = setTimeout(checkIdle, idleTimeout)

        return () => {
            cancelAnimationFrame(animationId)
            clearTimeout(idleTimerId)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [maxAngle, lerpSpeed, idleTimeout])

    const containerStyle: CSSProperties = {
        perspective: `${size * 20}px`,
        userSelect: 'none',
        filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.2))',
        ...style,
    }

    const wrapperStyle: CSSProperties = {
        width: size,
        height: size,
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`,
    }

    const faceStyle: CSSProperties = {
        width: size,
        height: size,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    return (
        <div ref={containerRef} style={containerStyle}>
            <div style={wrapperStyle}>
                <div style={{ ...faceStyle, transform: `translateZ(${half}px)` }}>
                    <img src={front} style={{ width: '100%', height: '100%' }} alt="" />
                </div>
                <div style={{ ...faceStyle, transform: `translateZ(-${half}px)`, backgroundColor: 'var(--color-primary)' }} />
                <div style={{ ...faceStyle, backgroundColor: 'var(--color-primary)', transform: `translateX(-${half}px) rotateY(90deg)` }} />
                <div style={{ ...faceStyle, transform: `rotateY(-270deg) translateX(${half}px)`, transformOrigin: 'top right' }}>
                    <img src={right} style={{ width: '100%', height: '100%' }} alt="" />
                </div>
                <div style={{ ...faceStyle, transform: `rotateX(-270deg) translateY(-${half}px)`, transformOrigin: 'top center' }}>
                    <img src={top} style={{ width: '100%', height: '100%' }} alt="" />
                </div>
                <div style={{ ...faceStyle, backgroundColor: 'var(--color-primary)', transform: `translateZ(${half}px) rotateX(90deg)`, transformOrigin: 'bottom', boxShadow: '0 0 25px rgba(0,0,0,0.5)' }} />
            </div>
        </div>
    )
}

