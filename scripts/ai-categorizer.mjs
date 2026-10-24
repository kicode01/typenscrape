import fs from 'fs';
import path from 'path';

// Manual .env parser to avoid external dependencies
const envPath = path.join(process.cwd(), '.env');
let groqKey = '';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/GROQ_API_KEY\s*=\s*(.*)/);
  if (match) {
    groqKey = match[1].trim();
  }
}

if (!groqKey) {
  console.error("Missing GROQ_API_KEY in .env");
  process.exit(1);
}

console.log(`Loaded Groq API key.`);

const DEST_DIR = './public/data';
const BATCH_SIZE = 50; // Smaller batches for Groq to avoid max token limits
const RPM_LIMIT_MS = 3000; // Wait 3 seconds between batches

const CATEGORIES = ["Beef", "Pork", "Chicken", "Seafood", "Vegetables", "Soups", "Noodles", "Rice", "Desserts", "Snacks", "Appetizers", "Beverages", "Condiments"];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function categorizeBatch(batch) {
  const prompt = `You are a culinary AI for an RPG game. Classify these ${batch.length} Filipino recipes. 
Categories: ${CATEGORIES.join(', ')}.
Rarity: Common (everyday), Rare (special), Epic (expensive/holiday), Legendary (extreme/bizarre).
Stats: 4 integers 1-100 for [prepSpeed, health, flavor, budget].

INPUT:
${batch.map(r => `${r.id}|${r.name}|${r.ingredients.slice(0,3).join(',')}`).join('\n')}

OUTPUT MUST BE A VALID JSON OBJECT containing an array "recipes" exactly ${batch.length} long, minified:
{"recipes": [{"i":"recipe_1","c":"Pork","r":"Common","s":[80,50,90,60]},...]}`;

  try {
    const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const result = await response.json();
    if (result.error) {
       console.error("AI API Error:", result.error.message);
       if (result.error.code === 429) {
         console.log(`\n⚠️ Quota exceeded (429)! Waiting 10 seconds before retrying...`);
         await delay(10000);
         return { retryWithNextKey: true };
       }
       return null;
    }
    
    const parsed = JSON.parse(result.choices[0].message.content);
    return parsed.recipes;
  } catch (error) {
    console.error("AI Error:", error.message);
    return null;
  }
}

async function run() {
  console.log("Starting AI Categorization Dataset Builder...");
  
  // Load all chunks
  const chunks = [];
  for (let i = 1; i <= 16; i++) {
    const p = path.join(DEST_DIR, `chunk_${i}.json`);
    if (fs.existsSync(p)) {
      chunks.push({ index: i, path: p, data: JSON.parse(fs.readFileSync(p, 'utf8')) });
    }
  }

  let allRecipes = chunks.flatMap(c => c.data);
  console.log(`Total recipes loaded: ${allRecipes.length}`);

  let updatedCount = 0;
  
  for (let i = 0; i < allRecipes.length; i += BATCH_SIZE) {
    console.log(`\nProcessing batch ${Math.floor(i/BATCH_SIZE) + 1} of ${Math.ceil(allRecipes.length/BATCH_SIZE)}...`);
    const batch = allRecipes.slice(i, i + BATCH_SIZE);
    
    let success = false;
    let attempts = 0;
    while (!success && attempts < 3) {
      const results = await categorizeBatch(batch);
      
      if (results && results.retryWithNextKey) {
        // Quota exceeded, key was rotated. We will immediately retry without incrementing 'attempts'
        console.log("Retrying batch immediately with new key...");
        await delay(2000);
        continue;
      }

      if (results && Array.isArray(results) && results.length > 0) {
        // Map back to recipes
        for (const res of results) {
          const recipe = batch.find(r => r.id === res.i);
          if (recipe) {
            recipe.category = res.c || recipe.category;
            recipe.rarity = res.r || recipe.rarity;
            if (Array.isArray(res.s) && res.s.length === 4) {
              recipe.stats = {
                prepSpeed: res.s[0],
                health: res.s[1],
                flavor: res.s[2],
                budget: res.s[3]
              };
            }
            updatedCount++;
          }
        }
        success = true;
        console.log(`Successfully categorized ${results.length} recipes in this batch.`);
      } else {
        attempts++;
        console.log(`Batch failed, attempt ${attempts}/3. Waiting 10s...`);
        await delay(10000);
      }
    }
    
    // Write progress back to chunks immediately so we don't lose data on crash
    let pointer = 0;
    for (const chunk of chunks) {
      const chunkLen = chunk.data.length;
      chunk.data = allRecipes.slice(pointer, pointer + chunkLen);
      fs.writeFileSync(chunk.path, JSON.stringify(chunk.data, null, 2));
      pointer += chunkLen;
    }

    if (i + BATCH_SIZE < allRecipes.length) {
      console.log(`Waiting ${RPM_LIMIT_MS/1000}s to respect RPM limits...`);
      await delay(RPM_LIMIT_MS);
    }
  }

  console.log(`\nDONE! Successfully AI-categorized ${updatedCount}/${allRecipes.length} recipes.`);
}

run();
