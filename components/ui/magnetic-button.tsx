"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "../providers/reduced-motion-provider";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
}

export function MagneticButton({ children, strength = 30, className = "", ...props }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !buttonRef.current || !textRef.current) return;

    const button = buttonRef.current;
    const text = textRef.current;

    const xTo = gsap.quickTo(button, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(button, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const textXTo = gsap.quickTo(text, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const textYTo = gsap.quickTo(text, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = button.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      xTo(x * (strength / 100));
      yTo(y * (strength / 100));
      textXTo(x * (strength / 200));
      textYTo(y * (strength / 200));
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      textXTo(0);
      textYTo(0);
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [prefersReducedMotion, strength]);

  return (
    <button
      ref={buttonRef}
      className={`relative inline-flex items-center justify-center ${className}`}
      {...props}
    >
      <span ref={textRef} className="pointer-events-none block">
        {children}
      </span>
    </button>
  );
}
