import React, { useState, useRef, useEffect } from 'react';
import { ClothingItem, ScreenType } from '../types';
import { APP_LOGO, USER_AVATAR } from '../data/initialData';

interface CameraScanScreenProps {
  onSaveToCloset: (item: ClothingItem) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const CameraScanScreen: React.FC<CameraScanScreenProps> = ({
  onSaveToCloset,
  onNavigate,
}) => {
  // Preset default analyzed piece (Navy blazer from the visual specs)
  const [currentImage, setCurrentImage] = useState<string>(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDT9rFUpAL9w3SxnrsX5NzZetQ4MnCDps1unMi3ezoeiipzyumNT9swJFpl9GLnqCGpgWhnlaOnIZJACBDrgwhYeS6h2-jiZ8waMAki5Z9aT4RbhgPNdNCYXGaUEUI0LWeqgRv5tIJBH0E2PPuXHZ7ra2NOmyKRHHiwdkUmtCMCKz6uWlA1PxuUVbEgzcWJif2VA9h3CBRUj9yRXD8q-Hx1D4SymGZxtZx-FZ4EpMnUi8GpNbCFgm70Uw'
  );

  const [itemName, setItemName] = useState('Klasik Kesim Yün Ceket');
  const [itemType, setItemType] = useState('Blazer Ceket');
  const [category, setCategory] = useState<'ust' | 'alt' | 'dis' | 'ayakkabi' | 'aksesuar'>('dis');
  const [brand, setBrand] = useState('Özel Koleksiyon');
  const [toneName, setToneName] = useState('Gece Laciverti');
  const [toneHex, setToneHex] = useState('#18233C');
  const [season, setSeason] = useState<'Yazlık' | 'Kışlık' | 'Sonbahar' | 'İlkbahar / Sonbahar' | '4 Mevsim'>('İlkbahar / Sonbahar');
  const [styleSegment, setStyleSegment] = useState('Akıllı Rahat');
  const [aiNote, setAiNote] = useState(
    'Keten bej pantolonun ve keten beyaz gömleğinle kusursuz bir Nişantaşı ofis kombini ve kapsül uyumu sunar.'
  );

  const [isFlashOn, setIsFlashOn] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showManualEdit, setShowManualEdit] = useState(false);
  const [scanProgress, setScanProgress] = useState(45);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scanning laser animation
  useEffect(() => {
    let direction = 1;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 80) direction = -1;
        if (prev <= 15) direction = 1;
        return prev + direction * 1.5;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Handle image upload from user device / camera
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCurrentImage(reader.result);
          simulateAiDetection(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // AI auto-detection simulation for new photos
  const simulateAiDetection = (fileName: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const lower = fileName.toLowerCase();
      if (lower.includes('pantolon') || lower.includes('trouser') || lower.includes('jean')) {
        setItemName('Tailored Dökümlü Pantolon');
        setItemType('Kumaş Pantolon');
        setCategory('alt');
        setToneName('Kum Beji');
        setToneHex('#D6C7B2');
        setSeason('4 Mevsim');
        setStyleSegment('Ofis & Şık');
        setAiNote('Dolabındaki beyaz keten gömlek ve deri loafer ile dengeli bir smart-casual uyum sağlar.');
      } else if (lower.includes('elbise') || lower.includes('dress')) {
        setItemName('Zarif Midi Slip Elbise');
        setItemType('İpek Elbise');
        setCategory('ust');
        setToneName('Şampanya');
        setToneHex('#EAE1D3');
        setSeason('Yazlık');
        setStyleSegment('Kokteyl & Davet');
        setAiNote('Akşam davetlerinde bej trençkot ve ince dore topuklularla mükemmel kombinlenir.');
      } else if (lower.includes('ayakkabi') || lower.includes('shoe') || lower.includes('loafer')) {
        setItemName('İtalyan Kalıp Loafer');
        setItemType('Deri Loafer');
        setCategory('ayakkabi');
        setToneName('Koyu Kahve');
        setToneHex('#3D251A');
        setSeason('4 Mevsim');
        setStyleSegment('Klasik');
        setAiNote('Koleksiyonundaki pileli pantolonlarla hem gündüz hem akşam toplantılarında giyilebilir.');
      } else {
        setItemName('İtalyan Dokuma Blazer');
        setItemType('Blazer Ceket');
        setCategory('dis');
        setToneName('Gece Laciverti');
        setToneHex('#18233C');
        setSeason('İlkbahar / Sonbahar');
        setStyleSegment('Akıllı Rahat');
        setAiNote('Keten bej pantolonun ve keten beyaz gömleğinle kusursuz bir Nişantaşı ofis kombini sunar.');
      }
    }, 700);
  };

