"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import ExposeState from "./ExposeState";

/**
 * The Surfer. A chrome rider on a chrome board, carving across the page
 * as you scroll — banking into turns, trailing an ember wake, reflecting
 * the disk's fire off every surface. The whole figure is re-materialed
 * to liquid chrome so it reads as sculpture, not action figure.
 *
 * Flight plan (kept simple and consistent):
 *  1. waits at the hero's bottom-right corner; slides in the moment you scroll
 *  2. one clean sweep up-left across About, exiting during Experience
 *  3. one high right-to-left glide over the late Experience / quote
 *  4. sits out the pinned Projects ride entirely
 *  5. one diagonal top-right → bottom-left over More Experiments
 *  6. final approach through Leadership, gone by the footer
 */

const RIG_SCALE = 0.2;

type Key = { p: number; x: number; y: number; jump?: boolean };

const PATH: Key[] = [
  { p: 0.0, x: 1.55, y: -0.8 }, // parked just off the hero's bottom-right
  { p: 0.05, x: 0.9, y: -0.5 }, // slides in the moment scrolling starts
  { p: 0.14, x: 0.0, y: 0.0 },
  { p: 0.24, x: -1.6, y: 0.55 }, // exits upper-left during Experience
  { p: 0.3, x: 1.6, y: 0.72, jump: true }, // reposition right (hidden)
  { p: 0.34, x: 0.9, y: 0.62 }, // high right-to-left glide
  { p: 0.42, x: -1.6, y: 0.4 }, // gone before the projects pin
  { p: 0.62, x: 1.6, y: 0.85, jump: true }, // sits out pinned Projects
  { p: 0.66, x: 0.95, y: 0.55 }, // enters top-right over More Experiments
  { p: 0.73, x: -1.6, y: -0.75 }, // one diagonal to bottom-left, out
  { p: 0.8, x: 1.6, y: -0.55, jump: true }, // reposition for Leadership
  { p: 0.84, x: 0.85, y: -0.45 }, // final approach, halfway through Leadership
  { p: 0.92, x: -0.25, y: -0.05 },
  { p: 1.0, x: -1.6, y: 0.55 }, // gone by the footer
];

const WAKE_COUNT = 70;

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function samplePath(p: number): { x: number; y: number; hidden: boolean } {
  let i = 0;
  while (i < PATH.length - 2 && p > PATH[i + 1].p) i++;
  const a = PATH[i];
  const b = PATH[i + 1];
  if (a.jump) return { x: b.x, y: b.y, hidden: true };
  const t = smooth(THREE.MathUtils.clamp((p - a.p) / (b.p - a.p), 0, 1));
  return {
    x: THREE.MathUtils.lerp(a.x, b.x, t),
    y: THREE.MathUtils.lerp(a.y, b.y, t),
    hidden: false,
  };
}

const chrome = new THREE.MeshStandardMaterial({
  color: "#f4f6fa",
  metalness: 1,
  roughness: 0.07,
  envMapIntensity: 1.7,
});

function Rider() {
  const { scene } = useGLTF("/models/silver-surfer.glb");

  const figure = useMemo(() => {
    // normalize whatever the model's native scale/origin is:
    // chrome everything, stand ~1.5 board-units tall, feet at y=0
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) mesh.material = chrome;
    });
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const s = 1.5 / (size.y || 1);
    scene.scale.setScalar(s);
    box.setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.x -= center.x;
    scene.position.z -= center.z;
    scene.position.y -= box.min.y;
    return scene;
  }, [scene]);

  // stands on the board's top surface; the facing group handles direction
  return <primitive object={figure} position={[0, 0.4, 0]} />;
}

