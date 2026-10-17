"use client";

import { Info, Play } from "lucide-react";
import type { MediaItem } from "@/lib/tmdb-types";

export default function FeaturedActions({ item }: { item: MediaItem }) {
  const explore = () => {
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };

  const showDetails = () => {
    window.dispatchEvent(new CustomEvent("catalog-open", { detail: { item } }));
  };

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={explore}
        className="flex h-12 cursor-pointer items-center gap-2 bg-[#ff3d4f] px-6 text-sm font-extrabold text-white shadow-[0_15px_40px_rgba(255,61,79,0.22)] transition hover:bg-[#e82e41]"
      >
        <Play size={17} fill="currentColor" /> Explorar títulos
      </button>
      <button
        type="button"
        onClick={showDetails}
        className="flex h-12 cursor-pointer items-center gap-2 border border-white/25 bg-black/25 px-6 text-sm font-bold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/10"
      >
        <Info size={18} /> Más información
      </button>
    </div>
  );
}
