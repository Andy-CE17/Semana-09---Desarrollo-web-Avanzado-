import axios from "axios";
import { connection } from "next/server";
import { Suspense } from "react";
import ClientWeatherWidget from "./ClientWeatherWidget";

interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
}

async function getWeatherServer(): Promise<WeatherData> {
  await connection();
  const response = await axios.get<WeatherData>(
    "https://api.open-meteo.com/v1/forecast?latitude=-12.04&longitude=-77.03&current_weather=true",
  );
  return response.data;
}

async function LimaWeatherCard() {
  const serverWeather = await getWeatherServer();

  return (
    <div className="rounded-2xl border-4 border-white bg-white/90 p-6 shadow-2xl backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
        <h2 className="text-2xl font-bold text-gray-800">Lima - SSR</h2>
      </div>
      <div className="mb-2 text-6xl font-bold text-blue-600">
        {serverWeather.current_weather.temperature}°C
      </div>
      <p className="text-gray-600">
        Viento: {serverWeather.current_weather.windspeed} km/h
      </p>
      <div className="mt-4 rounded-lg border-2 border-green-200 bg-green-50 p-3">
        <p className="text-xs text-green-800">
          ✅ Datos obtenidos en el servidor - SEO friendly
        </p>
      </div>
    </div>
  );
}

function WeatherCardFallback() {
  return (
    <div className="rounded-2xl border-4 border-white bg-white/90 p-6 shadow-2xl backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
        <h2 className="text-2xl font-bold text-gray-800">Lima - SSR</h2>
      </div>
      <div className="py-8 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-4 border-green-500" />
        <p className="mt-4 text-gray-600">Consultando el clima desde el servidor...</p>
      </div>
    </div>
  );
}

export default function WeatherDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-5xl font-bold text-white drop-shadow-lg">
          ☁️ Dashboard del Clima
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Suspense fallback={<WeatherCardFallback />}>
            <LimaWeatherCard />
          </Suspense>
          <ClientWeatherWidget />
        </div>

        <div className="mt-8 rounded-2xl border-4 border-white bg-white/90 p-6 shadow-2xl backdrop-blur">
          <h3 className="mb-4 text-2xl font-bold text-gray-700">
            📊 Comparación SSR vs CSR
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700">Característica</th>
                  <th className="px-4 py-2 text-left text-gray-700">SSR</th>
                  <th className="px-4 py-2 text-left text-gray-700">CSR</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 font-semibold text-gray-700">SEO</td>
                  <td className="px-4 py-2 text-green-600">✅ Excelente</td>
                  <td className="px-4 py-2 text-red-600">❌ Limitado</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-2 font-semibold text-gray-700">Tiempo inicial</td>
                  <td className="px-4 py-2 text-green-600">✅ Rápido</td>
                  <td className="px-4 py-2 text-yellow-600">⚠️ Más lento</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-semibold text-gray-700">Interactividad</td>
                  <td className="px-4 py-2 text-yellow-600">⚠️ Recarga página</td>
                  <td className="px-4 py-2 text-green-600">✅ Dinámica</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-2 font-semibold text-gray-700">Carga del servidor</td>
                  <td className="px-4 py-2 text-red-600">❌ Alta</td>
                  <td className="px-4 py-2 text-green-600">✅ Baja</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
