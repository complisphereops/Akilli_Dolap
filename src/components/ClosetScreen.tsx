import React, { useState, useMemo } from 'react';
import { ClothingItem, CategoryKey, ScreenType } from '../types';

interface ClosetScreenProps {
  wardrobe: ClothingItem[];
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onResetWardrobe?: () => void;
}

export const ClosetScreen: React.FC<ClosetScreenProps> = ({
  wardrobe,
  onToggleFavorite,
  onDeleteItem,
  onNavigate,
  onResetWardrobe,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'wearCount' | 'favorites'>('default');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [justReset, setJustReset] = useState(false);

  const categories: { key: CategoryKey; label: string; count?: number }[] = [
    { key: 'all', label: `Tümü (${wardrobe.length})` },
    { key: 'ust', label: 'Üst Giyim' },
    { key: 'alt', label: 'Alt Giyim' },
    { key: 'dis', label: 'Dış Giyim' },
    { key: 'ayakkabi', label: 'Ayakkabılar' },
    { key: 'aksesuar', label: 'Aksesuarlar' },
  ];

  const filteredItems = useMemo(() => {
    return wardrobe
      .filter((item) => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query) ||
          item.colorName.toLowerCase().includes(query) ||
          item.styleSegment.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'wearCount') return b.wearCount - a.wearCount;
        if (sortBy === 'favorites') return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
        return 0;
      });
  }, [wardrobe, activeCategory, searchQuery, sortBy]);

  return (
    <div className="flex flex-col w-full px-5 pt-3 pb-28 animate-in fade-in duration-300">
      {/* Wardrobe Header & Sorting */}
      <div className="flex items-end justify-between pt-1 pb-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[18px]">checkroom</span>
            <span className="text-[11px] font-bold uppercase tracking-widest">Koleksiyon</span>
          </div>
          <h1 className="text-[26px] font-semibold text-on-surface tracking-tight mt-0.5">
            Dolabım
          </h1>
          <p className="text-[12px] text-on-surface-variant font-medium">
            {wardrobe.length} Parça Kıyafet & Aksesuar
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5">
          {onResetWardrobe && (
            <button
              type="button"
              aria-label="Tüm Gardırobu Yenile"
              title="Tüm varsayılan 42 parçayı geri yükle"
              onClick={() => {
                onResetWardrobe();
                setJustReset(true);
                setTimeout(() => setJustReset(false), 2000);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:text-primary text-[11px] font-semibold shadow-xs border border-[#E8DEC8]/60 active:scale-95 transition-all"
            >
              <span className={`material-symbols-outlined text-[15px] text-primary ${justReset ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{justReset ? 'Yüklendi' : 'Tümünü Yükle'}</span>
            </button>
          )}

          <button
            type="button"
            aria-label="Kıyafetleri Sırala"
            onClick={() => {
              if (sortBy === 'default') setSortBy('wearCount');
              else if (sortBy === 'wearCount') setSortBy('favorites');
              else setSortBy('default');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface text-[12px] font-semibold shadow-xs border border-[#E8DEC8]/60 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[17px] text-primary">tune</span>
            <span>
              {sortBy === 'wearCount' ? 'En Çok Giyilen' : sortBy === 'favorites' ? 'Favoriler' : 'Sırala'}
            </span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full mb-3.5">
        <div className="relative flex items-center w-full h-12 rounded-xl bg-surface-container-lowest shadow-xs border border-[#E8DEC8]/60">
          <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Dolabımda ara, renk veya marka..."
            className="w-full h-full pl-10 pr-10 bg-transparent text-on-surface placeholder:text-outline text-[13px] outline-none rounded-xl"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 w-7 h-7 flex items-center justify-center rounded-full text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : (
            <span className="absolute right-3 text-outline/80">
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </span>
          )}
        </div>
      </div>

      {/* Capsule Harmony & Wear Insight Banner */}
      <div 
        onClick={() => onNavigate('stylist')}
        className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low shadow-xs mb-4 border border-[#E8DEC8]/50 cursor-pointer hover:bg-surface-container transition-colors group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 shadow-xs text-primary">
            <span className="material-symbols-outlined text-[18px] fill-1">auto_awesome</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-primary font-bold">Kapsül Uyumu</span>
              <span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="text-[11px] text-secondary font-bold">%85 Aktif</span>
            </div>
            <p className="text-[12px] text-on-surface-variant truncate">
              {wardrobe.length} parça ile 140+ kombin varyasyonu hazır
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-outline text-[18px] group-hover:translate-x-0.5 transition-transform">
          chevron_right
        </span>
      </div>

      {/* Horizontal Scrollable Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 -mx-5 px-5">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold transition-all duration-150 border shadow-xs ${
                isActive
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface border-[#E8DEC8]/60 hover:bg-surface-container'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Wardrobe Gallery Grid (2-Column Studio Look) */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 mt-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="flex flex-col rounded-2xl bg-surface-container-lowest shadow-xs border border-[#E8DEC8]/60 overflow-hidden group cursor-pointer hover:shadow-md transition-all duration-200"
            >
              {/* Image Frame */}
              <div className="relative w-full aspect-[4/5] bg-surface-container-low overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Season Badge */}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-xs text-on-surface-variant text-[10px] font-bold shadow-xs">
                  {item.season}
                </span>

                {/* Favorite Action Button */}
                <button
                  type="button"
                  aria-label="Favorilere ekle"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-surface-container-lowest/90 backdrop-blur-xs flex items-center justify-center shadow-xs active:scale-90 transition-transform"
                >
                  <span
                    className={`material-symbols-outlined text-[16px] ${
                      item.isFavorite ? 'text-secondary fill-1' : 'text-outline'
                    }`}
                  >
                    favorite
                  </span>
                </button>

                {/* Wear Count Overlay */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-surface-container-highest/90 backdrop-blur-xs text-on-surface text-[10px] font-semibold flex items-center gap-1 shadow-xs">
                  <span className="material-symbols-outlined text-[12px] text-primary">history</span>
                  <span>{item.wearCount} kez giyildi</span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-3 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-[13px] font-semibold text-on-surface truncate">
                    {item.name}
                  </h2>
                  <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                    {item.colorName} • {item.brand}
                  </p>
                </div>

                <div className="mt-2.5 flex items-center justify-between pt-1.5 border-t border-surface-container-high/60">
                  <span className="text-[11px] text-primary font-bold truncate">
                    {item.styleSegment}
                  </span>
                  <span className="text-[10px] text-outline shrink-0 ml-1">
                    {item.lastWorn}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-outline mb-3">
            <span className="material-symbols-outlined text-[28px]">search_off</span>
          </div>
          <h3 className="text-[16px] font-semibold text-on-surface">Parça Bulunamadı</h3>
          <p className="text-[12px] text-on-surface-variant mt-1 max-w-[240px]">
            Aramanızla eşleşen kıyafet bulunamadı. Filtreleri temizleyebilir veya yeni parça ekleyebilirsiniz.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-full bg-primary text-on-primary text-[12px] font-semibold shadow-sm"
          >
            Tüm Dolabı Göster
          </button>
        </div>
      )}

      {/* Floating Action Button: Navigates to Kıyafet Tara / Kamera screen directly */}
      <div className="fixed right-5 bottom-20 z-40">
        <button
          type="button"
          aria-label="Yeni Kıyafet Ekle"
          onClick={() => onNavigate('camera')}
          className="group flex items-center gap-2 h-14 px-4 rounded-full bg-primary text-on-primary shadow-xl hover:bg-primary-container active:scale-95 transition-all duration-200 border border-white/20"
        >
          <span className="material-symbols-outlined text-[24px] group-hover:rotate-90 transition-transform duration-300">
            add
          </span>
          <span className="text-[13px] font-semibold pr-1">Yeni Ekle</span>
        </button>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-[#E8DEC8]/60 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest">
              <h3 className="text-[16px] font-bold text-on-surface truncate">
                {selectedItem.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="my-4 aspect-[4/5] rounded-2xl overflow-hidden bg-surface-container-low shadow-xs">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-left mb-4">
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-[10px] text-outline uppercase font-bold">Marka & Renk</span>
                <p className="text-[12px] font-semibold text-on-surface truncate">
                  {selectedItem.brand} • {selectedItem.colorName}
                </p>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-[10px] text-outline uppercase font-bold">Mevsim & Stil</span>
                <p className="text-[12px] font-semibold text-on-surface truncate">
                  {selectedItem.season} • {selectedItem.styleSegment}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onToggleFavorite(selectedItem.id);
                  setSelectedItem({
                    ...selectedItem,
                    isFavorite: !selectedItem.isFavorite,
                  });
                }}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-1.5 border transition-all ${
                  selectedItem.isFavorite
                    ? 'bg-secondary/10 border-secondary text-secondary'
                    : 'bg-surface-container border-outline/30 text-on-surface'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${selectedItem.isFavorite ? 'fill-1' : ''}`}>
                  favorite
                </span>
                <span>{selectedItem.isFavorite ? 'Favoride' : 'Favoriye Ekle'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onDeleteItem(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="px-3 py-2.5 rounded-xl bg-error-container text-on-error-container font-semibold text-[13px] flex items-center justify-center hover:opacity-90"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
