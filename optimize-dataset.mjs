import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

console.log('Scanning and optimizing dataset chunks...');

function repairInstructions(rawInstructions) {
  if (!rawInstructions || rawInstructions === '[]') return [];
  const raw = rawInstructions.split('\\n').map(s => s.trim()).filter(s => s.length > 0);
  const repaired = [];
  for (const step of raw) {
    if (repaired.length > 0 && /^[a-z]/.test(step)) {
      repaired[repaired.length - 1] += ' ' + step;
    } else {
      repaired.push(step);
    }
  }
  return repaired;
}

function repairIngredients(rawIngredients) {
  if (!rawIngredients || rawIngredients === '[]') return [];
  return rawIngredients.split('\\n').map(s => s.trim()).filter(s => s.length > 0);
}

let totalProcessed = 0;
let totalFixed = 0;

for (let i = 1; i <= 10; i++) {
  const file = path.join(DATA_DIR, `chunk_${i}.json`);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    const optimized = data.map(item => {
      totalProcessed++;
      
      const cleanIngredients = repairIngredients(item.ingredients);
      const cleanInstructions = repairInstructions(item.instructions);
      
      // Check if we need to fix
      let neededFix = false;
      if (item.ingredients === '[]' || item.instructions === '[]') neededFix = true;
      if (item.description) neededFix = true; // We are removing description
      
      if (neededFix) totalFixed++;

      return {
        id: item.id,
        name: item.name,
        prepTime: item.prepTime,
        cookTime: item.cookTime,
        ingredients: cleanIngredients,
        instructions: cleanInstructions
        // description is intentionally omitted to save space and remove redundancy
      };
    });
    
    fs.writeFileSync(file, JSON.stringify(optimized, null, 2));
    console.log(`Optimized chunk_${i}.json (${optimized.length} recipes)`);
  }
}

console.log(`\nDone! Processed ${totalProcessed} recipes. Fixed ${totalFixed} recipes.`);
