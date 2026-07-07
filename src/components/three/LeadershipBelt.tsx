"use client";

import { Suspense, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import ExposeState from "./ExposeState";

/**
 * "Design in motion" belt — a curved filmstrip of leadership imagery
 * drifting across the frame as you scroll (trionn's motion-strip idea,
 * recast in the void). Cards are gently cylinder-bent, bob on their own
 * phase, and the whole strip rides the section's scroll progress.
 */

const CARD_W = 3.1;
const CARD_H = 1.95;
const GAP = 0.55;

function BeltCard({ url, index }: { url: string; index: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useTexture(url);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(CARD_W, CARD_H, 24, 1);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // slight cylindrical bend, like a strip of film
      pos.setZ(i, -(x * x) * 0.055);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.position.y = Math.sin(t * 0.5 + index * 1.7) * 0.07;
    mesh.current.rotation.x = Math.sin(t * 0.35 + index * 0.9) * 0.025;
  });

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      position={[index * (CARD_W + GAP), 0, 0]}
    >
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Belt({
  images,
  progress,
  pointer,
  reduced,
}: {
  images: string[];
  progress: RefObject<number>;
  pointer: RefObject<THREE.Vector2>;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  // loop the set twice so the strip never runs out mid-drift
  const urls = useMemo(() => [...images, ...images], [images]);
  const total = urls.length * (CARD_W + GAP) - GAP;

  useFrame(() => {
    if (!group.current) return;
    const p = reduced ? 0.5 : progress.current;
    const target = -total / 2 + CARD_W / 2 + (0.5 - p) * 7.5;
    group.current.position.x +=
      (target - group.current.position.x) * (reduced ? 1 : 0.06);
    if (tilt.current && !reduced) {
      const px = pointer.current.x;
      tilt.current.rotation.y += (px * 0.06 - tilt.current.rotation.y) * 0.04;
    }
  });

  return (
    <group ref={tilt} rotation={[0.03, 0, -0.055]}>
      <group ref={group}>
        {urls.map((url, i) => (
          <BeltCard key={`${url}-${i}`} url={url} index={i} />
        ))}
      </group>
    </group>
  );
}

export default function LeadershipBelt({
  images,
  progress,
  pointer,
  reduced,
}: {
  images: string[];
  progress: RefObject<number>;
  pointer: RefObject<THREE.Vector2>;
  reduced: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.4], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      style={{ pointerEvents: "none" }}
    >
      <ExposeState />
      <Suspense fallback={null}>
        <Belt
          images={images}
          progress={progress}
          pointer={pointer}
          reduced={reduced}
        />
      </Suspense>
    </Canvas>
  );
}