  // Save to closet handler
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);

      const newItem: ClothingItem = {
        id: `item-${Date.now()}`,
        name: itemName,
        brand: brand || 'Gardırop',
        colorName: toneName,
        colorHex: toneHex,
        category,
        season,
        styleSegment,
        wearCount: 1,
        lastWorn: 'Yeni Eklendi',
        image: currentImage,
        isFavorite: false,
        matchNote: aiNote,
      };

      onSaveToCloset(newItem);

      // Redirect to Closet page after brief feedback
      setTimeout(() => {
        onNavigate('closet');
      }, 900);
    }, 750);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-safe animate-in fade-in duration-200">
      {/* Hidden File Input for Real Photo Upload / Camera Capture */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Screen Header */}
      <header className="fixed top-0 inset-x-0 z-50 pt-safe bg-surface/85 backdrop-blur-xl border-b border-[#E8DEC8]/50 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-[480px] mx-auto h-16 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Kapat veya Geri"
              onClick={() => onNavigate('closet')}
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            <img src={APP_LOGO} alt="Akıllı Dolap" className="h-7 w-auto object-contain" />
            <h1 className="text-[16px] font-semibold text-on-surface truncate">
              Kıyafet Tara
            </h1>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Flaş Aç/Kapat"
              onClick={() => setIsFlashOn(!isFlashOn)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                isFlashOn ? 'bg-secondary-fixed text-on-secondary-fixed' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {isFlashOn ? 'flash_on' : 'flash_off'}
              </span>
            </button>

            <button
              type="button"
              aria-label="Fotoğraf Seç"
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">photo_library</span>
            </button>

            <div className="w-8 h-8 rounded-full overflow-hidden border border-surface-container-high ml-1">
              <img src={USER_AVATAR} alt="Selin" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[480px] mx-auto w-full pt-20 px-5 flex flex-col space-y-4">
        {/* Viewfinder Control Bar */}
        <div className="flex items-center justify-between py-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-[11px] font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Canlı AI Vizörü
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Kılavuz Çizgileri"
              onClick={() => setShowGrid(!showGrid)}
              className={`w-9 h-9 flex items-center justify-center rounded-full shadow-xs transition-colors ${
                showGrid ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">grid_4x4</span>
            </button>

            <button
              type="button"
              aria-label="Fotoğraf Değiştir / Yükle"
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[19px]">flip_camera_ios</span>
            </button>

            <button
              type="button"
              aria-label="Otomatik Işık Dengesi"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed shadow-xs"
            >
              <span className="material-symbols-outlined text-[19px]">hdr_auto</span>
            </button>
          </div>
        </div>

        {/* Central Camera Viewfinder Box (4:5 Ratio) */}
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-surface-container-lowest shadow-md border border-[#E8DEC8]/60 flex items-center justify-center">
          {/* Garment Image */}
          <img
            src={currentImage}
            alt={itemName}
            className={`w-full h-full object-cover select-none transition-opacity duration-300 ${
              isScanning ? 'opacity-70 blur-xs' : 'opacity-100'
            }`}
          />

          {/* Flash lighting simulation */}
          {isFlashOn && (
            <div className="absolute inset-0 bg-amber-50/20 pointer-events-none mix-blend-screen" />
          )}

          {/* Ambient Subtle Gradient Mask */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45 pointer-events-none"></div>

          {/* Grid lines */}
          {showGrid && (
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-25">
              <div className="border-r border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-b border-white"></div>
              <div className="border-r border-white"></div>
              <div className="border-r border-white"></div>
              <div></div>
            </div>
          )}

          {/* Viewfinder Corner HUD Brackets */}
          <div className="absolute inset-4 pointer-events-none">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/90 rounded-tl-lg shadow-sm"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/90 rounded-tr-lg shadow-sm"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/90 rounded-bl-lg shadow-sm"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/90 rounded-br-lg shadow-sm"></div>

            {/* Center Focus Target */}
            <div className="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center opacity-60">
              <div className="w-2 h-2 rounded-full bg-white shadow-xs"></div>
            </div>
          </div>

          {/* AI Laser Scanning Bar (Real-time animated pulse) */}
          <div
            className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary-fixed to-transparent opacity-90 pointer-events-none shadow-[0_0_8px_#c6ebd9]"
            style={{ top: `${scanProgress}%` }}
          />

          {/* Dynamic Status Badge Pill Top Left */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface shadow-sm border border-white/10">
            <span className="material-symbols-outlined text-[15px] text-primary-fixed fill-1">
              check_circle
            </span>
            <span className="text-[11px] font-semibold tracking-wide">
              Nesne Algılandı (%98)
            </span>
          </div>

          {/* Lighting Metric Pill Top Right */}
          <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface/85 backdrop-blur-md text-on-surface shadow-sm border border-white/30">
            <span className="material-symbols-outlined text-[14px] text-tertiary">wb_sunny</span>
            <span className="text-[11px] font-medium">Doğal Işık</span>
          </div>

          {/* Garment Optical Target Tag Center-Bottom */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md text-on-surface shadow-sm border border-white/40">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 text-on-primary-fixed">
                <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
              </div>
              <div className="truncate">
                <p className="text-[13px] font-semibold text-on-surface truncate">{itemName}</p>
                <p className="text-[11px] text-on-surface-variant truncate">
                  Stüdyo Kalitesi • Net Odak
                </p>
              </div>
            </div>
            <span className="text-[11px] text-primary px-2.5 py-1 rounded-full bg-primary-fixed/60 font-bold shrink-0">
              4:5 Oran
            </span>
          </div>
        </div>

        {/* AI Detection Preview Panel */}
        <div className="w-full bg-surface-container-low rounded-2xl p-4 space-y-3 shadow-xs border border-[#E8DEC8]/50">
          {/* Panel Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-xs">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
              </div>
              <div>
                <h2 className="text-[14px] font-bold text-on-surface">Yapay Zekâ Analizi</h2>
                <p className="text-[11px] text-on-surface-variant">
                  Kumaş dokusu & silüet sınıflandırması
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
              <span className="material-symbols-outlined text-[14px] fill-1">verified</span>
              <span className="text-[11px] font-bold">%99 Doğruluk</span>
            </div>
          </div>

          {/* Metadata Attributes Chips Grid (4 items exactly from screenshot) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Giysi Türü */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-lowest border border-[#E8DEC8]/40 shadow-xs">
              <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">apparel</span>
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] text-on-surface-variant font-medium">
                  Giysi Türü
                </span>
                <span className="block text-[12px] font-semibold text-on-surface truncate">
                  {itemType}
                </span>
              </div>
            </div>

            {/* Ton & Doku */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-lowest border border-[#E8DEC8]/40 shadow-xs">
              <div className="w-7 h-7 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-xs"
                  style={{ backgroundColor: toneHex }}
                />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] text-on-surface-variant font-medium">
                  Ton & Doku
                </span>
                <span className="block text-[12px] font-semibold text-on-surface truncate">
                  {toneName}
                </span>
              </div>
            </div>

            {/* Mevsim */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-lowest border border-[#E8DEC8]/40 shadow-xs">
              <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">routine</span>
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] text-on-surface-variant font-medium">Mevsim</span>
                <span className="block text-[12px] font-semibold text-on-surface truncate">
                  {season}
                </span>
              </div>
            </div>

            {/* Stil Segmenti */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-lowest border border-[#E8DEC8]/40 shadow-xs">
              <div className="w-7 h-7 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0 text-on-tertiary-fixed-variant">
                <span className="material-symbols-outlined text-[16px]">local_mall</span>
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] text-on-surface-variant font-medium">
                  Stil Segmenti
                </span>
                <span className="block text-[12px] font-semibold text-on-surface truncate">
                  {styleSegment}
                </span>
              </div>
            </div>
          </div>

          {/* Capsule AI Recommendation Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-tertiary-fixed/40 text-on-tertiary-fixed-variant border border-tertiary-fixed/60">
            <span className="material-symbols-outlined text-[18px] text-tertiary shrink-0 mt-0.5">
              tips_and_updates
            </span>
            <p className="text-[12px] leading-snug">{aiNote}</p>
          </div>
        </div>

        {/* Bottom CTA Control Group */}
        <div className="flex flex-col gap-2.5 pt-1 pb-6">
          <div className="flex items-center gap-2.5">
            {/* Secondary Reset / Retake Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-12 px-4 flex items-center justify-center gap-1.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all active:scale-95 shrink-0 border border-[#E8DEC8]/50 shadow-xs"
            >
              <span className="material-symbols-outlined text-[19px]">refresh</span>
              <span className="text-[12px] font-semibold">Yeniden Çek</span>
            </button>

            {/* Primary Save to Closet Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isSaved}
              className={`flex-1 h-12 px-5 flex items-center justify-center gap-2 rounded-xl text-on-primary font-semibold text-[13px] shadow-sm transition-all duration-200 active:scale-98 ${
                isSaved
                  ? 'bg-tertiary'
                  : 'bg-primary hover:bg-primary-container active:scale-98'
              }`}
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                  <span>Kataloğa Ekleniyor...</span>
                </>
              ) : isSaved ? (
                <>
                  <span className="material-symbols-outlined text-[20px] fill-1">task_alt</span>
                  <span>Dolaba Eklendi!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">checkroom</span>
                  <span>Dolabıma Kaydet</span>
                </>
              )}
            </button>
          </div>

          {/* Sub-action manual refinement link */}
          <div className="flex items-center justify-center pt-0.5">
            <button
              type="button"
              onClick={() => setShowManualEdit(true)}
              className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-[11px] underline underline-offset-4 font-medium"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Detayları ve Etiketleri Manuel Düzenle</span>
            </button>
          </div>
        </div>
      </main>

      {/* Manual Edit Modal */}
      {showManualEdit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-[#E8DEC8]/60 space-y-3.5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest">
              <h3 className="text-[15px] font-bold text-on-surface">Parça Detaylarını Düzenle</h3>
              <button
                type="button"
                onClick={() => setShowManualEdit(false)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-on-surface-variant">Parça Adı</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-surface-container-high bg-surface-container-low text-[13px] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-on-surface-variant">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-surface-container-high bg-surface-container-low text-[13px] outline-none"
              >
                <option value="ust">Üst Giyim</option>
                <option value="alt">Alt Giyim</option>
                <option value="dis">Dış Giyim</option>
                <option value="ayakkabi">Ayakkabılar</option>
                <option value="aksesuar">Aksesuarlar</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-on-surface-variant">Renk Tonu</label>
                <input
                  type="text"
                  value={toneName}
                  onChange={(e) => setToneName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-surface-container-high bg-surface-container-low text-[13px] outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-on-surface-variant">Mevsim</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value as any)}
                  className="w-full h-10 px-2.5 rounded-xl border border-surface-container-high bg-surface-container-low text-[13px] outline-none"
                >
                  <option value="Yazlık">Yazlık</option>
                  <option value="Kışlık">Kışlık</option>
                  <option value="Sonbahar">Sonbahar</option>
                  <option value="İlkbahar / Sonbahar">İlkbahar / Sonbahar</option>
                  <option value="4 Mevsim">4 Mevsim</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowManualEdit(false)}
                className="w-full h-11 bg-primary text-on-primary rounded-xl font-semibold text-[13px] shadow-sm"
              >
                Değişiklikleri Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
