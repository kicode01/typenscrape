# Hyperframes Composition Brief: TypenScrape

## Objective
Create a short, high-energy launch video for TypenScrape highlighting its offline pantry-to-recipe AI forge, anti-bloat philosophy ("Ingredients first, life stories never"), and RPG dish mastery progression.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080 (30fps)
- Duration: 20 seconds

## Source Material
- Project root: `.`
- Primary files read: `README.md`, `package.json`, `index.html`, `src/index.css`, `src/components/RecipeGenerator.tsx`, `src/components/RecipeCard.tsx`
- Product name: TypenScrape
- Tagline / strongest claim: "Ingredients first. Life stories never."
- Key UI or visual moment to recreate:
  - Tactile neobrutalist Carinderia cards with `4px 4px 0px #1C1917` shadows
  - Pantry ingredient picker (Beef STR Build, Garlic, Soy Sauce, Vinegar)
  - Dual-Engine AI Chef calculation ("Forging base ingredients...", "Calculating flavor synergies...")
  - Legendary Recipe Card unbox (+250 Chef XP, Culinary Radar, step checklist)
- Copy that must appear verbatim:
  - "Ingredients first. Life stories never."
  - "Beef (STR Build)"
  - "Forging base ingredients..."
  - "Calculating flavor synergies..."
  - "Classic Beef Adobo"
  - "Legendary Dish"
  - "+250 Chef XP"
  - "100% Offline (IndexedDB)"

## Creative Direction
- Tone preset: `default`
- Creative direction: "The anti-bloat culinary RPG"
- Interpretation: Fast-paced, punchy, tactile, humorous anti-bloat opening transitioning into a satisfying, gamified recipe forge.
- Angle: From pantry scraps to Michelin-grade legendary meals with zero blog stories, zero ads, and zero wifi needed.
- Hook: An overblown recipe blog narrative slammed away by "INGREDIENTS FIRST. LIFE STORIES NEVER."
- Outro / punchline: "Transform your pantry. Master the kitchen. TypenScrape."
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign

## Visual Identity
- Background: `#FAFAF9` (Carinderia warm cream) and `#1C1917` (Midnight charcoal for AI forge)
- Text: `#1C1917` (light) / `#FAFAF9` (dark)
- Accent: `#F97316` (Carinderia orange) / `#EA580C`
- Secondary Accent: `#10B981` (Palengke emerald) & `#F59E0B` (Legendary Gold)
- Display font: `'Nunito', 'Space Grotesk', system-ui, sans-serif`
- Body font: `'Inter', system-ui, sans-serif`
- Visual references from the project:
  - Neobrutalist tactile cards with 2px/3px black borders and 4px offset hard shadows (`box-shadow: 4px 4px 0px #1C1917`)
  - RPG build tags ("STR Build", "Balanced", "Speed Build")
  - Gold foil shine effect on Legendary badge

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract:
1. Scene 1 (0.0s - 3.5s): Anti-Blog Hook — "Ingredients first. Life stories never."
2. Scene 2 (3.5s - 8.5s): The Pantry Forge — Selecting leftover ingredients into the forge.
3. Scene 3 (8.5s - 12.0s): Dual-Engine AI Forge — Groq Llama 3 × Gemini calculating flavor synergies.
4. Scene 4 (12.0s - 17.0s): Legendary Unbox — Classic Beef Adobo, +250 XP, Culinary Radar, and instant recipe steps.
5. Scene 5 (17.0s - 20.0s): Outro — 100% Offline, Zero Ads, Installable PWA.

## Audio
- Audio role: Upbeat, driving acoustic/electronic track with crisp interface pops and a celebratory level-up chime.
- Audio arc: Bouncy rhythm through the hook and ingredient selection, energetic pulsing build during AI calculation, explosive brass/triumph on the legendary dish unbox, and a warm logo resolve.
- Music: `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3`
- Music treatment: Full track from 0.0s, fade out at 19.5s.
- Music cue guidance: 120.19 BPM. Strong cues at 8.02s, 12.02s, 16.02s, 18.52s.
- SFX files to use:
  - `impactBell_heavy_000.ogg` (or similar triumphant chime for Legendary unlock)
  - `drop_001.ogg` / `select_001.ogg` (for ingredient selections)
  - `switch_001.ogg` / `tick_001.ogg` (for XP count-up)
- Audio files destination: `<output-dir>/composition/assets/`

## Hyperframes Instructions
- Scaffolding: Create the composition in `brag-output/composition/`
- Structure: Standard Hyperframes HTML/CSS composition with GSAP / CSS keyframes and `data-*` timeline attributes.
- Ensure all text passes WCAG contrast.
- Keep creation and rendering local. Run `npx hyperframes check` and render with `npx hyperframes render`.
