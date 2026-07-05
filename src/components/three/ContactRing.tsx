"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ExposeState from "./ExposeState";

/**
 * A quiet echo of the hero for the footer: a thin tilted ring of
 * ember particles in slow orbit behind the closing words.
 */
function Ring({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const count = 650;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const furnace = new THREE.Color("#c2410c");
    const horizon = new THREE.Color("#ff8e3c");
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.15 + (Math.random() - 0.5) * 0.55 * Math.random();
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 2] = Math.sin(a) * r;
      c.copy(furnace).lerp(horizon, Math.random());
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    if (reduced || !group.current) return;
    group.current.rotation.y += Math.min(delta, 0.05) * 0.06;
  });

  return (
    <group ref={group} rotation={[1.18, 0, 0.12]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export default function ContactRing() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!mounted) return null;
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.4, 5.4], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <ExposeState />
      <Ring reduced={reduced} />
    </Canvas>
  );
}
