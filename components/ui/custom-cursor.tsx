"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "../providers/reduced-motion-provider";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(true); // default true to prevent flash on mobile

  useEffect(() => {
    // Check if device is touch
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);

    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion || !cursorRef.current || !glowRef.current) return;

    // Use GSAP quickTo for highly performant tracking
    const xMoveCursor = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3" });
    const yMoveCursor = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3" });
    
    // Glow has slightly more lag for a smooth trailing effect
    const xMoveGlow = gsap.quickTo(glowRef.current, "x", { duration: 0.3, ease: "power3" });
    const yMoveGlow = gsap.quickTo(glowRef.current, "y", { duration: 0.3, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      xMoveCursor(e.clientX);
      yMoveCursor(e.clientY);
      xMoveGlow(e.clientX);
      yMoveGlow(e.clientY);
    };

    // State management based on hovered elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Default reset
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { scale: 1, backgroundColor: "transparent", duration: 0.2 });
      }

      // Check for links or buttons
      if (target.tagName.toLowerCase() === "a" || target.tagName.toLowerCase() === "button" || target.closest("a") || target.closest("button")) {
        gsap.to(cursorRef.current, { scale: 2.5, backgroundColor: "rgba(157, 78, 221, 0.1)", duration: 0.2 });
      }
      
      // Check for specific data-cursor attributes (e.g. data-cursor="project")
      const cursorData = target.closest("[data-cursor]");
      if (cursorData) {
        const type = cursorData.getAttribute("data-cursor");
        if (type === "project") {
          gsap.to(cursorRef.current, { scale: 3, backgroundColor: "var(--accent)", mixBlendMode: "difference", duration: 0.2 });
        }
      }
    };

    const handleMouseOut = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { scale: 1, backgroundColor: "transparent", mixBlendMode: "normal", duration: 0.2 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isTouchDevice, prefersReducedMotion]);

  if (isTouchDevice || prefersReducedMotion) return null;

  return (
    <>
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-32 h-32 -mt-16 -ml-16 bg-accent rounded-full pointer-events-none z-[998] opacity-10 blur-[40px]"
        style={{ willChange: "transform" }}
      />
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 -mt-2 -ml-2 border border-secondary rounded-full pointer-events-none z-[999] flex items-center justify-center transition-colors"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
