"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useReducedMotion } from "../providers/reduced-motion-provider";

const NAV_LINKS = [
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Lab", href: "#lab" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Scroll Progress Indicator
    if (progressRef.current && !prefersReducedMotion) {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1,
        },
      });
    }

    // Active Section Observer (will work when sections with IDs are added)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 md:px-0">
        <div className="flex items-center justify-between px-6 py-3 rounded-full bg-background/50 backdrop-blur-md border border-border">
          {/* Logo */}
          <Link href="/" className="font-clash-display font-semibold text-lg tracking-wider hover:text-accent transition-colors">
            FAYIZ
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-general-sans text-sm tracking-wide transition-colors ${
                  activeSection === link.name.toLowerCase() ? "text-accent" : "text-secondary hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-secondary hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-current mb-1.5" />
            <div className="w-5 h-0.5 bg-current" />
          </button>
        </div>

        {/* Scroll Progress Line */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90%] max-w-xl h-[1px] bg-border rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="w-full h-full bg-accent origin-left scale-x-0"
          />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center">
          <nav className="flex flex-col items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-clash-display text-3xl tracking-wider ${
                  activeSection === link.name.toLowerCase() ? "text-accent" : "text-secondary hover:text-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
