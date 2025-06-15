
import React, { useState } from 'react';
import { RecipeGenerator } from '@/components/RecipeGenerator';
import { RecipeCard } from '@/components/RecipeCard';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { ChefHat, Sparkles, Utensils } from 'lucide-react';

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
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Recipe Wizard</h1>
                <p className="text-gray-600">Transform ingredients into culinary magic</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-orange-600">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">AI-Powered Recipes</span>
            </div>
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
              Just tell us what ingredients you have, and our AI chef will create delicious recipes with detailed instructions, 
              measurements, and helpful suggestions to make your cooking experience amazing.
            </p>
            <div className="flex items-center justify-center space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <Utensils className="h-5 w-5" />
                <span>1000+ Recipe Combinations</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChefHat className="h-5 w-5" />
                <span>Professional Instructions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>AI-Enhanced Suggestions</span>
              </div>
            </div>
          </div>

          {/* API Key Input */}
          <div className="mb-8">
            <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
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
                    <p>Enter your ingredients and let our AI chef create something amazing for you!</p>
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
            <div className="flex items-center justify-center space-x-3 mb-4">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold">Recipe Wizard</span>
            </div>
            <p className="text-gray-400 mb-6">
              Transforming simple ingredients into extraordinary culinary experiences
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <span>• Works Offline</span>
              <span>• AI-Powered</span>
              <span>• Unlimited Recipes</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
