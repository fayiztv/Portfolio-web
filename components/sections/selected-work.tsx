"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import { useReducedMotion } from "../providers/reduced-motion-provider";
import { MagneticButton } from "../ui/magnetic-button";

export function SelectedWork() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const projectElements = gsap.utils.toArray<HTMLElement>(".project-container");

      projectElements.forEach((project) => {
        const number = project.querySelector(".project-number");
        const title = project.querySelector(".project-title");
        const visual = project.querySelector(".project-visual");
        const infoItems = project.querySelectorAll(".project-info-item");

        if (prefersReducedMotion) {
          gsap.set([number, title, visual, infoItems], { opacity: 1, y: 0 });
          return;
        }

        // Set initial states
        gsap.set([number, title], { y: 50, opacity: 0 });
        gsap.set(visual, { scale: 0.95, opacity: 0 });
        gsap.set(infoItems, { y: 20, opacity: 0 });

        // ScrollTrigger animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: project,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        });

        tl.to([number, title], {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        })
          .to(
            visual,
            {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: "expo.out",
            },
            "-=0.4"
          )
          .to(
            infoItems,
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
            },
            "-=0.8"
          );

        // Parallax effect for the visual only on desktop
        const mm = gsap.matchMedia();
        mm.add("(min-width: 768px)", () => {
          const visualInner = project.querySelector(".project-visual-inner");
          if (visualInner) {
            gsap.to(visualInner, {
              yPercent: 15,
              ease: "none",
              scrollTrigger: {
                trigger: project,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={containerRef} id="work" className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-clash-display font-semibold text-3xl md:text-5xl mb-16 md:mb-32">
          Selected Work
        </h2>

        <div className="flex flex-col gap-32 md:gap-48">
          {projects.map((project, index) => {
            // Alternate layout rhythm
            const isEven = index % 2 === 0;

            return (
              <div
                key={project.id}
                className="project-container group flex flex-col gap-8 md:gap-12"
              >
                {/* Header */}
                <div
                  className={`flex flex-col md:flex-row md:items-end justify-between gap-4 ${
                    !isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="overflow-hidden">
                    <span className="project-number font-jetbrains-mono text-accent text-lg md:text-xl block mb-2">
                      {project.number}
                    </span>
                    <Link href={`/work/${project.slug}`}>
                      <h3
                        className="project-title font-clash-display font-semibold text-4xl md:text-6xl hover:text-accent transition-colors cursor-pointer"
                        data-cursor="project"
                      >
                        {project.name}
                      </h3>
                    </Link>
                  </div>
                  <div className="project-title font-general-sans text-secondary/80 text-lg md:text-xl max-w-sm">
                    {project.role}
                  </div>
                </div>

                {/* Visual */}
                <Link
                  href={`/work/${project.slug}`}
                  className="project-visual relative w-full aspect-[4/3] md:aspect-[16/9] bg-secondary/5 rounded-xl border border-border overflow-hidden block"
                  data-cursor="project"
                >
                  <div className="project-visual-inner absolute inset-0 -top-[15%] h-[130%] bg-gradient-to-br from-secondary/10 to-transparent flex items-center justify-center">
                    <span className="font-jetbrains-mono text-secondary/40 text-sm tracking-widest uppercase">
                      Visual Placeholder
                    </span>
                  </div>
                </Link>

                {/* Info */}
                <div
                  className={`flex flex-col md:flex-row gap-8 md:gap-16 justify-between ${
                    !isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <p className="project-info-item font-general-sans text-lg md:text-xl text-secondary/90 leading-relaxed max-w-2xl text-balance">
                    {project.shortDescription}
                  </p>
                  
                  <div className="flex flex-col gap-6 md:min-w-[300px]">
                    <div className="project-info-item flex flex-wrap gap-2">
                      {project.technologies.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="font-jetbrains-mono text-xs px-3 py-1 rounded-full border border-border/50 text-secondary/80"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="font-jetbrains-mono text-xs px-3 py-1 rounded-full border border-border/50 text-secondary/50">
                          +{project.technologies.length - 5} more
                        </span>
                      )}
                    </div>
                    
                    <div className="project-info-item mt-auto">
                      <Link href={`/work/${project.slug}`}>
                        <MagneticButton className="px-6 py-3 rounded-full border border-border hover:border-accent hover:text-accent transition-colors font-general-sans text-sm tracking-wide">
                          View Case Study
                        </MagneticButton>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
