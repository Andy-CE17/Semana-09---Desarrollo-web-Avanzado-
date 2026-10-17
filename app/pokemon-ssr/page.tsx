import axios from "axios";
import { connection } from "next/server";
import { Suspense } from "react";

interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

async function getPokemon(): Promise<Pokemon> {
  await connection();
  const randomId = Math.floor(Math.random() * 150) + 1;
  const response = await axios.get<Pokemon>(
    `https://pokeapi.co/api/v2/pokemon/${randomId}`,
  );
  return response.data;
}

async function PokemonContent() {
  const pokemon = await getPokemon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-t-xl border-4 border-black bg-yellow-400 px-6 py-3 text-center text-black">
          <h1 className="text-3xl font-bold">⚡ Pokémon SSR</h1>
          <p className="mt-1 text-sm">Server-Side Rendering</p>
        </div>

        <div className="rounded-b-xl border-4 border-t-0 border-black bg-white p-8 shadow-2xl">
          <div className="text-center">
            {/* La guía utiliza la URL remota que entrega PokeAPI. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="mx-auto h-48 w-48"
            />
            <h2 className="mt-4 text-4xl font-bold capitalize text-gray-700">
              {pokemon.name}
            </h2>
            <div className="mt-4 flex justify-center gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  className="rounded-full bg-green-500 px-4 py-2 font-semibold text-white"
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-lg border-2 border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-800">
              💡 <strong>SSR:</strong> Los datos se obtienen en el servidor antes de enviar el HTML. ¡Ve el código fuente de la página para ver el contenido ya renderizado!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PokemonSSR() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 p-8">
          <div className="mx-auto max-w-2xl rounded-xl border-4 border-black bg-white p-12 text-center shadow-2xl">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-b-4 border-green-500" />
            <p className="mt-4 text-gray-600">Renderizando Pokémon en el servidor...</p>
          </div>
        </div>
      }
    >
      <PokemonContent />
    </Suspense>
  );
}
