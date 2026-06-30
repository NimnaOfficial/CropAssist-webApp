"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

function SwirlingDots({ count, reverse }: { count: number; reverse: boolean }) {
  // Create a perfectly polished circular texture for the dots
  const dotTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.5, "rgba(255,255,255,0.8)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    
    // Only Green and Yellow colors
    const palette = [
      new THREE.Color("#22c55e"), // green
      new THREE.Color("#84cc16"), // lime green
      new THREE.Color("#eab308"), // yellow
      new THREE.Color("#fef08a"), // bright yellow
    ];

    for (let i = 0; i < count; i++) {
      // "Dots are everywhere" - massive spherical volume
      const radius = Math.random() * 30 + 5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi);
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      const color = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return { positions: pos, colors: cols };
  }, [count]);

  const meshRef = useRef<THREE.Points>(null!);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const speed = 0.015;
    // Some move up roundly, others down roundly
    if (reverse) {
      meshRef.current.rotation.y -= delta * speed;
      meshRef.current.rotation.x -= delta * (speed * 0.5);
      meshRef.current.rotation.z -= delta * (speed * 0.2);
    } else {
      meshRef.current.rotation.y += delta * speed;
      meshRef.current.rotation.x += delta * (speed * 0.5);
      meshRef.current.rotation.z += delta * (speed * 0.2);
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        vertexColors={true}
        map={dotTexture}
        transparent={true} 
        opacity={0.6} 
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function DashboardBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Hydration fix: Return an empty div with the correct classes during SSR
    return <div className="fixed inset-0 z-0 pointer-events-none bg-zinc-50 dark:bg-[#030303]" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-zinc-50 dark:bg-[#030303]">
      {/* 
        ULTIMATE 3D GREEN & YELLOW SWIRLING GALAXY 
      */}
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }} dpr={[1, 2]}>
        <fog attach="fog" args={[isDark ? "#030303" : "#fafafa", 10, 40]} />
        {/* Layer 1: Swirling Upwards */}
        <SwirlingDots count={2000} reverse={false} />
        {/* Layer 2: Swirling Downwards */}
        <SwirlingDots count={2000} reverse={true} />
      </Canvas>
    </div>
  );
}
