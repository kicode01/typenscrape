import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FirebaseStatus } from '@/components/FirebaseStatus';
import { Settings, Database, HardDrive, Smartphone, CheckCircle2, Info, Sun, Moon, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useLiteMode } from '@/hooks/useLiteMode';
import { toast } from 'sonner';

interface SettingsViewProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme, setTheme }) => {
  const { isLiteMode, setIsLiteMode } = useLiteMode();
  return (
    <div className="p-4 space-y-5 pb-6 font-runde animate-fade-up">
      <div className="flex items-center space-x-2">
        <Settings className="h-5 w-5 text-orange-500" />
        <h2 className="text-xl font-extrabold text-theme-text tracking-tight">System &amp; Storage</h2>
      </div>

      {/* Theme Appearance Mode Switcher */}
      <Card className="glass-panel rounded-3xl border-[length:var(--theme-border-width)] border-theme-border shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 text-theme-text opacity-90">
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Appearance Theme</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
              className={`rounded-2xl text-xs font-bold flex items-center space-x-2 h-11 ${
                theme === 'light'
                  ? 'bg-theme-primary text-theme-panel shadow-[var(--theme-box-shadow)] hover:brightness-110 border-transparent'
                  : 'bg-theme-panel text-theme-text border-[length:var(--theme-border-width)] border-theme-border'
              }`}
            >
              <Sun className="h-4 w-4 text-amber-500" />
              <span>Light Mode</span>
            </Button>

            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
              className={`rounded-2xl text-xs font-bold flex items-center space-x-2 h-11 ${
                theme === 'dark'
                  ? 'bg-theme-primary text-theme-panel shadow-[var(--theme-box-shadow)] hover:brightness-110 border-transparent'
                  : 'bg-theme-panel text-theme-text border-[length:var(--theme-border-width)] border-theme-border'
              }`}
            >
              <Moon className="h-4 w-4 text-indigo-400" />
              <span>Dark Mode</span>
            </Button>
          </div>

          {/* Lite Mode Toggle */}
          <div className="mt-4 p-3 rounded-2xl bg-theme-bg/50 border border-theme-border/50 flex items-center justify-between">
            <div>
              <h3 className="text-[11px] font-black text-theme-text uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-orange-500" />
                Lite Mode
              </h3>
              <p className="text-[10px] text-theme-icon font-bold">
                Optimize performance for budget devices.
              </p>
            </div>
            <Switch 
              checked={isLiteMode} 
              onCheckedChange={setIsLiteMode} 
              className="data-[state=checked]:bg-theme-primary data-[state=unchecked]:bg-theme-border scale-90"
            />
          </div>
        </CardContent>
      </Card>

      {/* Network & Cloud DB Connection */}
      <Card className="glass-panel rounded-3xl border-[length:var(--theme-border-width)] border-theme-border shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 text-theme-text opacity-90">
            <Database className="h-4 w-4 text-orange-500" />
            <span>Connection &amp; Cloud Sync</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-theme-text opacity-70">
          <FirebaseStatus />
          <p className="leading-relaxed">
            TypenScrape operates with a dual architecture: local IndexedDB engine for instant offline response, synchronized with Firebase Cloud database.
          </p>
        </CardContent>
      </Card>

      {/* Offline Storage Engine */}
      <Card className="glass-panel rounded-3xl border-[length:var(--theme-border-width)] border-theme-border shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 text-theme-text opacity-90">
            <HardDrive className="h-4 w-4 text-purple-500" />
            <span>Offline Storage Engine</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-theme-text opacity-70">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            <span>IndexedDB Multi-Entry Index Active</span>
          </div>
          <p className="leading-relaxed">
            Local recipe datasets are indexed directly in browser memory, enabling sub-10ms ingredient lookups without internet.
          </p>
        </CardContent>
      </Card>

      {/* PWA App Info */}
      <Card className="glass-panel rounded-3xl border-theme-border border-[length:var(--theme-border-width)] shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 text-theme-text opacity-90">
            <Smartphone className="h-4 w-4 text-blue-500" />
            <span>PWA Installation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-theme-text opacity-70 leading-relaxed">
            Install TypenScrape to your Home Screen or Desktop for standalone native execution.
          </p>
          <Button
            onClick={() => toast.info('Use your browser menu and select Add to Home Screen or Install App.', { icon: <Info className="h-4 w-4 text-blue-500" /> })}
            variant="outline"
            className="w-full text-xs bg-theme-panel text-theme-text border-theme-border border-[length:var(--theme-border-width)] hover:text-orange-600"
          >
            Installation Guide
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
