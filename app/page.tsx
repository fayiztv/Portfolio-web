export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="font-clash-display text-4xl md:text-6xl font-semibold mb-4 text-balance text-center">
        Foundation Ready
      </h1>
      <p className="font-general-sans text-secondary text-lg mb-8 text-center max-w-2xl">
        Next.js App Router, Tailwind CSS, local fonts, and providers are wired up.
      </p>
      <div className="font-jetbrains-mono text-accent glow-text-accent px-4 py-2 border border-border rounded">
        {'<SystemStatus status="online" />'}
      </div>
    </main>
  );
}
