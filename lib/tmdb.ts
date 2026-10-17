import axios from "axios";
import type {
  Genre,
  GenreResponse,
  MediaDetails,
  MediaItem,
  MediaType,
  TmdbListResponse,
} from "./tmdb-types";

const TMDB_API_URL = "https://api.themoviedb.org/3";

function getApiKey() {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("Falta configurar TMDB_API_KEY en .env.local");
  }

  return apiKey;
}

export async function tmdbRequest<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
  const response = await axios.get<T>(`${TMDB_API_URL}${path}`, {
    params: {
      api_key: getApiKey(),
      language: "es-ES",
      include_adult: false,
      ...params,
    },
    timeout: 12000,
  });

  return response.data;
}

function isMediaItem(item: MediaItem) {
  return (
    (item.media_type === "movie" || item.media_type === "tv") &&
    Boolean(item.poster_path)
  );
}

export async function getHomeCatalog() {
  const [trending, movies, series, movieGenres, tvGenres] = await Promise.all([
    tmdbRequest<TmdbListResponse>("/trending/all/week"),
    tmdbRequest<TmdbListResponse>("/movie/popular", { page: 1 }),
    tmdbRequest<TmdbListResponse>("/tv/popular", { page: 1 }),
    tmdbRequest<GenreResponse>("/genre/movie/list"),
    tmdbRequest<GenreResponse>("/genre/tv/list"),
  ]);

  const trendingItems = trending.results.filter(isMediaItem);
  const movieItems = movies.results
    .filter((item) => Boolean(item.poster_path))
    .map((item) => ({ ...item, media_type: "movie" as const }));
  const tvItems = series.results
    .filter((item) => Boolean(item.poster_path))
    .map((item) => ({ ...item, media_type: "tv" as const }));

  const seen = new Set<number>();
  const genres = [...movieGenres.genres, ...tvGenres.genres].filter((genre) => {
    if (seen.has(genre.id)) return false;
    seen.add(genre.id);
    return true;
  });

  const initialItems = [...trendingItems, ...movieItems, ...tvItems].filter(
    (item, index, items) =>
      index ===
      items.findIndex(
        (candidate) =>
          candidate.id === item.id && candidate.media_type === item.media_type,
      ),
  );

  const featured =
    trendingItems.find((item) => item.backdrop_path && item.overview) ??
    initialItems[0];

  return { featured, initialItems: initialItems.slice(0, 30), genres };
}

export async function searchCatalog({
  query,
  mediaType,
  genre,
}: {
  query: string;
  mediaType: "all" | MediaType;
  genre?: number;
}) {
  let response: TmdbListResponse;

  if (query) {
    const endpoint =
      mediaType === "all" ? "/search/multi" : `/search/${mediaType}`;
    response = await tmdbRequest<TmdbListResponse>(endpoint, {
      query,
      page: 1,
    });
  } else if (mediaType === "all") {
    response = await tmdbRequest<TmdbListResponse>("/trending/all/week");
  } else {
    response = await tmdbRequest<TmdbListResponse>(`/discover/${mediaType}`, {
      sort_by: "popularity.desc",
      page: 1,
      with_genres: genre,
    });
  }

  return response.results
    .map((item) => ({
      ...item,
      media_type: item.media_type ?? (mediaType === "all" ? undefined : mediaType),
    }))
    .filter(isMediaItem)
    .filter((item) => !genre || item.genre_ids.includes(genre));
}

export async function getMediaDetails(
  mediaType: MediaType,
  id: number,
): Promise<MediaDetails> {
  const details = await tmdbRequest<Omit<MediaDetails, "media_type">>(
    `/${mediaType}/${id}`,
    { append_to_response: "credits,videos" },
  );

  return { ...details, media_type: mediaType };
}

export function imageUrl(path: string | null, size = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

export function titleOf(item: Pick<MediaItem, "title" | "name">) {
  return item.title ?? item.name ?? "Sin título";
}

export function yearOf(
  item: Pick<MediaItem, "release_date" | "first_air_date">,
) {
  const date = item.release_date ?? item.first_air_date;
  return date ? date.slice(0, 4) : "Próximamente";
}

export function genreName(genres: Genre[], genreId: number) {
  return genres.find((genre) => genre.id === genreId)?.name;
}
