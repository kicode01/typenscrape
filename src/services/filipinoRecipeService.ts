// Filipino Recipe Service
// Fetches, normalizes, and caches data from 5 HuggingFace datasets

const HF_BASE = 'https://datasets-server.huggingface.co/rows';

const DATASETS = [
  { key: 'FILIPINO_RECIPES_2K_V2', dataset: 'joackimagno/FILIPINO_RECIPES_2K_V2' },
  { key: 'FILIPINO_RECIPES_2K',    dataset: 'joackimagno/FILIPINO_RECIPES_2K' },
  { key: 'FILIPINO_RECIPES_1K',    dataset: 'joackimagno/FILIPINO_RECIPES_1K' },
  { key: 'CARINDERIA_RECIPES',     dataset: 'joackimagno/CARINDERIA_RECIPES' },
  { key: 'FILTERED',               dataset: 'joackimagno/filtered-filipino-recipes' },
];

const CACHE_KEY = 'typenscrape_filipino_recipes_v2';
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export interface FilipinoDish {
  id: string;
  name: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  ingredients: string[];       // full ingredient lines
  ingredientNames: string[];   // short keyword list
  instructions: string[];      // step-by-step
  description?: string;
  url?: string;
  source: string;
  category: string;            // inferred category
  rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  stats?: {
    prepSpeed: number;
    health: number;
    flavor: number;
    budget: number;
  };
}

// ─── Category inference ──────────────────────────────────────────────────────
function inferCategory(ingredientNames: string[], recipeName: string): string {
  const combined = (ingredientNames.join(' ') + ' ' + recipeName).toLowerCase();

  if (/pancit|bihon|noodle|sotanghon|canton|mami|misua/.test(combined)) return 'Noodles';
  if (/sinigang|tinola|nilaga|bulalo|sopas|arroz caldo|lugaw|goto|congee/.test(combined)) return 'Soups';
  if (/sinangag|arroz|rice|kanin|champorado/.test(combined)) return 'Rice';
  if (/shrimp|hipon|fish|bangus|tilapia|isda|squid|pusit|crab|alimango|tahong|seafood|clam|mussel/.test(combined)) return 'Seafood';
  if (/chicken|manok/.test(combined)) return 'Chicken';
  if (/beef|baka|bulalo|kare-kare|kaldereta/.test(combined)) return 'Beef';
  if (/kalabasa|kangkong|sitaw|gulay|ampalaya|eggplant|talong|okra|saluyot|vegetable|pechay|camote/.test(combined)) return 'Vegetables';
  if (/pork|baboy|lechon|liempo|tocino|longganisa|chorizo/.test(combined)) return 'Pork';
  if (/cake|pastry|bibingka|puto|kutsinta|suman|kakanin|dessert|leche|halo|biko|maja|ube/.test(combined)) return 'Desserts';
  return 'Others';
}

// ─── Raw row → FilipinoDish normalizer ───────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeRow(row: any, sourceKey: string): FilipinoDish | null {
  const name: string = (row.recipe_name || '').trim();
  if (!name) return null;

  // Parse ingredients: pipe-delimited OR newline-delimited (filtered dataset)
  const rawIngredients: string = row.ingredients || row.full_ingredients || '';
  const ingredients = rawIngredients
    .split(/\||\r?\n/)
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 1);

  // Parse ingredient names: pipe OR comma delimited
  const rawNames: string = row.ingredient_names || '';
  const ingredientNames = rawNames
    .split(/\||,/)
    .map((s: string) => s.trim().toLowerCase())
    .filter((s: string) => s.length > 1);

  // Parse instructions: pipe OR newline delimited
  const parseInstructions = (value: string | null | undefined): string[] => {
    if (!value) return [];
      
    const parts = value.split(/\||\r?\n/).map(s => s.trim()).filter(s => s.length > 0);
    if (parts.length === 0) return [];
      
    // Join all parts into a single string with spaces, normalizing whitespace
    const joined = parts.join(' ').replace(/\s+/g, ' ');
    // Split by period, exclamation, question mark, or colon followed by space and then a Capital letter or digit
    const sentences = joined.split(/(?<=[.!?:])\s+(?=[A-Z0-9])/);
    return sentences.map(s => s.trim()).filter(s => s.length > 0);
  };

  const instructions = parseInstructions(row.instructions);

  const id = `${sourceKey}_${name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`;

  return {
    id,
    name,
    prepTime: row.prep_time || '',
    cookTime: row.cook_time || '',
    totalTime: row.total_time || '',
    servings: String(row.servings || ''),
    ingredients,
    ingredientNames,
    instructions,
    description: row.description || undefined,
    url: row.url || undefined,
    source: sourceKey,
    category: inferCategory(ingredientNames, name),
  };
}

// ─── Fetch a single dataset page ─────────────────────────────────────────────
async function fetchDataset(dataset: string, offset = 0, length = 100): Promise<FilipinoDish[]> {
  const url = `${HF_BASE}?dataset=${encodeURIComponent(dataset)}&config=default&split=train&offset=${offset}&length=${length}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${dataset}: ${res.status}`);
  const json = await res.json();
  return json.rows || [];
}

// ─── Fetch + normalize all datasets ──────────────────────────────────────────
export async function fetchAllFilipinoRecipes(): Promise<FilipinoDish[]> {
  // Check cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        console.log(`✅ Loaded ${data.length} Filipino recipes from cache`);
        return data;
      }
    }
  } catch {
    // cache miss or corrupt — refetch
  }

  // Fetch all datasets in parallel
  const results = await Promise.allSettled(
    DATASETS.map(async ({ key, dataset }) => {
      const rows = await fetchDataset(dataset);
      return rows
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((r: any) => normalizeRow(r.row, key))
        .filter((d): d is FilipinoDish => d !== null);
    })
  );

  // Merge all results
  const seenNames = new Set<string>();
  const merged: FilipinoDish[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      for (const dish of result.value) {
        const key = dish.name.toLowerCase().trim();
        if (!seenNames.has(key)) {
          seenNames.add(key);
          merged.push(dish);
        }
      }
    }
  }

  // Sort alphabetically
  merged.sort((a, b) => a.name.localeCompare(b.name));

  // Cache for 1 hour
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: merged }));
  } catch {
    // storage full — skip cache
  }

  console.log(`🇵🇭 Loaded ${merged.length} unique Filipino recipes from HuggingFace`);
  return merged;
}

export function clearFilipinoRecipeCache() {
  localStorage.removeItem(CACHE_KEY);
}

export const CATEGORIES = ['All', 'Pork', 'Chicken', 'Beef', 'Seafood', 'Vegetables', 'Noodles', 'Soups', 'Rice', 'Desserts', 'Others'];
