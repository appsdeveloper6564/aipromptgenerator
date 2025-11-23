import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { Menu, Moon, Sun, Bell, User as UserIcon, Youtube, AlertTriangle, Search, Filter, Trash2, Star, ArrowUpDown, Heart, LayoutGrid, List as ListIcon } from 'lucide-react';
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
  
  // Library Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'alpha' | 'favorites'>('date');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleFavorite = (id: string) => {
    setSavedPrompts(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const deletePrompt = (id: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      setSavedPrompts(prev => prev.filter(p => p.id !== id));
    }
  };

  const getFilteredPrompts = () => {
    return savedPrompts
      .filter(p => {
        const matchesSearch = (p.title + p.content + p.category).toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
        const matchesFav = !showFavoritesOnly || p.isFavorite;
        return matchesSearch && matchesCategory && matchesFav;
      })
      .sort((a, b) => {
        if (sortBy === 'date') return b.createdAt - a.createdAt; // Newest first
        if (sortBy === 'alpha') return a.title.localeCompare(b.title);
        if (sortBy === 'favorites') return (b.isFavorite === a.isFavorite) ? 0 : b.isFavorite ? 1 : -1;
        return 0;
      });
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
        const displayedPrompts = getFilteredPrompts();
        const uniqueCategories = ['All', ...new Set(savedPrompts.map(p => p.category))];

        return (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ListIcon className="text-brand-purple" /> My Library
                <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {savedPrompts.length}
                </span>
              </h2>
              <button 
                onClick={() => setCurrentView(AppView.GENERATOR)}
                className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 text-sm font-bold shadow-md transition-colors"
              >
                + New Prompt
              </button>
            </div>

            {/* Search & Filters Toolbar */}
            <div className="bg-white dark:bg-brand-card p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4 md:space-y-0 md:flex gap-4 items-center flex-wrap">
              {/* Search */}
              <div className="flex-1 relative min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-purple outline-none dark:text-white"
                />
              </div>

              {/* Filters Group */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                <div className="relative">
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="appearance-none pl-9 pr-8 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-brand-purple outline-none cursor-pointer dark:text-gray-200"
                  >
                    {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>

                <div className="relative">
                   <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none pl-9 pr-8 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-brand-purple outline-none cursor-pointer dark:text-gray-200"
                  >
                    <option value="date">Date (Newest)</option>
                    <option value="alpha">Name (A-Z)</option>
                    <option value="favorites">Popularity</option>
                  </select>
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>

                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    showFavoritesOnly 
                      ? 'bg-brand-red/10 border-brand-red text-brand-red' 
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Heart size={14} className={showFavoritesOnly ? 'fill-current' : ''} />
                  <span className="hidden sm:inline">Favorites</span>
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid gap-4">
              {savedPrompts.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-brand-card rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                  <LayoutGrid className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">No prompts saved yet</h3>
                  <p className="text-gray-500 mb-6">Create your first AI masterpiece in the Generator.</p>
                  <button 
                    onClick={() => setCurrentView(AppView.GENERATOR)}
                    className="px-6 py-2 bg-brand-orange text-white rounded-full font-bold hover:shadow-lg transition-all"
                  >
                    Go to Generator
                  </button>
                </div>
              ) : displayedPrompts.length === 0 ? (
                <div className="text-center py-12">
                   <p className="text-gray-500 text-lg">No prompts match your search filters.</p>
                   <button 
                    onClick={() => { setSearchQuery(''); setFilterCategory('All'); setShowFavoritesOnly(false); }}
                    className="mt-4 text-brand-purple hover:underline"
                   >
                     Clear all filters
                   </button>
                </div>
              ) : (
                displayedPrompts.map(p => (
                  <div key={p.id} className="group bg-white dark:bg-brand-card p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-brand-purple/50 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-bold text-brand-orange uppercase tracking-wider">
                          {p.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => toggleFavorite(p.id)}
                          className={`p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${p.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
                        >
                          <Star size={16} className={p.isFavorite ? 'fill-current' : ''} />
                        </button>
                        <button 
                          onClick={() => deletePrompt(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 truncate pr-8">{p.title}</h3>
                    
                    <div className="relative bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm font-mono text-gray-600 dark:text-gray-300">
                      <p className="line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                        {p.content}
                      </p>
                      <button 
                        onClick={() => {navigator.clipboard.writeText(p.content); alert('Copied!')}}
                        className="absolute top-2 right-2 p-1.5 bg-white dark:bg-black rounded border border-gray-200 dark:border-gray-700 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-brand-purple"
                        title="Copy to clipboard"
                      >
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      </button>
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