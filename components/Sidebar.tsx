import React, { useEffect, useState } from 'react';
import { 
  Home, 
  Sparkles, 
  MessageSquare, 
  Image as ImageIcon, 
  Library, 
  LayoutDashboard, 
  Menu, 
  X,
  Youtube,
  Download,
  Gift,
  Smartphone
} from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, setIsOpen }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const menuItems = [
    { id: AppView.HOME, label: 'Home', icon: <Home size={20} /> },
    { id: AppView.GENERATOR, label: 'Prompt Generator', icon: <Sparkles size={20} /> },
    { id: AppView.CHAT, label: 'AI Chatbot', icon: <MessageSquare size={20} /> },
    { id: AppView.IMAGE_EDITOR, label: 'Image Editor', icon: <ImageIcon size={20} /> },
    { id: AppView.LIBRARY, label: 'My Library', icon: <Library size={20} /> },
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  ];

  const externalLinks = [
    { label: 'MC Pro Mafia', icon: <Youtube size={16} />, url: 'https://youtube.com/@mcpro_mafia?si=Q7UqOF3oTO3KsyhF' },
    { label: 'Mafia Tech Pro', icon: <Youtube size={16} />, url: 'https://youtube.com/@mafiatechpro?si=CtHV8-5g16ZJWYj_' },
    { label: 'Code Builder', icon: <Sparkles size={16} />, url: 'https://mafiacodebuilder.blogspot.com/' },
    { label: 'Spin to Win', icon: <Gift size={16} />, url: 'https://spintowinrewardsforfree.blogspot.com/' },
    { label: 'Download Games', icon: <Download size={16} />, url: 'https://dipanshu6564gmailcom.itch.io/' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full w-64 
          bg-white dark:bg-brand-card border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-orange via-brand-red to-brand-purple">
              PromptMaster
            </h1>
            <button 
              onClick={() => setIsOpen(false)} 
              className="lg:hidden p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* PWA Install Button (Visible only if installable) */}
          {deferredPrompt && (
            <div className="px-4 mb-2">
              <button
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg font-bold shadow-md hover:bg-orange-600 transition-colors animate-pulse"
              >
                <Smartphone size={18} /> Install App
              </button>
            </div>
          )}

          {/* Nav Items */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${currentView === item.id 
                    ? 'bg-gradient-to-r from-brand-orange/10 to-brand-purple/10 text-brand-red font-medium border border-brand-red/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Partners & Links
              </p>
            </div>
            
            {externalLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                {link.icon}
                <span className="truncate">{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Footer User Info Mock */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-orange to-brand-purple flex items-center justify-center text-white font-bold">
                U
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">User</p>
                <p className="text-xs text-gray-500 truncate">Free Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};