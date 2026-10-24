import pandas as pd
import glob
import os
import math
import uuid

# Configuration
DATASET_DIR = "dataset"
OUTPUT_DIR = "public/data"
CHUNK_SIZE = 5000
MAX_TOTAL_RECIPES = 50000 # Limit to prevent browser OOM

print("Starting Recipe Dataset Compiler...")

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

dataframes = []

# 1. Load CSV
csv_path = os.path.join(DATASET_DIR, "general_recipes.csv")
if os.path.exists(csv_path):
    print(f"Loading CSV: {csv_path}")
    try:
        # Assuming Kaggle Food.com dataset structure
        df_csv = pd.read_csv(csv_path)
        dataframes.append(df_csv)
    except Exception as e:
        print(f"Error reading CSV: {e}")

# 2. Load Parquets
parquet_files = glob.glob(os.path.join(DATASET_DIR, "*.parquet"))
for pq_file in parquet_files:
    print(f"Loading Parquet: {pq_file}")
    try:
        df_pq = pd.read_parquet(pq_file)
        dataframes.append(df_pq)
    except Exception as e:
        print(f"Error reading Parquet: {e}")

if not dataframes:
    print("No datasets found!")
    exit(1)

# 3. Combine Data
print("Merging datasets...")
df = pd.concat(dataframes, ignore_index=True)

# 4. Standardize Columns (Make it "Smart")
# Different datasets have different column names, we try to catch them all.
print("Standardizing and cleaning data...")

# Name mapping
if 'Name' in df.columns:
    df['clean_name'] = df['Name']
elif 'name' in df.columns:
    df['clean_name'] = df['name']
elif 'title' in df.columns:
    df['clean_name'] = df['title']
else:
    df['clean_name'] = "Unnamed Recipe"

# Ingredients mapping
if 'RecipeIngredientParts' in df.columns:
    df['clean_ingredients'] = df['RecipeIngredientParts']
elif 'ingredients' in df.columns:
    df['clean_ingredients'] = df['ingredients']
elif 'Full Ingredients' in df.columns:
    df['clean_ingredients'] = df['Full Ingredients']
else:
    df['clean_ingredients'] = ""

# Instructions mapping
if 'RecipeInstructions' in df.columns:
    df['clean_instructions'] = df['RecipeInstructions']
elif 'instructions' in df.columns:
    df['clean_instructions'] = df['instructions']
elif 'directions' in df.columns:
    df['clean_instructions'] = df['directions']
else:
    df['clean_instructions'] = ""

# Times mapping
df['clean_prepTime'] = df.get('PrepTime', df.get('prep_time', ''))
df['clean_cookTime'] = df.get('CookTime', df.get('cook_time', ''))

# Extract only what we need for the web app
df_clean = df[['clean_name', 'clean_ingredients', 'clean_instructions', 'clean_prepTime', 'clean_cookTime']].copy()

# Drop rows where name or ingredients are completely missing
df_clean.dropna(subset=['clean_name', 'clean_ingredients'], inplace=True)

# 5. Deduplicate
print(f"Total rows before deduplication: {len(df_clean)}")
df_clean.drop_duplicates(subset=['clean_name'], keep='first', inplace=True)
print(f"Total rows after deduplication: {len(df_clean)}")

# Clean up formatting (e.g. remove pandas list artifacts like ['item1', 'item2'] -> item1, item2)
def clean_array_string(s):
    if not isinstance(s, str):
        return ""
    # Very basic cleanup of Kaggle stringified lists
    return s.replace("['", "").replace("']", "").replace("', '", "\\n").replace('["', "").replace('"]', "").replace('", "', "\\n")

df_clean['clean_ingredients'] = df_clean['clean_ingredients'].apply(clean_array_string)
df_clean['clean_instructions'] = df_clean['clean_instructions'].apply(clean_array_string)

# 6. Generate UUIDs and format as LocalRecipe
print("Generating final JSON structure...")
recipes = []
for index, row in df_clean.iterrows():
    # Only keep valid recipes
    if not isinstance(row['clean_name'], str) or len(row['clean_name'].strip()) < 2:
        continue
        
    recipes.append({
        "id": "r_" + str(uuid.uuid4())[:8],
        "name": str(row['clean_name']),
        "ingredients": str(row['clean_ingredients']),
        "description": str(row['clean_instructions'])[:200] + "...", # Small snippet
        "instructions": str(row['clean_instructions']), # Full text
        "prepTime": str(row['clean_prepTime']) if pd.notnull(row['clean_prepTime']) else "N/A",
        "cookTime": str(row['clean_cookTime']) if pd.notnull(row['clean_cookTime']) else "N/A"
    })
    
    # Cap total recipes to keep chunk sizes reasonable
    if len(recipes) >= MAX_TOTAL_RECIPES:
        break

print(f"Final valid recipe count: {len(recipes)}")

# 7. Chunk and Export
total_chunks = math.ceil(len(recipes) / CHUNK_SIZE)
# The frontend code looks for chunk_1.json to chunk_10.json, so limit to 10 chunks
max_export_chunks = min(total_chunks, 10)

print(f"Exporting to {max_export_chunks} chunks in {OUTPUT_DIR}...")
for i in range(max_export_chunks):
    chunk = recipes[i*CHUNK_SIZE : (i+1)*CHUNK_SIZE]
    chunk_file = os.path.join(OUTPUT_DIR, f"chunk_{i+1}.json")
    
    # Convert list of dicts to a pandas dataframe just for easy JSON export
    chunk_df = pd.DataFrame(chunk)
    chunk_df.to_json(chunk_file, orient="records")
    print(f"Created {chunk_file} with {len(chunk)} recipes")

print("Dataset compiled successfully!")
