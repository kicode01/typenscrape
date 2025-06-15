import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, ChefHat, Lightbulb, Utensils } from 'lucide-react';
import { ChefKico } from '@/components/ChefKico';

interface Recipe {
  name: string;
  description: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  ingredients: Array<{ name: string; amount: string }>;
  instructions: string[];
  tips: string[];
  suggestions: string[];
  relatedDishes: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white shadow-lg border-orange-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardTitle className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl">{recipe.name}</h2>
            <p className="text-orange-100 mt-2">{recipe.description}</p>
          </div>
          <ChefKico context="viewing-recipe" size="md" />
        </CardTitle>
        
        {/* Recipe Stats */}
        <div className="flex items-center space-x-6 mt-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{recipe.cookTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span className="text-sm">{recipe.servings}</span>
          </div>
          <Badge className={`${getDifficultyColor(recipe.difficulty)} border-0`}>
            {recipe.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Ingredients */}
        <div>
          <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
            <Utensils className="h-5 w-5 mr-2 text-orange-500" />
            Ingredients
          </h3>
          <div className="grid gap-2">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{ingredient.name}</span>
                <span className="font-medium text-gray-900">{ingredient.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Instructions */}
        <div>
          <h3 className="flex items-center justify-between text-lg font-semibold text-gray-800 mb-3">
            <div className="flex items-center">
              <ChefHat className="h-5 w-5 mr-2 text-orange-500" />
              Instructions
            </div>
            <div className="flex items-center space-x-2">
              <ChefKico context="viewing-recipe" size="sm" />
              <span className="text-xs text-orange-600">Need cooking tips?</span>
            </div>
          </h3>
          <div className="space-y-3">
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed">{instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        {recipe.tips.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Chef's Tips
              </h3>
              <div className="space-y-2">
                {recipe.tips.map((tip, index) => (
                  <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                    <p className="text-gray-700 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Suggestions */}
        {recipe.suggestions.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Ingredient Suggestions</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">To enhance this recipe, consider adding:</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.suggestions.map((suggestion, index) => (
                    <Badge key={index} variant="outline" className="border-blue-300 text-blue-700">
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Related Dishes */}
        {recipe.relatedDishes.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Related Dishes</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">With similar ingredients, you could also make:</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.relatedDishes.map((dish, index) => (
                    <Badge key={index} variant="outline" className="border-green-300 text-green-700">
                      {dish}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
