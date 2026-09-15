import React, { useState } from 'react';
import { APP_LOGO, USER_AVATAR } from '../data/initialData';
import { ScreenType } from '../types';

interface AppHeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentScreen, onNavigate }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Hava Durumu Uyarısı',
      desc: 'Bugün akşam 19:00 sonrası Boğaz kıyısında rüzgar artacak. Trençkotunu almayı unutma.',
      time: '15 dk önce',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Kapsül Dolap Önerisi',
      desc: 'Bej keten pantolonun ile 3 yeni kombin alternatifi oluşturuldu.',
      time: '2 saat önce',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Haftalık Stil Raporun Hazır',
      desc: 'Bu hafta en çok tercih ettiğin renk: Adaçayı Yeşili (%42).',
      time: 'Dün',
      unread: false,
    },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-surface/85 backdrop-blur-xl border-b border-[#E8DEC8]/50 shadow-[0_1px_8px_rgba(60,52,42,0.03)] pt-safe">
      <div className="max-w-[480px] mx-auto h-16 px-5 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => onNavigate('home')}
        >
          <img 
            src={APP_LOGO} 
            alt="Akıllı Dolap Logo" 
            className="h-8 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-[17px] text-primary tracking-tight leading-tight">
              Akıllı Dolap
            </span>
            <span className="text-[10px] uppercase font-semibold text-secondary tracking-widest leading-none">
              Kişisel AI Stilist
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 relative">
          {/* Notifications Button */}
          <div className="relative">
            <button
              type="button"
              aria-label="Bildirimler"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors relative"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-2xl shadow-xl border border-[#E8DEC8]/60 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container-highest">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-on-surface">Bildirimler</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">2 Yeni</span>
                    </div>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      Tümünü Oku
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 max-h-72 overflow-y-auto no-scrollbar">
                    {notifications.map((n) => (
                      <div 
                        key={n.id}
                        className={`p-2.5 rounded-xl text-left transition-colors ${n.unread ? 'bg-surface-container-low/90' : 'hover:bg-surface-container-low'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-on-surface">{n.title}</span>
                          <span className="text-[10px] text-outline">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Avatar Link */}
          <button
            type="button"
            aria-label="Profilim"
            onClick={() => onNavigate('profile')}
            className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform active:scale-95 ${
              currentScreen === 'profile' ? 'border-primary ring-2 ring-primary/20' : 'border-surface-container-high'
            }`}
          >
            <img 
              src={USER_AVATAR} 
              alt="Selin Kaya" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
