"use client";

import Image from "next/image";
import {
  ChevronDown,
  Clock3,
  Film,
  Grid3X3,
  LoaderCircle,
  Play,
  Search,
  SlidersHorizontal,
  Star,
  Tv,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  Genre,
  MediaDetails,
  MediaItem,
  MediaType,
} from "@/lib/tmdb-types";

interface CatalogExplorerProps {
  initialItems: MediaItem[];
  genres: Genre[];
}

type CatalogType = "all" | MediaType;

const IMAGE_BASE = "https://image.tmdb.org/t/p";

function getTitle(item: Pick<MediaItem, "title" | "name">) {
  return item.title ?? item.name ?? "Sin título";
}

function getYear(item: Pick<MediaItem, "release_date" | "first_air_date">) {
  const date = item.release_date ?? item.first_air_date;
  return date ? date.slice(0, 4) : "Próximamente";
}

function getMediaType(item: MediaItem): MediaType {
  return item.media_type === "tv" ? "tv" : "movie";
}

function formatRuntime(details: MediaDetails) {
  const total = details.runtime ?? details.episode_run_time?.[0];
  if (!total) return null;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return hours ? `${hours} h ${minutes} min` : `${minutes} min`;
}

function MediaCard({
  item,
  onSelect,
}: {
  item: MediaItem;
  onSelect: (item: MediaItem) => void;
}) {
  const type = getMediaType(item);
  const title = getTitle(item);

  return (
    <article className="group relative overflow-hidden border border-white/10 bg-[#10141a] shadow-[0_18px_45px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1.5 hover:border-[#ff3d4f]/60 hover:shadow-[0_22px_60px_rgba(0,0,0,0.55)]">
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="block w-full cursor-pointer text-left"
        aria-label={`Ver detalles de ${title}`}
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-[#161c25]">
          {item.poster_path ? (
            <Image
              src={`${IMAGE_BASE}/w500${item.poster_path}`}
              alt={`Póster de ${title}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition duration-700 group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/20">
              <Film size={52} strokeWidth={1.3} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-transparent opacity-70" />
          <div className="absolute left-0 top-3 border-l-2 border-[#ff3d4f] bg-black/75 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {type === "movie" ? "Película" : "Serie"}
          </div>
          <div className="absolute right-3 top-3 flex items-center gap-1 bg-[#ffc34a] px-2.5 py-1 text-xs font-black text-[#171209] shadow-lg">
            <Star size={12} fill="currentColor" />
            {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
          </div>
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="flex items-center justify-center gap-2 bg-[#ff3d4f] px-4 py-3 text-sm font-bold text-white shadow-xl">
              <Play size={15} fill="currentColor" /> Ver detalles
            </span>
          </div>
        </div>
        <div className="border-t border-white/5 p-4">
          <h3 className="line-clamp-1 text-base font-bold tracking-tight text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm text-[#8e99a8]">{getYear(item)}</p>
        </div>
      </button>
    </article>
  );
}

function DetailModal({
  item,
  onClose,
}: {
  item: MediaItem;
  onClose: () => void;
}) {
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const type = getMediaType(item);

  useEffect(() => {
    const controller = new AbortController();

    const loadDetails = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`/api/catalog/${type}/${item.id}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("No se pudieron cargar los detalles");
        setDetails((await response.json()) as MediaDetails);
      } catch (requestError) {
        if (!(requestError instanceof DOMException && requestError.name === "AbortError")) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadDetails();
    return () => controller.abort();
  }, [item.id, type]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const data = details ?? item;
  const title = getTitle(data);
  const trailer = details?.videos?.results.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );
  const cast = details?.credits?.cast.slice(0, 5) ?? [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/85 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles de ${title}`}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto border border-white/10 bg-[#0c1118] shadow-[0_30px_120px_rgba(0,0,0,0.8)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-11 w-11 cursor-pointer items-center justify-center border border-white/15 bg-black/65 text-white transition hover:border-[#ff3d4f] hover:bg-[#ff3d4f]"
          aria-label="Cerrar detalles"
        >
          <X size={21} />
        </button>

        <div className="relative min-h-56 overflow-hidden sm:min-h-72">
          {data.backdrop_path && (
            <Image
              src={`${IMAGE_BASE}/w1280${data.backdrop_path}`}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover opacity-55"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1118] via-[#0c1118]/45 to-transparent" />
        </div>

        <div className="relative -mt-24 grid gap-7 px-5 pb-8 sm:grid-cols-[190px_1fr] sm:px-9">
          <div className="relative mx-auto aspect-[2/3] w-40 overflow-hidden border border-white/15 bg-[#171c24] shadow-2xl sm:mx-0 sm:w-[190px]">
            {data.poster_path ? (
              <Image
                src={`${IMAGE_BASE}/w500${data.poster_path}`}
                alt={`Póster de ${title}`}
                fill
                sizes="190px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/20">
                <Film size={48} />
              </div>
            )}
          </div>

          <div className="pt-1 sm:pt-20">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ffc34a]">
              <span>{type === "movie" ? "Película" : "Serie"}</span>
              <span className="text-white/25">•</span>
              <span>{getYear(data)}</span>
              {details?.status && (
                <>
                  <span className="text-white/25">•</span>
                  <span>{details.status}</span>
                </>
              )}
            </div>
            <h2 className="max-w-3xl text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              {title}
            </h2>
            {details?.tagline && (
              <p className="mt-2 text-sm italic text-[#aab2bf]">“{details.tagline}”</p>
            )}

            {loading ? (
              <div className="flex items-center gap-3 py-10 text-[#aab2bf]">
                <LoaderCircle className="animate-spin text-[#ff4d6d]" />
                Consultando información completa...
              </div>
            ) : error ? (
              <p className="mt-6 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
                No se pudieron cargar todos los detalles. Inténtalo nuevamente.
              </p>
            ) : details ? (
              <>
                <div className="mt-5 flex flex-wrap gap-2">
                  {details.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-[#d5dae2]"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-5 text-sm text-[#c5ccd6]">
                  <span className="flex items-center gap-2">
                    <Star size={17} fill="#ffc34a" className="text-[#ffc34a]" />
                    <strong className="text-white">{details.vote_average.toFixed(1)}</strong>
                    / 10
                  </span>
                  <span className="flex items-center gap-2">
                    <Users size={17} className="text-[#ff3d4f]" />
                    {details.vote_count.toLocaleString("es-PE")} votos
                  </span>
                  {formatRuntime(details) && (
                    <span className="flex items-center gap-2">
                      <Clock3 size={17} className="text-[#ff3d4f]" />
                      {formatRuntime(details)}
                    </span>
                  )}
                  {type === "tv" && details.number_of_seasons && (
                    <span className="flex items-center gap-2">
                      <Tv size={17} className="text-[#ff3d4f]" />
                      {details.number_of_seasons} temporadas
                    </span>
                  )}
                </div>

                <p className="mt-6 max-w-3xl text-[0.98rem] leading-7 text-[#b9c0cb]">
                  {details.overview || "La sinopsis todavía no está disponible en español."}
                </p>

                {cast.length > 0 && (
                  <div className="mt-7">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7f8998]">
                      Reparto principal
                    </h3>
                    <p className="text-sm leading-6 text-[#d8dde5]">
                      {cast.map((person) => person.name).join(" · ")}
                    </p>
                  </div>
                )}

                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 inline-flex items-center gap-2 bg-[#ff3d4f] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_35px_rgba(255,61,79,0.25)] transition hover:bg-[#e82e41]"
                  >
                    <Play size={17} fill="currentColor" /> Ver tráiler
                  </a>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogExplorer({
  initialItems,
  genres,
}: CatalogExplorerProps) {
  const [query, setQuery] = useState("");
  const [mediaType, setMediaType] = useState<CatalogType>("all");
  const [genre, setGenre] = useState("all");
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    const handleNavigationFilter = (event: Event) => {
      const detail = (event as CustomEvent<{ type: CatalogType }>).detail;
      if (!detail?.type) return;

      setMediaType(detail.type);
      setQuery("");
      setGenre("all");
    };

    window.addEventListener("catalog-filter", handleNavigationFilter);
    return () => window.removeEventListener("catalog-filter", handleNavigationFilter);
  }, []);

  useEffect(() => {
    const handleOpenDetails = (event: Event) => {
      const detail = (event as CustomEvent<{ item: MediaItem }>).detail;
      if (detail?.item) setSelectedItem(detail.item);
    };

    window.addEventListener("catalog-open", handleOpenDetails);
    return () => window.removeEventListener("catalog-open", handleOpenDetails);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError(false);

      try {
        const params = new URLSearchParams({ type: mediaType });
        if (query.trim()) params.set("q", query.trim());
        if (genre !== "all") params.set("genre", genre);

        const response = await fetch(`/api/catalog?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("No se pudo consultar el catálogo");
        const data = (await response.json()) as { results: MediaItem[] };
        setItems(data.results);
      } catch (requestError) {
        if (!(requestError instanceof DOMException && requestError.name === "AbortError")) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 420);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query, mediaType, genre]);

  const heading = useMemo(() => {
    if (query.trim()) return `Resultados para “${query.trim()}”`;
    if (mediaType === "movie") return "Películas para descubrir";
    if (mediaType === "tv") return "Series para maratonear";
    return "Tendencias de la semana";
  }, [mediaType, query]);

  return (
    <section id="catalogo" className="relative mx-auto max-w-[1480px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mb-9 flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 flex items-center gap-3 text-[0.67rem] font-bold uppercase tracking-[0.25em] text-[#ff6977]">
            <span className="h-px w-8 bg-[#ff3d4f]" /> Catálogo
          </p>
          <h2 className="text-3xl font-black tracking-[-0.035em] text-white sm:text-5xl">
            {heading}
          </h2>
          <p className="mt-3 text-sm text-[#8e99a8]">
            {loading ? "Actualizando resultados..." : `${items.length} títulos disponibles`}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(310px,1fr)_auto] lg:w-[670px]">
          <label className="group relative">
            <span className="sr-only">Buscar película o serie</span>
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#77808d] transition group-focus-within:text-[#ff3d4f]"
            />
            <input
              id="catalog-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar película o serie..."
              className="h-14 w-full border border-white/15 bg-[#0e1218] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-[#697382] focus:border-[#ff3d4f] focus:bg-[#11161e]"
            />
          </label>

          <label className="relative">
            <span className="sr-only">Filtrar por género</span>
            <SlidersHorizontal
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#77808d]"
            />
            <select
              id="catalog-genre"
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
              className="h-14 min-w-48 appearance-none border border-white/15 bg-[#0e1218] pl-11 pr-10 text-sm font-semibold text-[#d8dde5] outline-none transition focus:border-[#ffc34a]/70"
            >
              <option value="all">Todos los géneros</option>
              {genres.map((genreOption) => (
                <option key={genreOption.id} value={genreOption.id}>
                  {genreOption.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#ffc34a]"
            />
          </label>
        </div>
      </div>

      <div className="mb-8 flex w-full gap-7 overflow-x-auto border-b border-white/10 pb-0 sm:w-auto">
        {(
          [
            ["all", "Todo", Grid3X3],
            ["movie", "Películas", Film],
            ["tv", "Series", Tv],
          ] as const
        ).map(([value, label, Icon]) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setMediaType(value);
              window.dispatchEvent(
                new CustomEvent("catalog-state-change", { detail: { type: value } }),
              );
            }}
            className={`flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-1 pb-3 text-sm font-bold transition ${
              mediaType === value
                ? "border-[#ff3d4f] text-white"
                : "border-transparent text-[#8f98a6] hover:border-white/30 hover:text-white"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8 text-center text-red-100">
          No pudimos actualizar el catálogo. Revisa tu conexión e inténtalo nuevamente.
        </div>
      ) : items.length === 0 && !loading ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.025] py-20 text-center">
          <Search className="mx-auto mb-4 text-[#596272]" size={40} />
          <h3 className="text-xl font-bold text-white">No encontramos coincidencias</h3>
          <p className="mt-2 text-sm text-[#7f8998]">Prueba con otro título o cambia los filtros.</p>
        </div>
      ) : (
        <div className={`grid grid-cols-2 gap-4 transition sm:grid-cols-3 sm:gap-6 lg:grid-cols-5 xl:grid-cols-6 ${loading ? "opacity-45" : "opacity-100"}`}>
          {items.map((item) => (
            <MediaCard
              key={`${getMediaType(item)}-${item.id}`}
              item={item}
              onSelect={setSelectedItem}
            />
          ))}
        </div>
      )}

      {loading && (
        <div className="pointer-events-none absolute inset-x-0 top-56 flex justify-center">
          <div className="flex items-center gap-3 border border-white/10 bg-[#10151d]/95 px-5 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur">
            <LoaderCircle size={18} className="animate-spin text-[#ff3d4f]" />
            Buscando títulos
          </div>
        </div>
      )}

      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  );
}
