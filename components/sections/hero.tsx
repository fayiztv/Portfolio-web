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
  const pinRef = useRef<HTMLElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    // Check if previously skipped
    if (sessionStorage.getItem("introSkipped") === "true") {
      setIsSkipped(true);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    // If not ready, we lock the scroll using body overflow
    if (!isReady && !prefersReducedMotion && !isSkipped) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isReady, prefersReducedMotion, isSkipped]);

  useEffect(() => {
    if (!isReady || !pinRef.current) return;
    if (prefersReducedMotion || isSkipped) {
      // Jump to end state
      gsap.set(".hero-element", { opacity: 1, y: 0 });
      gsap.set(".hero-title-line", { opacity: 1, y: "0%" });
      gsap.set(".hero-3d-mask-container", { maskImage: "none", WebkitMaskImage: "none", opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // The timeline is scrubbed via scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=5000", // 5000px of scrolling for the sequence
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Prepare initial states
      gsap.set(".intro-layers-container", { opacity: 1 });
      gsap.set(".hero-element", { y: 50, opacity: 0 });
      gsap.set(".hero-title-line", { y: "120%", opacity: 0 });
      gsap.set(".navbar", { opacity: 0 }); // Assuming navbar has this class or we fade it in layout... wait, navbar is global. 
      // We'll just fade the navbar element globally
      gsap.set("header", { opacity: 0 }); 

      // Timeline Steps (percentages correspond to scroll progress roughly mapped to timeline duration)

      // Step 2 & 3: Pattern Reveal & Letter Morph (0-35%)
      if (!isMobile) {
        // Animate the turbulence frequency down to 0 to "settle" the pattern
        tl.to(".intro-turbulence", { attr: { baseFrequency: 0 }, duration: 2 }, 0);
      }
      // Reveal the text holes by tracking letter spacing or just a slow scale/fade
      tl.fromTo(".intro-text-group-pattern", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5 }, 0);

      // Step 4: Wordmark Settles (35-45%)
      tl.to(".intro-pattern-layer", { opacity: 0, duration: 0.5 }, 2)
        .to(".intro-border-frame", { opacity: 1, duration: 0.5 }, 2)
        .to(".intro-text-group-solid", { opacity: 1, duration: 0.5 }, 2);

      // Step 5: Wipe Transition (45-55%)
      tl.to(".intro-wipe-ribbon", { attr: { x: "0%" }, duration: 0.8, ease: "power2.inOut" }, 3)
        .set(".intro-text-group-solid", { opacity: 0 })
        .set(".intro-bg-solid", { opacity: 0 })
        .to(".intro-wipe-ribbon", { attr: { x: "100%" }, duration: 0.8, ease: "power2.inOut" }, 3.8);

      // Step 6: Visual Reveal Through Mask (55-65%)
      // The 3D container is masked by #hero-canvas-mask. We just make sure it's visible.
      // We fade out the intro border frame.
      tl.to(".intro-border-frame", { opacity: 0, duration: 0.5 }, 4.5);

      // Step 7: Mask Expands to Hero (65-80%)
      tl.to(".intro-text-group-canvas", {
        scale: 40, // Massive scale to zoom through the hole
        duration: 2.5,
        ease: "power3.in",
      }, 5)
      .to("header", { opacity: 1, duration: 1 }, 6); // Navbar fades in

      // Step 8: Wordmark Fades Out (80-88%)
      // By scaling massively, the mask is out of view. We can fade the entire mask container or just remove the mask.
      tl.set(".hero-3d-mask-container", { maskImage: "none", WebkitMaskImage: "none" }, 7.5)
        .set(".intro-layers-container", { opacity: 0 }, 7.5);

      // Step 9: Copy Animates In (88-100%)
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

    }, pinRef);

    return () => ctx.revert();
  }, [isReady, prefersReducedMotion, isSkipped, isMobile]);

  const handleSkip = () => {
    sessionStorage.setItem("introSkipped", "true");
    setIsSkipped(true);
    setIsReady(true);
    // ScrollTrigger will be killed and recreated immediately due to dependencies, jumping to static state
    window.scrollTo(0, 0); 
  };

  return (
    <>
      {(!isSkipped && !prefersReducedMotion) && (
        <IntroSequence onReady={() => setIsReady(true)} isMobile={isMobile} />
      )}
      
      {/* Skip Button */}
      {(!isSkipped && !prefersReducedMotion && isReady) && (
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
    </>
  );
}
