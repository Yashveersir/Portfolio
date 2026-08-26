'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function FloatingGeometry({ position, scale, color, speed }: { position: [number, number, number], scale: number, color: string, speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * speed;
      meshRef.current.rotation.y += delta * speed * 1.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {/* 1 in 3 chance to be a torus knot, otherwise icosahedron */}
      {scale > 1.5 ? (
        <torusKnotGeometry args={[1, 0.3, 100, 16]} />
      ) : (
        <icosahedronGeometry args={[1, 0]} />
      )}
      <meshBasicMaterial color={color} wireframe={true} transparent opacity={0.15} />
    </mesh>
  );
}

function GeometryField() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
      groupRef.current.rotation.z += delta * 0.01;
    }
  });

  // Pre-generate random shapes
  const shapes = Array.from({ length: 60 }).map((_, i) => {
    const isPurple = Math.random() > 0.5;
    return {
      id: i,
      position: [
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 2,
      color: isPurple ? '#a855f7' : '#22d3ee', // mix purple and cyan
      speed: (Math.random() - 0.5) * 0.5
    };
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape) => (
        <FloatingGeometry 
          key={shape.id} 
          position={shape.position} 
          scale={shape.scale} 
          color={shape.color} 
          speed={shape.speed}
        />
      ))}
    </group>
  );
}

export default function SkillsBackground3D() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <fog attach="fog" args={['#050810', 5, 40]} />
        <GeometryField />
      </Canvas>
    </div>
  );
}
