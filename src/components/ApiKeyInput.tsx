
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey }) => {
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState('');

  const handleSave = () => {
    setApiKey(tempKey);
    setTempKey('');
  };

  const handleClear = () => {
    setApiKey('');
    setTempKey('');
  };

  return (
    <div className="space-y-4">
      {apiKey && (
        <div className="flex items-center justify-center">
          <Badge className="bg-green-100 text-green-800 border-green-300">Connected</Badge>
        </div>
      )}
      
      {!apiKey ? (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                type={showKey ? 'text' : 'password'}
                placeholder="sk-..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button onClick={handleSave} disabled={!tempKey.trim()}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
            <span className="text-sm text-gray-600">
              API Key: {showKey ? apiKey : '•'.repeat(20)}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
