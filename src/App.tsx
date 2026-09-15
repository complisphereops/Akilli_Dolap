import React, { useState, useEffect } from 'react';
import { ScreenType, ClothingItem, Outfit, CalendarEvent, ChatMessage, UserProfile } from './types';
import {
  initialWardrobe,
  initialOutfits,
  accessoriesList,
  initialCalendarEvents,
  initialChatMessages,
  initialUserProfile,
} from './data/initialData';
import { AppHeader } from './components/AppHeader';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ClosetScreen } from './components/ClosetScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { CameraScanScreen } from './components/CameraScanScreen';
import { StylistChatScreen } from './components/StylistChatScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';

export default function App() {
  // Screen Routing State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

  // Wardrobe Collection with LocalStorage Persistence & Auto-Sync
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(() => {
    const saved = localStorage.getItem('akilli_dolap_wardrobe');
    if (saved) {
      try {
        const parsed: ClothingItem[] = JSON.parse(saved);
        // Automatically merge all items from initialWardrobe so new pieces immediately appear
        const existingIds = new Set(parsed.map((item) => item.id));
        const missingDefaults = initialWardrobe.filter((item) => !existingIds.has(item.id));
        if (missingDefaults.length > 0) {
          const merged = [...parsed, ...missingDefaults];
          localStorage.setItem('akilli_dolap_wardrobe', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse wardrobe from localStorage', e);
      }
    }
    return initialWardrobe;
  });

  useEffect(() => {
    localStorage.setItem('akilli_dolap_wardrobe', JSON.stringify(wardrobe));
  }, [wardrobe]);

  // Outfits State
  const [outfits, setOutfits] = useState<Outfit[]>(() => {
    const saved = localStorage.getItem('akilli_dolap_outfits');
    if (saved) {
      try {
        const parsed: Outfit[] = JSON.parse(saved);
        // Ensure outfits have mannequinImage and garments populated
        const updated = parsed.map((po) => {
          const match = initialOutfits.find((io) => io.id === po.id);
          if (match) {
            return {
              ...po,
              mannequinImage: po.mannequinImage || match.mannequinImage,
              garments: po.garments && po.garments.length > 0 ? po.garments : match.garments,
            };
          }
          return po;
        });
        // If saved list only has 1 outfit, also include the other initial outfits so user can browse
        const existingIds = new Set(updated.map((u) => u.id));
        const missingInitial = initialOutfits.filter((io) => !existingIds.has(io.id));
        return [...updated, ...missingInitial];
      } catch (e) {
        console.error('Failed to parse outfits', e);
      }
    }
    return initialOutfits;
  });

  const [currentOutfitIndex, setCurrentOutfitIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('akilli_dolap_outfits', JSON.stringify(outfits));
  }, [outfits]);

  // Calendar Events State
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('akilli_dolap_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse events', e);
      }
    }
    return initialCalendarEvents;
  });

  useEffect(() => {
    localStorage.setItem('akilli_dolap_events', JSON.stringify(events));
  }, [events]);

  // Chat Messages State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('akilli_dolap_chat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat', e);
      }
    }
    return initialChatMessages;
  });

  useEffect(() => {
    localStorage.setItem('akilli_dolap_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const [isAiResponding, setIsAiResponding] = useState<boolean>(false);
  const [isGeneratingOutfit, setIsGeneratingOutfit] = useState<boolean>(false);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('akilli_dolap_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
    return initialUserProfile;
  });

  useEffect(() => {
    localStorage.setItem('akilli_dolap_user', JSON.stringify(userProfile));
  }, [userProfile]);

  // -------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------

  // Save newly scanned garment to wardrobe
  const handleSaveToCloset = (newItem: ClothingItem) => {
    setWardrobe((prev) => [newItem, ...prev]);
  };

  // Toggle favorite garment
  const handleToggleFavorite = (id: string) => {
    setWardrobe((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  // Delete garment
  const handleDeleteGarment = (id: string) => {
    setWardrobe((prev) => prev.filter((item) => item.id !== id));
  };

  // Restore/Sync all default collection items
  const handleResetWardrobe = () => {
    setWardrobe(initialWardrobe);
    localStorage.setItem('akilli_dolap_wardrobe', JSON.stringify(initialWardrobe));
  };

  // Shuffle Outfit on Home Screen
  const handleShuffleOutfit = () => {
    setCurrentOutfitIndex((prev) => (prev + 1) % outfits.length);
  };

  // Generate new custom outfit using Gemini AI based on Wardrobe + Weather
  const handleGenerateAIOutfit = async () => {
    setIsGeneratingOutfit(true);
    try {
      const currentWeather = outfits[currentOutfitIndex] || outfits[0];
      const res = await fetch('/api/stylist/generate-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wardrobe,
          weather: {
            contextLocation: currentWeather?.contextLocation || 'İstanbul, Bebek',
            temperature: currentWeather?.temperature || '22°C',
            weatherCondition: currentWeather?.weatherCondition || 'Güneşli • Esintili',
          },
          occasion: 'Günlük Şıklık & Ofis',
          avoidTitles: outfits.map((o) => o.title),
          currentOutfitId: outfits[currentOutfitIndex]?.id,
        }),
      });

      if (res.ok) {
        const newOutfit: Outfit = await res.json();
        setOutfits((prev) => {
          const filtered = prev.filter((o) => o.id !== newOutfit.id && o.title !== newOutfit.title);
          return [newOutfit, ...filtered];
        });
        setCurrentOutfitIndex(0);
        setToastMessage(`✨ Yeni AI Kombini Hazırlandı: "${newOutfit.title}"`);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        // High-variety client-side generator fallback to ensure outfit is never stuck
        const tops = wardrobe.filter((w) => w.category === 'ust');
        const bottoms = wardrobe.filter((w) => w.category === 'alt');
        const outers = wardrobe.filter((w) => w.category === 'dis');
        const shoes = wardrobe.filter((w) => w.category === 'ayakkabi');
        const accessories = wardrobe.filter((w) => w.category === 'aksesuar');

        const currentIds = new Set(outfits[currentOutfitIndex]?.garments?.map((g) => g.id) || []);
        const pickDifferent = (list: typeof wardrobe) => {
          const diff = list.filter((item) => !currentIds.has(item.id));
          return diff.length > 0 ? diff[Math.floor(Math.random() * diff.length)] : list[0];
        };

        const randomTop = pickDifferent(tops) || tops[0];
        const randomBottom = pickDifferent(bottoms) || bottoms[0];
        const randomShoe = pickDifferent(shoes) || shoes[0];
        const randomOuter = outers.length > 0 ? pickDifferent(outers) : undefined;
        const randomAcc = accessories.length > 0 ? pickDifferent(accessories) : undefined;

        const selectedGarments = [randomOuter, randomTop, randomBottom, randomShoe, randomAcc].filter(Boolean) as typeof wardrobe;

        const mannequinImages = [
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1000&q=85',
        ];

        const titles = [
          'Modern Şehir & Bahar Uyumu',
          'Akıllı Ofis & Doğal Zarafet',
          'Hafta Sonu Dinamik Şıklık',
          'Zamansız Doku & Kontrast',
          'Akdeniz Esintisi & Konfor',
        ];

        const chosenTitle = titles[Math.floor(Math.random() * titles.length)];
        const fallbackOutfit: Outfit = {
          id: `outfit-gen-${Date.now()}`,
          title: `${chosenTitle} (${randomTop.name})`,
          contextLocation: currentWeather?.contextLocation || 'İstanbul, Bebek',
          temperature: currentWeather?.temperature || '22°C',
          weatherCondition: currentWeather?.weatherCondition || 'Güneşli • Esintili',
          matchPercentage: Math.floor(Math.random() * 5) + 94,
          image: randomOuter?.image || randomTop.image,
          mannequinImage: mannequinImages[Math.floor(Math.random() * mannequinImages.length)],
          garments: selectedGarments.map((g) => ({
            id: g.id,
            name: g.name,
            category: g.category,
            brand: g.brand,
            colorName: g.colorName,
            colorHex: g.colorHex,
            image: g.image,
          })),
          items: selectedGarments.map((g) => ({
            name: g.name,
            color: g.colorName,
            dotColor: g.colorHex,
            category: g.category,
            brand: g.brand,
            image: g.image,
          })),
          rationaleTitle: `${currentWeather?.temperature || '22°C'} ve esintiye göre optimize edildi.`,
          rationaleText: `${randomTop.name} ve ${randomBottom.name} parçalarıyla dolabından taze bir silüet oluşturuldu.`,
          styleTip: 'Aksesuarlarını minimalist tutarak kombinin dokusal geçişini öne çıkarabilirsin.',
          isLiked: false,
          isWorn: false,
        };

        setOutfits((prev) => [fallbackOutfit, ...prev]);
        setCurrentOutfitIndex(0);
        setToastMessage(`✨ Yeni Kombin Hazırlandı: "${fallbackOutfit.title}"`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.warn('AI outfit generation error:', err);
      handleShuffleOutfit();
    } finally {
      setIsGeneratingOutfit(false);
    }
  };

  // Toggle Outfit Like
  const handleToggleOutfitLike = (outfitId: string) => {
    setOutfits((prev) =>
      prev.map((o) => (o.id === outfitId ? { ...o, isLiked: !o.isLiked } : o))
    );
  };

  // Toggle Outfit Worn
  const handleToggleOutfitWorn = (outfitId: string) => {
    setOutfits((prev) =>
      prev.map((o) => (o.id === outfitId ? { ...o, isWorn: !o.isWorn } : o))
    );
  };

  // Update a single garment on the mannequin outfit
  const handleUpdateOutfitGarment = (
    outfitId: string,
    category: 'ust' | 'alt' | 'dis' | 'ayakkabi' | 'aksesuar',
    newGarment: ClothingItem
  ) => {
    setOutfits((prev) =>
      prev.map((outfit) => {
        if (outfit.id !== outfitId) return outfit;
        const currentGarments = outfit.garments || [];
        const updatedGarments = [
          ...currentGarments.filter((g) => g.category !== category),
          {
            id: newGarment.id,
            name: newGarment.name,
            category: newGarment.category,
            brand: newGarment.brand,
            colorName: newGarment.colorName,
            colorHex: newGarment.colorHex,
            image: newGarment.image,
          },
        ];
        const updatedItems = [
          ...outfit.items.filter((i) => i.category !== category && i.name !== newGarment.name),
          {
            name: newGarment.name,
            color: newGarment.colorName,
            dotColor: newGarment.colorHex,
            category: newGarment.category,
            brand: newGarment.brand,
            image: newGarment.image,
          },
        ];
        return {
          ...outfit,
          garments: updatedGarments,
          items: updatedItems,
          matchPercentage: Math.min(100, Math.max(93, outfit.matchPercentage + (Math.random() > 0.5 ? 1 : 0))),
        };
      })
    );
    setToastMessage(`✨ Terzi mankenine yeni parça giydirildi: "${newGarment.name}"`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Calendar Reminder
  const handleToggleReminder = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, isReminderOn: !ev.isReminderOn } : ev))
    );
  };

  // Add Calendar Event
  const handleAddCalendarEvent = (newEvent: CalendarEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  // Send Message in Stylist Chat with real Gemini AI
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Şimdi',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiResponding(true);

    try {
      const currentWeather = outfits[currentOutfitIndex] || outfits[0];
      const res = await fetch('/api/stylist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          wardrobe,
          accessories: accessoriesList,
          weather: {
            contextLocation: currentWeather?.contextLocation || 'İstanbul, Bebek',
            temperature: currentWeather?.temperature || '22°C',
            weatherCondition: currentWeather?.weatherCondition || 'Güneşli • Esintili',
          },
          userProfile,
          history: chatMessages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'stylist',
          text: data.reply,
          timestamp: 'Şimdi',
          suggestedItem: data.suggestedItem || undefined,
          comparisons:
            data.comparisons && data.comparisons.length > 0 ? data.comparisons : undefined,
        };
        setChatMessages((prev) => [...prev, aiMsg]);
        setIsAiResponding(false);
        return;
      }
    } catch (e) {
      console.warn('API Chat request failed, using intelligent fallback:', e);
    }

    // Fallback if network or server request is unavailable
    setTimeout(() => {
      let stylistReply = '';
      let suggestedGarment: ChatMessage['suggestedItem'] = undefined;
      let comparisons: ChatMessage['comparisons'] = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('ayakkabı') || lower.includes('topuklu') || lower.includes('loafer')) {
        stylistReply =
          'Bu akşamki hava ve zemin durumu için kalın topuklu deri sandalet veya dolabındaki taba loafer çok daha dengeli ve zarif olacaktır.';
        comparisons = [
          {
            title: 'Küt Topuklu Deri Sandalet',
            subtitle: 'Orta Yükseklik • Taş Rengi',
            match: '%96 Uyum',
            recommended: true,
            icon: 'checkroom',
          },
          {
            title: 'Süet Penny Loafer',
            subtitle: 'Doğal Taban • Taba',
            match: '%91 Uyum',
            recommended: false,
            icon: 'styler',
          },
        ];
      } else if (lower.includes('soğuk') || lower.includes('rüzgar') || lower.includes('hava')) {
        stylistReply =
          'Hava serinlediğinde keten kumaşın üzerine dolabındaki klasik kruvaze trençkotu veya keten blazer ceketi almanı kesinlikle tavsiye ederim.';
        suggestedGarment = {
          name: 'Klasik Kruvaze Trençkot',
          brandColor: 'Kum Beji • Su Geçirmez',
          image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDT9rFUpAL9w3SxnrsX5NzZetQ4MnCDps1unMi3ezoeiipzyumNT9swJFpl9GLnqCGpgWhnlaOnIZJACBDrgwhYeS6h2-jiZ8waMAki5Z9aT4RbhgPNdNCYXGaUEUI0LWeqgRv5tIJBH0E2PPuXHZ7ra2NOmyKRHHiwdkUmtCMCKz6uWlA1PxuUVbEgzcWJif2VA9h3CBRUj9yRXD8q-Hx1D4SymGZxtZx-FZ4EpMnUi8GpNbCFgm70Uw',
          colorHex: '#C5B299',
        };
      } else if (lower.includes('takı') || lower.includes('aksesuar') || lower.includes('küpe')) {
        stylistReply =
          'Doğal keten ve dökümlü parçalara en çok minimalist 18K altın halka küpeler ve ince zincir kolye yakışacaktır. Abartıdan uzak, stiline sade bir ışıltı katacaktır.';
      } else if (lower.includes('rahat') || lower.includes('spor') || lower.includes('günlük')) {
        stylistReply =
          'Daha rahat bir hava yakalamak istersen, keten palazzo pantolonunun altına beyaz minimalist sneaker giyebilir ve gömleğinin kollarını iki tur katlayabilirsin.';
      } else {
        stylistReply =
          'Harika bir seçim! Gardırobundaki renk paletini ve kişisel stil silüetini göz önüne aldığımda, bu parça kombinine hem modern hem de sakin bir şıklık katacaktır.';
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'stylist',
        text: stylistReply,
        timestamp: 'Şimdi',
        suggestedItem: suggestedGarment,
        comparisons,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      setIsAiResponding(false);
    }, 600);
  };

  // Reset chat
  const handleResetChat = () => {
    setChatMessages(initialChatMessages);
  };

  // Update user profile
  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  // Check if current screen uses the global header & bottom navigation
  const isTabScreen = ['home', 'calendar', 'closet', 'profile'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Universal Top App Header on Main Tab Screens */}
      {isTabScreen && (
        <AppHeader
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />
      )}

      {/* Toast Notification for Outfit Generation and Actions */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-[92%] w-[400px] bg-on-surface text-surface rounded-2xl px-4 py-3 shadow-2xl border border-white/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-amber-400 text-[18px]">auto_awesome</span>
          </div>
          <p className="text-[13px] font-medium leading-snug flex-1">{toastMessage}</p>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-surface/60 hover:text-surface text-[14px] p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container Wrapper (Constrained to mobile viewport max 480px) */}
      <div className={`w-full max-w-[480px] mx-auto flex-1 flex flex-col ${isTabScreen ? 'pt-16' : ''}`}>
        {/* Screen 1: Home (Ana Sayfa) */}
        {currentScreen === 'home' && (
          <HomeScreen
            outfits={outfits}
            currentOutfitIndex={currentOutfitIndex}
            wardrobe={wardrobe}
            onSelectOutfitIndex={(idx) => setCurrentOutfitIndex(idx)}
            onShuffleOutfit={handleShuffleOutfit}
            onGenerateAIOutfit={handleGenerateAIOutfit}
            isGeneratingOutfit={isGeneratingOutfit}
            onToggleOutfitLike={handleToggleOutfitLike}
            onToggleOutfitWorn={handleToggleOutfitWorn}
            onUpdateOutfitGarment={handleUpdateOutfitGarment}
            accessories={accessoriesList}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {/* Screen 2: Closet (Dolabım) */}
        {currentScreen === 'closet' && (
          <ClosetScreen
            wardrobe={wardrobe}
            onToggleFavorite={handleToggleFavorite}
            onDeleteItem={handleDeleteGarment}
            onResetWardrobe={handleResetWardrobe}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {/* Screen 3: Calendar (Takvim) */}
        {currentScreen === 'calendar' && (
          <CalendarScreen
            events={events}
            onToggleReminder={handleToggleReminder}
            onAddEvent={handleAddCalendarEvent}
          />
        )}

        {/* Screen 4: Profile (Profilim) */}
        {currentScreen === 'profile' && (
          <ProfileScreen
            user={userProfile}
            wardrobeCount={wardrobe.length}
            onUpdateUser={handleUpdateUser}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onLogout={() => setCurrentScreen('login')}
          />
        )}

        {/* Sub-screen 1: Camera Scan (Kıyafet Tara / Kamera) */}
        {currentScreen === 'camera' && (
          <CameraScanScreen
            onSaveToCloset={handleSaveToCloset}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {/* Sub-screen 2: AI Stylist Chat (Stilist Asistanı) */}
        {currentScreen === 'stylist' && (
          <StylistChatScreen
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onResetChat={handleResetChat}
            isAiTyping={isAiResponding}
          />
        )}

        {/* Auth 1: Login Screen */}
        {currentScreen === 'login' && (
          <LoginScreen
            onLoginSuccess={() => setCurrentScreen('home')}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {/* Auth 2: Register Screen */}
        {currentScreen === 'register' && (
          <RegisterScreen
            onRegisterSuccess={(name, email) => {
              handleUpdateUser({ name, email });
              setCurrentScreen('home');
            }}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {/* Auth 3: Forgot Password Screen */}
        {currentScreen === 'forgot_password' && (
          <ForgotPasswordScreen onNavigate={(screen) => setCurrentScreen(screen)} />
        )}
      </div>

      {/* Universal Bottom Navigation on Main Tab Screens */}
      {isTabScreen && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />
      )}
    </div>
  );
}
