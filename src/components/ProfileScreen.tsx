import React, { useState } from 'react';
import { UserProfile, ScreenType } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  wardrobeCount: number;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  wardrobeCount,
  onUpdateUser,
  onNavigate,
  onLogout,
}) => {
  const [dailyNotification, setDailyNotification] = useState(user.notificationsEnabled);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [topSize, setTopSize] = useState(user.topSize);
  const [bottomSize, setBottomSize] = useState(user.bottomSize);
  const [favoriteColors, setFavoriteColors] = useState(
    user.favoriteTones.map((t) => t.name).join(', ')
  );

  const handleToggleNotification = () => {
    const nextVal = !dailyNotification;
    setDailyNotification(nextVal);
    onUpdateUser({ notificationsEnabled: nextVal });
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const toneArray = favoriteColors.split(',').map((c) => ({
      name: c.trim(),
      hex: '#A8B5A3',
    }));
    onUpdateUser({
      topSize,
      bottomSize,
      favoriteTones: toneArray,
    });
    setShowStyleModal(false);
  };

  return (
    <div className="flex flex-col w-full px-5 pt-3 pb-28 gap-4 animate-in fade-in duration-300">
      {/* Profile Header */}
      <div className="pt-1">
        <span className="text-[11px] uppercase tracking-widest text-primary font-bold">
          HESAP & AYARLAR
        </span>
        <h1 className="text-[26px] font-semibold text-on-surface tracking-tight mt-0.5">
          Profilim
        </h1>
        <p className="text-[12px] text-on-surface-variant font-medium">
          Stil tercihlerini ve dolap verilerini yönet
        </p>
      </div>

      {/* User Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#E8DEC8]/60 flex items-center gap-3.5 relative overflow-hidden">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary text-on-primary rounded-full flex items-center justify-center text-[11px] shadow-xs">
            <span className="material-symbols-outlined text-[13px]">edit</span>
          </div>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[17px] font-bold text-on-surface truncate">{user.name}</h2>
            <span className="material-symbols-outlined text-primary text-[17px] fill-1">
              verified
            </span>
          </div>
          <p className="text-[12px] text-on-surface-variant truncate mt-0.5">
            {user.handle} • {user.email}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
              {user.styleBadge}
            </span>
          </div>
        </div>
      </div>

      {/* Bento Stats Strip */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-surface-container-low rounded-2xl p-3 text-center border border-[#E8DEC8]/50 shadow-2xs">
          <span className="text-[20px] font-bold text-primary block leading-tight">
            {wardrobeCount}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold mt-0.5 block">
            Dolap Parçası
          </span>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-3 text-center border border-[#E8DEC8]/50 shadow-2xs">
          <span className="text-[20px] font-bold text-secondary block leading-tight">
            {user.outfitsCount}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold mt-0.5 block">
            AI Kombin
          </span>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-3 text-center border border-[#E8DEC8]/50 shadow-2xs">
          <span className="text-[20px] font-bold text-tertiary block leading-tight">
            %{user.capsuleScore}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold mt-0.5 block">
            Kapsül Uyumu
          </span>
        </div>
      </div>

      {/* Premium Luxury Banner */}
      <div className="bg-gradient-to-r from-primary to-[#4D6254] rounded-2xl p-4 text-on-primary shadow-sm relative overflow-hidden flex items-center justify-between">
        <div className="flex flex-col gap-1 max-w-[210px]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-secondary-container">
              workspace_premium
            </span>
            <span className="text-[12px] font-bold tracking-wide uppercase text-secondary-container">
              Akıllı Dolap Premium
            </span>
          </div>
          <p className="text-[11px] text-on-primary-container leading-snug">
            Sınırsız AI stilist analizi ve mevsimsel kapsül planlama ayrıcalığı aktif.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white shadow-xs border border-white/30">
          Aktif Üye
        </span>
      </div>

      {/* Preferences & Settings List */}
      <div className="bg-surface-container-lowest rounded-2xl p-2 shadow-xs border border-[#E8DEC8]/60 divide-y divide-surface-container-high/60">
        {/* Stil & Beden Tercihlerim */}
        <div
          onClick={() => setShowStyleModal(true)}
          className="p-3 flex items-center justify-between cursor-pointer hover:bg-surface-container-low rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">straighten</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold text-on-surface">Stil & Beden Tercihlerim</h3>
              <p className="text-[11px] text-on-surface-variant truncate">
                Üst: {user.topSize} • Alt: {user.bottomSize} •{' '}
                {user.favoriteTones.map((t) => t.name).join(', ')}
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
        </div>

        {/* Günlük Kombin Bildirimi Switch */}
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">alarm</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold text-on-surface">
                Günlük Kombin Bildirimi
              </h3>
              <p className="text-[11px] text-on-surface-variant">Her sabah 08:30</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Günlük bildirimi aç/kapat"
            onClick={handleToggleNotification}
            className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
              dailyNotification ? 'bg-primary' : 'bg-surface-container-highest'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                dailyNotification ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Hava Durumu Lokasyonu */}
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-[20px]">wb_sunny</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold text-on-surface">Hava Durumu Lokasyonu</h3>
              <p className="text-[11px] text-on-surface-variant">İstanbul / Bebek</p>
            </div>
          </div>
          <span className="text-[11px] text-primary font-semibold">Değiştir</span>
        </div>

        {/* Uygulama Dili */}
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
              <span className="material-symbols-outlined text-[20px]">language</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold text-on-surface">Uygulama Dili</h3>
              <p className="text-[11px] text-on-surface-variant">{user.language}</p>
            </div>
          </div>
          <span className="text-[11px] text-outline">Varsayılan</span>
        </div>

        {/* Çıkış Yap */}
        <div
          onClick={onLogout}
          className="p-3 flex items-center justify-between cursor-pointer hover:bg-error-container/20 rounded-xl transition-colors text-error"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-error-container/30 flex items-center justify-center text-error shrink-0">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold text-error">Oturumu Kapat</h3>
              <p className="text-[11px] text-error/80">Giriş ekranına dön</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-error text-[18px]">chevron_right</span>
        </div>
      </div>

      {/* Style & Size Edit Modal */}
      {showStyleModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-[#E8DEC8]/60 space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest">
              <h3 className="text-[15px] font-bold text-on-surface">Stil Tercihlerini Düzenle</h3>
              <button
                type="button"
                onClick={() => setShowStyleModal(false)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                    Üst Giyim Beden
                  </label>
                  <select
                    value={topSize}
                    onChange={(e) => setTopSize(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl border border-surface-container-high text-[13px] outline-none"
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                    Alt Giyim Beden
                  </label>
                  <select
                    value={bottomSize}
                    onChange={(e) => setBottomSize(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl border border-surface-container-high text-[13px] outline-none"
                  >
                    <option value="34">34</option>
                    <option value="36">36</option>
                    <option value="38">38</option>
                    <option value="40">40</option>
                    <option value="42">42</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                  Favori Renk Tonları (Virgülle ayırın)
                </label>
                <input
                  type="text"
                  value={favoriteColors}
                  onChange={(e) => setFavoriteColors(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl border border-surface-container-high text-[13px] outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-primary text-on-primary rounded-xl font-semibold text-[13px] shadow-sm"
                >
                  Kaydet & Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
