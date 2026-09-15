import React from 'react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  // Navigation tabs definition
  const tabs = [
    {
      id: 'home' as ScreenType,
      label: 'Ana Sayfa',
      icon: 'cottage',
    },
    {
      id: 'calendar' as ScreenType,
      label: 'Takvim',
      icon: 'calendar_today',
    },
    {
      id: 'closet' as ScreenType,
      label: 'Dolabım',
      icon: 'checkroom',
    },
    {
      id: 'profile' as ScreenType,
      label: 'Profilim',
      icon: 'person',
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-surface/90 backdrop-blur-xl border-t border-[#E8DEC8]/50 shadow-[0_-4px_24px_rgba(60,52,42,0.04)]">
      <div className="max-w-[480px] mx-auto flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-all duration-200 select-none ${
                isActive 
                  ? 'text-primary font-semibold' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span 
                  className={`material-symbols-outlined text-[24px] transition-transform duration-200 ${isActive ? 'scale-110 font-medium' : ''}`}
                >
                  {tab.icon}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={`text-[11px] leading-tight transition-all ${isActive ? 'font-semibold tracking-tight' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
