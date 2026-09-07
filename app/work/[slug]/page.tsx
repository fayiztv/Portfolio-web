import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";

// Generate static params for SSG
export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Reusable placeholder block component
function PlaceholderSection({ title, message = "Content TBD" }: { title: string, message?: string }) {
  return (
    <div className="mb-12">
      <h3 className="font-clash-display font-semibold text-2xl md:text-3xl mb-4">{title}</h3>
      <div className="p-6 border border-dashed border-border/50 rounded-lg bg-secondary/5 flex items-center justify-center min-h-[100px]">
        <span className="font-jetbrains-mono text-sm text-secondary/50 uppercase tracking-widest">{message}</span>
      </div>
    </div>
  );
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        
        {/* Project Identity & Header */}
        <header className="mb-16 md:mb-24">
          <Link href="/#work" className="inline-block mb-8 font-jetbrains-mono text-sm text-secondary hover:text-accent transition-colors">
            ← Back to Work
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="font-jetbrains-mono text-accent text-xl">{project.number}</span>
            <h1 className="font-clash-display font-semibold text-5xl md:text-7xl">{project.name}</h1>
          </div>
          <p className="font-general-sans text-xl md:text-2xl text-secondary/80 max-w-2xl text-balance mb-8">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap gap-x-12 gap-y-6 pt-8 border-t border-border/50">
            <div>
              <span className="block font-jetbrains-mono text-xs text-secondary/50 uppercase tracking-widest mb-2">Role</span>
              <span className="font-general-sans text-foreground">{project.role}</span>
            </div>
            
            {/* Links Section */}
            <div>
              <span className="block font-jetbrains-mono text-xs text-secondary/50 uppercase tracking-widest mb-2">Links</span>
              <div className="flex gap-4">
                {project.githubUrl && project.githubUrl !== "TBD" ? (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="font-general-sans text-foreground hover:text-accent underline underline-offset-4 decoration-border hover:decoration-accent transition-all">
                    GitHub ↗
                  </a>
                ) : (
                  <span className="font-general-sans text-secondary/40 cursor-not-allowed">GitHub (Coming Soon)</span>
                )}
                {project.liveUrl && !project.liveUrl.startsWith("TBD") ? (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="font-general-sans text-foreground hover:text-accent underline underline-offset-4 decoration-border hover:decoration-accent transition-all">
                    Live Site ↗
                  </a>
                ) : (
                  <span className="font-general-sans text-secondary/40 cursor-not-allowed">{project.liveUrl || "Live Site (TBD)"}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Visual Placeholder */}
        <div className="w-full aspect-video bg-secondary/10 rounded-xl mb-16 md:mb-24 flex items-center justify-center border border-border">
          <span className="font-jetbrains-mono text-secondary/40">Hero Visual TBD</span>
        </div>

        {/* Content Structure */}
        <div className="space-y-16 md:space-y-24">
          
          {/* Context */}
          <section>
            <h3 className="font-clash-display font-semibold text-2xl md:text-3xl mb-6">Context</h3>
            <p className="font-general-sans text-lg text-secondary/90 leading-relaxed">
              {project.context}
            </p>
          </section>

          {/* Placeholders for unprovided specific data points */}
          <PlaceholderSection title="Problem Statement" message="Problem Details TBD" />
          <PlaceholderSection title="Approach" message="Approach Details TBD" />

          {/* Architecture / What I Built */}
          <section>
            <h3 className="font-clash-display font-semibold text-2xl md:text-3xl mb-6">Architecture & Implementation</h3>
            <p className="font-general-sans text-lg text-secondary/90 leading-relaxed">
              {project.whatIBuilt}
            </p>
          </section>

          {/* Key Features */}
          <section>
            <h3 className="font-clash-display font-semibold text-2xl md:text-3xl mb-6">Key Features</h3>
            <ul className="list-disc list-outside ml-5 space-y-3 font-general-sans text-lg text-secondary/90">
              {project.notableFeatures.map((feature, i) => (
                <li key={i} className="pl-2">{feature}</li>
              ))}
            </ul>
          </section>

          {/* More Placeholders */}
          <PlaceholderSection title="Technical Decisions" message="Technical Decisions TBD" />
          <PlaceholderSection title="UI/UX Notes" message="UI/UX Notes TBD" />
          <PlaceholderSection title="Challenges" message="Challenges TBD" />
          <PlaceholderSection title="Outcome" message="Outcome & Metrics TBD" />

          {/* Screenshots Gallery */}
          <section>
            <h3 className="font-clash-display font-semibold text-2xl md:text-3xl mb-6">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.map((img, i) => (
                <div key={i} className="aspect-video bg-secondary/10 rounded-lg border border-border flex items-center justify-center">
                  <span className="font-jetbrains-mono text-secondary/40 text-xs">Screenshot {i + 1} Placeholder</span>
                  {/* <Image src={img} alt={`Screenshot ${i+1}`} fill className="object-cover" /> */}
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section>
            <h3 className="font-clash-display font-semibold text-2xl md:text-3xl mb-6">Tech Stack</h3>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-jetbrains-mono text-sm px-4 py-2 rounded-full border border-border/50 bg-secondary/5 text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

        </div>
      </div>
    </article>
  );
}
