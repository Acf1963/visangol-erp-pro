import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  FileText,
  History as HistoryIcon,
  Upload,
  Download,
} from 'lucide-react';
import { useAppStore } from '../store';
import { cn } from '../utils/cn';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab } = useAppStore();
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem('visangol_logo');
    if (savedLogo) setCustomLogo(savedLogo);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowInstallBtn(false);
    setDeferredPrompt(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setCustomLogo(base64String);
      localStorage.setItem('visangol_logo', base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomLogo(null);
    localStorage.removeItem('visangol_logo');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'inventory', label: 'Stock', icon: Package },
    { id: 'work-order', label: 'Obra', icon: FileText },
    { id: 'history', label: 'Histórico', icon: HistoryIcon },
  ] as const;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-800 px-6 py-4 z-50 flex justify-between items-center">
      {/* LOGO */}
      <div className="flex items-center gap-6">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
          title="Clique para alterar o logotipo"
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleLogoUpload}
          />

          {/* Se existir logo personalizado → mostra-o */}
          {customLogo ? (
            <div className="bg-white px-3 py-1.5 rounded-xl flex items-center justify-center h-10 shadow-sm relative overflow-hidden group/logo">
              <img src={customLogo} alt="Visangol" className="h-full object-contain" />

              {/* Overlay para remover */}
              <div
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity"
                onClick={handleRemoveLogo}
              >
                <span className="text-white text-[10px] uppercase font-bold tracking-widest">
                  Remover
                </span>
              </div>
            </div>
          ) : (
            /* Logo padrão da pasta public */
            <div className="bg-white px-3 py-1.5 rounded-xl flex items-center justify-center h-10 shadow-sm cursor-pointer">
              <img src="/logo.png" alt="Visangol Logo" className="h-full object-contain" />
            </div>
          )}
        </div>

        {/* Botão de instalar PWA */}
        {showInstallBtn && (
          <button
            onClick={handleInstallClick}
            className="hidden lg:flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95 animate-pulse"
            title="Instalar Visangol ERP no Pop!_OS / Linux"
          >
            <Download className="w-4 h-4" />
            <span>INSTALAR NO POP!_OS</span>
          </button>
        )}
      </div>

      {/* TABS */}
      <div className="flex gap-4 md:gap-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
                isActive
                  ? 'bg-orange-500/10 text-orange-500'
                  : 'text-slate-400 hover:text-slate-200',
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider hidden md:block">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
