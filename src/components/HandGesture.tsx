import { useEffect, useRef, useState } from 'react'
import * as handpose from '@tensorflow-models/handpose'
import '@tensorflow/tfjs'

interface HandGestureProps {
    onGestureChange: (openness: number) => void
}

export function HandGesture({ onGestureChange }: HandGestureProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [gestureStatus, setGestureStatus] = useState<string>('Initializing...')
    const [model, setModel] = useState<handpose.HandPose | null>(null)

    useEffect(() => {
        let animationId: number

        const setupCamera = async () => {
            if (!videoRef.current) return

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480 }
                })
                videoRef.current.srcObject = stream
                await new Promise((resolve) => {
                    if (videoRef.current) {
                        videoRef.current.onloadedmetadata = resolve
                    }
                })
                await videoRef.current.play()
                setGestureStatus('📷 Loading hand detection model...')
            } catch (err) {
                console.error('Camera error:', err)
                setGestureStatus('❌ Camera access denied')
            }
        }

        const loadModel = async () => {
            try {
                const loadedModel = await handpose.load()
                setModel(loadedModel)
                setGestureStatus('👋 Show your hand to camera')
            } catch (err) {
                console.error('Model loading error:', err)
                setGestureStatus('❌ Failed to load model')
            }
        }

        const detectHands = async () => {
            if (!model || !videoRef.current || !canvasRef.current) {
                animationId = requestAnimationFrame(detectHands)
                return
            }

            const predictions = await model.estimateHands(videoRef.current)

            const ctx = canvasRef.current.getContext('2d')
            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
            }

            if (predictions.length > 0) {
                const hand = predictions[0]
                const landmarks = hand.landmarks

                // Draw hand landmarks for debugging
                if (ctx) {
                    landmarks.forEach((point: number[]) => {
                        ctx.beginPath()
                        ctx.arc(point[0], point[1], 3, 0, 2 * Math.PI)
                        ctx.fillStyle = '#FFD700'
                        ctx.fill()
                    })
                }

                // Calculate hand openness percentage
                const thumbTip = landmarks[4]
                const indexTip = landmarks[8]
                const middleTip = landmarks[12]
                const ringTip = landmarks[16]
                const pinkyTip = landmarks[20]

                // Calculate average distance from thumb to all fingertips
                const distances = [indexTip, middleTip, ringTip, pinkyTip].map(tip => {
                    return Math.sqrt(
                        Math.pow(thumbTip[0] - tip[0], 2) +
                        Math.pow(thumbTip[1] - tip[1], 2)
                    )
                })

                const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length

                // Calculate openness percentage (0 = closed, 1 = open)
                const minDistance = 30  // Fully closed fist
                const maxDistance = 150 // Fully open hand

                const openness = Math.max(0, Math.min(1,
                    (avgDistance - minDistance) / (maxDistance - minDistance)
                ))

                // Pass openness as a number between 0 and 1
                onGestureChange(openness)

                const percentage = Math.round(openness * 100)
                if (openness < 0.2) {
                    setGestureStatus(`✊ Closed (${percentage}%) - Tree`)
                } else if (openness > 0.8) {
                    setGestureStatus(`✋ Open (${percentage}%) - Scattered`)
                } else {
                    setGestureStatus(`🖐️ Partial (${percentage}%) - Morphing`)
                }
            } else {
                setGestureStatus('👋 Show your hand to camera')
            }

            animationId = requestAnimationFrame(detectHands)
        }

        setupCamera().then(() => {
            loadModel().then(() => {
                detectHands()
            })
        })

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId)
            }
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
                tracks.forEach(track => track.stop())
            }
        }
    }, [model, onGestureChange])

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 10
        }}>
            {/* Hidden video element for camera */}
            <video
                ref={videoRef}
                width="640"
                height="480"
                style={{ display: 'none' }}
            />

            {/* Hidden canvas for visualization (optional) */}
            <canvas
                ref={canvasRef}
                width="640"
                height="480"
                style={{ display: 'none' }}
            />

            {/* Status indicator */}
            <div style={{
                background: 'rgba(0,0,0,0.7)',
                color: '#FFD700',
                padding: '10px 15px',
                borderRadius: '8px',
                border: '1px solid #FFD700',
                fontSize: '14px',
                fontFamily: 'monospace',
                textAlign: 'center'
            }}>
                {gestureStatus}
            </div>
        </div>
    )
}
