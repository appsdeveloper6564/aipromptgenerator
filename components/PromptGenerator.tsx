import React, { useState } from 'react';
import { Copy, Share2, Save, Wand2, Loader2, Sparkles } from 'lucide-react';
import { generatePromptContent } from '../services/geminiService';
import { Prompt } from '../types';

interface Props {
  onSave: (prompt: Prompt) => void;
}

export const PromptGenerator: React.FC<Props> = ({ onSave }) => {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('ChatGPT');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const categories = [
    'ChatGPT', 'Coding', 'YouTube', 'Instagram', 'Automation', 
    'Minecraft', 'Thumbnail', 'Shorts', 'Midjourney'
  ];

  const tones = ['Professional', 'Creative', 'Funny', 'Persuasive', 'Academic', 'Casual'];

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    const content = await generatePromptContent(topic, category, tone);
    setResult(content);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert('Copied to clipboard!');
  };

  const handleSave = () => {
    if (!result) return;
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      title: `${category}: ${topic.substring(0, 30)}...`,
      content: result,
      category,
      tags: [tone],
      createdAt: Date.now(),
      isFavorite: false
    };
    onSave(newPrompt);
    alert('Prompt saved to library!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">AI Prompt Generator</h2>
        <p className="text-gray-500 dark:text-gray-400">Powered by Gemini Flash Lite for instant results</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6 bg-white dark:bg-brand-card p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                    category === c 
                      ? 'bg-brand-orange text-white border-brand-orange' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-brand-orange text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tone</label>
            <select 
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-purple outline-none"
            >
              {tones.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topic / Keyword</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g., A python script to scrape data from a website..."
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-purple outline-none h-32 resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full py-4 bg-gradient-to-r from-brand-orange to-brand-red text-white font-bold rounded-xl shadow-lg hover:shadow-brand-orange/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
            Generate Prompt
          </button>
        </div>

        {/* Output */}
        <div className="flex flex-col h-full bg-white dark:bg-brand-card p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Generated Result</label>
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 overflow-y-auto min-h-[300px] border border-gray-200 dark:border-gray-800">
            {result ? (
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200">{result}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8">
                <Sparkles size={48} className="mb-4 opacity-20" />
                <p>Your AI-crafted prompt will appear here.</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex gap-3">
            <button 
              onClick={handleCopy}
              disabled={!result}
              className="flex-1 py-2 px-4 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Copy size={18} /> Copy
            </button>
            <button 
              onClick={handleSave}
              disabled={!result}
              className="flex-1 py-2 px-4 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Save size={18} /> Save
            </button>
            <button 
              disabled={!result}
              className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};