import { Hero } from "@/components/sections/hero";
import { SelectedWork } from "@/components/sections/selected-work";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <SelectedWork />
    </main>
  );
}
