import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Plus, X, Lightbulb, Database } from 'lucide-react';
import { generateRecipeFromIngredients } from '@/utils/recipeGenerator';
import { recipeDataService } from '@/services/recipeDataService';
import { toast } from 'sonner';

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: any) => void;
  apiKey?: string;
}

export const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ onRecipeGenerated, apiKey }) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [preferences, setPreferences] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [databaseState, setDatabaseState] = useState(recipeDataService.getLoadingState());

  // Monitor database loading state
  useEffect(() => {
    const checkDatabaseState = () => {
      const state = recipeDataService.getLoadingState();
      setDatabaseState(state);
    };

    // Check initially and set up interval to monitor state
    checkDatabaseState();
    const interval = setInterval(checkDatabaseState, 500);

    // Trigger database loading
    recipeDataService.loadChunkedDatabase().then(() => {
      checkDatabaseState();
      clearInterval(interval);
    });

    return () => clearInterval(interval);
  }, []);

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    setIsGenerating(true);
    try {
      const recipe = await generateRecipeFromIngredients(ingredients, preferences, apiKey);
      onRecipeGenerated(recipe);
      toast.success('Recipe generated successfully!');
    } catch (error) {
      toast.error('Failed to generate recipe. Please try again.');
      console.error('Recipe generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const commonIngredients = [
    'Chicken', 'Rice', 'Onion', 'Garlic', 'Tomato', 'Pasta', 'Cheese', 'Eggs',
    'Potato', 'Carrot', 'Bell Pepper', 'Spinach', 'Mushroom', 'Beef', 'Fish'
  ];

  return (
    <Card className="bg-white shadow-lg border-orange-100">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6" />
          <span>Recipe Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Database Loading Status */}
        {databaseState.isLoading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-700">
              <Database className="h-4 w-4 animate-pulse" />
              <span className="text-sm">Loading recipe database...</span>
            </div>
          </div>
        )}

        {databaseState.error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-700">
              <Database className="h-4 w-4" />
              <span className="text-sm">Using basic recipe database (extended database failed to load)</span>
            </div>
          </div>
        )}

        {databaseState.isLoaded && !databaseState.isLoading && !databaseState.error && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700">
              <Database className="h-4 w-4" />
              <span className="text-sm">Full recipe database loaded successfully!</span>
            </div>
          </div>
        )}

        {/* Ingredient Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Add Your Ingredients
          </label>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter an ingredient..."
              value={currentIngredient}
              onChange={(e) => setCurrentIngredient(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={addIngredient} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Current Ingredients */}
          {ingredients.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                  <Badge
                    key={ingredient}
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 px-3 py-1"
                  >
                    {ingredient}
                    <button
                      onClick={() => removeIngredient(ingredient)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Add Suggestions */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Lightbulb className="h-4 w-4 inline mr-1" />
            Quick Add
          </label>
          <div className="flex flex-wrap gap-2">
            {commonIngredients
              .filter(ing => !ingredients.includes(ing))
              .slice(0, 8)
              .map((ingredient) => (
                <Button
                  key={ingredient}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIngredients([...ingredients, ingredient]);
                  }}
                  className="text-xs"
                >
                  + {ingredient}
                </Button>
              ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Preferences (Optional)
          </label>
          <Textarea
            placeholder="Any dietary restrictions, cuisine preferences, or cooking style? (e.g., vegetarian, Italian, quick meals, etc.)"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateRecipe}
          disabled={isGenerating || ingredients.length === 0}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-5 w-5 mr-2 animate-spin" />
              Generating Recipe...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Recipe
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