function SurferRig({ progress }: { progress: React.RefObject<number> }) {
  const rig = useRef<THREE.Group>(null);
  const board = useRef<THREE.Group>(null);
  const facing = useRef<THREE.Group>(null);
  const wake = useRef<THREE.Points>(null);
  const prev = useRef({ x: -10, y: 0 });
  const dir = useRef(1); // +1 flying right, -1 flying left
  const wakeIdx = useRef(0);

  const { wakePositions, wakeLife } = useMemo(
    () => ({
      wakePositions: new Float32Array(WAKE_COUNT * 3).fill(99),
      wakeLife: new Float32Array(WAKE_COUNT).fill(0),
    }),
    []
  );

  useFrame((state, delta) => {
    if (!rig.current || !board.current) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    const halfH =
      Math.tan(
        (state.camera as THREE.PerspectiveCamera).fov * 0.5 * (Math.PI / 180)
      ) * 5;
    const halfW = halfH * (state.size.width / state.size.height);

    const { x, y, hidden } = samplePath(progress.current);
    const wx = x * halfW;
    const wy = y * halfH + Math.sin(t * 0.9) * 0.05; // idle bob

    const vx = wx - prev.current.x;
    const vy = wy - prev.current.y;
    prev.current.x = wx;
    prev.current.y = wy;

    rig.current.position.set(wx, wy, 0);
    rig.current.visible = !hidden && Math.abs(x) < 1.45;

    // carve: roll into horizontal motion, pitch into vertical
    const bank = THREE.MathUtils.clamp(-vx * 6, -0.5, 0.5);
    const pitch = THREE.MathUtils.clamp(vy * 4, -0.3, 0.3);
    board.current.rotation.z +=
      (bank + Math.sin(t * 0.7) * 0.04 - board.current.rotation.z) * 0.08;
    board.current.rotation.x += (pitch - board.current.rotation.x) * 0.08;
    board.current.rotation.y = 0.3 + Math.sin(t * 0.4) * 0.1;

    // face the direction of travel — eases through the turn
    if (Math.abs(vx) > 0.002) dir.current = vx > 0 ? 1 : -1;
    if (facing.current) {
      facing.current.rotation.y +=
        (dir.current * (Math.PI / 2) - facing.current.rotation.y) * 0.09;
    }

    // ember wake behind the tail while moving
    const speed = Math.hypot(vx, vy);
    if (rig.current.visible && speed > 0.003) {
      const i = wakeIdx.current;
      wakePositions[i * 3] = wx - Math.sign(vx || 1) * 0.18;
      wakePositions[i * 3 + 1] = wy - 0.02;
      wakePositions[i * 3 + 2] = -0.2;
      wakeLife[i] = 1;
      wakeIdx.current = (i + 1) % WAKE_COUNT;
    }
    for (let i = 0; i < WAKE_COUNT; i++) {
      if (wakeLife[i] <= 0) continue;
      wakeLife[i] -= dt * 1.4;
      wakePositions[i * 3 + 1] += dt * 0.06;
      if (wakeLife[i] <= 0) wakePositions[i * 3] = 99;
    }
    if (wake.current) {
      wake.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <group ref={rig} visible={false}>
        <group ref={board}>
          <group scale={RIG_SCALE}>
            {/* the board: thin chrome plank */}
            <mesh rotation={[0, 0, Math.PI / 2]} scale={[0.4, 1, 0.9]}>
              <capsuleGeometry args={[0.42, 2.4, 8, 24]} />
              <primitive object={chrome} attach="material" />
            </mesh>
            {/* the rider — flips to face the direction of travel;
                board still flies while the model streams in */}
            <group ref={facing} rotation={[0, Math.PI / 2, 0]}>
              <Suspense fallback={null}>
                <Rider />
              </Suspense>
            </group>
          </group>
        </group>
      </group>
      <points ref={wake}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[wakePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#ff8e3c"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </>
  );
}

export default function CosmicSurfer() {
  const progress = useRef(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // desktop, motion-tolerant only — this is garnish, not structure
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gate = () => setActive(window.innerWidth > 1024);
    gate();
    window.addEventListener("resize", gate);

    let target = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? window.scrollY / max : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // chase the scroll target so the flight feels floaty, not glued
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      progress.current += (target - progress.current) * 0.06;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", gate);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[55] hidden lg:block">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ pointerEvents: "none" }}
      >
        <ExposeState />
        {/* procedural chrome environment: bright cool silver overhead for
            true chrome highlights, only a faint warm glow from the disk
            below — silver first, orange as a hint */}
        <Environment frames={1} resolution={64}>
          <mesh position={[0, -3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[30, 30]} />
            <meshBasicMaterial color="#6e523c" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[30, 30]} />
            <meshBasicMaterial color="#aab1bd" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, -8]}>
            <planeGeometry args={[24, 8]} />
            <meshBasicMaterial color="#2a2d34" side={THREE.DoubleSide} />
          </mesh>
        </Environment>
        <SurferRig progress={progress} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/silver-surfer.glb");
