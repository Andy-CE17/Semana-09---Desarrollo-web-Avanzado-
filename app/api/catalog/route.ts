import { NextRequest, NextResponse } from "next/server";
import { searchCatalog } from "@/lib/tmdb";
import type { MediaType } from "@/lib/tmdb-types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim() ?? "";
  const requestedType = searchParams.get("type");
  const mediaType: "all" | MediaType =
    requestedType === "movie" || requestedType === "tv"
      ? requestedType
      : "all";
  const rawGenre = searchParams.get("genre");
  const genre = rawGenre ? Number(rawGenre) : undefined;

  try {
    const results = await searchCatalog({
      query,
      mediaType,
      genre: Number.isFinite(genre) ? genre : undefined,
    });

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: "No fue posible consultar el catálogo en este momento." },
      { status: 502 },
    );
  }
}
