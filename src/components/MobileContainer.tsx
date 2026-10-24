import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  return (
    <div className="app-bg h-[100dvh] flex justify-center items-start transition-colors duration-500 overflow-hidden">
      {/* Fluid Container: Mobile full-width, Desktop centered responsive view */}
      <div className="w-full max-w-4xl h-[100dvh] bg-transparent relative flex flex-col md:my-6 md:rounded-3xl md:h-[90vh] border-x md:border border-theme-border transition-colors duration-500 overflow-hidden">
        {children}
      </div>
    </div>
  );
};
