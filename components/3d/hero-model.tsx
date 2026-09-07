"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "../providers/reduced-motion-provider";

function AbstractShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to -1 to +1
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Subtle rotation idle
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;

      // Parallax effect tied to mouse
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mousePosition.x * 0.5, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mousePosition.y * 0.5, 0.05);
      
      // Slight tilt tied to mouse
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mousePosition.y * 0.5, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mousePosition.x * 0.5, 0.05);
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#9d4edd"
          wireframe={true}
          transparent
          opacity={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Inner core object */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#c8b6ff"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

export default function HeroModel() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(true); // default true to avoid hydration mismatch and avoid rendering heavy Canvas on mobile

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile(); // Check on mount
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (prefersReducedMotion || isMobile) {
    return null; // Do not render heavy 3D canvas if motion is reduced or on small screens
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#c8b6ff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#9d4edd" />
        <AbstractShape />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
