"use client";

import Image from "next/image";
import {
  ChevronDown,
  Clock3,
  Film,
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
    <article className="group relative overflow-hidden rounded-[5px] border border-white/10 bg-[#10141a] shadow-[0_18px_45px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1.5 hover:border-[#ed263b] hover:shadow-[0_24px_65px_rgba(0,0,0,0.65),0_0_24px_rgba(237,38,59,0.15)] hover:ring-2 hover:ring-[#ed263b] hover:ring-offset-2 hover:ring-offset-[#080b10] focus-within:ring-2 focus-within:ring-[#ed263b]">
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
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.075] group-hover:saturate-[0.72]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/20">
              <Film size={52} strokeWidth={1.3} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-transparent opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(237,38,59,0.08),rgba(3,4,7,0.82))] opacity-0 backdrop-blur-[1px] transition duration-300 group-hover:opacity-100" />
          <div className="absolute left-0 top-3 border-l-2 border-[#ff3d4f] bg-black/75 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md transition duration-300 group-hover:translate-x-1">
            {type === "movie" ? "Película" : "Serie"}
          </div>
          <div className="absolute right-3 top-3 flex items-center gap-1 bg-[#ffc34a] px-2.5 py-1 text-xs font-black text-[#171209] shadow-lg">
            <Star size={12} fill="currentColor" />
            {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
          </div>
          <div className="absolute inset-0 flex scale-90 flex-col items-center justify-center gap-3 opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/35 bg-[#ed263b] text-white shadow-[0_12px_34px_rgba(237,38,59,0.45)] transition group-hover:scale-100">
              <Play className="ml-0.5" size={20} fill="currentColor" />
            </span>
            <span className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-white">
              Ver ficha
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
  const originalTitle = data.original_title ?? data.original_name;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 p-0 backdrop-blur-md sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles de ${title}`}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto border border-white/10 bg-[#0a0c11] shadow-[0_35px_140px_rgba(0,0,0,0.9)] sm:rounded-2xl xl:overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/65 text-white shadow-xl backdrop-blur-md transition hover:border-[#ed263b] hover:bg-[#ed263b]"
          aria-label="Cerrar detalles"
        >
          <X size={21} />
        </button>

        <div className="relative min-h-52 overflow-hidden sm:min-h-[260px]">
          {data.backdrop_path && (
            <Image
              src={`${IMAGE_BASE}/w1280${data.backdrop_path}`}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover opacity-75"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a0e]/80 via-transparent to-[#080a0e]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c11] via-[#0a0c11]/20 to-black/15" />
        </div>

        <div className="relative -mt-16 grid gap-6 px-5 pb-7 sm:-mt-20 sm:grid-cols-[170px_1fr] sm:px-8 lg:gap-8 lg:px-10">
          <div className="relative mx-auto aspect-[2/3] w-36 overflow-hidden rounded-lg border border-white/15 bg-[#171c24] shadow-[0_25px_70px_rgba(0,0,0,0.65)] sm:mx-0 sm:w-[170px]">
            {data.poster_path ? (
              <Image
                src={`${IMAGE_BASE}/w500${data.poster_path}`}
                alt={`Póster de ${title}`}
                fill
                sizes="170px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/20">
                <Film size={48} />
              </div>
            )}
          </div>

          <div className="pt-0 sm:pt-10">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-[0.64rem] font-bold uppercase tracking-[0.14em]">
              <span className="rounded-full bg-[#ed263b] px-3 py-1.5 text-white">
                {type === "movie" ? "Película" : "Serie"}
              </span>
              <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-white/65 backdrop-blur-sm">
                {getYear(data)}
              </span>
              {details?.status && (
                <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-white/65 backdrop-blur-sm">
                  {details.status}
                </span>
              )}
            </div>
            <h2 className="max-w-3xl text-3xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-4xl">
              {title}
            </h2>
            {originalTitle && originalTitle !== title && (
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.13em] text-white/35">
                Título original · {originalTitle}
              </p>
            )}
            {details?.tagline && (
              <p className="mt-2 max-w-2xl text-xs italic text-white/55">“{details.tagline}”</p>
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
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-[0.68rem] font-semibold text-white/65"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                  {trailer && (
                    <a
                      href={`https://www.youtube.com/watch?v=${trailer.key}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto inline-flex items-center gap-2 rounded-full bg-[#ed263b] px-4 py-2 text-xs font-bold text-white shadow-[0_10px_28px_rgba(237,38,59,0.2)] transition hover:bg-[#ff4053]"
                    >
                      <Play size={14} fill="currentColor" /> Ver tráiler
                    </a>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] sm:grid-cols-4">
                  <div className="border-b border-r border-white/8 p-2.5 sm:border-b-0">
                    <span className="flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-white/35">
                      <Star size={13} className="text-[#ffc34a]" fill="currentColor" /> Puntuación
                    </span>
                    <p className="mt-1 text-sm font-black text-white">
                      {details.vote_average.toFixed(1)} <span className="text-xs font-medium text-white/35">/ 10</span>
                    </p>
                  </div>
                  <div className="border-b border-white/8 p-2.5 sm:border-b-0 sm:border-r">
                    <span className="flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-white/35">
                      <Clock3 size={13} className="text-[#ed263b]" /> Duración
                    </span>
                    <p className="mt-1 text-sm font-black text-white">
                      {formatRuntime(details) ?? "No disponible"}
                    </p>
                  </div>
                  <div className="border-r border-white/8 p-2.5">
                    <span className="flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-white/35">
                      <Users size={13} className="text-[#ed263b]" /> Valoraciones
                    </span>
                    <p className="mt-1 text-sm font-black text-white">
                      {details.vote_count.toLocaleString("es-PE")}
                    </p>
                  </div>
                  <div className="p-2.5">
                    <span className="flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-white/35">
                      <Tv size={13} className="text-[#ed263b]" /> {type === "tv" ? "Temporadas" : "Estreno"}
                    </span>
                    <p className="mt-1 text-sm font-black text-white">
                      {type === "tv" ? details.number_of_seasons ?? "—" : getYear(details)}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-[0.68rem] font-black uppercase tracking-[0.19em] text-white/40">
                    Sinopsis
                  </h3>
                  <p className="mt-2 max-w-4xl text-sm leading-6 text-white/65">
                    {details.overview || "La sinopsis todavía no está disponible en español."}
                  </p>
                </div>

                {cast.length > 0 && (
                  <div className="mt-5 border-t border-white/8 pt-4">
                    <h3 className="mb-3 text-[0.64rem] font-black uppercase tracking-[0.18em] text-white/40">
                      Reparto principal
                    </h3>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                      {cast.map((person) => (
                        <div key={person.id} className="min-w-0">
                          <div className="relative mb-1.5 aspect-square w-10 overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
                            {person.profile_path ? (
                              <Image
                                src={`${IMAGE_BASE}/w185${person.profile_path}`}
                                alt={person.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <Users className="absolute inset-0 m-auto text-white/20" size={18} />
                            )}
                          </div>
                          <p className="truncate text-[0.68rem] font-bold text-white/80">{person.name}</p>
                          <p className="mt-0.5 truncate text-[0.62rem] text-white/35">{person.character}</p>
                        </div>
                      ))}
                    </div>
                  </div>
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
    const handleHeaderSearch = (event: Event) => {
      const detail = (event as CustomEvent<{ query: string }>).detail;
      if (!detail?.query) return;

      setQuery(detail.query);
      setMediaType("all");
      setGenre("all");
    };

    window.addEventListener("catalog-search", handleHeaderSearch);
    return () => window.removeEventListener("catalog-search", handleHeaderSearch);
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
      <div className="mb-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">
            {heading}
          </h2>
          <p className="pb-1 text-sm text-white/45">
            {loading ? "Actualizando..." : `${items.length} títulos`}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.035] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm lg:flex-row lg:items-center">
          <div className="grid grid-cols-3 rounded-lg bg-black/30 p-1 lg:w-auto lg:min-w-[290px]">
            {(
              [
                ["all", "Todo"],
                ["movie", "Películas"],
                ["tv", "Series"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setMediaType(value);
                  window.dispatchEvent(
                    new CustomEvent("catalog-state-change", { detail: { type: value } }),
                  );
                }}
                className={`cursor-pointer rounded-md px-4 py-2.5 text-sm font-bold transition ${
                  mediaType === value
                    ? "bg-[#ed263b] text-white shadow-[0_6px_18px_rgba(237,38,59,0.22)]"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <span className="hidden h-7 w-px bg-white/10 lg:block" />

          <label className="group relative min-w-0 flex-1">
            <span className="sr-only">Buscar película o serie</span>
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 transition group-focus-within:text-[#ed263b]"
            />
            <input
              id="catalog-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por título"
              className="h-12 w-full rounded-lg border border-transparent bg-black/20 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/15 focus:bg-black/35"
            />
          </label>

          <label className="relative lg:w-[210px]">
            <span className="sr-only">Filtrar por género</span>
            <SlidersHorizontal
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />
            <select
              id="catalog-genre"
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
              className="h-12 w-full appearance-none rounded-lg border border-transparent bg-black/20 pl-11 pr-10 text-sm font-semibold text-white/70 outline-none transition focus:border-white/15 focus:bg-black/35"
            >
              <option value="all">Todos los géneros</option>
              {genres.map((genreOption) => (
                <option key={genreOption.id} value={genreOption.id}>
                  {genreOption.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#ed263b]"
            />
          </label>
        </div>
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
