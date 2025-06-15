
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Info, Eye, EyeOff } from 'lucide-react';

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
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-blue-800">
          <Key className="h-5 w-5" />
          <span>AI Enhancement (Optional)</span>
          {apiKey && <Badge className="bg-green-100 text-green-800">Connected</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-blue-700 mb-3">
              This app works completely offline with a built-in recipe database. 
              For enhanced AI-powered responses and more creative recipes, you can optionally add an OpenAI API key.
            </p>
            
            {!apiKey ? (
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
            ) : (
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
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
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
