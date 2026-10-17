import Image from "next/image";
import { connection } from "next/server";
import { Suspense } from "react";
import { Star } from "lucide-react";
import CatalogExplorer from "@/components/CatalogExplorer";
import FeaturedActions from "@/components/FeaturedActions";
import SiteHeader, { Wordmark } from "@/components/SiteHeader";
import { getHomeCatalog, imageUrl, titleOf, yearOf } from "@/lib/tmdb";

function GalleryLoading() {
  return (
    <main className="min-h-screen bg-[#07090d]">
      <SiteHeader />
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
      <SiteHeader />

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

            <FeaturedActions item={featured} />
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
