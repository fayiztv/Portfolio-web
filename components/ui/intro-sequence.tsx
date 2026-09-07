"use client";

import React, { useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";

interface IntroSequenceProps {
  onReady: () => void;
  isMobile: boolean;
}

export function IntroSequence({ onReady, isMobile }: IntroSequenceProps) {
  const { progress, active } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Simulated minimum loading time for visual smoothness, gating on actual 3D readiness
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isReady) {
      interval = setInterval(() => {
        setDisplayProgress(p => {
          // If 3D canvas is still active loading, hold at 90%
          if (active && p >= 90) return 90;
          // If R3F reports 100% or inactive (finished), go to 100%
          if (!active || progress === 100) {
            if (p >= 100) {
              clearInterval(interval);
              setIsReady(true);
              onReady();
              return 100;
            }
            return p + 5;
          }
          // Otherwise increment normally
          return p + 2;
        });
      }, 30);
    }

    return () => clearInterval(interval);
  }, [active, progress, isReady, onReady]);

  return (
    <>
      {/* 1. Loading State Gate */}
      {!isReady && (
        <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
          <div className="w-full max-w-sm border border-border/50 rounded-lg bg-secondary/5 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 bg-background/50">
              <div className="w-2.5 h-2.5 rounded-full bg-border/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-border/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-border/50"></div>
            </div>
            <div className="p-8 flex flex-col items-center">
              <div className="w-full h-1 bg-border/30 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-accent transition-all duration-75 ease-linear"
                  style={{ width: `${displayProgress}%` }}
                />
              </div>
              <span className="font-jetbrains-mono text-xs text-secondary tracking-widest uppercase">
                {displayProgress >= 100 ? "READY" : `LOADING → ${Math.floor(displayProgress)}%`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Intro Sequence Layers (Managed by GSAP in parent) */}
      <div className="intro-layers-container fixed inset-0 z-40 pointer-events-none opacity-0">
        
        {/* SVG Defs & Masking Engine */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            {/* Pattern (Step 2) */}
            <pattern id="dash-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="12" height="3" fill="var(--secondary)" opacity="0.3" rx="1.5" />
              <rect x="20" y="20" width="12" height="3" fill="var(--secondary)" opacity="0.3" rx="1.5" />
            </pattern>

            {/* Metaball / Liquid Filter (Step 3) - Only on Desktop */}
            {!isMobile && (
              <filter id="metaball">
                <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="1" result="noise" className="intro-turbulence" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            )}

            {/* Mask to cut "FAYIZ" out of the pattern (White = Keep pattern, Black = transparent hole) */}
            <mask id="pattern-text-mask">
              <rect width="100%" height="100%" fill="white" />
              <g className="intro-text-group-pattern">
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="font-clash-display font-semibold text-[15vw] md:text-[18vw]" fill="black">
                  FAYIZ
                </text>
              </g>
            </mask>

            {/* Mask to reveal the 3D Canvas (Black = hide canvas, White = show canvas through text) */}
            <mask id="hero-canvas-mask">
              <rect width="100%" height="100%" fill="black" />
              <g className="intro-text-group-canvas">
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="font-clash-display font-semibold text-[15vw] md:text-[18vw]" fill="white">
                  FAYIZ
                </text>
              </g>
            </mask>
          </defs>

          {/* Layer: Dark Background */}
          <rect width="100%" height="100%" fill="var(--background)" className="intro-bg-solid" />

          {/* Layer: Pattern with cutout text */}
          <rect 
            width="100%" 
            height="100%" 
            fill="url(#dash-pattern)" 
            mask="url(#pattern-text-mask)" 
            filter={!isMobile ? "url(#metaball)" : ""}
            className="intro-pattern-layer" 
          />

          {/* Layer: Solid Text (Step 4) */}
          <g className="intro-text-group-solid opacity-0">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="font-clash-display font-semibold text-[15vw] md:text-[18vw]" fill="var(--foreground)">
              FAYIZ
            </text>
          </g>

          {/* Layer: Wipe Ribbon (Step 5) */}
          <rect x="-100%" y="0" width="100%" height="100%" fill="var(--accent)" className="intro-wipe-ribbon" />
        </svg>

        {/* Decorative Border Frame (Step 4) */}
        <div className="intro-border-frame absolute inset-4 border border-secondary/20 pointer-events-none opacity-0" />
      </div>
    </>
  );
}
