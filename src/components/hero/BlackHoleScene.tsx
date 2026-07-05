"use client";

import { useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ExposeState from "@/components/three/ExposeState";

type SceneProps = {
  pointer: RefObject<THREE.Vector2>;
  isMobile: boolean;
  reduced: boolean;
};

/* ================================================================
   GARGANTUA — a shader-built accretion system.
   Anatomy: near-edge-on accretion disk (differentially sheared fbm
   streaks, temperature ramp, relativistic beaming), a pure-black
   shadow, a white-hot photon ring with a lensed halo arc above,
   and a starfield. Pulses slowly. No textures, no models.
   ================================================================ */

const NOISE_GLSL = /* glsl */ `
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.55;
    for (int i = 0; i < OCTAVES; i++) {
      v += amp * vnoise(p);
      p = p * 2.03 + vec2(17.13, 9.71);
      amp *= 0.5;
    }
    return v;
  }
`;

const diskVertex = /* glsl */ `
  varying vec2 vP;
  void main() {
    vP = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const diskFragment = /* glsl */ `
  uniform float uTime;
  varying vec2 vP;
  ${"" /* noise injected via defines-driven OCTAVES */}
  __NOISE__
  void main() {
    float r = length(vP);
    float rn = clamp((r - INNER) / (OUTER - INNER), 0.0, 1.0);

    // differential rotation: inner orbits shear faster -> streaks smear into arcs
    float th = uTime * (1.5 / max(r * 0.55, 0.35));
    float c1 = cos(th), s1 = sin(th);
    vec2 q = mat2(c1, -s1, s1, c1) * vP;
    float n = 0.6 + 0.55 * (fbm(q * 1.15) - 0.5);

    float th2 = uTime * (2.4 / max(r * 0.5, 0.3));
    float c2 = cos(th2), s2 = sin(th2);
    vec2 q2 = mat2(c2, -s2, s2, c2) * vP;
    n *= 0.8 + 0.42 * fbm(q2 * 2.6);

    // fine concentric striations — the grooved-disk look
    float rings = 0.86 + 0.14 * sin(r * 30.0 - uTime * 0.5 + n * 7.0);
    n *= rings;

    // temperature ramp: deep ember rim -> orange -> white-hot inner edge
    float fall = pow(1.0 - rn, 1.5);
    vec3 cold = vec3(0.30, 0.05, 0.008);
    vec3 mid = vec3(1.0, 0.42, 0.10);
    vec3 hot = vec3(1.0, 0.90, 0.78);
    vec3 col = mix(cold, mid, fall);
    col = mix(col, hot, pow(fall, 2.6));

    // relativistic beaming: the approaching side burns brighter
    float dop = mix(0.45, 1.8, clamp(0.5 - 0.5 * vP.x / max(r, 0.001), 0.0, 1.0));

    // slow breathing
    float pulse = 1.0 + 0.06 * sin(uTime * 0.7) + 0.035 * sin(uTime * 1.9 + 1.3);

    float bright = (0.24 + 1.4 * fall) * n * dop * pulse;

    float aIn = smoothstep(0.0, 0.05, rn);
    float aOut = 1.0 - smoothstep(0.5, 1.0, rn);
    gl_FragColor = vec4(col * bright, aIn * aOut);
  }
`;

const ringFragment = /* glsl */ `
  uniform float uTime;
  varying vec2 vP;
  void main() {
    float r = length(vP);
    // thin white-hot photon ring
    float core = exp(-pow((r - 1.12) * 42.0, 2.0));
    // lensed halo — stronger above the shadow (the far disk, bent over the top)
    float halo = exp(-max(r - 1.12, 0.0) * 4.2) * 0.36;
    float topBoost = 1.0 + 1.1 * smoothstep(0.0, 1.0, vP.y / max(r, 0.001));
    float pulse = 1.0 + 0.05 * sin(uTime * 0.7 + 0.6);
    vec3 col = vec3(1.0, 0.88, 0.72) * core * 2.4
             + vec3(1.0, 0.50, 0.15) * halo * topBoost;
    float alpha = clamp(core * 1.5 + halo * topBoost, 0.0, 1.0);
    gl_FragColor = vec4(col * pulse, alpha * pulse);
  }
`;

function Gargantua({ pointer, isMobile, reduced }: SceneProps) {
  const group = useRef<THREE.Group>(null);

  const diskMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: diskVertex,
        fragmentShader: diskFragment.replace("__NOISE__", NOISE_GLSL),
        defines: {
          OCTAVES: isMobile ? 3 : 5,
          INNER: "1.2",
          OUTER: "6.0",
        },
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [isMobile]
  );

  const ringMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: diskVertex,
        fragmentShader: ringFragment,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      }),
    []
  );

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    diskMaterial.uniforms.uTime.value = t;
    ringMaterial.uniforms.uTime.value = t;

    if (group.current) {
      // barely-perceptible drift + breathing scale
      group.current.rotation.z = -0.09 + Math.sin(t * 0.05) * 0.02;
      const s = 1.0 + Math.sin(t * 0.45) * 0.008;
      group.current.scale.setScalar(s);
    }
    // cursor parallax on the camera — small, damped
    if (!isMobile) {
      const p = pointer.current;
      const cam = state.camera;
      cam.position.x += (p.x * 0.28 - cam.position.x) * 0.03;
      cam.position.y += (0.42 + p.y * 0.14 - cam.position.y) * 0.03;
    }
  });

  return (
    <group ref={group} position={[isMobile ? 0 : 1.25, isMobile ? -0.9 : -1.2, 0]}>
      {/* the shadow — pure black, occludes stars and the far disk */}
      <mesh>
        <sphereGeometry args={[1.0, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* accretion disk — flat in xz, near edge-on to camera */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={diskMaterial}>
        <ringGeometry args={[1.2, 6.0, 180, 1]} />
      </mesh>
      {/* photon ring + lensed halo, facing camera, drawn over everything */}
      <mesh material={ringMaterial} renderOrder={10}>
        <ringGeometry args={[0.95, 2.6, 128, 1]} />
      </mesh>
    </group>
  );
}

function Starfield({ isMobile, reduced }: { isMobile: boolean; reduced: boolean }) {
  const count = isMobile ? 500 : 1300;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // shell of stars far behind the system
      const r = 26 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = -Math.abs(r * Math.cos(phi)) - 8;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y += Math.min(delta, 0.05) * 0.004;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        color="#fff3e2"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function BlackHoleScene({
  pointer,
  isMobile,
  reduced,
  onReady,
}: SceneProps & { onReady?: () => void }) {
  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [0, 0.42, 7.2], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      onCreated={() => onReady?.()}
    >
      <ExposeState />
      <color attach="background" args={["#030304"]} />
      <Starfield isMobile={isMobile} reduced={reduced} />
      <Gargantua pointer={pointer} isMobile={isMobile} reduced={reduced} />
    </Canvas>
  );
}
