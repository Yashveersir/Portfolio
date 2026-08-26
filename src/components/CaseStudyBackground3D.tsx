'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function WireframeTerrain({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // A large plane with many segments for smooth waves
  const geometry = useMemo(() => new THREE.PlaneGeometry(100, 100, 60, 60), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = geometry.attributes.position;
    
    // Animate the Z-axis of the plane (which becomes Y when rotated)
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      
      const waveX = Math.sin(x * 0.15 + time * 0.8) * 1.5;
      const waveY = Math.cos(y * 0.15 + time * 0.5) * 1.5;
      const waveMixed = Math.sin(x * y * 0.01 + time * 0.3) * 0.5;
      
      positions.setZ(i, waveX + waveY + waveMixed);
    }
    positions.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2 + 0.1, 0, 0]} position={[0, -5, -15]}>
      <meshBasicMaterial 
        color={color} 
        wireframe={true} 
        transparent={true} 
        opacity={0.3} 
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function CaseStudyBackground3D({ color = '#22d3ee' }: { color?: string }) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 mix-blend-screen opacity-70">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <fog attach="fog" args={['#030509', 5, 40]} />
        <WireframeTerrain color={color} />
      </Canvas>
    </div>
  );
}
