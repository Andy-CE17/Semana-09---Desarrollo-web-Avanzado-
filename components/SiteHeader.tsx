"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { MediaType } from "@/lib/tmdb-types";

type CatalogType = "all" | MediaType;
type NavigationTarget = "home" | "genres" | "search" | CatalogType;

export function Wordmark() {
  return (
    <span className="flex items-center gap-3" aria-label="Cinética">
      <span className="relative block h-8 w-8 border-2 border-[#ff3d4f]">
        <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 bg-[#ff3d4f]" />
      </span>
      <span className="text-[1.05rem] font-black tracking-[0.28em] text-white">
        CINÉTICA
      </span>
    </span>
  );
}

export default function SiteHeader() {
  const [active, setActive] = useState<NavigationTarget>("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleFilterChange = (event: Event) => {
      const detail = (event as CustomEvent<{ type: CatalogType }>).detail;
      if (detail?.type) setActive(detail.type);
    };

    window.addEventListener("catalog-state-change", handleFilterChange);
    return () => window.removeEventListener("catalog-state-change", handleFilterChange);
  }, []);

  const goToCatalog = (target: NavigationTarget) => {
    setActive(target);
    setMobileOpen(false);

    if (target === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const type: CatalogType = target === "movie" || target === "tv" ? target : "all";
    window.dispatchEvent(new CustomEvent("catalog-filter", { detail: { type } }));
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });

    window.setTimeout(() => {
      if (target === "search") document.getElementById("catalog-search")?.focus();
      if (target === "genres") document.getElementById("catalog-genre")?.focus();
    }, 450);
  };

  const navItems: Array<{ label: string; target: NavigationTarget }> = [
    { label: "Inicio", target: "home" },
    { label: "Películas", target: "movie" },
    { label: "Series", target: "tv" },
    { label: "Géneros", target: "genres" },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-40 border-b border-white/10 bg-[#07090d]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Cinética - Inicio" onClick={() => setActive("home")}>
          <Wordmark />
        </Link>

        <nav
          className="hidden h-full items-center gap-9 text-[0.82rem] font-semibold text-white/60 md:flex"
          aria-label="Navegación principal"
        >
          {navItems.map((item) => (
            <button
              key={item.target}
              type="button"
              onClick={() => goToCatalog(item.target)}
              className={`h-full cursor-pointer border-b-2 transition ${
                active === item.target
                  ? "border-[#ff3d4f] text-white"
                  : "border-transparent hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToCatalog("search")}
            className="flex h-10 cursor-pointer items-center gap-2 border border-white/20 px-4 text-xs font-bold text-white transition hover:border-[#ff3d4f] hover:bg-[#ff3d4f] sm:text-sm"
          >
            <Search size={16} strokeWidth={2} />
            <span className="hidden sm:inline">Buscar</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center border border-white/20 text-white md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X size={19} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-white/10 bg-[#090c11] px-5 py-3 md:hidden"
          aria-label="Navegación móvil"
        >
          {navItems.map((item) => (
            <button
              key={item.target}
              type="button"
              onClick={() => goToCatalog(item.target)}
              className={`flex w-full cursor-pointer items-center border-l-2 px-4 py-3 text-left text-sm font-semibold transition ${
                active === item.target
                  ? "border-[#ff3d4f] bg-white/[0.05] text-white"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
