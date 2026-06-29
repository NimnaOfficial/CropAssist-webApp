"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

function Particles() {
  const { resolvedTheme } = useTheme();
  const count = 500;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  const meshRef = useRef<THREE.Points>(null!);
  const { viewport } = useThree();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Cursor tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base gentle rotation
      meshRef.current.rotation.y += delta * 0.02;
      meshRef.current.rotation.x += delta * 0.01;
      
      // Cursor parallax effect (subtle)
      const targetX = mouse.x * 0.5;
      const targetY = mouse.y * 0.5;
      
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
    }
  });

  // Very subtle colors
  const color = resolvedTheme === "dark" ? "#22c55e" : "#16a34a";
  const opacity = resolvedTheme === "dark" ? 0.3 : 0.2;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        color={color} 
        transparent 
        opacity={opacity} 
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function DashboardBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <fog attach="fog" args={["#000", 3, 10]} />
        <Particles />
      </Canvas>
    </div>
  );
}
