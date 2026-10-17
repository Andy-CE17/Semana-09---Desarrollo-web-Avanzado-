"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  CloudSun,
  FolderKanban,
  Gamepad2,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { MediaType } from "@/lib/tmdb-types";

type CatalogType = "all" | MediaType;
type NavigationTarget = "home" | "genres" | "search" | CatalogType;

export function Wordmark() {
  return (
    <span className="flex items-center gap-3" aria-label="Cinética">
      <span className="relative block h-7 w-[46px]" aria-hidden="true">
        <span className="absolute left-0 top-0 h-7 w-7 rounded-full border border-[#ff5364]/80 bg-[radial-gradient(circle_at_35%_30%,#ff5465,#bd1024_72%)] shadow-[0_0_18px_rgba(224,30,52,0.3)]" />
        <span className="absolute left-[10px] top-0 h-7 w-7 rounded-full border border-white/35 bg-[#7f111f]/80 backdrop-blur-sm" />
        <span className="absolute right-0 top-0 h-7 w-7 rounded-full border border-white/65 bg-white/10 backdrop-blur-sm" />
      </span>
      <span className="text-[1.2rem] font-black tracking-[-0.02em] text-white sm:text-[1.35rem]">
        CINÉTICA
      </span>
    </span>
  );
}

export default function SiteHeader() {
  const [active, setActive] = useState<NavigationTarget>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exercisesOpen, setExercisesOpen] = useState(false);
  const [headerQuery, setHeaderQuery] = useState("");

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

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = headerQuery.trim();

    if (!query) {
      goToCatalog("search");
      return;
    }

    setActive("search");
    setMobileOpen(false);
    window.dispatchEvent(new CustomEvent("catalog-search", { detail: { query } }));
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems: Array<{ label: string; target: NavigationTarget }> = [
    { label: "Inicio", target: "home" },
    { label: "Películas", target: "movie" },
    { label: "Series", target: "tv" },
    { label: "Géneros", target: "genres" },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-40 bg-gradient-to-b from-black/90 via-black/55 to-transparent">
      <div className="mx-auto flex h-[88px] max-w-[1320px] items-center gap-8 px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="shrink-0 transition-opacity hover:opacity-85"
          aria-label="Cinética - Inicio"
          onClick={() => setActive("home")}
        >
          <Wordmark />
        </Link>

        <nav
          className="ml-auto hidden h-full items-center gap-7 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-white/70 lg:flex"
          aria-label="Navegación principal"
        >
          {navItems.map((item) => (
            <button
              key={item.target}
              type="button"
              onClick={() => goToCatalog(item.target)}
              className={`relative h-full cursor-pointer transition-colors after:absolute after:bottom-[22px] after:left-0 after:h-[2px] after:transition-all ${
                active === item.target
                  ? "text-white after:w-full after:bg-[#ed263b]"
                  : "hover:text-white after:w-0 after:bg-[#ed263b] hover:after:w-full"
              }`}
            >
              {item.label}
            </button>
          ))}

          <div
            className="relative flex h-full items-center"
            onMouseEnter={() => setExercisesOpen(true)}
            onMouseLeave={() => setExercisesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setExercisesOpen((value) => !value)}
              onFocus={() => setExercisesOpen(true)}
              className={`relative flex h-full cursor-pointer items-center gap-1.5 transition-colors after:absolute after:bottom-[22px] after:left-0 after:h-[2px] after:bg-[#ed263b] after:transition-all ${
                exercisesOpen
                  ? "text-white after:w-full"
                  : "hover:text-white after:w-0 hover:after:w-full"
              }`}
              aria-expanded={exercisesOpen}
              aria-controls="exercise-navigation"
              aria-haspopup="menu"
            >
              Ejercicios
              <ChevronDown
                size={14}
                className={`transition-transform ${exercisesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {exercisesOpen && (
              <div
                id="exercise-navigation"
                className="absolute right-0 top-[72px] w-[500px] overflow-hidden rounded-2xl border border-white/12 bg-[#0b0c10]/97 text-left normal-case tracking-normal shadow-[0_28px_80px_rgba(0,0,0,0.72)] backdrop-blur-2xl"
              >
                <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ed263b] text-white shadow-[0_8px_22px_rgba(237,38,59,0.28)]">
                    <FolderKanban size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">Proyectos de la guía</p>
                    <p className="mt-0.5 text-xs font-normal text-white/40">
                      Ejercicios de renderizado y consumo de APIs
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-4">
                  <div className="flex min-h-[250px] flex-col overflow-hidden rounded-xl border border-white/9 bg-white/[0.035] transition hover:border-[#ed263b]/35 hover:bg-white/[0.055]">
                    <div className="relative h-24 overflow-hidden border-b border-white/8">
                      <Image
                        src="/project-previews/pokeapp.png"
                        alt="Vista previa del ejercicio PokeApp"
                        fill
                        sizes="240px"
                        className="object-cover object-top transition duration-500 hover:scale-[1.04]"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-[#101115] via-transparent to-transparent" />
                      <span className="absolute right-3 top-3 rounded-full bg-black/65 px-2 py-1 text-[0.58rem] font-black tracking-[0.16em] text-white/65 backdrop-blur-md">
                        01
                      </span>
                    </div>
                    <div className="flex items-center gap-3 px-4 pt-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ed263b]/12 text-[#ff5364]">
                        <Gamepad2 size={18} />
                      </span>
                      <div>
                        <p className="text-base font-bold text-white">PokeApp</p>
                        <p className="text-xs font-normal text-white/40">Renderizado SSR y CSR</p>
                      </div>
                    </div>
                    <div className="mt-auto grid grid-cols-2 gap-2 p-4 pt-3">
                      <Link
                        href="/pokemon-ssr"
                        onClick={() => setExercisesOpen(false)}
                        className="rounded-md bg-white/[0.06] px-3 py-2 text-center text-[0.68rem] font-bold text-white/65 transition hover:bg-[#ed263b] hover:text-white"
                      >
                        Ver SSR
                      </Link>
                      <Link
                        href="/pokemon-csr"
                        onClick={() => setExercisesOpen(false)}
                        className="rounded-md bg-white/[0.06] px-3 py-2 text-center text-[0.68rem] font-bold text-white/65 transition hover:bg-[#ed263b] hover:text-white"
                      >
                        Ver CSR
                      </Link>
                    </div>
                  </div>

                  <Link
                    href="/weather"
                    onClick={() => setExercisesOpen(false)}
                    className="group/project flex min-h-[250px] flex-col overflow-hidden rounded-xl border border-white/9 bg-white/[0.035] transition hover:border-[#ed263b]/35 hover:bg-white/[0.055]"
                  >
                    <div className="relative h-24 overflow-hidden border-b border-white/8">
                      <Image
                        src="/project-previews/clima.png"
                        alt="Vista previa del ejercicio de clima"
                        fill
                        sizes="240px"
                        className="object-cover object-top transition duration-500 group-hover/project:scale-[1.04]"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-[#101115] via-transparent to-transparent" />
                      <span className="absolute right-3 top-3 rounded-full bg-black/65 px-2 py-1 text-[0.58rem] font-black tracking-[0.16em] text-white/65 backdrop-blur-md">
                        02
                      </span>
                    </div>
                    <div className="flex items-center gap-3 px-4 pt-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.07] text-white/70 transition group-hover/project:bg-[#ed263b]/12 group-hover/project:text-[#ff5364]">
                        <CloudSun size={18} />
                      </span>
                      <div>
                        <p className="text-base font-bold text-white">Clima</p>
                        <p className="text-xs font-normal text-white/40">Datos SSR y CSR</p>
                      </div>
                    </div>
                    <span className="mt-auto flex items-center justify-between px-4 pb-4 pt-3 text-[0.68rem] font-bold text-white/60 transition group-hover/project:text-white">
                      Abrir proyecto
                      <ArrowUpRight size={15} className="text-[#ff5364]" />
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        <form
          onSubmit={submitSearch}
          className="ml-2 hidden h-10 w-[210px] items-center rounded-full border border-white/20 bg-white/12 px-4 text-white shadow-[0_8px_30px_rgba(0,0,0,0.16)] backdrop-blur-md transition focus-within:border-[#ed263b]/80 focus-within:bg-black/45 xl:flex"
          role="search"
        >
          <input
            value={headerQuery}
            onChange={(event) => setHeaderQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/50"
            type="search"
            placeholder="Buscar títulos"
            aria-label="Buscar películas o series"
          />
          <button
            type="submit"
            className="ml-2 flex cursor-pointer items-center justify-center text-white/65 transition hover:text-[#ff4053]"
            aria-label="Buscar"
          >
            <Search size={17} strokeWidth={2.2} />
          </button>
        </form>

        <button
          type="button"
          onClick={() => goToCatalog("search")}
          className="ml-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:border-[#ed263b]/70 hover:bg-[#ed263b] xl:hidden"
          aria-label="Buscar"
        >
          <Search size={18} strokeWidth={2.2} />
        </button>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition hover:border-[#ed263b]/70 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileOpen ? <X size={19} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          className="mx-4 max-h-[calc(100vh-108px)] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0c10]/95 p-3 shadow-2xl backdrop-blur-2xl lg:hidden"
          aria-label="Navegación móvil"
        >
          {navItems.map((item) => (
            <button
              key={item.target}
              type="button"
              onClick={() => goToCatalog(item.target)}
              className={`flex w-full cursor-pointer items-center rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                active === item.target
                  ? "bg-[#ed263b] text-white"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="mt-2 border-t border-white/10 px-2 pb-1 pt-4">
            <div className="mb-3 flex items-center gap-2 px-2">
              <FolderKanban size={16} className="text-[#ff5364]" />
              <p className="text-xs font-black uppercase tracking-[0.15em] text-white/55">
                Ejercicios
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.03]">
              <div className="relative h-28">
                <Image
                  src="/project-previews/pokeapp.png"
                  alt="Vista previa del ejercicio PokeApp"
                  fill
                  sizes="100vw"
                  className="object-cover object-top"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-[#111217] via-transparent to-transparent" />
              </div>
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <Gamepad2 size={18} className="text-[#ff5364]" />
                  <div>
                    <p className="text-sm font-bold text-white">PokeApp</p>
                    <p className="text-xs text-white/35">Renderizado SSR y CSR</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    href="/pokemon-ssr"
                    className="rounded-lg bg-white/[0.06] px-3 py-2 text-center text-xs font-bold text-white/65"
                    onClick={() => setMobileOpen(false)}
                  >
                    Ver SSR
                  </Link>
                  <Link
                    href="/pokemon-csr"
                    className="rounded-lg bg-white/[0.06] px-3 py-2 text-center text-xs font-bold text-white/65"
                    onClick={() => setMobileOpen(false)}
                  >
                    Ver CSR
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/weather"
              className="mt-2 block overflow-hidden rounded-xl border border-white/8 bg-white/[0.03] text-white/65"
              onClick={() => setMobileOpen(false)}
            >
              <span className="relative block h-28">
                <Image
                  src="/project-previews/clima.png"
                  alt="Vista previa del ejercicio de clima"
                  fill
                  sizes="100vw"
                  className="object-cover object-top"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-[#111217] via-transparent to-transparent" />
              </span>
              <span className="flex items-center justify-between p-3">
                <span className="flex items-center gap-3">
                  <CloudSun size={18} className="text-[#ff5364]" />
                  <span>
                    <span className="block text-sm font-bold text-white">Clima</span>
                    <span className="block text-xs text-white/35">Datos SSR y CSR</span>
                  </span>
                </span>
                <ArrowUpRight size={16} />
              </span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
