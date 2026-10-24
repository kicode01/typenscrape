/**
 * Stream & Seed Recipes directly from Open Food Facts Dataset (With Redirect Follow)
 * Dataset URL: https://static.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz
 * 
 * Usage: node scripts/seedFromOpenFoodFacts.mjs [limit]
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { createGunzip } from 'zlib';
import { createInterface } from 'readline';
import { get } from 'https';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env
const envPath = join(__dirname, '../.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const firebaseConfig = {
  apiKey: envVars.VITE_FIREBASE_API_KEY,
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Error: Firebase environment variables are missing in .env file.');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const LIMIT = parseInt(process.argv[2]) || 5000;
const INITIAL_URL = 'https://static.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz';

function fetchStream(url, onResponse) {
  get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log(`↪️ Following redirect to: ${res.headers.location}`);
      fetchStream(res.headers.location, onResponse);
      return;
    }

    if (res.statusCode !== 200) {
      console.error(`Failed to download dataset. HTTP Status: ${res.statusCode}`);
      process.exit(1);
    }

    onResponse(res);
  }).on('error', (err) => {
    console.error('Download stream error:', err);
  });
}

async function processStream() {
  console.log(`🌐 Stream-downloading Open Food Facts dataset from: ${INITIAL_URL}`);
  console.log(`🎯 Target count: ${LIMIT} items`);

  fetchStream(INITIAL_URL, (res) => {
    const gunzip = createGunzip();
    const rl = createInterface({
      input: res.pipe(gunzip),
      crlfDelay: Infinity
    });

    let headerMap = {};
    let lineCount = 0;
    let totalUploaded = 0;
    let batch = writeBatch(db);
    let batchCount = 0;

    rl.on('line', async (line) => {
      lineCount++;

      // First line is TSV/CSV header
      if (lineCount === 1) {
        const headers = line.split('\t');
        headers.forEach((h, index) => {
          headerMap[h.trim()] = index;
        });
        console.log('📋 Parsed dataset header fields.');
        return;
      }

      if (totalUploaded >= LIMIT) {
        rl.close();
        res.destroy();
        return;
      }

      const columns = line.split('\t');
      const nameIndex = headerMap['product_name'] ?? headerMap['product_name_en'] ?? 7;
      const ingredientsIndex = headerMap['ingredients_text'] ?? headerMap['ingredients_text_en'] ?? 32;
      const categoryIndex = headerMap['categories'] ?? 18;
      const quantityIndex = headerMap['quantity'] ?? 11;

      const productName = columns[nameIndex]?.trim();
      const ingredientsText = columns[ingredientsIndex]?.trim();

      if (productName && ingredientsText && ingredientsText.length > 5) {
        const ingredientsArray = ingredientsText
          .split(/[,;\n]/)
          .flatMap(item => item.split(' '))
          .map(word => word.replace(/[^a-zA-Z]/g, '').toLowerCase())
          .filter(word => word.length > 2);

        const docRef = doc(db, 'recipes', `off_${Date.now()}_${totalUploaded}`);
        batch.set(docRef, {
          name: productName,
          ingredients: ingredientsText,
          ingredientsArray: Array.from(new Set(ingredientsArray)),
          description: `Category: ${columns[categoryIndex] || 'General Food'}`,
          prepTime: 'PT10M',
          cookTime: 'PT15M',
          recipeYield: columns[quantityIndex] || '1 serving',
          source: 'Open Food Facts World Database',
          url: 'https://world.openfoodfacts.org',
          createdAt: Timestamp.now()
        });

        batchCount++;
        totalUploaded++;

        if (batchCount === 400) {
          rl.pause();
          await batch.commit();
          console.log(`📦 Uploaded batch: ${totalUploaded} / ${LIMIT} Open Food Facts items...`);
          batch = writeBatch(db);
          batchCount = 0;
          setTimeout(() => rl.resume(), 300);
        }
      }
    });

    rl.on('close', async () => {
      if (batchCount > 0) {
        await batch.commit();
      }
      console.log(`✅ Open Food Facts Seeding Complete! Uploaded ${totalUploaded} entries.`);
      process.exit(0);
    });
  });
}

processStream();
