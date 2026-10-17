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
          <div className="h-full w-2/3 animate-pulse bg-[#d7192d]" />
        </div>
      </div>
    </main>
  );
}

async function GalleryContent() {
  await connection();
  const { featured, initialItems, genres } = await getHomeCatalog();
  const backdrop = imageUrl(featured.backdrop_path, "original");
  const featuredTitle = titleOf(featured);

  return (
    <main className="min-h-screen overflow-hidden bg-[#07090d]">
      <SiteHeader />

      <section className="relative min-h-[92vh] overflow-hidden border-b border-white/10">
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

        <div className="absolute inset-0 bg-gradient-to-b from-[#07090d]/55 via-transparent to-[#07090d]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,13,0.78)_0%,rgba(7,9,13,0.06)_38%,rgba(7,9,13,0.06)_68%,rgba(7,9,13,0.72)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-[1480px] items-end justify-center px-5 pb-16 pt-32 text-center sm:px-8 sm:pb-20 lg:px-12 lg:pb-16">
          <div className="max-w-4xl">
            <h1 className="font-editorial text-[3.15rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white drop-shadow-[0_5px_30px_rgba(0,0,0,0.8)] sm:text-7xl lg:text-[5.6rem]">
              Mira. <span className="text-[#f02b3f]">Siente.</span>
              <span className="block">Recuerda.</span>
            </h1>

            <div className="mx-auto mt-6 flex w-fit flex-wrap items-center justify-center gap-3 border-y border-white/15 px-5 py-3 text-xs font-semibold text-white/75 sm:text-sm">
              <span className="text-white">{featuredTitle}</span>
              <span className="text-white/30">/</span>
              <span>{yearOf(featured)}</span>
              <span className="text-white/30">/</span>
              <span className="flex items-center gap-1.5 text-[#ffc34a]">
                <Star size={14} fill="currentColor" /> {featured.vote_average.toFixed(1)}
              </span>
            </div>

            <div className="flex justify-center">
              <FeaturedActions item={featured} />
            </div>
          </div>
        </div>

        <p className="absolute bottom-7 right-8 z-10 hidden border-r-2 border-[#d7192d] pr-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/55 lg:block">
          Imagen destacada · {featuredTitle}
        </p>
      </section>

      <CatalogExplorer initialItems={initialItems} genres={genres} />

      <footer className="border-t border-white/10 bg-[#090c11]">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-4 px-5 py-10 text-sm text-[#737b88] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div className="space-y-3">
            <Wordmark />
            <p className="text-xs text-white/45">
              © 2026 Andy Campos. Todos los derechos reservados.
            </p>
          </div>
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
