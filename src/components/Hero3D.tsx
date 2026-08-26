'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/*
 * HERO 3D — "Engineering Artifact"
 *
 * A large sculptural cage structure positioned to SURROUND the portrait.
 * Design language: dark polished chrome, one orbital cyan ring, one silver arc.
 * The structure should feel like a physical object, not a screen effect.
 *
 * Camera at z=12, FOV 44:
 *   Visible height ≈ 10 units
 *   Main body (radius 2.8) fills ~56% of viewport height — appropriately large
 *   Orbital ring (radius 4.2) extends to 84% viewport height — frames portrait
 */

function Lighting() {
  return (
    <>
      {/* Absolute minimum ambient — surfaces must earn light from key sources */}
      <ambientLight intensity={0.05} color="#08101c" />

      {/* Key light — warm, raking from upper-right, creates strong metallic highlights */}
      <directionalLight position={[14, 20, 6]} intensity={2.8} color="#e0d8c8" />

      {/* Soft fill — cool-blue opposite side, prevents total darkness */}
      <directionalLight position={[-10, 4, 3]} intensity={0.3} color="#b0c8e0" />

      {/* Cyan point light — primary chromatic accent, lower-left near portrait */}
      <pointLight position={[-14, -2, 14]} intensity={8} color="#22d3ee" distance={40} decay={2} />

      {/* Violet point — opposing accent, creates colour contrast in reflections */}
      <pointLight position={[18, 8, -6]} intensity={3.5} color="#8b6fff" distance={32} decay={2} />

      {/* Cold back rim — separates structure from void */}
      <pointLight position={[0, 0, -22]} intensity={1.5} color="#1a2848" distance={40} decay={2} />
    </>
  );
}

function Artifact() {
  const groupRef   = useRef<THREE.Group>(null);
  const ring1Ref   = useRef<THREE.Mesh>(null);
  const ring2Ref   = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  // Edge geometry computed once
  const icosaEdges = useMemo(() =>
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.8, 1)), []);
  const dodecaEdges = useMemo(() =>
    new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(3.4, 0)), []);

  // Materials
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#06091a'),
    roughness: 0.05,
    metalness: 1.0,
    envMapIntensity: 2.0,
  }), []);

  const innerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0c1430'),
    roughness: 0.18,
    metalness: 0.88,
    side: THREE.BackSide,
  }), []);

  const secondaryMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#050814'),
    roughness: 0.04,
    metalness: 1.0,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!groupRef.current) return;

    // Deliberate, architectural rotation — not a toy spin
    groupRef.current.rotation.y = t * 0.03 + pointer.x * 0.06;
    groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.08 + pointer.y * 0.03;

    // Independent ring rotations on non-trivial axes
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += 0.002;
      ring1Ref.current.rotation.x += 0.0005;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += 0.0015;
      ring2Ref.current.rotation.y -= 0.001;
    }
  });

  return (
    /* Slightly off-centre — portrait covers central region, artifact frames it */
    <group ref={groupRef} position={[0.3, 0.2, 0]}>

      {/* ── Primary body — dark chrome icosahedron ── */}
      <mesh material={bodyMat}>
        <icosahedronGeometry args={[2.8, 1]} />
      </mesh>
      <mesh material={innerMat}>
        <icosahedronGeometry args={[2.72, 1]} />
      </mesh>

      {/* ── Structural edge lines — icosahedron skeleton ── */}
      <lineSegments geometry={icosaEdges}>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.07} />
      </lineSegments>

      {/* ── Secondary cage — dodecahedron, different orientation ── */}
      <mesh material={secondaryMat} rotation={[0.6, 0.85, 0.35]}>
        <dodecahedronGeometry args={[3.4, 0]} />
      </mesh>
      <lineSegments geometry={dodecaEdges} rotation={[0.6, 0.85, 0.35]}>
        <lineBasicMaterial color="#c0d0e8" transparent opacity={0.035} />
      </lineSegments>

      {/* ── Orbital ring 1 — primary cyan, tilted 65° ── */}
      {/* This frames the portrait like a saturn ring */}
      <mesh ref={ring1Ref} rotation={[1.15, 0.25, 0.1]}>
        <torusGeometry args={[4.2, 0.018, 8, 256]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={4.5}
          roughness={0}
          metalness={0}
          toneMapped={false}
        />
      </mesh>

      {/* ── Orbital ring 2 — silver-white, nearly horizontal, larger ── */}
      <mesh ref={ring2Ref} rotation={[0.35, 0.7, 1.1]}>
        <torusGeometry args={[5.4, 0.01, 6, 256]} />
        <meshStandardMaterial
          color="#dce8f0"
          emissive="#ffffff"
          emissiveIntensity={1.4}
          roughness={0}
          metalness={0}
          transparent
          opacity={0.55}
          toneMapped={false}
        />
      </mesh>

      {/* ── Inner luminous core — engineering signal ── */}
      <mesh>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={6}
          roughness={0}
          metalness={0}
          toneMapped={false}
        />
      </mesh>
      {/* Hot centre */}
      <mesh>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={10}
          roughness={0}
          metalness={0}
          toneMapped={false}
        />
      </mesh>

    </group>
  );
}

export default function Hero3D() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  if (reduced) return null;

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 44 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
        }}
        dpr={[1, 1.5]}
      >
        <Lighting />
        <Artifact />
      </Canvas>
    </div>
  );
}
