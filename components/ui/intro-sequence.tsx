"use client";

import React, { useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";

interface IntroSequenceProps {
  onReady: () => void;
  isMobile: boolean;
  debugState?: string;
}

export function IntroSequence({ onReady, isMobile, debugState }: IntroSequenceProps) {
  const { progress, active } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Simulated minimum loading time for visual smoothness, gating on actual 3D readiness
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isReady) {
      interval = setInterval(() => {
        setDisplayProgress(p => {
          // R3F useProgress can be inactive on mount before first request.
          // We wait until p reaches 90. If active, we hold at 90.
          if (active && p >= 90) return 90;
          
          if (!active && p >= 90 && progress === 100) {
            // Wait until it actually reached 100 and no longer active
            clearInterval(interval);
            setIsReady(true);
            onReady();
            return 100;
          }
          
          if (p >= 100) {
            clearInterval(interval);
            setIsReady(true);
            onReady();
            return 100;
          }

          return p + 3;
        });
      }, 30);
    }

    return () => clearInterval(interval);
  }, [active, progress, isReady, onReady]);

  return (
    <>
      {/* DEBUG LABEL */}
      <div className="fixed top-4 left-4 z-[999] bg-black text-white px-2 py-1 font-mono text-xs uppercase border border-red-500">
        Stage: {debugState || "loading"} | R3F: {Math.round(progress)}% | Display: {Math.round(displayProgress)}%
      </div>

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
            {/* The Light Sweep Visual Gradient */}
            <linearGradient id="sweep-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="sweep-blur">
              <feGaussianBlur stdDeviation="30" />
            </filter>

            {/* The Mask for Layer 2 (Soft wipe transition) */}
            <linearGradient id="sweep-mask-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" />
              <stop offset="80%" stopColor="white" />
              <stop offset="100%" stopColor="black" />
            </linearGradient>
            <mask id="sweep-mask">
              <rect className="intro-sweep-mask-rect" width="300%" height="100%" fill="url(#sweep-mask-grad)" x="-200%" />
            </mask>

            {/* Mask to reveal the 3D Canvas through text */}
            <mask id="hero-canvas-mask">
              <rect width="100%" height="100%" fill="black" />
              <g className="intro-text-group-canvas">
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="font-clash-display font-semibold text-[15vw] md:text-[18vw]" fill="white">
                  FAYIZ
                </text>
              </g>
            </mask>
          </defs>

          {/* Layer 2: Scramble Text & Solid Background (Wiped away by mask to reveal 3D canvas) */}
          <g mask="url(#sweep-mask)" className="intro-layer-two">
            <rect width="100%" height="100%" fill="var(--background)" className="intro-bg-solid" />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-[15vw] md:text-[18vw]">
              {['F', 'A', 'Y', 'I', 'Z'].map((char, i) => (
                <tspan 
                  key={i} 
                  id={`scramble-char-${i}`} 
                  className="scramble-char font-jetbrains-mono font-medium fill-secondary"
                  style={{ transition: 'fill 0.15s ease' }}
                >
                  {char}
                </tspan>
              ))}
            </text>
          </g>

          {/* Layer 3: Light Sweep Visual */}
          <rect 
            className="intro-sweep-visual opacity-0" 
            width="100%" 
            height="150%" 
            y="-25%"
            x="-100%"
            fill="url(#sweep-gradient)" 
            filter="url(#sweep-blur)" 
            transform="skewX(-15)"
          />
        </svg>
      </div>
    </>
  );
}
