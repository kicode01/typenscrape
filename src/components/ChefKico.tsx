
import React, { useState } from 'react';
import { ChefHat } from 'lucide-react';
import { ChefKicoDialog } from './ChefKicoDialog';
import { ChefTip } from '@/data/chefTips';

interface ChefKicoProps {
  context?: ChefTip['context'];
  position?: 'floating' | 'inline';
  size?: 'sm' | 'md' | 'lg';
}

export const ChefKico: React.FC<ChefKicoProps> = ({ 
  context = 'general', 
  position = 'inline',
  size = 'md'
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-12 h-12';
      case 'md': return 'w-16 h-16';
      case 'lg': return 'w-20 h-20';
      default: return 'w-16 h-16';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-5 w-5';
      case 'md': return 'h-6 w-6';
      case 'lg': return 'h-8 w-8';
      default: return 'h-6 w-6';
    }
  };

  const baseClasses = `
    ${getSizeClasses()}
    bg-gradient-to-r from-orange-500 to-red-500 
    rounded-full 
    flex items-center justify-center 
    cursor-pointer 
    transition-all duration-300 
    hover:scale-110 hover:shadow-lg 
    active:scale-95
    group
    relative
  `;

  const positionClasses = position === 'floating' 
    ? 'fixed bottom-6 right-6 z-50 shadow-xl' 
    : '';

  return (
    <>
      <div 
        className={`${baseClasses} ${positionClasses}`}
        onClick={() => setIsDialogOpen(true)}
        title="Click me for cooking tips and fun facts!"
      >
        <ChefHat className={`${getIconSize()} text-white group-hover:animate-bounce`} />
        
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 animate-ping opacity-20"></div>
        
        {/* Tooltip for larger sizes */}
        {size !== 'sm' && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Hi! I'm Chef Kico 👋
          </div>
        )}
      </div>

      <ChefKicoDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        context={context}
      />
    </>
  );
};
