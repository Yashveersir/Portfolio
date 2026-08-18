'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Use a slight mouse reaction
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.pointer.y * 0.5 + state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.pointer.x * 0.5 + state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 4]} />
        <MeshDistortMaterial
          color="var(--cyan)"
          emissive="var(--purple-500)"
          emissiveIntensity={0.5}
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
        />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none md:pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AnimatedShape />
      </Canvas>
    </div>
  );
}
