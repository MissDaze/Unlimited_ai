import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Download, Loader2 } from 'lucide-react';

interface ImageGeneratorProps {
  modelId: string;
  apiKey: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ modelId, apiKey }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim() || !apiKey) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Multi-Model App'
        },
        body: JSON.stringify({
          model: modelId,
          prompt: prompt,
          n: 1,
          size: '1024x1024'
        })
      });
      
      const data = await response.json();
      
      if (data.data?.[0]?.url) {
        setGeneratedImage(data.data[0].url);
      } else if (data.error) {
        setError(data.error.message || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Image Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && generateImage()}
          />
          <Button onClick={generateImage} disabled={loading || !prompt.trim() || !apiKey}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
          </Button>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {generatedImage && (
          <div className="space-y-3">
            <div className="relative">
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="w-full rounded-lg shadow-lg max-h-96 object-contain"
              />
            </div>
            <Button onClick={downloadImage} variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Image
            </Button>
          </div>
        )}
        
        {!generatedImage && !loading && (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Generated image will appear here</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageGenerator;