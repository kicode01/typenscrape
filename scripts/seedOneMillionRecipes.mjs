/**
 * High-Performance Bulk Seeder for 1M+ Recipes in Firestore
 * Usage: node scripts/seedOneMillionRecipes.mjs [targetCount]
 * Default targetCount: 1000 (adjust as needed based on your Firebase plan)
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables (prefer process.env, fallback to .env file if available)
const envVars = {};
const envPath = join(__dirname, '../.env');
if (existsSync(envPath)) {
  try {
    const envContent = readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          const key = trimmed.slice(0, idx).trim();
          const value = trimmed.slice(idx + 1).trim();
          envVars[key] = value;
        }
      }
    });
  } catch (err) {
    console.warn('⚠️ Could not read local .env file:', err.message);
  }
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || envVars.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID || envVars.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Error: Firebase environment variables are missing. Ensure they are configured in GitHub Secrets or .env file.');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TARGET_COUNT = parseInt(process.argv[2]) || 5000;

const CUISINES = ['Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese', 'Thai', 'French', 'Mediterranean', 'American', 'Greek'];
const DISH_TYPES = ['Soup', 'Salad', 'Stew', 'Curry', 'Roast', 'Stir-Fry', 'Bake', 'Pasta', 'Bowl', 'Casserole'];
const PROTEINS = ['Chicken', 'Beef', 'Pork', 'Tofu', 'Salmon', 'Shrimp', 'Turkey', 'Lentils', 'Chickpeas', 'Eggs'];
const VEGGIES = ['Garlic', 'Onion', 'Tomato', 'Spinach', 'Mushroom', 'Bell Pepper', 'Broccoli', 'Zucchini', 'Carrot', 'Potato'];
const SPICES = ['Cumin', 'Paprika', 'Basil', 'Oregano', 'Turmeric', 'Chili Flakes', 'Black Pepper', 'Garlic Powder', 'Ginger', 'Soy Sauce'];

function generateRecipeCombination(index) {
  const cuisine = CUISINES[index % CUISINES.length];
  const dish = DISH_TYPES[(index + 3) % DISH_TYPES.length];
  const protein = PROTEINS[(index + 7) % PROTEINS.length];
  const veggie1 = VEGGIES[(index + 2) % VEGGIES.length];
  const veggie2 = VEGGIES[(index + 5) % VEGGIES.length];
  const spice = SPICES[(index + 4) % SPICES.length];

  const name = `${cuisine} ${protein} ${dish} with ${veggie1} & ${spice}`;
  const ingredientsText = `1 lb ${protein}\n2 cups ${veggie1}\n1 cup ${veggie2}\n2 tbsp ${spice}\nSalt & pepper to taste`;
  const ingredientsArray = [protein, veggie1, veggie2, spice, cuisine, dish].map(i => i.toLowerCase());

  return {
    name,
    ingredients: ingredientsText,
    ingredientsArray,
    description: `A delicious ${cuisine.toLowerCase()} style ${dish.toLowerCase()} made with fresh ${protein.toLowerCase()} and ${veggie1.toLowerCase()}.`,
    prepTime: 'PT15M',
    cookTime: 'PT25M',
    recipeYield: '4 servings',
    source: 'TypenScrape Global Database',
    createdAt: Timestamp.now()
  };
}

async function bulkSeed() {
  console.log(`🚀 Starting Firestore Bulk Seeding... Target: ${TARGET_COUNT} recipes`);
  let totalUploaded = 0;
  let batch = writeBatch(db);
  let batchCount = 0;

  for (let i = 1; i <= TARGET_COUNT; i++) {
    const recipe = generateRecipeCombination(i);
    const docRef = doc(db, 'recipes', `recipe_bulk_${i}`);
    
    batch.set(docRef, recipe);
    batchCount++;
    totalUploaded++;

    // Firestore allows max 500 operations per writeBatch
    if (batchCount === 450) {
      await batch.commit();
      console.log(`📦 Uploaded batch: ${totalUploaded} / ${TARGET_COUNT} recipes...`);
      batch = writeBatch(db);
      batchCount = 0;
      // Slight delay to respect write limits
      await new Promise(r => setTimeout(r, 200));
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`✅ Bulk Seeding Complete! Total uploaded to Firestore: ${totalUploaded} recipes.`);
  process.exit(0);
}

bulkSeed().catch(console.error);
