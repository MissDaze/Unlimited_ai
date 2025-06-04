import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface AIModel {
  id: string;
  name: string;
  category: 'chat' | 'code' | 'image';
  description: string;
}

const AI_MODELS: AIModel[] = [
  { id: 'mistral-7b-instruct', name: 'Mistral 7B Instruct', category: 'chat', description: 'General purpose chat model' },
  { id: 'codellama-34b-instruct', name: 'CodeLlama 34B', category: 'code', description: 'Code generation and assistance' },
  { id: 'llama-3.1-8b-instruct', name: 'Llama 3.1 8B', category: 'chat', description: 'Advanced conversational AI' },
  { id: 'stable-diffusion-xl', name: 'Stable Diffusion XL', category: 'image', description: 'High-quality image generation' },
  { id: 'deepseek-coder-33b', name: 'DeepSeek Coder', category: 'code', description: 'Specialized coding assistant' },
  { id: 'nous-hermes-2-mixtral', name: 'Nous Hermes 2', category: 'chat', description: 'Intelligent conversation model' }
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const selectedModelData = AI_MODELS.find(m => m.id === selectedModel);
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'chat': return 'bg-blue-100 text-blue-800';
      case 'code': return 'bg-green-100 text-green-800';
      case 'image': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-2">
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select AI Model" />
        </SelectTrigger>
        <SelectContent>
          {AI_MODELS.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(model.category)}>
                  {model.category}
                </Badge>
                <span>{model.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedModelData && (
        <p className="text-sm text-gray-600">{selectedModelData.description}</p>
      )}
    </div>
  );
};

export default ModelSelector;
export { AI_MODELS };