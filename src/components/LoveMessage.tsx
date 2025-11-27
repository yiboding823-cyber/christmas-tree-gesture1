import { Text } from '@react-three/drei'
import { useRef } from 'react'

interface LoveMessageProps {
    morphProgress: number
}

export function LoveMessage({ morphProgress }: LoveMessageProps) {
    const groupRef = useRef<THREE.Group>(null)

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* Background card */}
            <mesh position={[0, 0, -0.05]}>
                <boxGeometry args={[4, 1.5, 0.15]} />
                <meshStandardMaterial
                    color="#8B0000"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#DC143C"
                    emissiveIntensity={morphProgress * 2}
                    transparent
                    opacity={morphProgress * 0.95}
                />
            </mesh>

            {/* Golden border */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[3.8, 1.3, 0.1]} />
                <meshStandardMaterial
                    color="#FFD700"
                    metalness={1}
                    roughness={0.1}
                    emissive="#FFD700"
                    emissiveIntensity={morphProgress * 2.5}
                    transparent
                    opacity={morphProgress * 0.9}
                />
            </mesh>

            {/* Text: "I Love You" */}
            <Text
                position={[0, 0.3, 0.1]}
                fontSize={0.35}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/pacifico/v22/FwZY7-Qmy14u9lezJ96A4sijpFu_.woff"
                outlineWidth={0.02}
                outlineColor="#8B0000"
                transparent
                opacity={morphProgress}
            >
                I Love You
            </Text>

            {/* Text: "Joey" */}
            <Text
                position={[0, -0.2, 0.1]}
                fontSize={0.45}
                color="#FFD700"
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/pacifico/v22/FwZY7-Qmy14u9lezJ96A4sijpFu_.woff"
                outlineWidth={0.03}
                outlineColor="#8B0000"
                transparent
                opacity={morphProgress}
            >
                Joey
            </Text>

            {/* Decorative hearts */}
            <mesh position={[-1.7, 0.3, 0.1]} scale={0.12}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial
                    color="#FF1493"
                    emissive="#FF1493"
                    emissiveIntensity={morphProgress * 3}
                    transparent
                    opacity={morphProgress}
                />
            </mesh>
            <mesh position={[1.7, 0.3, 0.1]} scale={0.12}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial
                    color="#FF1493"
                    emissive="#FF1493"
                    emissiveIntensity={morphProgress * 3}
                    transparent
                    opacity={morphProgress}
                />
            </mesh>

            {/* Sparkle effect around the message */}
            {morphProgress > 0.5 && (
                <>
                    <pointLight
                        position={[0, 0, 0.5]}
                        intensity={morphProgress * 2}
                        distance={3}
                        color="#FFD700"
                    />
                </>
            )}
        </group>
    )
}
