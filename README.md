# TypenScrape

> **The Intelligent, Offline-First Pocket Sous-Chef.**  
> Transform what’s in your pantry into chef-caliber meals—instantly, intelligently, and completely offline.

[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Offline First](https://img.shields.io/badge/Storage-IndexedDB_Chunked-emerald.svg)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
[![AI Architecture](https://img.shields.io/badge/AI-Groq_Llama3_%C3%97_Gemini-purple.svg)](https://groq.com)
[![Sync](https://img.shields.io/badge/Cloud-Firebase_Firestore-orange.svg)](https://firebase.google.com)
[![License](https://img.shields.io/badge/License-MIT-gray.svg)](LICENSE)

---

## Overview

Most recipe apps are bloated, ad-ridden, and completely useless the moment your phone loses signal in a grocery aisle or a rural kitchen. **TypenScrape** is built differently: a mobile-first, zero-friction culinary companion that puts an entire searchable recipe catalog and a generative AI executive chef directly in your pocket.

Whether you're trying to prevent food waste using leftover ingredients, exploring authentic Filipino heritage cuisine, or leveling up your cooking skills with RPG-inspired dish mastery, TypenScrape delivers instant results with zero lag.

---

## Key Capabilities

### 🧠 Dual-Engine Generative AI Chef
TypenScrape features an intelligent sous-chef powered by a multi-LLM orchestration layer designed for instant generation:
* **Sub-Second Latency with Fallback**: Queries ultra-fast Groq (Llama 3) for instantaneous recipe generation, seamlessly failing over to Google Gemini if network conditions or rate limits dictate.
* **Michelin-Grade Culinary Logic**: Understands chemical flavor pairings and automatically introduces essential pantry staples (oils, acids, aromatics, seasoning) to make random ingredient lists taste exceptional.
* **Smart Gibberish & Inedible Filtering**: Actively rejects random typing, inedible objects, and nonsensical input to keep outputs safe and grounded.
* **Bilingual Fluency**: Generates complete recipes and techniques in both English and fluent Filipino (Tagalog).

---

### ⚡ True Offline-First Architecture
Never worry about losing kitchen connectivity. TypenScrape is engineered to work reliably off-the-grid:
* **Chunked Micro-Database**: 16 optimized data bundles stream sequentially into the browser's local IndexedDB, providing thousands of recipes without causing memory spikes or crashing low-end smartphones.
* **Instant In-Memory Search**: Search dishes by name, primary ingredients, or cooking styles with zero network round-trips.
* **Virtualized Performance**: TanStack Virtual scrolling ensures silky-smooth 60 FPS list performance, even when navigating extensive collections.

---

### 🎮 RPG-Style Culinary Gamification
Cooking should be an adventure. TypenScrape turns meal preparation into an engaging progression system:
* **Dish Rarity Tiers**: Every custom-generated dish is scored and classified as **Common**, **Rare**, **Epic**, or **Legendary** based on culinary complexity and flavor harmony.
* **Four-Point Culinary Radar**: Visual stat breakdowns evaluate every recipe across **Prep Speed**, **Health Balance**, **Flavor Intensity**, and **Budget Efficiency**.
* **Chef XP & Rank Mastery**: Earn experience points for discovering recipes, cooking meals, and curating collections, advancing your status along an interactive culinary roadmap.

---

### 🇵🇭 Heritage Dishes & Global Database
* **Curated Filipino Recipe Corpus**: Dedicated access to authentic Philippine culinary traditions—from classic Adobos and sour Sinigangs to regional street foods and celebration feasts.
* **Global Recipe Integration**: Structured ingredient specifications and standardized culinary techniques powered by extensive datasets and Spoonacular integration.

---

### 📱 Native-Grade Mobile Experience (PWA)
* **Installable Anywhere**: Add TypenScrape directly to your iOS or Android home screen with zero app store friction, running in a clean, standalone viewport.
* **Neomorphic & High-Contrast Themes**: Thoughtfully styled with customizable light and dark themes, tactile visual cues, and accessible contrast levels designed for wet hands and steamy kitchen environments.
* **Audio & Haptic Feedback**: Tactile interaction designed specifically for mobile ergonomics.

---

### ☁️ Privacy-First Sync & Local Independence
* **100% Functional Guest Mode**: No mandatory signup or credit card required. All favorites, history, and XP persist locally on your device by default.
* **Optional Cloud Synchronization**: Sign in anytime with Google to automatically merge and synchronize favorites, history, custom settings, and earned XP across all your devices via Firebase Firestore.

---

## Feature Comparison Matrix

| Feature | TypenScrape | Standard Recipe Blogs | Generic Cooking Apps |
| :--- | :---: | :---: | :---: |
| **Offline Search & Browsing** | **Yes (IndexedDB)** | No | Limited / Paid Tier |
| **Pantry Ingredient Generation** | **Dual AI (Groq + Gemini)** | No | Rule-based Search |
| **Ad-Free Clean Interface** | **Yes (100% Clean)** | No (Heavy Ads & Trackers) | In-App Ads |
| **Filipino Regional Cuisine** | **Native Curated Corpus** | Rare | Basic / Americanized |
| **Gamified RPG Stats & XP** | **Yes** | No | No |
| **Memory Footprint** | **Chunked (< 7 MB active)** | Heavy (Web scripts) | Heavy (Native bundles) |
| **Works Without Account** | **Yes (Local First)** | Yes (With tracking) | Mandatory Registration |

---

## Design & Performance Philosophy

1. **Ingredients First, Life Stories Never**: No 2,000-word blog intros or endless scrolling past affiliate links. Every recipe begins immediately with prep times, measurements, and actionable steps.
2. **Accessible to Every Device**: Built to run fluidly on budget smartphones and intermittent 3G connections. Peak RAM usage is strictly managed through sequential chunk hydration.
3. **Data Sovereignty**: Your culinary history and saved favorites belong to you—stored locally in your browser and synced to the cloud only when you choose.

---

<p align="center">
  Crafted with care for food lovers, home cooks, and late-night pantry adventurers.
</p>
