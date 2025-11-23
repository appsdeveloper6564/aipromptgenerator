import React from 'react';
import { AppView } from '../types';
import { ArrowRight, Youtube, Code, Zap, Grid, Shield, TrendingUp } from 'lucide-react';

interface Props {
  onChangeView: (view: AppView) => void;
}

export const Home: React.FC<Props> = ({ onChangeView }) => {
  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Hero */}
      <div className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-orange via-brand-red to-brand-purple animate-gradient-x leading-tight p-2">
          The Ultimate AI Prompt Generator <br/> & App Builder
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Create viral prompts for ChatGPT, YouTube, and Coding in seconds. Powered by the latest Gemini AI models.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => onChangeView(AppView.GENERATOR)}
            className="px-8 py-4 bg-brand-orange text-white rounded-full font-bold text-lg shadow-lg hover:shadow-brand-orange/40 hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            Start Generating <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => onChangeView(AppView.CHAT)}
            className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Chat with AI
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {[
          { icon: <Zap className="text-yellow-500" />, title: "Flash Lite Speed", desc: "Instant prompt generation with low latency." },
          { icon: <Code className="text-blue-500" />, title: "Code Builder", desc: "Generate complex coding prompts for apps." },
          { icon: <Youtube className="text-red-500" />, title: "YouTube Growth", desc: "Scripts, titles, and tags for viral videos." },
          { icon: <Grid className="text-purple-500" />, title: "Multi-Model", desc: "Access Gemini Pro & Flash Image models." },
          { icon: <Shield className="text-green-500" />, title: "Secure SaaS", desc: "Enterprise-grade security and reliability." },
          { icon: <TrendingUp className="text-orange-500" />, title: "Trending Ideas", desc: "See what's popular in the AI community." },
        ].map((f, i) => (
          <div key={i} className="bg-white dark:bg-brand-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center mb-4">
              {f.icon}
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{f.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-brand-dark to-black text-white rounded-3xl p-8 md:p-12 max-w-5xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple blur-[100px] opacity-30 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">Join the Mafia Tech Pro Community</h2>
            <p className="text-gray-300 mb-6">Get exclusive access to code builders, apps, and more resources.</p>
            <div className="flex flex-wrap gap-4">
              <a href="https://youtube.com/@mafiatechpro?si=CtHV8-5g16ZJWYj_" target="_blank" className="px-6 py-3 bg-red-600 rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 transition-colors">
                <Youtube size={20} /> Subscribe
              </a>
              <a href="https://mafiacodebuilder.blogspot.com/" target="_blank" className="px-6 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors">
                Try Code Builder
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <a href="https://quizcentreforfree.blogspot.com" target="_blank" className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-center text-sm font-medium backdrop-blur-sm">
              Quiz Centre
            </a>
            <a href="https://voicebotgpt.netlify.app" target="_blank" className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-center text-sm font-medium backdrop-blur-sm">
              Voice Bot AI
            </a>
            <a href="https://studysmartandlearn.vercel.app/" target="_blank" className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-center text-sm font-medium backdrop-blur-sm">
              Study App
            </a>
             <a href="https://dipanshu6564gmailcom.itch.io/" target="_blank" className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-center text-sm font-medium backdrop-blur-sm">
              Download Games
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
