"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useReducedMotion } from "../providers/reduced-motion-provider";
import { IntroSequence } from "../ui/intro-sequence";

const HeroModel = dynamic(() => import("../3d/hero-model"), {
  ssr: false,
});

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [debugStage, setDebugStage] = useState("loading");
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    if (sessionStorage.getItem("introSkipped") === "true") {
      setIsSkipped(true);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady && !prefersReducedMotion && !isSkipped) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isReady, prefersReducedMotion, isSkipped]);

  const scrambleRef = useRef([false, false, false, false, false]);

  useEffect(() => {
    // Scrambler Loop
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    const scrambleChars = ['F', 'A', 'Y', 'I', 'Z'];
    let animationFrameId: number;
    let lastTime = 0;

    const loop = (time: number) => {
      if (time - lastTime > 60) {
        lastTime = time;
        scrambleChars.forEach((char, i) => {
          const node = document.getElementById(`scramble-char-${i}`);
          if (!node) return;

          if (scrambleRef.current[i]) {
            if (node.textContent !== char) {
              node.textContent = char;
              node.setAttribute("class", "scramble-char font-clash-display font-semibold fill-foreground");
              
              node.style.fill = "var(--accent)";
              node.style.filter = "drop-shadow(0 0 15px var(--accent))";
              setTimeout(() => {
                if (node) {
                  node.style.fill = "var(--foreground)";
                  node.style.filter = "none";
                }
              }, 150);
            }
          } else {
            const randomGlyph = glyphs[Math.floor(Math.random() * glyphs.length)];
            node.textContent = randomGlyph;
            node.setAttribute("class", "scramble-char font-jetbrains-mono font-medium fill-secondary");
          }
        });
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    if (!isReady || !pinRef.current || !containerRef.current) return;
    
    if (prefersReducedMotion || isSkipped) {
      setDebugStage("released (skipped)");
      setIsFinished(true);
      
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      gsap.set(".hero-3d-mask-container", { maskImage: "none", WebkitMaskImage: "none", opacity: 0 });
      gsap.set(".hero-element", { y: 50, opacity: 0 });
      gsap.set(".hero-title-line", { y: "120%", opacity: 0 });
      gsap.set("header", { opacity: 1 });

      tl.to(".hero-title-line", { y: "0%", opacity: 1, duration: 1.2, stagger: 0.15, ease: "expo.out" })
        .to(".hero-element", { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, "-=0.8")
        .to(".hero-3d-mask-container", { opacity: 1, duration: 2, ease: "power2.inOut" }, "-=0.5");
      return;
    }

    const ctx = gsap.context(() => {
      setDebugStage("pinning active");
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=5000",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            
            if (p < 0.35) setDebugStage("scramble decode");
            else if (p < 0.55) setDebugStage("light sweep");
            else if (p < 0.65) setDebugStage("visual reveal");
            else if (p < 0.80) setDebugStage("mask expand");
            else if (p < 0.88) setDebugStage("wordmark fade");
            else if (p < 1) setDebugStage("copy animate");
            
            if (p === 1) {
              setDebugStage("released");
              setIsFinished(true);
            } else {
              setIsFinished(false);
            }

            // Lock scramble letters sequentially (0% to 35%)
            scrambleRef.current = [
              p >= 0.07,
              p >= 0.14,
              p >= 0.21,
              p >= 0.28,
              p >= 0.35,
            ];
          }
        },
      });

      gsap.set(".intro-layers-container", { opacity: 1 });
      gsap.set(".hero-element", { y: 50, opacity: 0 });
      gsap.set(".hero-title-line", { y: "120%", opacity: 0 });
      gsap.set("header", { opacity: 0 }); 

      // 0 to 3: Holding phase while the scramble happens (mapped to 0-35% of scroll)
      tl.to({}, { duration: 3 });

      // 3 to 4: The Soft Light Sweep (mapped to 35-55% roughly)
      // Visual sweep crosses screen, mask wipes layer away revealing 3D underneath
      tl.set(".intro-sweep-visual", { opacity: 1 }, 3)
        .fromTo(".intro-sweep-mask-rect", { x: "-200%" }, { x: "100%", duration: 1, ease: "power2.inOut" }, 3)
        .fromTo(".intro-sweep-visual", { x: "-100%" }, { x: "100%", duration: 1, ease: "power2.inOut" }, 3);

      // 5 to 7.5: Mask Expands to Hero
      tl.to(".intro-text-group-canvas", {
        scale: 50, 
        transformOrigin: "50% 50%",
        duration: 2.5,
        ease: "power3.in",
      }, 5)
      .to("header", { opacity: 1, duration: 1 }, 6); 

      // 7.5 to 8.7: Clean up mask and Copy Reveal
      tl.set(".hero-3d-mask-container", { maskImage: "none", WebkitMaskImage: "none" }, 7.5)
        .set(".intro-layers-container", { opacity: 0 }, 7.5);

      tl.to(".hero-title-line", {
        y: "0%",
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "expo.out",
      }, 7.5)
      .to(".hero-element", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
      }, 8);

    }, containerRef);

    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
      const st = ScrollTrigger.getAll().find(t => t.pin === pinRef.current);
    });

    return () => ctx.revert();
  }, [isReady, prefersReducedMotion, isSkipped, isMobile]);

  const handleSkip = () => {
    sessionStorage.setItem("introSkipped", "true");
    
    // Always refresh before reading st.end to ensure we don't jump to a stale target
    ScrollTrigger.refresh();
    const st = ScrollTrigger.getAll().find(t => t.pin === pinRef.current);
    if (st) {
      console.log("Skipping to exact ST End:", st.end);
      window.scrollTo({ top: st.end, behavior: "instant" });
    } else {
      setIsSkipped(true);
      setIsReady(true);
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      {(!isSkipped && !prefersReducedMotion) && (
        <IntroSequence onReady={() => setIsReady(true)} isMobile={isMobile} debugState={debugStage} />
      )}
      
      {/* Skip Button - Only visible when intro is active and not finished */}
      {(!isSkipped && !prefersReducedMotion && isReady && !isFinished) && (
        <button 
          onClick={handleSkip}
          className="fixed bottom-8 right-8 z-50 font-jetbrains-mono text-xs uppercase tracking-widest text-secondary hover:text-accent transition-colors mix-blend-difference"
        >
          Skip Intro ↗
        </button>
      )}

      {/* The Pin Container */}
      <section 
        ref={pinRef}
        id="home"
        className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      >
        {/* Background 3D Element Masked */}
        <div 
          className="hero-3d-mask-container absolute inset-0 z-0 w-full h-full bg-background"
          style={{
            maskImage: (!isSkipped && !prefersReducedMotion) ? "url(#hero-canvas-mask)" : "none",
            WebkitMaskImage: (!isSkipped && !prefersReducedMotion) ? "url(#hero-canvas-mask)" : "none",
            maskSize: "cover",
            WebkitMaskSize: "cover",
          }}
        >
          <HeroModel />
        </div>

        {/* Copy Elements */}
        <div className="relative z-10 w-full h-full max-w-6xl mx-auto flex flex-col justify-center px-6 md:px-12 lg:px-24 pointer-events-none">
          <div className="pointer-events-auto">
            {/* Availability Badge */}
            <div className="hero-element flex items-center gap-3 mb-8 md:mb-12 mt-12 md:mt-20">
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
        </div>
      </section>
    </div>
  );
}
