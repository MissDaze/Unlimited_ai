import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, Code, Image, AlertCircle } from 'lucide-react';
import ModelSelector, { AI_MODELS } from './ModelSelector';
import ApiKeyDialog from './ApiKeyDialog';
import AIChat from './AIChat';
import CodeAssistant from './CodeAssistant';
import ImageGenerator from './ImageGenerator';

const AIModelApp: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('mistral-7b-instruct');
  const [apiKey, setApiKey] = useState('');
  
  const selectedModelData = AI_MODELS.find(m => m.id === selectedModel);
  const activeTab = selectedModelData?.category || 'chat';
  
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Multi-Model Studio</h1>
              <p className="text-gray-600">Powered by OpenRouter - Multiple AI models for all your needs</p>
            </div>
            <ApiKeyDialog apiKey={apiKey} onApiKeyChange={setApiKey} />
          </div>
          
          {!apiKey && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please configure your OpenRouter API key to use the AI models.
              </AlertDescription>
            </Alert>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Model Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <ModelSelector 
                selectedModel={selectedModel} 
                onModelChange={handleModelChange} 
              />
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Image
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="mt-6">
            <AIChat modelId={selectedModel} apiKey={apiKey} />
          </TabsContent>
          
          <TabsContent value="code" className="mt-6">
            <CodeAssistant modelId={selectedModel} apiKey={apiKey} />
          </TabsContent>
          
          <TabsContent value="image" className="mt-6">
            <ImageGenerator modelId={selectedModel} apiKey={apiKey} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIModelApp;