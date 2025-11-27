import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { useControls } from 'leva'
import { Tree } from './Tree'

interface SceneProps {
    morphProgress: number // 0 = tree, 1 = scattered
}

export function Scene({ morphProgress }: SceneProps) {
    const { bloomIntensity, bloomThreshold, bloomRadius } = useControls('Postprocessing', {
        bloomIntensity: { value: 1.5, min: 0, max: 5 },
        bloomThreshold: { value: 0.8, min: 0, max: 1 },
        bloomRadius: { value: 0.4, min: 0, max: 1 },
    })

    const { envPreset } = useControls('Environment', {
        envPreset: { value: 'city', options: ['city', 'sunset', 'dawn', 'night'] },
    })

    return (
        <>
            <color attach="background" args={['#050505']} />

            <OrbitControls
                makeDefault
                autoRotate
                autoRotateSpeed={0.5}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
            />

            {/* Lighting for "Exaggerated Luxury" */}
            <ambientLight intensity={0.2} />
            <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                intensity={2}
                castShadow
                color="#fffaed"
            />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ffd700" />

            <Environment preset={envPreset as any} background={false} blur={0.8} />

            <Tree morphProgress={morphProgress} />

            <EffectComposer enableNormalPass={false}>
                <Bloom
                    luminanceThreshold={bloomThreshold}
                    mipmapBlur
                    intensity={bloomIntensity}
                    radius={bloomRadius}
                />
                <ToneMapping />
            </EffectComposer>
        </>
    )
}
