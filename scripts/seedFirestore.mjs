/**
 * Seed Local Recipes to Firebase Firestore
 * Usage: node scripts/seedFirestore.mjs
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
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

async function seedRecipes() {
  console.log('🚀 Starting Firestore Recipe Seeding Process for project:', firebaseConfig.projectId);
  
  const publicDataDir = join(__dirname, '../public/data');
  const srcDataDir = join(__dirname, '../src/data');

  let recipeFiles = [];

  if (existsSync(publicDataDir)) {
    const publicFiles = readdirSync(publicDataDir).filter(f => f.endsWith('.json')).map(f => join(publicDataDir, f));
    recipeFiles.push(...publicFiles);
  }

  if (existsSync(srcDataDir)) {
    const srcFiles = readdirSync(srcDataDir).filter(f => f.endsWith('.json')).map(f => join(srcDataDir, f));
    recipeFiles.push(...srcFiles);
  }

  console.log(`📁 Found ${recipeFiles.length} JSON dataset files.`);

  let totalUploaded = 0;
  const recipesRef = collection(db, 'recipes');

  for (const filePath of recipeFiles.slice(0, 5)) {
    console.log(`📦 Uploading recipes from ${filePath}...`);
    try {
      const content = readFileSync(filePath, 'utf-8');
      const recipes = JSON.parse(content);

      // Upload batch of recipes per file
      for (const recipe of recipes.slice(0, 30)) {
        if (!recipe.name) continue;

        const ingredientsText = recipe.ingredients || '';
        const ingredientsArray = ingredientsText
          .split('\n')
          .flatMap(line => line.split(' '))
          .map(word => word.replace(/[^a-zA-Z]/g, '').toLowerCase())
          .filter(word => word.length > 2);

        await addDoc(recipesRef, {
          name: recipe.name,
          ingredients: ingredientsText,
          ingredientsArray: Array.from(new Set(ingredientsArray)),
          description: recipe.description || '',
          prepTime: recipe.prepTime || 'PT15M',
          cookTime: recipe.cookTime || 'PT20M',
          recipeYield: recipe.recipeYield || '2-4 servings',
          source: recipe.source || 'Scraped Recipe',
          url: recipe.url || '',
          image: recipe.image || '',
          createdAt: Timestamp.now()
        });
        totalUploaded++;
      }
    } catch (err) {
      console.warn(`Warning parsing/uploading ${filePath}:`, err.message);
    }
  }

  console.log(`✅ Seeding Complete! Successfully uploaded ${totalUploaded} recipes to Firestore.`);
  process.exit(0);
}

seedRecipes().catch(console.error);
