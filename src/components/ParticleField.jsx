/* eslint-disable react-hooks/purity */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ========== Animated Torus Knot — hero centerpiece ========== */
function GlowingTorusKnot() {
  const mesh = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    mesh.current.rotation.x = t * 0.15;
    mesh.current.rotation.y = t * 0.2;
    mesh.current.position.y = Math.sin(t * 0.5) * 0.3;
  });

  return (
    <mesh ref={mesh} position={[3.5, 1.5, -3]}>
      <torusKnotGeometry args={[1.2, 0.35, 200, 32]} />
      <meshPhysicalMaterial
        color="#00ffcc"
        emissive="#00ffcc"
        emissiveIntensity={0.4}
        roughness={0.15}
        metalness={0.9}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

/* ========== Wireframe Icosahedron — rotating slowly ========== */
function WireframeIcosahedron() {
  const mesh = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    mesh.current.rotation.x = t * 0.1;
    mesh.current.rotation.z = t * 0.08;
    mesh.current.position.y = Math.sin(t * 0.3 + 2) * 0.5;
  });

  return (
    <mesh ref={mesh} position={[-3.5, -1, -4]}>
      <icosahedronGeometry args={[2, 1]} />
      <meshPhysicalMaterial
        color="#aa00ff"
        emissive="#aa00ff"
        emissiveIntensity={0.5}
        wireframe
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

/* ========== Floating Octahedron cluster ========== */
function FloatingOctahedrons() {
  const group = useRef();

  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 10,
          -3 - Math.random() * 8,
        ],
        scale: 0.15 + Math.random() * 0.35,
        speed: 0.3 + Math.random() * 0.6,
        offset: Math.random() * Math.PI * 2,
        color: ['#00ffcc', '#aa00ff', '#ff0055'][Math.floor(Math.random() * 3)],
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const item = items[i];
      child.rotation.x = t * item.speed;
      child.rotation.y = t * item.speed * 0.7;
      child.position.y = item.pos[1] + Math.sin(t * item.speed + item.offset) * 0.5;
    });
  });

  return (
    <group ref={group}>
      {items.map((item, i) => (
        <mesh key={i} position={item.pos} scale={item.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color={item.color}
            emissive={item.color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.5}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

/* ========== Particle starfield with gentle drift ========== */
function ParticleStars({ count = 2000 }) {
  const points = useRef();

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      [0, 1, 0.8],     // cyan
      [0.67, 0, 1],    // purple
      [1, 0, 0.33],    // pink
      [1, 1, 1],       // white
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }
    return { positions, colors };
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    points.current.rotation.y = t * 0.01;
    points.current.rotation.x = t * 0.005;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ========== Glowing ring — orbital effect ========== */
function GlowRing() {
  const mesh = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    mesh.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.3;
    mesh.current.rotation.z = t * 0.1;
  });

  return (
    <mesh ref={mesh} position={[0, 0, -6]}>
      <torusGeometry args={[4, 0.02, 16, 100]} />
      <meshBasicMaterial color="#00ffcc" transparent opacity={0.4} />
    </mesh>
  );
}

/* ========== Mouse-interactive scene wrapper ========== */
function Scene() {
  const group = useRef();

  useFrame(({ pointer }) => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        pointer.x * 0.15,
        0.03
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        pointer.y * 0.08,
        0.03
      );
    }
  });

  return (
    <group ref={group}>
      <GlowingTorusKnot />
      <WireframeIcosahedron />
      <FloatingOctahedrons />
      <GlowRing />
    </group>
  );
}

/* ========== Main Export ========== */
export default function ParticleField() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: '#050505' }}
      >
        {/* Ambient fill */}
        <ambientLight intensity={0.2} />

        {/* Key lights — neon colors */}
        <pointLight position={[8, 5, 5]} intensity={3} color="#00ffcc" distance={30} />
        <pointLight position={[-8, -5, 5]} intensity={3} color="#ff0055" distance={30} />
        <pointLight position={[0, 8, -5]} intensity={2} color="#aa00ff" distance={25} />
        <pointLight position={[0, -8, 3]} intensity={1.5} color="#00ffcc" distance={20} />

        {/* Starfield behind everything */}
        <ParticleStars count={2500} />

        {/* Interactive shapes */}
        <Scene />
      </Canvas>
    </div>
  );
}
