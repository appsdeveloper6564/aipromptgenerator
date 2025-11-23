import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { Menu, Moon, Sun, Bell, User as UserIcon, Youtube, AlertTriangle } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { PromptGenerator } from './components/PromptGenerator';
import { AIChat } from './components/AIChat';
import { ImageStudio } from './components/ImageStudio';
import { Home } from './components/Home';
import { AppView, Prompt } from './types';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The application encountered an unexpected error.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Reload Page
          </button>
          {this.state.error && (
            <pre className="mt-4 p-4 bg-gray-200 dark:bg-black rounded text-xs text-left overflow-auto max-w-lg">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.HOME:
        return <Home onChangeView={setCurrentView} />;
      case AppView.GENERATOR:
        return <PromptGenerator onSave={(p) => setSavedPrompts([...savedPrompts, p])} />;
      case AppView.CHAT:
        return <AIChat />;
      case AppView.IMAGE_EDITOR:
        return <ImageStudio />;
      case AppView.LIBRARY:
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Saved Prompts ({savedPrompts.length})</h2>
            <div className="grid gap-4">
              {savedPrompts.length === 0 ? (
                <p className="text-gray-500">No prompts saved yet.</p>
              ) : (
                savedPrompts.map(p => (
                  <div key={p.id} className="bg-white dark:bg-brand-card p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">{p.category}</span>
                      <span className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-gray-200 mb-2">{p.title}</p>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-sm font-mono text-gray-600 dark:text-gray-300 line-clamp-3">
                      {p.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case AppView.DASHBOARD:
        return (
          <div className="max-w-4xl mx-auto space-y-8">
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Dashboard</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-brand-orange to-red-500 p-6 rounded-2xl text-white">
                  <p className="text-sm opacity-80">Prompts Generated</p>
                  <p className="text-4xl font-bold mt-2">124</p>
                </div>
                <div className="bg-gradient-to-br from-brand-purple to-indigo-600 p-6 rounded-2xl text-white">
                  <p className="text-sm opacity-80">Tokens Used</p>
                  <p className="text-4xl font-bold mt-2">45.2k</p>
                </div>
                 <div className="bg-gradient-to-br from-gray-800 to-black p-6 rounded-2xl text-white border border-gray-700">
                  <p className="text-sm opacity-80">Plan</p>
                  <p className="text-4xl font-bold mt-2">Free</p>
                  <button className="mt-4 px-4 py-2 bg-white text-black text-sm font-bold rounded-lg w-full">Upgrade to Pro</button>
                </div>
             </div>
          </div>
        )
      default:
        return <Home onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-gray-50 dark:bg-brand-dark transition-colors duration-200">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-brand-card border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 shrink-0 z-20 relative">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="lg:hidden text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-purple">
              PromptMaster
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://whatsapp.com/channel/0029VbBgeABGE56mFmtPxD1z" 
              target="_blank"
              className="hidden md:flex items-center gap-2 text-sm text-green-600 font-medium hover:underline"
            >
              Join WhatsApp
            </a>
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
            <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm">
                U
              </div>
            </button>
          </div>
        </header>

        {/* Prominent Subscriber Notice Banner */}
        <div className="bg-gradient-to-r from-brand-orange via-brand-red to-brand-purple text-white py-3 px-4 text-center shadow-md relative z-10 animate-fade-in">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="flex items-center gap-2 font-medium text-sm sm:text-base">
              <Youtube size={20} className="animate-bounce" />
              Target: 1000 Subscribers (Need 950 more!)
            </span>
            <a 
              href="https://youtube.com/@mcpro_mafia?si=Q7UqOF3oTO3KsyhF" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1 bg-white text-brand-red rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-gray-100 hover:scale-105 transition-all shadow-sm"
            >
              Subscribe Now
            </a>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}