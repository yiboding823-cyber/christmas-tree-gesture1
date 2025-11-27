import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import { Scene } from './components/Scene'
import { UI } from './components/UI'
import { HandGesture } from './components/HandGesture'

function App() {
    const [morphState, setMorphState] = useState<'TREE_SHAPE' | 'SCATTERED'>('TREE_SHAPE')
    const [morphProgress, setMorphProgress] = useState<number>(0) // 0 = tree, 1 = scattered

    const handleGestureChange = (openness: number) => {
        setMorphProgress(openness)
        // Also update binary state for UI buttons
        setMorphState(openness > 0.5 ? 'SCATTERED' : 'TREE_SHAPE')
    }

    const handleButtonClick = (state: 'TREE_SHAPE' | 'SCATTERED') => {
        setMorphState(state)
        setMorphProgress(state === 'SCATTERED' ? 1 : 0)
    }

    return (
        <>
            <Leva collapsed={true} />
            <HandGesture onGestureChange={handleGestureChange} />
            <UI onSetState={handleButtonClick} currentState={morphState} />
            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [0, 2, 10], fov: 45 }}
                gl={{ antialias: false, stencil: false, alpha: false }}
            >
                <Scene morphProgress={morphProgress} />
            </Canvas>
        </>
    )
}

export default App
