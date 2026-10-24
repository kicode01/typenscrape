import { createInterface } from 'readline';
import { createReadStream, writeFileSync, rmSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LAYER1_PATH = join(__dirname, '../layer1.json');
const DATA_DIR = join(__dirname, '../public/data');

const TARGET_CHUNKS = 10;
const RECIPES_PER_CHUNK = 2000;
const MAX_RECIPES = TARGET_CHUNKS * RECIPES_PER_CHUNK;

async function buildDatabase() {
  console.log(`🚀 Starting Offline Database Builder (Text-Only Mode) for Low-End Devices`);
  console.log(`Target: ${MAX_RECIPES} optimized text-only recipes in ${TARGET_CHUNKS} chunks.`);

  // 1. Clean old dummy chunks
  if (existsSync(DATA_DIR)) {
    console.log(`🧹 Cleaning old chunks...`);
    const files = readdirSync(DATA_DIR);
    for (const file of files) {
      if (file.startsWith('chunk_') && file.endsWith('.json')) {
        rmSync(join(DATA_DIR, file));
      }
    }
  } else {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  // 2. Stream layer1.json to extract valid recipes (no images needed)
  console.log(`\n🍲 Extracting text recipes from layer1.json...`);
  
  if (!existsSync(LAYER1_PATH)) {
    console.error(`❌ layer1.json not found!`);
    process.exit(1);
  }

  const l1Stream = createReadStream(LAYER1_PATH);
  const l1Rl = createInterface({ input: l1Stream, crlfDelay: Infinity });

  const validRecipes = [];
  let chunkIndex = 1;

  for await (const line of l1Rl) {
    let cleanLine = line.trim();
    if (cleanLine === '[' || cleanLine === ']') continue;
    if (cleanLine.endsWith(',')) cleanLine = cleanLine.slice(0, -1);
    
    try {
      if (!cleanLine.startsWith('{')) continue;
      const obj = JSON.parse(cleanLine);
      
      // Filter: Must have ingredients and instructions (images NOT required anymore)
      if (obj.ingredients && obj.ingredients.length >= 3 && obj.instructions && obj.instructions.length >= 2) {
        
        const ingredientsText = obj.ingredients.map(i => i.text).join('\n');
        
        // Extract array of clean ingredient names for fast matching
        const ingredientsArray = obj.ingredients
          .flatMap(i => i.text.split(/[,;\s]/))
          .map(word => word.replace(/[^a-zA-Z]/g, '').toLowerCase())
          .filter(word => word.length > 2);

        // Map Recipe1M format to our LocalRecipe interface
        const localRecipe = {
          id: obj.id,
          name: obj.title,
          ingredients: ingredientsText,
          ingredientsArray: Array.from(new Set(ingredientsArray)),
          description: obj.instructions[0].text,
          prepTime: 'PT15M',
          cookTime: 'PT25M',
          recipeYield: '2-4 servings',
          source: 'Recipe1M Dataset',
          url: obj.url || '',
          image: '', // Text-only mode: No image!
          instructions: obj.instructions.map(i => i.text) // Store for UI usage
        };

        validRecipes.push(localRecipe);

        // If we filled a chunk, write it immediately
        if (validRecipes.length === RECIPES_PER_CHUNK) {
          const chunkPath = join(DATA_DIR, `chunk_${chunkIndex}.json`);
          writeFileSync(chunkPath, JSON.stringify(validRecipes, null, 0));
          console.log(`📦 Wrote chunk_${chunkIndex}.json (${validRecipes.length} recipes)`);
          
          validRecipes.length = 0; // Clear array for next chunk
          chunkIndex++;

          if (chunkIndex > TARGET_CHUNKS) {
            break; // We have enough data
          }
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }
  l1Stream.close();

  console.log(`\n🎉 Success! Built ${chunkIndex - 1} chunks with ${RECIPES_PER_CHUNK} text-only recipes each.`);
  console.log(`📱 This database is extremely fast for low-end devices!`);
}

buildDatabase().catch(console.error);
