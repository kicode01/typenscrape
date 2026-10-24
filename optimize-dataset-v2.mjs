import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

console.log('Scanning and optimizing dataset chunks (v2)...');

function repairInstructionsV2(instructionsArray) {
  if (!instructionsArray || instructionsArray.length === 0) return [];
  // Join the array into a single string with spaces, normalizing whitespace
  const joined = instructionsArray.join(' ').replace(/\s+/g, ' ');
  // Split by period, exclamation, question mark, or colon followed by space and then a Capital letter or digit
  const sentences = joined.split(/(?<=[.!?:])\s+(?=[A-Z0-9])/);
  return sentences.map(s => s.trim()).filter(s => s.length > 0);
}

let totalProcessed = 0;

for (let i = 1; i <= 10; i++) {
  const file = path.join(DATA_DIR, `chunk_${i}.json`);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    const optimized = data.map(item => {
      totalProcessed++;
      
      const cleanInstructions = repairInstructionsV2(item.instructions);
      
      return {
        ...item,
        instructions: cleanInstructions
      };
    });
    
    fs.writeFileSync(file, JSON.stringify(optimized, null, 2));
    console.log(`Optimized chunk_${i}.json (${optimized.length} recipes)`);
  }
}

console.log(`\nDone! Processed ${totalProcessed} recipes.`);
