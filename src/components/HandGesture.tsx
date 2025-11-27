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
    const lastOpenness = useRef<number>(0)

    useEffect(() => {
        let animationId: number

        const setupCamera = async () => {
            if (!videoRef.current) return

            try {
                // Add timeout for camera access
                const streamPromise = navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480 }
                })

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Camera request timed out')), 10000)
                )

                const stream = await Promise.race([streamPromise, timeoutPromise]) as MediaStream

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
                setGestureStatus('❌ Camera access failed (Check permissions)')
            }
        }

        const loadModel = async () => {
            try {
                // Add timeout for model loading
                const loadPromise = handpose.load()
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Model load timed out')), 20000)
                )

                const loadedModel = await Promise.race([loadPromise, timeoutPromise]) as handpose.HandPose
                setModel(loadedModel)
                setGestureStatus('👋 Show your hand to camera')
            } catch (err) {
                console.error('Model loading error:', err)
                setGestureStatus('❌ Failed to load model (Network error?)')
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

                // --- High Precision Scale-Invariant Algorithm ---

                // 1. Calculate "Palm Size" (Reference Scale)
                // Distance between Wrist (0) and Middle Finger MCP (9)
                // This distance is stable regardless of finger curling
                const wrist = landmarks[0]
                const middleMCP = landmarks[9]
                const palmSize = Math.sqrt(
                    Math.pow(wrist[0] - middleMCP[0], 2) +
                    Math.pow(wrist[1] - middleMCP[1], 2)
                )

                // 2. Calculate "Finger Extension"
                // Average distance from Wrist (0) to all Fingertips (Index 8, Middle 12, Ring 16, Pinky 20)
                // We exclude thumb for this specific metric as it's more flexible
                const fingertips = [8, 12, 16, 20]
                let totalTipDistance = 0
                fingertips.forEach(index => {
                    const tip = landmarks[index]
                    const dist = Math.sqrt(
                        Math.pow(wrist[0] - tip[0], 2) +
                        Math.pow(wrist[1] - tip[1], 2)
                    )
                    totalTipDistance += dist
                })
                const avgTipDistance = totalTipDistance / fingertips.length

                // 3. Calculate Ratio (Extension / PalmSize)
                // Closed Fist: Ratio is approx 0.8 - 1.0 (Tips touch palm)
                // Open Hand: Ratio is approx 1.8 - 2.2 (Tips extended)
                const ratio = avgTipDistance / palmSize

                // 4. Map Ratio to 0-1 Openness
                // RE-CALIBRATED THRESHOLDS:
                // Closed Fist (Tips touching palm): Ratio is usually around 0.5 - 0.7
                // Relaxed Hand: Ratio is around 1.0 - 1.2
                // Open Hand: Ratio is around 1.8 - 2.2

                // We lower the minRatio significantly to ensure a closed fist registers as 0.
                const minRatio = 0.6 // Was 0.8 - lowered to catch tight fists
                const maxRatio = 2.0 // Was 2.2 - slightly lowered to make 100% easier

                let rawOpenness = (ratio - minRatio) / (maxRatio - minRatio)

                // Aggressive clamping for closed state
                // If ratio is below 0.8 (very likely a fist), force it to 0
                if (ratio < 0.8) rawOpenness = 0;

                // Add a small "dead zone" at the top end
                if (rawOpenness > 0.95) rawOpenness = 1

                rawOpenness = Math.max(0, Math.min(1, rawOpenness))

                // 5. Exponential Smoothing (Low-pass filter)
                // Reduced alpha from 0.7 to 0.3 to significantly lower latency
                // value = prev * alpha + new * (1 - alpha)
                const alpha = 0.3
                const smoothedOpenness = (lastOpenness.current * alpha) + (rawOpenness * (1 - alpha))
                lastOpenness.current = smoothedOpenness

                // Pass smoothed value
                onGestureChange(smoothedOpenness)

                const percentage = Math.round(smoothedOpenness * 100)
                if (smoothedOpenness < 0.2) {
                    setGestureStatus(`✊ Closed (${percentage}%) - Tree`)
                } else if (smoothedOpenness > 0.8) {
                    setGestureStatus(`✋ Open (${percentage}%) - Scattered`)
                } else {
                    setGestureStatus(`🖐️ Precision Control (${percentage}%)`)
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
