"use client";

import axios from "axios";
import { useEffect, useState } from "react";

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

export default function PokemonCSR() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const randomId = Math.floor(Math.random() * 150) + 1;
        const response = await axios.get<Pokemon>(
          `https://pokeapi.co/api/v2/pokemon/${randomId}`,
        );
        setPokemon(response.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-t-xl border-4 border-black bg-yellow-400 px-6 py-3 text-center text-black">
          <h1 className="text-3xl font-bold">🎮 Pokémon CSR</h1>
          <p className="mt-1 text-sm">Client-Side Rendering</p>
        </div>

        <div className="rounded-b-xl border-4 border-t-0 border-black bg-white p-8 shadow-2xl">
          {loading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-16 w-16 animate-spin rounded-full border-b-4 border-red-500" />
              <p className="mt-4 text-gray-600">Cargando Pokémon...</p>
            </div>
          ) : error ? (
            <p className="py-12 text-center font-semibold text-red-600">
              No se pudo cargar el Pokémon. Recarga la página para intentarlo nuevamente.
            </p>
          ) : pokemon ? (
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
                    className="rounded-full bg-blue-500 px-4 py-2 font-semibold text-white"
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>CSR:</strong> Los datos se cargan en el navegador después de que la página se renderiza. ¡Mira la pestaña Network para ver la petición!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
