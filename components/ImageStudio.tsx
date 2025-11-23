import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Wand2, Loader2, Download } from 'lucide-react';
import { editImageWithPrompt } from '../services/geminiService';

export const ImageStudio: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt) return;

    setLoading(true);
    // Strip header from base64 for API
    const base64Data = selectedImage.split(',')[1];
    
    try {
      const newImage = await editImageWithPrompt(base64Data, prompt);
      if (newImage) {
        setResultImage(newImage);
      } else {
        alert("Could not generate image edit.");
      }
    } catch (e) {
      alert("Error editing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Magic Image Editor</h2>
        <p className="text-gray-500 dark:text-gray-400">Upload an image and use text commands to edit it using Gemini Nano Banana</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-brand-orange transition-colors bg-white dark:bg-brand-card"
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Original" className="h-full w-full object-contain rounded-xl" />
            ) : (
              <div className="text-center p-6">
                <Upload className="mx-auto mb-2 text-gray-400" size={40} />
                <p className="text-sm text-gray-500">Click to upload image</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Edit Instruction</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Make it look like a sketch, Remove background..."
                className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-brand-card border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-brand-purple outline-none dark:text-white"
              />
              <button
                onClick={handleEdit}
                disabled={!selectedImage || !prompt || loading}
                className="px-6 bg-gradient-to-r from-brand-orange to-brand-red text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-brand-card rounded-2xl h-[400px] flex items-center justify-center relative overflow-hidden shadow-xl">
          {resultImage ? (
            <div className="relative w-full h-full group">
              <img src={resultImage} alt="Result" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a 
                  href={resultImage} 
                  download="edited-image.png"
                  className="px-6 py-3 bg-white text-black rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Download size={20} /> Download
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
              <p>Edited image will appear here</p>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-10">
              <Loader2 size={48} className="animate-spin mb-4 text-brand-orange" />
              <p className="animate-pulse">Processing pixel data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
