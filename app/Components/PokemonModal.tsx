"use client";

import { useEffect, useState } from "react";
import { TYPE_COLORS } from "../lib/typeColors";

interface Stat { name: string; value: number; }
interface DetailData {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: Stat[];
  abilities: string[];
  height: number;
  weight: number;
}

export default function PokemonModal({
  id, onClose, favorites, onToggleFav
}: {
  id: number;
  onClose: () => void;
  favorites: number[];
  onToggleFav: (id: number) => void;
}) {
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(r => r.json())
      .then(d => {
        setData({
          id: d.id,
          name: d.name,
          image: d.sprites.other["official-artwork"].front_default,
          types: d.types.map((t: { type: { name: string } }) => t.type.name),
          stats: d.stats.map((s: { stat: { name: string }; base_stat: number }) => ({
            name: s.stat.name, value: s.base_stat
          })),
          abilities: d.abilities.map((a: { ability: { name: string } }) => a.ability.name),
          height: d.height,
          weight: d.weight,
        });
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "var(--muted)", fontSize: "1.4rem", cursor: "pointer" }}
        >✕</button>

        {loading || !data ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <img src={data.image} alt={data.name} className="w-28 h-28 object-contain" />
              <div>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>#{String(data.id).padStart(3, "0")}</p>
                <h2 className="text-2xl font-black capitalize" style={{ fontFamily: "'Bebas Neue', sans-serif", color: "var(--accent)", letterSpacing: "0.05em" }}>
                  {data.name}
                </h2>
                <div className="flex gap-2 mt-1">
                  {data.types.map(t => (
                    <span key={t} className="type-badge" style={{ background: TYPE_COLORS[t] || "#555", color: "#fff" }}>{t}</span>
                  ))}
                </div>
                <div className="flex gap-4 mt-2 text-xs" style={{ color: "var(--muted)" }}>
                  <span>Height: {data.height / 10}m</span>
                  <span>Weight: {data.weight / 10}kg</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <h3 className="text-xs font-bold uppercase mb-3" style={{ color: "var(--muted)", letterSpacing: "0.1em" }}>Base Stats</h3>
            <div className="space-y-2 mb-6">
              {data.stats.map(s => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-xs capitalize w-24 shrink-0" style={{ color: "var(--muted)" }}>{s.name}</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: "var(--border)" }}>
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${Math.min(100, (s.value / 255) * 100)}%`, background: "var(--accent)" }}
                    />
                  </div>
                  <span className="text-xs w-8 text-right font-bold" style={{ color: "var(--text)" }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Abilities */}
            <h3 className="text-xs font-bold uppercase mb-2" style={{ color: "var(--muted)", letterSpacing: "0.1em" }}>Abilities</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {data.abilities.map(a => (
                <span key={a} className="type-badge capitalize" style={{ background: "var(--border)", color: "var(--text)" }}>{a}</span>
              ))}
            </div>

            {/* Favorite */}
            <button
              onClick={() => onToggleFav(data.id)}
              className="w-full py-2 rounded-xl font-bold text-sm"
              style={{
                background: favorites.includes(data.id) ? "var(--accent)" : "var(--border)",
                color: favorites.includes(data.id) ? "#000" : "var(--text)",
                border: "none", cursor: "pointer"
              }}
            >
              {favorites.includes(data.id) ? "⭐ Favorited" : "☆ Add to Favorites"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}