"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import dynamic from "next/dynamic";
import { useReducedMotion } from "../providers/reduced-motion-provider";

// Dynamically import the 3D model so it doesn't block initial page load or SSR
const HeroModel = dynamic(() => import("../3d/hero-model"), {
  ssr: false,
});

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      // Create a master timeline
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });
      
      timelineRef.current = tl;

      if (prefersReducedMotion) {
        // Simple fade in for accessibility
        tl.to(".hero-element", { opacity: 1, duration: 1, stagger: 0.1 })
          .to(".hero-3d-container", { opacity: 1, duration: 1 }, "-=0.5");
        return;
      }

      // Cinematic Entrance Animation
      tl.set(".hero-element", { y: 50, opacity: 0 })
        .set(".hero-title-line", { y: "120%", opacity: 0 })
        .set(".hero-3d-container", { opacity: 0 });

      // Staggered reveal for masked title lines
      tl.to(".hero-title-line", {
        y: "0%",
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "expo.out",
      })
      // Fade/slide up the supporting text
      .to(".hero-element", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
      }, "-=0.8")
      // Fade in the 3D canvas smoothly
      .to(".hero-3d-container", {
        opacity: 1,
        duration: 2,
        ease: "power2.inOut",
      }, "-=0.5");

    }, containerRef);

    return () => ctx.revert(); // Cleanup GSAP context
  }, [prefersReducedMotion]);

  return (
    <section 
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center pt-20 pb-12 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* Background 3D Element */}
      <HeroModel />

      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col justify-center">
        
        {/* Availability Badge */}
        <div className="hero-element flex items-center gap-3 mb-8 md:mb-12">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
          </div>
          <p className="font-jetbrains-mono text-xs uppercase tracking-widest text-secondary">
            Available for SE / Full-Stack Roles
          </p>
        </div>

        {/* Masked Title Reveal Container */}
        <div className="mb-6 space-y-1">
          <div className="overflow-hidden">
            <h1 className="hero-title-line font-clash-display font-semibold text-5xl md:text-7xl lg:text-[7.5rem] leading-[0.9] tracking-tight">
              Muhammed Fayiz TV
            </h1>
          </div>
          <div className="overflow-hidden">
            <h2 className="hero-title-line font-clash-display text-3xl md:text-5xl lg:text-7xl leading-[1.1] tracking-tight text-secondary/80">
              Full Stack Software Engineer
            </h2>
          </div>
        </div>

        {/* Copy & Location */}
        <div className="hero-element flex flex-col md:flex-row gap-8 md:gap-16 mt-8 md:mt-12 max-w-4xl">
          <p className="font-general-sans text-lg md:text-xl text-secondary/90 leading-relaxed max-w-2xl text-balance">
            Building real, production software end-to-end — from enterprise ERP systems to scalable SaaS platforms. I judge a project by its bugs, because fixing them reveals exactly how it was built.
          </p>
          
          <div className="flex flex-col gap-1 font-jetbrains-mono text-sm text-secondary/70 shrink-0 justify-end">
            <span className="text-accent/80 uppercase text-xs tracking-wider mb-1">Base</span>
            <span>Kannur, Kerala</span>
            <span>India</span>
          </div>
        </div>
      </div>
    </section>
  );
}
