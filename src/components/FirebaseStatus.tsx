import React, { useState, useEffect } from 'react';
import { isFirebaseConfigured } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { Cloud, Wifi, WifiOff } from 'lucide-react';

export const FirebaseStatus: React.FC = () => {
  const firebaseConnected = isFirebaseConfigured();
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center space-x-1.5 font-runde">
      {isOnline ? (
        <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30 flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-bold rounded-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 status-pulse inline-block" />
          <Wifi className="h-3 w-3" />
          <span>Online</span>
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-violet-50 dark:bg-purple-500/10 text-violet-700 dark:text-purple-300 border-violet-300 dark:border-purple-500/30 flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-bold rounded-xl">
          <WifiOff className="h-3 w-3" />
          <span>Offline PWA</span>
        </Badge>
      )}

      {firebaseConnected && isOnline && (
        <Badge variant="outline" className="bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-500/30 flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-bold rounded-xl">
          <Cloud className="h-3 w-3" />
          <span>Cloud DB</span>
        </Badge>
      )}
    </div>
  );
};
