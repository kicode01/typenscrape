
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Eye, EyeOff } from 'lucide-react';

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
    <div className="flex items-center space-x-2">
      {!apiKey ? (
        <>
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder="Enter Gemini API Key"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              className="pr-10 min-w-48"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Button onClick={handleSave} disabled={!tempKey.trim()} size="sm">
            <Key className="h-4 w-4 mr-1" />
            Save
          </Button>
        </>
      ) : (
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-800">
            <Key className="h-3 w-3 mr-1" />
            Gemini Connected
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowKey(!showKey)}
            className="px-2"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} className="px-2">
            Remove
          </Button>
          {showKey && (
            <span className="text-xs text-gray-600 max-w-32 truncate">
              {apiKey}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
