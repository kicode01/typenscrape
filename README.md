# TypenScrape

A mobile-first recipe app. Find a recipe three ways: search a local database
that works offline, look one up on Spoonacular, or generate one from whatever
is in your fridge.

## What it does

- **Explore** — search a local recipe database that loads into the browser and
  keeps working with no connection.
- **Generate** — give it ingredients and preferences, get back a structured
  recipe (title, times, servings, difficulty, steps, tips, related dishes).
- **Favourites and history** — saved per user, synced through Firestore.
- **Filipino recipes** — a separate curated set alongside the general database.

## How it works

| Concern | Where it lives |
| :-- | :-- |
| Local recipe database | `public/data/chunk_*.json` (16 chunks) fetched sequentially and written into IndexedDB with indexes on name and ingredients — `recipeDataService.ts`, `idbService.ts` |
| Generation | Groq (Llama 3) tried first for latency, falling back to Gemini — `geminiService.ts` |
| Structured lookup | Spoonacular — `spoonacularService.ts` |
| Filipino set | `filipinoRecipeService.ts` |
| Auth and sync | Firebase Auth + Firestore — `firebaseRecipeService.ts` |
| Shell | Mobile container with tab navigation: Explore / Favourites / History / Settings |

Chunks are loaded one at a time rather than in parallel, deliberately — peak
memory matters on the low-end phones this is built for.

## Running it

```sh
npm install
cp .env.example .env    # fill in at least one generation key
npm run dev
```

`npm run build` produces a static `dist/` you can host anywhere.

## Environment

Every variable the app reads is listed in `.env.example`. Firebase is needed for
auth and sync; Spoonacular for structured lookup. Generation needs **either**
`VITE_GROQ_API_KEY` or `VITE_GEMINI_API_KEY` — with neither, generation is
disabled but browsing and search still work.

> These are `VITE_` variables, so they are compiled into the client bundle. Treat
> them as public: restrict them at the provider rather than relying on them
> staying secret.

## A note on the data

The recipe source (`general_recipes.csv`, ~69 MB) and the intermediate
`layer1.json` / `layer2.json` files (~1.4 GB and 126 MB) are **not** in this
repository. They are build inputs for the chunked runtime data in
`public/data/`, and the two JSON files exceed GitHub's per-file size limit.
`optimize-dataset*.mjs` is what turns one into the other.
