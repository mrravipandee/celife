"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Custom Shader for Refracted Luxury Background Plane ─────────────────────

const VertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform float uHoverActive;

varying vec2 vUv;

void main() {
  // Correct aspect ratio for object-fit: cover representation in WebGL
  vec2 ratio = vec2(
    min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
    min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
  );
  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  // Subtle interactive refraction following cursor
  vec2 mouseDelta = uv - uMouse;
  float dist = length(mouseDelta);
  
  // Refined wave: soft, restrained ripples with fast exponential falloff
  float wave = sin(dist * 20.0 - uTime * 2.8) * exp(-dist * 5.0) * uHoverActive;
  
  // Ambient calm breathing wave
  float ambient = sin(uv.y * 5.0 + uTime * 0.5) * cos(uv.x * 5.0 + uTime * 0.4) * 0.002;

  vec2 displacedUv = uv + (normalize(mouseDelta + 0.0001) * wave * 0.011) + vec2(ambient);
  
  vec4 color = texture2D(uTexture, displacedUv);
  
  // Subtle warm gold glint along ripple crests
  float glint = clamp(wave * 0.25, 0.0, 0.12);
  color.rgb += vec3(0.79, 0.64, 0.29) * glint;

  gl_FragColor = color;
}
`;

function BackgroundPlane({ mouseRef, hoverRef }: { mouseRef: React.RefObject<THREE.Vector2>; hoverRef: React.RefObject<number> }) {
  const { viewport, size, camera } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Compute exact viewport dimensions at mesh depth (z = -1) with bleed
  const targetVp = viewport.getCurrentViewport(camera, [0, 0, -1]);
  const meshScale: [number, number, number] = [targetVp.width * 1.08, targetVp.height * 1.08, 1];

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load("/images/hero/hotel-lobby.jpg", (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      setTexture(tex);
    });
  }, []);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: null as THREE.Texture | null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uImageResolution: { value: new THREE.Vector2(1920, 1080) },
      uHoverActive: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (materialRef.current && texture) {
      materialRef.current.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [size]);

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta;

    if (mouseRef.current) {
      // Smoothly interpolate mouse uniform
      const currentMouse = materialRef.current.uniforms.uMouse.value as THREE.Vector2;
      currentMouse.lerp(mouseRef.current, 0.06);
    }

    if (hoverRef.current !== undefined && hoverRef.current !== null) {
      const currentHover = materialRef.current.uniforms.uHoverActive.value as number;
      materialRef.current.uniforms.uHoverActive.value = THREE.MathUtils.lerp(
        currentHover,
        hoverRef.current,
        0.05
      );
    }
  });

  return (
    <mesh scale={meshScale} position={[0, 0, -1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VertexShader}
        fragmentShader={FragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Floating Gold Particles (Restrained Luxury) ──────────────────────────────

function GoldParticles({ mouseRef }: { mouseRef: React.RefObject<THREE.Vector2> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 1200;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spd = new Float32Array(particleCount);

    // Deterministic pseudo-random generation to maintain purity during render
    let seed = 42;
    const prng = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (prng() - 0.5) * 16;     // x range: -8 to 8
      pos[i * 3 + 1] = (prng() - 0.5) * 12; // y range: -6 to 6
      pos[i * 3 + 2] = (prng() - 0.5) * 4;  // z range: -2 to 2
      spd[i] = 0.15 + prng() * 0.35;         // slow upward/downward drift rate
    }
    return [pos, spd];
  }, [particleCount]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    // Slow ambient upward drift
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3 + 1;
      array[idx] += speeds[i] * delta * 0.35;
      if (array[idx] > 6) {
        array[idx] = -6;
      }
    }
    posAttr.needsUpdate = true;

    // Subtle parallax tilt following cursor
    if (mouseRef.current) {
      const targetRotX = (mouseRef.current.y - 0.5) * 0.08;
      const targetRotY = (mouseRef.current.x - 0.5) * 0.1;
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotX, 0.04);
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetRotY, 0.04);
    }
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        color="#c9a24a"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Parallax Camera Controller ───────────────────────────────────────────────

function CameraController({ mouseRef }: { mouseRef: React.RefObject<THREE.Vector2> }) {
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Ambient breathing oscillation
    const breathingY = Math.sin(time * 0.5) * 0.06;
    const breathingX = Math.cos(time * 0.35) * 0.04;

    if (mouseRef.current) {
      // Max 3 degrees (~0.052 rad) parallax
      const targetX = (mouseRef.current.x - 0.5) * 0.35 + breathingX;
      const targetY = -(mouseRef.current.y - 0.5) * 0.25 + breathingY;

      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.04);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.04);
      state.camera.lookAt(0, 0, -1);
    }
  });

  return null;
}

// ─── Main HeroScene Component ────────────────────────────────────────────────

export interface HeroSceneProps {
  isActive?: boolean;
}

export function HeroScene({ isActive = true }: HeroSceneProps) {
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));
  const hoverRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        mouseRef.current.set(x, 1.0 - y);
        hoverRef.current = 1;
      } else {
        hoverRef.current = 0;
      }
    };

    const handleMouseLeave = () => {
      hoverRef.current = 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        dpr={[1, 1.75]}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
        }}
        camera={{ position: [0, 0, 3], fov: 45 }}
        frameloop={isActive ? "always" : "never"}
        className="w-full h-full"
      >
        <CameraController mouseRef={mouseRef} />
        <BackgroundPlane mouseRef={mouseRef} hoverRef={hoverRef} />
        <GoldParticles mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
