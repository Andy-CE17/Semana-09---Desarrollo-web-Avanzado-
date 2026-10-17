# Laboratorio 9 - Next.js

Proyecto académico desarrollado con Next.js, TypeScript y Tailwind CSS para comparar renderizado CSR y SSR.

## Rutas del laboratorio

- `/pokemon-csr`: consulta de Pokémon desde el navegador.
- `/pokemon-ssr`: consulta de Pokémon desde el servidor.
- `/weather`: dashboard híbrido de clima con SSR y CSR.
- `/`: galería de películas y series con portada SSR, búsqueda CSR y modal de detalles.

## Configuración

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Copiar `.env.example` como `.env.local` y colocar la credencial de TMDB:

   ```env
   TMDB_API_KEY=tu_api_key_de_tmdb
   ```

3. Iniciar el servidor:

   ```bash
   npm run dev
   ```

4. Abrir `http://localhost:3000`.

`.env.local` está excluido de Git para evitar publicar la credencial.
