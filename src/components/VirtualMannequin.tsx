import React, { useState } from 'react';
import { Outfit, OutfitGarment, ClothingItem } from '../types';

interface VirtualMannequinProps {
  outfit: Outfit;
  wardrobe: ClothingItem[];
  isGenerating?: boolean;
  onUpdateGarment?: (category: 'ust' | 'alt' | 'dis' | 'ayakkabi' | 'aksesuar', newGarment: ClothingItem) => void;
  onToggleLike?: () => void;
}

export const VirtualMannequin: React.FC<VirtualMannequinProps> = ({
  outfit,
  wardrobe,
  isGenerating = false,
  onUpdateGarment,
  onToggleLike,
}) => {
  // Active selected zone on the mannequin for inspection / swapping
  const [selectedSlot, setSelectedSlot] = useState<'ust' | 'alt' | 'dis' | 'ayakkabi' | 'aksesuar' | null>(null);
  const [showOuterLayer, setShowOuterLayer] = useState<boolean>(true);
  const [isSwappingDrawerOpen, setIsSwappingDrawerOpen] = useState<boolean>(false);

  // Extract garments from outfit
  const garments = outfit.garments || [];
  const topGarment = garments.find((g) => g.category === 'ust') || 
    wardrobe.find((w) => w.category === 'ust' && outfit.items.some((i) => i.name === w.name)) ||
    wardrobe.find((w) => w.category === 'ust');

  const bottomGarment = garments.find((g) => g.category === 'alt') ||
    wardrobe.find((w) => w.category === 'alt' && outfit.items.some((i) => i.name === w.name)) ||
    wardrobe.find((w) => w.category === 'alt');

  const outerGarment = garments.find((g) => g.category === 'dis') ||
    wardrobe.find((w) => w.category === 'dis' && outfit.items.some((i) => i.name === w.name));

  const shoeGarment = garments.find((g) => g.category === 'ayakkabi') ||
    wardrobe.find((w) => w.category === 'ayakkabi' && outfit.items.some((i) => i.name === w.name)) ||
    wardrobe.find((w) => w.category === 'ayakkabi');

  const accessoryGarment = garments.find((g) => g.category === 'aksesuar') ||
    wardrobe.find((w) => w.category === 'aksesuar' && outfit.items.some((i) => i.name === w.name));

  const handleSlotClick = (slot: 'ust' | 'alt' | 'dis' | 'ayakkabi' | 'aksesuar') => {
    setSelectedSlot(slot);
    setIsSwappingDrawerOpen(true);
  };

  const getSlotGarment = (slot: 'ust' | 'alt' | 'dis' | 'ayakkabi' | 'aksesuar') => {
    switch (slot) {
      case 'ust': return topGarment;
      case 'alt': return bottomGarment;
      case 'dis': return outerGarment;
      case 'ayakkabi': return shoeGarment;
      case 'aksesuar': return accessoryGarment;
    }
  };

  const activeGarment = selectedSlot ? getSlotGarment(selectedSlot) : null;
  const availableWardrobeOptions = selectedSlot
    ? wardrobe.filter((w) => w.category === selectedSlot && w.id !== activeGarment?.id)
    : [];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#F7F4EE] via-[#EFEAE1] to-[#E5DECf] border border-[#D8CEBA] shadow-[0_8px_30px_rgb(0,0,0,0.06)] select-none">
      {/* Atelier Studio Ambient Header / Controls */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-[#D8CEBA] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-semibold text-on-surface tracking-wide">
            Sanal Terzi Mankeni
          </span>
          <span className="text-[10px] text-outline font-medium">| Giydirildi</span>
        </div>

        <div className="flex items-center gap-1.5">
          {outerGarment && (
            <button
              type="button"
              onClick={() => setShowOuterLayer(!showOuterLayer)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md border transition-all flex items-center gap-1 shadow-xs cursor-pointer ${
                showOuterLayer
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface/85 text-on-surface border-[#D8CEBA] hover:bg-surface'
              }`}
              title="Dış giyim katmanını çıkar veya giydir"
            >
              <span className="material-symbols-outlined text-[14px]">
                {showOuterLayer ? 'checkroom' : 'dry_cleaning'}
              </span>
              <span>{showOuterLayer ? 'Ceket Açık' : 'Ceketi Giy'}</span>
            </button>
          )}

          {onToggleLike && (
            <button
              type="button"
              aria-label="Kombini Favoriye Ekle"
              onClick={onToggleLike}
              className="w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md flex items-center justify-center text-on-surface shadow-xs active:scale-95 transition-transform hover:bg-surface border border-[#D8CEBA] cursor-pointer"
            >
              <span
                className={`material-symbols-outlined text-[18px] transition-colors ${
                  outfit.isLiked ? 'text-error fill-1' : 'text-on-surface'
                }`}
              >
                {outfit.isLiked ? 'favorite' : 'favorite_border'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Mannequin Stage Canvas */}
      <div className="relative w-full aspect-[4/5] max-h-[520px] flex flex-col items-center justify-between pt-10 pb-4 px-3 overflow-hidden">
        
        {/* Atelier Studio Lighting Backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.85)_0%,rgba(230,220,200,0.2)_70%)]" />
        
        {/* Subtle Tailor Vertical Measure / Center Seam Line */}
        <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-[1px] border-l border-dashed border-[#C5BBA7]/60 pointer-events-none" />

        {/* 1. MANNEQUIN HEAD & NECK FINIAL (Ahşap Tepe ve Boyun) */}
        <div className="relative z-10 flex flex-col items-center shrink-0 mb-1">
          {/* Wooden Top Finial Cap */}
          <div className="w-5 h-4 rounded-t-full bg-gradient-to-b from-[#7D5836] to-[#5C3B1E] shadow-xs border border-[#482E16]" />
          {/* Neck Stand */}
          <div className="w-8 h-7 bg-gradient-to-b from-[#E6DAC8] via-[#DECDB7] to-[#D5C2AA] rounded-t-sm shadow-xs border-x border-[#C2B19A] flex items-center justify-center relative">
            <span className="text-[7px] text-[#8C7A65] font-mono tracking-widest uppercase opacity-60">
              38
            </span>
          </div>
        </div>

        {/* 2. UPPER BODY: TORSO WITH TOP GARMENT & OUTERWEAR OVERLAY */}
        <div className="relative z-10 w-full max-w-[280px] flex flex-col items-center shrink-0">
          
          {/* Mannequin Shoulders & Torso Form */}
          <div 
            className={`relative w-full aspect-[16/11] rounded-2xl transition-all duration-300 flex items-center justify-center p-1.5 cursor-pointer group ${
              selectedSlot === 'ust' || selectedSlot === 'dis'
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface/50 shadow-md'
                : 'hover:shadow-sm'
            }`}
            onClick={() => handleSlotClick(outerGarment && showOuterLayer ? 'dis' : 'ust')}
          >
            {/* Linen Mannequin Bust Base Graphic */}
            <div className="absolute inset-x-4 inset-y-1 bg-[#EBE2D3] rounded-2xl border border-[#D5C7B0] shadow-inner flex flex-col justify-between p-2 pointer-events-none opacity-90">
              <div className="w-full flex justify-between px-3 text-[8px] text-[#A69680] font-mono">
                <span>SEAM-L</span>
                <span>SEAM-R</span>
              </div>
              <div className="w-12 h-[1px] bg-[#CBBBA5] mx-auto opacity-70" />
            </div>

            {/* DRESSED TOP GARMENT (Keten Gömlek / Tişört / Triko) */}
            {topGarment && (
              <div className={`relative z-10 w-[78%] h-full flex items-center justify-center transition-transform duration-300 ${
                showOuterLayer && outerGarment ? 'scale-90 opacity-90' : 'scale-100'
              }`}>
                <img
                  src={topGarment.image}
                  alt={topGarment.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(70,55,40,0.15)] group-hover:scale-105 transition-transform"
                />
              </div>
            )}

            {/* DRESSED OUTERWEAR OVERLAY (Ceket / Trençkot) */}
            {outerGarment && showOuterLayer && (
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in-95 duration-300">
                <img
                  src={outerGarment.image}
                  alt={outerGarment.name}
                  referrerPolicy="no-referrer"
                  className="w-[96%] h-full object-contain filter drop-shadow-[0_6px_12px_rgba(50,38,28,0.25)]"
                />
              </div>
            )}

            {/* Floating Tag Chip for Top / Outer */}
            <div className="absolute -top-2 left-2 z-30 pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSlotClick('ust');
                }}
                className="px-2 py-0.5 rounded-full bg-surface/90 hover:bg-surface backdrop-blur-md border border-[#D8CEBA] text-[10px] font-semibold text-on-surface shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: topGarment?.colorHex || '#F5F2EB' }}
                />
                <span className="truncate max-w-[100px]">{topGarment?.name || 'Üst Giyim'}</span>
                <span className="material-symbols-outlined text-[12px] text-primary">edit</span>
              </button>
            </div>

            {outerGarment && showOuterLayer && (
              <div className="absolute -top-2 right-2 z-30 pointer-events-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSlotClick('dis');
                  }}
                  className="px-2 py-0.5 rounded-full bg-surface/90 hover:bg-surface backdrop-blur-md border border-[#D8CEBA] text-[10px] font-semibold text-on-surface shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: outerGarment.colorHex }}
                  />
                  <span className="truncate max-w-[95px]">{outerGarment.name}</span>
                  <span className="material-symbols-outlined text-[12px] text-primary">edit</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. LOWER BODY: MANNEQUIN WAIST & TROUSERS / BOTTOM GARMENT */}
        <div className="relative z-10 w-full max-w-[250px] flex flex-col items-center shrink-0 -mt-2">
          
          <div
            className={`relative w-full aspect-[16/13] rounded-2xl transition-all duration-300 flex items-center justify-center p-1 cursor-pointer group ${
              selectedSlot === 'alt'
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface/50 shadow-md'
                : 'hover:shadow-sm'
            }`}
            onClick={() => handleSlotClick('alt')}
          >
            {/* Mannequin Lower Body Form Backdrop */}
            <div className="absolute inset-x-8 top-0 bottom-2 bg-[#E6DAC8] rounded-b-2xl border-x border-b border-[#D0C2AB] pointer-events-none opacity-80" />

            {/* DRESSED BOTTOM GARMENT (Pileli Pantolon / Denim / Etek) */}
            {bottomGarment && (
              <div className="relative z-10 w-[84%] h-full flex items-center justify-center">
                <img
                  src={bottomGarment.image}
                  alt={bottomGarment.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-[0_5px_10px_rgba(70,55,40,0.18)] group-hover:scale-105 transition-transform"
                />
              </div>
            )}

            {/* Floating Tag Chip for Bottom */}
            <div className="absolute top-2 left-1 z-30 pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSlotClick('alt');
                }}
                className="px-2 py-0.5 rounded-full bg-surface/90 hover:bg-surface backdrop-blur-md border border-[#D8CEBA] text-[10px] font-semibold text-on-surface shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: bottomGarment?.colorHex || '#D6C7B2' }}
                />
                <span className="truncate max-w-[100px]">{bottomGarment?.name || 'Alt Giyim'}</span>
                <span className="material-symbols-outlined text-[12px] text-primary">edit</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. BASE PEDESTAL & FOOTWEAR (Manken Tabanı ve Ayakkabılar) */}
        <div className="relative z-10 w-full max-w-[280px] flex items-center justify-between px-2 pt-1 border-t border-[#D5C7B0]/60 mt-auto">
          
          {/* Mannequin Central Tripod Stand Pole */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3 h-8 bg-gradient-to-r from-[#6E4B2B] via-[#8B623B] to-[#5A3C20] rounded-sm shadow-xs border border-[#482E16]" />

          {/* DRESSED FOOTWEAR (Deri Loafer / Sneaker) */}
          <div
            className={`relative flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface/80 hover:bg-surface backdrop-blur-md border border-[#D8CEBA] shadow-xs cursor-pointer transition-all ${
              selectedSlot === 'ayakkabi' ? 'ring-2 ring-primary shadow-sm' : ''
            }`}
            onClick={() => handleSlotClick('ayakkabi')}
          >
            {shoeGarment && (
              <img
                src={shoeGarment.image}
                alt={shoeGarment.name}
                referrerPolicy="no-referrer"
                className="w-10 h-8 object-contain filter drop-shadow-xs"
              />
            )}
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-semibold text-on-surface leading-tight truncate max-w-[90px]">
                {shoeGarment?.name || 'Ayakkabı'}
              </span>
              <span className="text-[9px] text-outline font-medium">
                {shoeGarment?.brand || 'Tods'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[13px] text-primary">edit</span>
          </div>

          {/* DRESSED ACCESSORY / BAG (Örgü Deri Çanta / Aksesuar) */}
          {accessoryGarment ? (
            <div
              className={`relative flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface/80 hover:bg-surface backdrop-blur-md border border-[#D8CEBA] shadow-xs cursor-pointer transition-all ${
                selectedSlot === 'aksesuar' ? 'ring-2 ring-primary shadow-sm' : ''
              }`}
              onClick={() => handleSlotClick('aksesuar')}
            >
              <img
                src={accessoryGarment.image}
                alt={accessoryGarment.name}
                referrerPolicy="no-referrer"
                className="w-9 h-8 object-contain filter drop-shadow-xs"
              />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-semibold text-on-surface leading-tight truncate max-w-[85px]">
                  {accessoryGarment.name}
                </span>
                <span className="text-[9px] text-outline font-medium">
                  {accessoryGarment.brand}
                </span>
              </div>
              <span className="material-symbols-outlined text-[13px] text-primary">edit</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleSlotClick('aksesuar')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface/60 hover:bg-surface text-[10px] font-medium text-outline border border-dashed border-[#D8CEBA] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>Çanta Ekle</span>
            </button>
          )}
        </div>

        {/* Loading / Fitting Shimmer Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-40 bg-surface/70 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 animate-in fade-in duration-200">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-[12px] font-semibold text-on-surface tracking-wide">
              Mankene Giydiriliyor...
            </span>
          </div>
        )}
      </div>

      {/* 5. INTERACTIVE GARMENT SWAPPER DRAWER (Mankene Dolaptan Başka Parça Giydir) */}
      {isSwappingDrawerOpen && activeGarment && (
        <div className="p-3 bg-surface-container-lowest border-t border-[#D8CEBA] flex flex-col gap-2.5 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-2xs"
                style={{ backgroundColor: activeGarment.colorHex }}
              />
              <span className="text-[12px] font-bold text-on-surface">
                {activeGarment.name}
              </span>
              <span className="text-[11px] text-outline">• {activeGarment.brand}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsSwappingDrawerOpen(false)}
              className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center text-[12px] hover:bg-surface-container-highest cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
              Dolaptan Alternatif Parça Giydir ({availableWardrobeOptions.length})
            </span>
            <span className="text-[10px] text-primary font-medium">Dokun ve Değiştir</span>
          </div>

          {availableWardrobeOptions.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
              {availableWardrobeOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (onUpdateGarment && selectedSlot) {
                      onUpdateGarment(selectedSlot, item);
                    }
                    setIsSwappingDrawerOpen(false);
                  }}
                  className="shrink-0 w-24 p-2 rounded-xl bg-surface-container-low hover:bg-surface border border-[#E8DEC8] flex flex-col items-center gap-1.5 active:scale-95 transition-all text-center cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center p-1 overflow-hidden border border-[#E8DEC8]/50">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-on-surface truncate w-full">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    <span className="text-[9px] text-outline truncate">{item.colorName}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-outline italic py-1">
              Bu kategori için gardırobunda başka parça bulunamadı.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
