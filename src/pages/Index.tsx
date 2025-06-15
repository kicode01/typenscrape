import React, { useState } from 'react';
import { RecipeGenerator } from '@/components/RecipeGenerator';
import { RecipeCard } from '@/components/RecipeCard';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { ChefHat, Sparkles, Utensils, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/cef3f1b2-69eb-49e3-89aa-4cac84df549a.png" alt="TypenScrape Logo" className="h-14 w-14 rounded-xl" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TypenScrape</h1>
                <p className="text-gray-600">Type your cravings. Scrape your next meal.</p>
              </div>
            </div>
            
            {/* AI Enhancement Dialog Trigger */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2 border-orange-200 hover:bg-orange-50">
                  <Zap className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-600 font-medium">AI Enhancement (Optional)</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2 text-orange-800">
                    <Zap className="h-5 w-5" />
                    <span>AI Enhancement (Optional)</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    This app works completely offline with a built-in recipe database. 
                    For enhanced AI-powered responses and more creative recipes, you can optionally add a Google Gemini API key.
                  </p>
                  <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Create Amazing Recipes from
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"> Any Ingredients</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Just type what you have. We’ll scrape and build a recipe that works for your taste, time, and kitchen.
            </p>
            <div className="flex items-center justify-center space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <Utensils className="h-5 w-5" />
                <span>Millions of Recipe Combinations</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChefHat className="h-5 w-5" />
                <span>Step-by-Step Instructions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Smart Cooking Tips</span>
              </div>
            </div>
          </div>

          {/* Recipe Generator */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <RecipeGenerator 
                onRecipeGenerated={setGeneratedRecipe} 
                apiKey={apiKey}
              />
            </div>
            <div>
              {generatedRecipe ? (
                <RecipeCard recipe={generatedRecipe} />
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
                  <div className="text-center text-gray-500">
                    <ChefHat className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2">Your Recipe Will Appear Here</h3>
                    <p>Enter your ingredients and we'll create something amazing for you!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3">
              <img src="/lovable-uploads/cef3f1b2-69eb-49e3-89aa-4cac84df549a.png" alt="TypenScrape Logo" className="h-10 w-10 rounded-lg" />
              <span className="text-2xl font-bold">TypenScrape</span>
            </div>
            <p className="text-gray-400 mt-4 text-sm">
              © 2025 TypenScrape. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
