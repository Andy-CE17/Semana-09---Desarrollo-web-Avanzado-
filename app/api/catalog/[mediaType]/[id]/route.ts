import { NextResponse } from "next/server";
import { getMediaDetails } from "@/lib/tmdb";
import type { MediaType } from "@/lib/tmdb-types";

interface RouteContext {
  params: Promise<{
    mediaType: string;
    id: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { mediaType, id } = await context.params;

  if (mediaType !== "movie" && mediaType !== "tv") {
    return NextResponse.json({ error: "Tipo de contenido inválido." }, { status: 400 });
  }

  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return NextResponse.json({ error: "Identificador inválido." }, { status: 400 });
  }

  try {
    const details = await getMediaDetails(mediaType as MediaType, numericId);
    return NextResponse.json(details);
  } catch {
    return NextResponse.json(
      { error: "No fue posible obtener los detalles." },
      { status: 502 },
    );
  }
}
