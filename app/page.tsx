import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Info, Play, Search, Star } from "lucide-react";
import CatalogExplorer from "@/components/CatalogExplorer";
import { getHomeCatalog, imageUrl, titleOf, yearOf } from "@/lib/tmdb";

function Wordmark() {
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

function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-white/10 bg-[#07090d]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Cinética - Inicio">
          <Wordmark />
        </Link>

        <nav
          className="hidden h-full items-center gap-9 text-[0.82rem] font-semibold text-white/60 md:flex"
          aria-label="Navegación principal"
        >
          <Link href="/" className="flex h-full items-center border-b-2 border-[#ff3d4f] text-white">
            Inicio
          </Link>
          <Link href="#catalogo" className="transition hover:text-white">Películas</Link>
          <Link href="#catalogo" className="transition hover:text-white">Series</Link>
          <Link href="#catalogo" className="transition hover:text-white">Géneros</Link>
        </nav>

        <Link
          href="#catalogo"
          className="flex h-10 items-center gap-2 border border-white/20 px-4 text-xs font-bold text-white transition hover:border-[#ff3d4f] hover:bg-[#ff3d4f] sm:text-sm"
        >
          <Search size={16} strokeWidth={2} /> Buscar
        </Link>
      </div>
    </header>
  );
}

function GalleryLoading() {
  return (
    <main className="min-h-screen bg-[#07090d]">
      <Header />
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-1 w-44 overflow-hidden bg-white/10">
          <div className="h-full w-2/3 animate-pulse bg-[#ff3d4f]" />
        </div>
      </div>
    </main>
  );
}

async function GalleryContent() {
  await connection();
  const { featured, initialItems, genres } = await getHomeCatalog();

  if (!featured) throw new Error("TMDB no devolvió contenido para la portada.");

  const backdrop = imageUrl(featured.backdrop_path, "original");
  const featuredTitle = titleOf(featured);

  return (
    <main className="min-h-screen overflow-hidden bg-[#07090d]">
      <Header />

      <section className="relative min-h-[86vh] overflow-hidden border-b border-white/10">
        {backdrop && (
          <Image
            src={backdrop}
            alt={`Escena de ${featuredTitle}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#07090d_0%,rgba(7,9,13,0.96)_22%,rgba(7,9,13,0.65)_50%,rgba(7,9,13,0.12)_78%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-transparent to-[#07090d]/30" />

        <div className="relative z-10 mx-auto flex min-h-[86vh] max-w-[1480px] items-end px-5 pb-16 pt-32 sm:px-8 lg:items-center lg:px-12 lg:pb-0">
          <div className="max-w-2xl">
            <p className="mb-5 flex items-center gap-3 text-[0.7rem] font-extrabold uppercase tracking-[0.28em] text-[#ff6977]">
              <span className="h-px w-10 bg-[#ff3d4f]" /> En tendencia esta semana
            </p>

            <h1 className="text-5xl font-black leading-[0.93] tracking-[-0.055em] text-white sm:text-7xl lg:text-[5.3rem]">
              {featuredTitle}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold text-white/75">
              <span className="flex items-center gap-1.5 text-[#ffc34a]">
                <Star size={16} fill="currentColor" strokeWidth={1.8} />
                {featured.vote_average.toFixed(1)}
              </span>
              <span className="text-white/25">|</span>
              <span>{yearOf(featured)}</span>
              <span className="text-white/25">|</span>
              <span>{featured.media_type === "tv" ? "Serie" : "Película"}</span>
              <span className="text-white/25">|</span>
              <span>{featured.vote_count.toLocaleString("es-PE")} valoraciones</span>
            </div>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#c0c5ce] sm:text-lg sm:leading-8">
              {featured.overview || "Uno de los títulos más vistos de esta semana."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#catalogo"
                className="flex h-12 items-center gap-2 bg-[#ff3d4f] px-6 text-sm font-extrabold text-white shadow-[0_15px_40px_rgba(255,61,79,0.22)] transition hover:bg-[#e82e41]"
              >
                <Play size={17} fill="currentColor" /> Explorar títulos
              </Link>
              <Link
                href="#catalogo"
                className="flex h-12 items-center gap-2 border border-white/25 bg-black/25 px-6 text-sm font-bold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/10"
              >
                <Info size={18} /> Más información
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 hidden border-l border-[#ff3d4f] pl-4 text-right lg:block">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white/45">Cartelera actual</p>
          <p className="mt-1 text-xs text-white/70">Películas y series en un solo lugar</p>
        </div>
      </section>

      <CatalogExplorer initialItems={initialItems} genres={genres} />

      <footer className="border-t border-white/10 bg-[#090c11]">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-4 px-5 py-10 text-sm text-[#737b88] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <Wordmark />
          <p>Historias para descubrir, recordar y compartir.</p>
          <p className="max-w-md text-xs md:text-right">
            Este producto utiliza la API de TMDB, pero no está avalado ni certificado por TMDB.
          </p>
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
