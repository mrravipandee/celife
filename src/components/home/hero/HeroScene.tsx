"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Custom Shader for Refracted Botanical Background ─────────────────────────

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
  vec2 ratio = vec2(
    min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
    min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
  );
  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  // Smoother, more fluid refraction (like liquid herbal extract)
  vec2 mouseDelta = uv - uMouse;
  float dist = length(mouseDelta);
  
  // Slower, deeper waves for a calming effect
  float wave = sin(dist * 15.0 - uTime * 1.8) * exp(-dist * 4.0) * uHoverActive;
  float ambient = sin(uv.y * 4.0 + uTime * 0.4) * cos(uv.x * 4.0 + uTime * 0.3) * 0.003;

  vec2 displacedUv = uv + (normalize(mouseDelta + 0.0001) * wave * 0.012) + vec2(ambient);
  
  vec4 color = texture2D(uTexture, displacedUv);
  
  // CHANGED: Warm Amber/Copper glint instead of Gold
  float glint = clamp(wave * 0.2, 0.0, 0.1);
  color.rgb += vec3(0.83, 0.64, 0.45) * glint;

  // ADDED: Soft vignette to focus attention on the center text
  float vignette = 1.0 - smoothstep(0.3, 1.2, length(vUv - 0.5));
  color.rgb *= mix(0.85, 1.0, vignette);

  gl_FragColor = color;
}
`;

function BackgroundPlane({ mouseRef, hoverRef }: { mouseRef: React.RefObject<THREE.Vector2>; hoverRef: React.RefObject<number> }) {
  const { viewport, size, camera } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  const targetVp = viewport.getCurrentViewport(camera, [0, 0, -1]);
  const meshScale: [number, number, number] = [targetVp.width * 1.08, targetVp.height * 1.08, 1];

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    // CHANGED: Brand aligned image
    loader.load("/images/hero/botanical-extract.jpg", (tex) => {
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
    []
  );

  useEffect(() => {
    if (materialRef.current && texture) materialRef.current.uniforms.uTexture.value = texture;
  }, [texture]);

  useEffect(() => {
    if (materialRef.current) materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
  }, [size]);

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta;

    if (mouseRef.current) {
      const currentMouse = materialRef.current.uniforms.uMouse.value as THREE.Vector2;
      currentMouse.lerp(mouseRef.current, 0.05); // Slower interpolation for calm feel
    }

    if (hoverRef.current !== undefined && hoverRef.current !== null) {
      const currentHover = materialRef.current.uniforms.uHoverActive.value as number;
      materialRef.current.uniforms.uHoverActive.value = THREE.MathUtils.lerp(currentHover, hoverRef.current, 0.04);
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

// ─── Botanical Pollen Particles (Restrained & Organic) ────────────────────────

function BotanicalParticles({ mouseRef }: { mouseRef: React.RefObject<THREE.Vector2> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 800; // Reduced slightly for elegance

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spd = new Float32Array(particleCount);

    let seed = 42;
    const prng = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (prng() - 0.5) * 16;
      pos[i * 3 + 1] = (prng() - 0.5) * 12;
      pos[i * 3 + 2] = (prng() - 0.5) * 4;
      spd[i] = 0.1 + prng() * 0.2; // Slower drift
    }
    return [pos, spd];
  }, [particleCount]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    // Organic swirling drift (like pollen in a gentle breeze)
    const time = performance.now() * 0.0001;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3 + 1;
      array[idx] += speeds[i] * delta * 0.2;
      array[idx * 3] += Math.sin(time + i) * delta * 0.05; // Subtle x-axis sway
      if (array[idx] > 6) array[idx] = -6;
    }
    posAttr.needsUpdate = true;

    if (mouseRef.current) {
      const targetRotX = (mouseRef.current.y - 0.5) * 0.05; // Reduced parallax intensity
      const targetRotY = (mouseRef.current.x - 0.5) * 0.07;
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotX, 0.03);
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetRotY, 0.03);
    }
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        // CHANGED: Soft Amber/Sage color instead of Gold
        color="#D4A373"
        transparent
        opacity={0.4} // Softer opacity
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
    // Slower breathing for a calming Ayurvedic effect
    const breathingY = Math.sin(time * 0.3) * 0.05;
    const breathingX = Math.cos(time * 0.2) * 0.03;

    if (mouseRef.current) {
      const targetX = (mouseRef.current.x - 0.5) * 0.25 + breathingX;
      const targetY = -(mouseRef.current.y - 0.5) * 0.2 + breathingY;

      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.03);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.03);
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
    const handleMouseLeave = () => hoverRef.current = 0;
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
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
        camera={{ position: [0, 0, 3], fov: 45 }}
        frameloop={isActive ? "always" : "never"}
        className="w-full h-full"
      >
        <CameraController mouseRef={mouseRef} />
        <BackgroundPlane mouseRef={mouseRef} hoverRef={hoverRef} />
        <BotanicalParticles mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}