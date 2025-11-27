import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, Sparkles } from '@react-three/drei'

// Helper to generate random point in sphere
const randomInSphere = (radius: number) => {
    const u = Math.random()
    const v = Math.random()
    const theta = 2 * Math.PI * u
    const phi = Math.acos(2 * v - 1)
    const r = Math.cbrt(Math.random()) * radius
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)
    return new THREE.Vector3(x, y, z)
}

// Helper to generate random point inside a cone volume
const randomInCone = (height: number, maxRadius: number) => {
    const y = Math.random() * height
    const rAtHeight = maxRadius * (1 - y / height)
    const angle = Math.random() * Math.PI * 2
    const r = Math.sqrt(Math.random()) * rAtHeight
    const x = r * Math.cos(angle)
    const z = r * Math.sin(angle)
    return new THREE.Vector3(x, y, z)
}

function MorphingItem({
    treePos,
    scatterPos,
    morphProgress,
    children
}: {
    treePos: THREE.Vector3,
    scatterPos: THREE.Vector3,
    morphProgress: number,
    children: React.ReactNode
}) {
    const ref = useRef<THREE.Group>(null)
    const currentPos = useRef(scatterPos.clone())
    const targetProgress = useRef(1) // Start scattered

    useFrame((_, delta) => {
        if (ref.current) {
            // Smooth transition to target progress
            targetProgress.current += (morphProgress - targetProgress.current) * delta * 3

            // Interpolate between tree and scatter positions
            currentPos.current.lerpVectors(treePos, scatterPos, targetProgress.current)
            ref.current.position.copy(currentPos.current)
        }
    })

    return <group ref={ref}>{children}</group>
}

function Ornament({ type, color, scale = 1 }: { type: 'sphere' | 'box' | 'gem', color: string, scale?: number }) {
    const [hovered, setHovered] = useState(false)
    const finalScale = hovered ? scale * 1.5 : scale
    const finalColor = hovered ? "#ffeb3b" : color
    const emissiveIntensity = hovered ? 2 : 0.2

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh
                scale={finalScale}
                castShadow
                receiveShadow
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
                onPointerOut={() => setHovered(false)}
            >
                {type === 'sphere' && <sphereGeometry args={[0.15, 32, 32]} />}
                {type === 'box' && <boxGeometry args={[0.25, 0.25, 0.25]} />}
                {type === 'gem' && <icosahedronGeometry args={[0.2, 0]} />}

                <meshStandardMaterial
                    color={finalColor}
                    metalness={1}
                    roughness={0.1}
                    emissive={finalColor}
                    emissiveIntensity={emissiveIntensity}
                />
            </mesh>
        </Float>
    )
}

interface TreeProps {
    morphProgress: number // 0 = tree, 1 = scattered
}

export function Tree({ morphProgress }: TreeProps) {
    const group = useRef<THREE.Group>(null)

    // Ornaments positions - Massive count to form the tree
    const ornaments = useMemo(() => {
        const items = []
        const count = 1125 // Increased by 2.5x (450 * 2.5)
        // Luxurious Green and Red theme
        const colors = [
            '#0A5F38', // Deep Emerald
            '#1B7943', // Rich Green
            '#8B0000', // Dark Red
            '#B22222', // Firebrick Red
            '#DC143C', // Crimson
            '#228B22', // Forest Green
            '#C41E3A', // Cardinal Red
        ]
        const types = ['box', 'box', 'box', 'sphere', 'gem'] as const // Mostly boxes

        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)]
            const color = colors[Math.floor(Math.random() * colors.length)]

            // Tree Position: Inside Cone Volume
            const treePos = randomInCone(6, 2.5) // Height 6, Base Radius 2.5

            // Scatter Position: Random Sphere
            const scatterPos = randomInSphere(12)

            items.push({ treePos, scatterPos, type, color })
        }
        return items
    }, [])

    // Star
    const starData = useMemo(() => ({
        treePos: new THREE.Vector3(0, 6.2, 0),
        scatterPos: randomInSphere(10)
    }), [])

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1
        }
    })

    return (
        <group ref={group} position={[0, -3, 0]}>

            {/* Ornaments (The Tree Body) */}
            {ornaments.map((o, i) => (
                <MorphingItem key={`ornament-${i}`} treePos={o.treePos} scatterPos={o.scatterPos} morphProgress={morphProgress}>
                    <Ornament type={o.type} color={o.color} scale={Math.random() * 0.4 + 0.6} />
                </MorphingItem>
            ))}

            {/* Top Star */}
            <MorphingItem treePos={starData.treePos} scatterPos={starData.scatterPos} morphProgress={morphProgress}>
                <Float speed={4} rotationIntensity={1} floatIntensity={0.2}>
                    <mesh scale={0.8}>
                        <octahedronGeometry />
                        <meshStandardMaterial
                            color="#FFD700"
                            emissive="#FFD700"
                            emissiveIntensity={2}
                            toneMapped={false}
                        />
                    </mesh>
                </Float>
            </MorphingItem>

            {/* Ambient Sparkles */}
            <Sparkles
                count={200}
                scale={12}
                size={4}
                speed={0.4}
                opacity={0.5}
                color="#FFD700"
            />
        </group>
    )
}
