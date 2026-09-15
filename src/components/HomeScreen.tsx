import React, { useState } from 'react';
import { Outfit, AccessoryItem, ScreenType, OutfitGarment, ClothingItem } from '../types';
import { VirtualMannequin } from './VirtualMannequin';

interface HomeScreenProps {
  outfits: Outfit[];
  currentOutfitIndex: number;
  wardrobe?: ClothingItem[];
  onSelectOutfitIndex?: (index: number) => void;
  onShuffleOutfit: () => void;
  onGenerateAIOutfit?: () => void;
  isGeneratingOutfit?: boolean;
  onToggleOutfitLike: (outfitId: string) => void;
  onToggleOutfitWorn: (outfitId: string) => void;
  onUpdateOutfitGarment?: (
    outfitId: string,
    category: 'ust' | 'alt' | 'dis' | 'ayakkabi' | 'aksesuar',
    newGarment: ClothingItem
  ) => void;
  accessories: AccessoryItem[];
  onNavigate: (screen: ScreenType) => void;
}

type OutfitViewMode = 'mannequin' | 'model' | 'flatlay' | 'pieces';

export const HomeScreen: React.FC<HomeScreenProps> = ({
  outfits,
  currentOutfitIndex,
  wardrobe = [],
  onSelectOutfitIndex,
  onShuffleOutfit,
  onGenerateAIOutfit,
  isGeneratingOutfit = false,
  onToggleOutfitLike,
  onToggleOutfitWorn,
  onUpdateOutfitGarment,
  accessories,
  onNavigate,
}) => {
  const currentOutfit = outfits[currentOutfitIndex] || outfits[0];
  const [isShuffling, setIsShuffling] = useState(false);
  const [viewMode, setViewMode] = useState<OutfitViewMode>('mannequin');
  const [selectedGarment, setSelectedGarment] = useState<OutfitGarment | null>(null);

  const handleShuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
      onShuffleOutfit();
      setIsShuffling(false);
    }, 350);
  };

  // Extract garments or fallback to items
  const outfitGarments: OutfitGarment[] =
    currentOutfit.garments && currentOutfit.garments.length > 0
      ? currentOutfit.garments
      : currentOutfit.items.map((item, idx) => ({
          id: `item-gen-${idx}`,
          name: item.name,
          category: (item.category as any) || (idx === 0 ? 'ust' : idx === 1 ? 'alt' : 'ayakkabi'),
          brand: item.brand || 'Dolabından',
          colorName: item.color,
          colorHex: item.dotColor,
          image: item.image || currentOutfit.image,
        }));

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'ust':
        return 'Üst Giyim';
      case 'alt':
        return 'Alt Giyim';
      case 'dis':
        return 'Dış Giyim';
      case 'ayakkabi':
        return 'Ayakkabı';
      case 'aksesuar':
        return 'Aksesuar';
      default:
        return 'Parça';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'ust':
        return 'checkroom';
      case 'alt':
        return 'styler';
      case 'dis':
        return 'dry_cleaning';
      case 'ayakkabi':
        return 'steps';
      case 'aksesuar':
        return 'watch';
      default:
        return 'apparel';
    }
  };

  return (
    <div className="flex flex-col w-full px-5 pt-3 pb-24 space-y-5 animate-in fade-in duration-300">
      {/* Greeting & Context Header */}
      <section className="flex items-end justify-between pt-1">
        <div>
          <span className="text-[11px] font-semibold text-tertiary uppercase tracking-wider">
            31 Mayıs • Cuma
          </span>
          <h1 className="text-[26px] font-semibold text-on-surface tracking-tight mt-0.5">
            Günaydın, Selin
          </h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low shadow-xs border border-[#E8DEC8]/40">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-[11px] text-on-surface-variant font-medium">Dolap Aktif</span>
        </div>
      </section>

      {/* Weather Widget Card */}
      <section className="bg-surface-container-low rounded-2xl p-4 shadow-sm relative overflow-hidden border border-[#E8DEC8]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-tertiary shadow-xs">
              <span className="material-symbols-outlined text-[28px] fill-1 text-tertiary">wb_sunny</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[19px] font-bold text-on-surface tracking-tight">
                  {currentOutfit.temperature || '22°C'}
                </span>
                <span className="text-[14px] text-on-surface-variant font-medium">
                  {currentOutfit.weatherCondition.split('•')[0] || 'Güneşli'}
                </span>
              </div>
              <p className="text-[12px] text-outline flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {currentOutfit.contextLocation || 'İstanbul, Bebek'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="px-2.5 py-1 rounded-full bg-surface text-on-surface-variant text-[11px] font-medium shadow-xs flex items-center gap-1 border border-[#E8DEC8]/30">
              <span className="material-symbols-outlined text-[13px] text-primary">air</span>
              Hafif esintili
            </span>
            <span className="text-[11px] text-outline">Nem %48</span>
          </div>
        </div>
      </section>

      {/* Main Featured Section: Günün Kombini & Sanal Manken Vitrini */}
      <section className="flex flex-col space-y-3">
        {/* Outfit Navigation Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-surface-container-low rounded-xl border border-[#E8DEC8]/50 text-[12px] shadow-xs">
          <div className="flex items-center gap-2 font-medium text-on-surface">
            <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
            <span className="font-semibold">Kombin {currentOutfitIndex + 1} / {outfits.length}</span>
            {outfits.length === 1 && (
              <span className="text-[11px] text-outline">• Yeni kombin için butona dokun</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                if (outfits.length <= 1) return;
                const prev = (currentOutfitIndex - 1 + outfits.length) % outfits.length;
                if (onSelectOutfitIndex) onSelectOutfitIndex(prev);
                else onShuffleOutfit();
              }}
              disabled={outfits.length <= 1 || isShuffling}
              className="w-7 h-7 rounded-lg bg-surface-container-lowest flex items-center justify-center text-on-surface hover:bg-surface border border-[#E8DEC8]/40 shadow-xs active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
              title="Önceki Kombin"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (outfits.length <= 1) return;
                const next = (currentOutfitIndex + 1) % outfits.length;
                if (onSelectOutfitIndex) onSelectOutfitIndex(next);
                else onShuffleOutfit();
              }}
              disabled={outfits.length <= 1 || isShuffling}
              className="w-7 h-7 rounded-lg bg-surface-container-lowest flex items-center justify-center text-on-surface hover:bg-surface border border-[#E8DEC8]/40 shadow-xs active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
              title="Sonraki Kombin"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Section Title & Match Badge */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <h2 className="text-[18px] font-bold text-on-surface tracking-tight truncate">
              {currentOutfit.title}
            </h2>
            <span className="material-symbols-outlined text-primary text-[18px] shrink-0">auto_awesome</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 shrink-0">
            <span className="material-symbols-outlined text-primary text-[14px] fill-1">verified</span>
            <span className="text-[11px] text-primary font-bold">
              %{currentOutfit.matchPercentage} Uyum
            </span>
          </div>
        </div>

        {/* View Mode Selector (Terzi Mankeni vs Editoryal Model vs Parça Vitrini vs Dolap Listesi) */}
        <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-[#E8DEC8]/50 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('mannequin')}
            className={`flex-1 py-1.5 px-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              viewMode === 'mannequin'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">accessibility_new</span>
            <span>Terzi Mankeni</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('model')}
            className={`flex-1 py-1.5 px-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              viewMode === 'model'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">photo_camera_front</span>
            <span>Model Look</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('flatlay')}
            className={`flex-1 py-1.5 px-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              viewMode === 'flatlay'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">grid_view</span>
            <span>Vitrin</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('pieces')}
            className={`flex-1 py-1.5 px-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              viewMode === 'pieces'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">checkroom</span>
            <span>Dolap ({outfitGarments.length})</span>
          </button>
        </div>

        {/* Outfit Gallery Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-[0_4px_20px_-2px_rgba(60,52,42,0.05)] border border-[#E8DEC8]/60 relative overflow-hidden flex flex-col gap-3">
          
          {/* 1. GERÇEK TERZİ MANKENİ GİYDİRME GÖRÜNÜMÜ */}
          {viewMode === 'mannequin' && (
            <VirtualMannequin
              outfit={currentOutfit}
              wardrobe={wardrobe}
              isGenerating={isShuffling || isGeneratingOutfit}
              onUpdateGarment={(category, newGarment) => {
                if (onUpdateOutfitGarment) {
                  onUpdateOutfitGarment(currentOutfit.id, category, newGarment);
                }
              }}
              onToggleLike={() => onToggleOutfitLike(currentOutfit.id)}
            />
          )}

          {/* 2. EDİTORYAL MODEL GÖRÜNÜMÜ (LOOKBOOK) */}
          {viewMode === 'model' && (
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low group">
              <img
                src={currentOutfit.mannequinImage || currentOutfit.image}
                alt={`${currentOutfit.title} Editoryal Model`}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
                  isShuffling || isGeneratingOutfit ? 'opacity-40' : 'opacity-100'
                }`}
              />
              {/* Subtle Gradient scrim for pill readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

              {/* Model Rozeti */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white shadow-sm">
                <span className="material-symbols-outlined text-amber-300 text-[14px]">auto_awesome</span>
                <span className="text-[11px] font-semibold tracking-wide">Editoryal Lookbook Modeli</span>
              </div>

              {/* Garment Floating Tag Chips with Quick Inspection */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                {outfitGarments.map((garment, idx) => (
                  <button
                    key={garment.id || idx}
                    type="button"
                    onClick={() => setSelectedGarment(garment)}
                    className="bg-surface/90 hover:bg-surface backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-white/50 active:scale-95 transition-all text-left cursor-pointer"
                  >
                    <span
                      className="w-2 h-2 rounded-full shadow-xs shrink-0"
                      style={{ backgroundColor: garment.colorHex }}
                    />
                    <span className="text-[11px] font-semibold text-on-surface truncate max-w-[110px]">
                      {garment.name}
                    </span>
                    <span className="text-[10px] text-outline">
                      • {garment.colorName}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quick Favorite micro-action */}
              <button
                type="button"
                aria-label="Favoriye Ekle"
                onClick={() => onToggleOutfitLike(currentOutfit.id)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface shadow-sm active:scale-95 transition-transform hover:bg-surface cursor-pointer"
              >
                <span
                  className={`material-symbols-outlined text-[20px] transition-colors ${
                    currentOutfit.isLiked ? 'text-error fill-1' : 'text-on-surface'
                  }`}
                >
                  {currentOutfit.isLiked ? 'favorite' : 'favorite_border'}
                </span>
              </button>
            </div>
          )}

          {/* 2. PARÇA VİTRİNİ (MODA KOLAJI / FLATLAY GÖRÜNÜMÜ) */}
          {viewMode === 'flatlay' && (
            <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#F5F2EB] p-2.5 flex flex-col justify-between border border-[#E8DEC8]/60 relative">
              <div className="flex items-center justify-between pb-1.5 px-1 border-b border-[#E8DEC8]/50">
                <span className="text-[11px] font-bold text-on-surface tracking-wider uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[15px]">grid_view</span>
                  Dolaptan Kombin Parçaları
                </span>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {outfitGarments.length} Parça
                </span>
              </div>

              {/* Responsive 2x2 flatlay grid */}
              <div className="grid grid-cols-2 gap-2 flex-1 pt-1.5">
                {outfitGarments.slice(0, 4).map((garment, idx) => (
                  <div
                    key={garment.id || idx}
                    onClick={() => setSelectedGarment(garment)}
                    className="relative bg-surface-container-lowest rounded-xl p-2 flex flex-col justify-between border border-[#E8DEC8]/60 hover:shadow-sm cursor-pointer transition-all group overflow-hidden"
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-1.5">
                      <img
                        src={garment.image}
                        alt={garment.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-surface/90 backdrop-blur-xs text-[9px] font-bold text-on-surface shadow-xs flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[10px] text-primary">
                          {getCategoryIcon(garment.category)}
                        </span>
                        {getCategoryLabel(garment.category)}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] text-outline font-medium truncate">
                        {garment.brand}
                      </p>
                      <h4 className="text-[11px] font-bold text-on-surface truncate leading-tight">
                        {garment.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: garment.colorHex }}
                        />
                        <span className="text-[10px] text-on-surface-variant truncate">
                          {garment.colorName}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. TÜM DOLAP PARÇALARI LİSTESİ */}
          {viewMode === 'pieces' && (
            <div className="w-full min-h-[320px] rounded-xl bg-surface-container-low p-2.5 flex flex-col gap-2">
              <div className="flex items-center justify-between px-1 py-0.5">
                <span className="text-[12px] font-bold text-on-surface">Kombin İçeriği Detayları</span>
                <span className="text-[11px] text-outline">Dolabındaki tam eşleşmeler</span>
              </div>
              <div className="flex flex-col gap-2">
                {outfitGarments.map((garment) => (
                  <div
                    key={garment.id}
                    onClick={() => setSelectedGarment(garment)}
                    className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-lowest border border-[#E8DEC8]/50 shadow-xs cursor-pointer hover:border-primary/40 transition-all"
                  >
                    <img
                      src={garment.image}
                      alt={garment.name}
                      className="w-14 h-14 rounded-lg object-cover bg-surface-container shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.2 rounded">
                          {getCategoryLabel(garment.category)}
                        </span>
                        <span className="text-[11px] text-outline truncate">{garment.brand}</span>
                      </div>
                      <h4 className="text-[13px] font-semibold text-on-surface truncate mt-0.5">
                        {garment.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10"
                          style={{ backgroundColor: garment.colorHex }}
                        />
                        <span className="text-[11px] text-on-surface-variant">{garment.colorName}</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[18px]">
                      chevron_right
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Stylist Interactive Card (Click opens Stylist Assistant) */}
          <div
            onClick={() => onNavigate('stylist')}
            className="bg-surface-container rounded-xl p-3.5 flex gap-3 items-start cursor-pointer hover:bg-surface-container-high transition-colors active:scale-[0.99] border border-[#E8DEC8]/40 group"
          >
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 mt-0.5 shadow-xs text-primary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[17px]">auto_awesome</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-on-surface leading-snug">
                  {currentOutfit.rationaleTitle}
                </p>
                <span className="text-[11px] font-bold text-primary flex items-center gap-0.5 shrink-0 ml-1">
                  Stiliste Sor
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
              <p className="text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                {currentOutfit.rationaleText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interaction Actions */}
      <section className="flex flex-col gap-2.5 pt-0.5">
        <button
          type="button"
          onClick={() => onToggleOutfitWorn(currentOutfit.id)}
          className={`w-full h-[52px] rounded-xl flex items-center justify-center gap-2 font-semibold text-[15px] shadow-sm active:scale-[0.98] transition-all duration-200 ${
            currentOutfit.isWorn
              ? 'bg-primary-container text-on-primary ring-2 ring-primary/20'
              : 'bg-primary text-on-primary hover:bg-primary-container'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">
            {currentOutfit.isWorn ? 'task_alt' : 'check'}
          </span>
          <span>
            {currentOutfit.isWorn ? 'Dolaba Kaydedildi! (Bugün Giydin)' : 'Bunu Giydim'}
          </span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onGenerateAIOutfit || handleShuffle}
            disabled={isGeneratingOutfit || isShuffling}
            className="h-[50px] bg-primary text-on-primary hover:bg-primary-container rounded-xl flex items-center justify-center gap-1.5 font-semibold text-[13px] active:scale-[0.98] transition-all shadow-xs disabled:opacity-75"
          >
            <span
              className={`material-symbols-outlined text-[19px] ${
                isGeneratingOutfit ? 'animate-spin' : ''
              }`}
            >
              {isGeneratingOutfit ? 'progress_activity' : 'auto_awesome'}
            </span>
            <span className="truncate">
              {isGeneratingOutfit ? 'Mankene Giydiriliyor...' : 'AI Kombin Üret'}
            </span>
          </button>

          <button
            type="button"
            onClick={outfits.length > 1 ? handleShuffle : (onGenerateAIOutfit || handleShuffle)}
            disabled={isShuffling || isGeneratingOutfit}
            className="h-[50px] bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-xl flex items-center justify-center gap-1.5 font-semibold text-[13px] active:scale-[0.98] transition-all border border-[#E8DEC8]/50 shadow-xs cursor-pointer"
          >
            <span
              className={`material-symbols-outlined text-[19px] text-on-surface-variant ${
                isShuffling || (isGeneratingOutfit && outfits.length <= 1) ? 'animate-spin' : ''
              }`}
            >
              autorenew
            </span>
            <span className="truncate">
              {outfits.length > 1 ? 'Farklı Öneri' : 'Farklı Kombin Üret'}
            </span>
          </button>
        </div>
      </section>

      {/* Günün Aksesuarları / Tamamlayıcı Parçalar */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-[17px] font-bold text-on-surface tracking-tight">
              Günün Aksesuarları
            </h3>
            <p className="text-[12px] text-outline">Kombini mükemmelleştiren detaylar</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('closet')}
            className="text-[12px] font-bold text-primary hover:underline"
          >
            Tümünü Gör
          </button>
        </div>

        {/* Accessory Cards Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar">
          {accessories.map((acc) => (
            <div
              key={acc.id}
              className="flex-shrink-0 w-44 bg-surface-container-lowest rounded-2xl p-3 shadow-xs border border-[#E8DEC8]/50 flex flex-col gap-2 hover:shadow-sm transition-all"
            >
              <div className="w-full h-28 bg-surface-container-low rounded-xl overflow-hidden flex items-center justify-center relative">
                <img
                  src={acc.image}
                  alt={acc.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-surface/90 backdrop-blur-xs text-on-surface text-[10px] font-bold shadow-xs">
                  {acc.tag}
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="text-[13px] font-semibold text-on-surface truncate">
                  {acc.name}
                </h4>
                <p className="text-[11px] text-outline truncate mt-0.5">
                  {acc.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Style Tip of the Day Pill */}
      <section className="bg-secondary-fixed/40 rounded-2xl p-4 flex items-center gap-3 border border-secondary-fixed/50 shadow-xs">
        <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[20px]">lightbulb</span>
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-[11px] font-bold text-on-secondary-fixed uppercase tracking-wider">
            Stil İpucu
          </h5>
          <p className="text-[12px] text-on-secondary-fixed-variant leading-snug mt-0.5">
            {currentOutfit.styleTip}
          </p>
        </div>
      </section>

      {/* Quick Garment Detail Modal / Sheet */}
      {selectedGarment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-[#E8DEC8]/70 flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-surface-container">
              <img
                src={selectedGarment.image}
                alt={selectedGarment.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                aria-label="Kapat"
                onClick={() => setSelectedGarment(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface active:scale-90 transition-transform shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md text-[11px] font-bold text-on-surface shadow-xs flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: selectedGarment.colorHex }}
                />
                {selectedGarment.colorName}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                {selectedGarment.brand} • {getCategoryLabel(selectedGarment.category)}
              </span>
              <h3 className="text-[18px] font-bold text-on-surface mt-0.5">
                {selectedGarment.name}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedGarment(null);
                  onNavigate('closet');
                }}
                className="h-11 rounded-xl bg-primary text-on-primary font-semibold text-[13px] flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
              >
                <span className="material-symbols-outlined text-[17px]">checkroom</span>
                <span>Dolapta Gör</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedGarment(null)}
                className="h-11 rounded-xl bg-surface-container text-on-surface font-semibold text-[13px] flex items-center justify-center active:scale-98 border border-[#E8DEC8]/50"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
