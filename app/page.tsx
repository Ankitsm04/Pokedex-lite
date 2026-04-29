import PokemonGrid from "@/app/Components/PokemonGrid";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-5xl font-black tracking-tight" style={{ color: "var(--accent)", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
            POKÉDEX LITE
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Gotta catch 'em all
          </p>
        </div>
        <PokemonGrid />
      </div>
    </main>
  );
}