import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import {
  ArrowDown,
  Clapperboard,
  Film,
  Play,
  Sparkles,
  Star,
} from "lucide-react";
import CatalogExplorer from "@/components/CatalogExplorer";
import { getHomeCatalog, imageUrl, titleOf, yearOf } from "@/lib/tmdb";

function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-white/10 bg-[#070a0f]/35 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="group flex items-center gap-3" aria-label="Frame - Inicio">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff4d6d] text-white shadow-[0_8px_28px_rgba(255,77,109,0.35)] transition group-hover:rotate-3 group-hover:scale-105">
            <Clapperboard size={21} strokeWidth={2.4} />
          </span>
          <span className="text-lg font-black tracking-[0.2em] text-white">FRAME</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/65 md:flex" aria-label="Navegación principal">
          <Link href="/" className="text-white transition hover:text-[#ff4d6d]">Inicio</Link>
          <Link href="#catalogo" className="transition hover:text-white">Catálogo</Link>
          <Link href="/pokemon-csr" className="transition hover:text-white">PokeApp CSR</Link>
          <Link href="/weather" className="transition hover:text-white">Clima</Link>
        </nav>

        <Link
          href="#catalogo"
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition hover:border-[#f7c948]/70 hover:bg-[#f7c948] hover:text-[#171209] sm:text-sm"
        >
          <Film size={16} /> Explorar
        </Link>
      </div>
    </header>
  );
}

function GalleryLoading() {
  return (
    <main className="min-h-screen bg-[#070a0f]">
      <Header />
      <div className="flex min-h-[82vh] items-center justify-center px-6 text-center">
        <div>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff4d6d] shadow-[0_14px_45px_rgba(255,77,109,0.35)]">
            <Clapperboard className="animate-pulse" size={30} />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#7f8998]">
            Preparando la cartelera
          </p>
        </div>
      </div>
    </main>
  );
}

async function GalleryContent() {
  await connection();
  const { featured, initialItems, genres } = await getHomeCatalog();

  if (!featured) {
    throw new Error("TMDB no devolvió contenido para la portada.");
  }

  const backdrop = imageUrl(featured.backdrop_path, "original");
  const featuredTitle = titleOf(featured);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070a0f]">
      <Header />

      <section className="relative min-h-[88vh] overflow-hidden">
        {backdrop && (
          <Image
            src={backdrop}
            alt={`Escena destacada de ${featuredTitle}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#070a0f_2%,rgba(7,10,15,0.92)_26%,rgba(7,10,15,0.42)_66%,rgba(7,10,15,0.68)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070a0f] via-transparent to-[#070a0f]/40" />
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-[#ff4d6d]/15 blur-[110px]" />
        <div className="absolute left-[38%] top-[20%] h-64 w-64 rounded-full bg-[#f7c948]/10 blur-[120px]" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1480px] items-end px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:items-center lg:px-12 lg:pb-0">
          <div className="max-w-3xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 rounded-full border border-[#ff4d6d]/35 bg-[#ff4d6d]/15 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ff8ca2] backdrop-blur">
                <Sparkles size={14} /> Tendencia destacada
              </span>
              <span className="rounded-full border border-white/15 bg-black/25 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/70 backdrop-blur">
                Renderizado SSR
              </span>
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.06em] text-white drop-shadow-2xl sm:text-7xl lg:text-[5.7rem]">
              {featuredTitle}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-white/80">
              <span className="flex items-center gap-1.5 text-[#f7c948]">
                <Star size={17} fill="currentColor" />
                {featured.vote_average.toFixed(1)}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/35" />
              <span>{yearOf(featured)}</span>
              <span className="h-1 w-1 rounded-full bg-white/35" />
              <span>{featured.media_type === "tv" ? "Serie" : "Película"}</span>
              <span className="h-1 w-1 rounded-full bg-white/35" />
              <span>{featured.vote_count.toLocaleString("es-PE")} valoraciones</span>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#c6cbd3] sm:text-lg sm:leading-8">
              {featured.overview ||
                "Descubre uno de los títulos que está marcando tendencia esta semana."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#catalogo"
                className="flex items-center gap-2 rounded-xl bg-[#ff4d6d] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_16px_45px_rgba(255,77,109,0.32)] transition hover:-translate-y-0.5 hover:bg-[#ff365f]"
              >
                <Play size={17} fill="currentColor" /> Explorar catálogo
              </Link>
              <Link
                href="#catalogo"
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.08] px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:border-[#f7c948]/60 hover:bg-white/[0.13]"
              >
                Buscar un título <ArrowDown size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-7 right-8 hidden items-center gap-3 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-white/40 lg:flex">
          <span className="h-px w-14 bg-white/25" /> Datos actualizados con TMDB
        </div>
      </section>

      <CatalogExplorer initialItems={initialItems} genres={genres} />

      <footer className="border-t border-white/10 bg-[#090d13]">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-4 px-5 py-9 text-sm text-[#737e8e] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div className="flex items-center gap-3 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff4d6d]">
              <Clapperboard size={16} />
            </span>
            <strong className="tracking-[0.18em]">FRAME</strong>
          </div>
          <p>Explora cine y televisión desde una experiencia creada con Next.js.</p>
          <p className="text-xs">Este producto utiliza la API de TMDB, pero no está avalado ni certificado por TMDB.</p>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<GalleryLoading />}>
      <GalleryContent />
    </Suspense>
  );
}
