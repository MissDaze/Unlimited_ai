import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, Copy, Check } from 'lucide-react';

interface CodeAssistantProps {
  modelId: string;
  apiKey: string;
}

const LANGUAGES = [
  'javascript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift'
];

const CodeAssistant: React.FC<CodeAssistantProps> = ({ modelId, apiKey }) => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateCode = async () => {
    if (!prompt.trim() || !apiKey) return;
    
    setLoading(true);
    
    try {
      const systemPrompt = `You are a coding assistant. Generate clean, well-commented ${language} code based on the user's request. Only return the code without explanations.`;
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Multi-Model App'
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ]
        })
      });
      
      const data = await response.json();
      
      if (data.choices?.[0]?.message) {
        setGeneratedCode(data.choices[0].message.content);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          Code Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        <div className="space-y-3">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what code you need..."
            className="min-h-20"
          />
          
          <Button onClick={generateCode} disabled={loading || !prompt.trim() || !apiKey} className="w-full">
            {loading ? 'Generating...' : 'Generate Code'}
          </Button>
        </div>
        
        {generatedCode && (
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Generated Code:</h3>
              <Button onClick={copyCode} variant="outline" size="sm">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm max-h-96">
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeAssistant;