
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Sparkles, RotateCcw, Heart } from 'lucide-react';
import { ChefTip, getRandomTip, getTipsByCategory } from '@/data/chefTips';

interface ChefKicoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  context?: ChefTip['context'];
}

export const ChefKicoDialog: React.FC<ChefKicoDialogProps> = ({
  isOpen,
  onClose,
  context = 'general'
}) => {
  const [currentTip, setCurrentTip] = useState<ChefTip>(() => getRandomTip(context));
  const [selectedCategory, setSelectedCategory] = useState<ChefTip['category'] | null>(null);

  const getNextTip = () => {
    const newTip = selectedCategory 
      ? getTipsByCategory(selectedCategory)[Math.floor(Math.random() * getTipsByCategory(selectedCategory).length)]
      : getRandomTip(context);
    setCurrentTip(newTip);
  };

  const selectCategory = (category: ChefTip['category']) => {
    setSelectedCategory(category);
    const categoryTips = getTipsByCategory(category);
    const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)];
    setCurrentTip(randomTip);
  };

  const resetToRandom = () => {
    setSelectedCategory(null);
    setCurrentTip(getRandomTip(context));
  };

  const getCategoryIcon = (category: ChefTip['category']) => {
    switch (category) {
      case 'technique': return '🔪';
      case 'ingredient': return '🥕';
      case 'kitchen-hack': return '💡';
      case 'fun-fact': return '🤔';
      case 'history': return '📚';
      case 'encouragement': return '❤️';
      default: return '👨‍🍳';
    }
  };

  const getCategoryColor = (category: ChefTip['category']) => {
    switch (category) {
      case 'technique': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ingredient': return 'bg-green-100 text-green-800 border-green-300';
      case 'kitchen-hack': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'fun-fact': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'history': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'encouragement': return 'bg-pink-100 text-pink-800 border-pink-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const categories: { key: ChefTip['category']; label: string }[] = [
    { key: 'technique', label: 'Techniques' },
    { key: 'ingredient', label: 'Ingredients' },
    { key: 'kitchen-hack', label: 'Kitchen Hacks' },
    { key: 'fun-fact', label: 'Fun Facts' },
    { key: 'history', label: 'Food History' },
    { key: 'encouragement', label: 'Motivation' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span>Chef Kico's Kitchen Wisdom</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Browse by category:</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant="outline"
                  size="sm"
                  onClick={() => selectCategory(category.key)}
                  className={`text-xs ${selectedCategory === category.key ? 'ring-2 ring-orange-500' : ''}`}
                >
                  {getCategoryIcon(category.key)} {category.label}
                </Button>
              ))}
              {selectedCategory && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToRandom}
                  className="text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Random
                </Button>
              )}
            </div>
          </div>

          {/* Current Tip */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <Badge className={getCategoryColor(currentTip.category)}>
                {getCategoryIcon(currentTip.category)} {currentTip.category.replace('-', ' ')}
              </Badge>
              <div className="text-4xl">👨‍🍳</div>
            </div>
            
            <p className="text-gray-800 text-lg leading-relaxed mb-4">
              "{currentTip.tip}"
            </p>
            
            <div className="flex items-center text-sm text-gray-600">
              <Heart className="h-4 w-4 mr-1 text-red-500" />
              <span>- Chef Kico</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              onClick={getNextTip}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Another Tip</span>
            </Button>
            
            <Button onClick={onClose} className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              Thanks, Chef Kico!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
