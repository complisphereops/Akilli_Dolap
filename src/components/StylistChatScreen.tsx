import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ScreenType } from '../types';
import { APP_LOGO } from '../data/initialData';

interface StylistChatScreenProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onResetChat: () => void;
  isAiTyping?: boolean;
}

export const StylistChatScreen: React.FC<StylistChatScreenProps> = ({
  messages,
  onSendMessage,
  onNavigate,
  onResetChat,
  isAiTyping = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLocalTyping, setIsLocalTyping] = useState(false);
  const isTyping = isLocalTyping || isAiTyping;
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    { label: 'Hangi ayakkabı uyar?', icon: 'styler' },
    { label: 'Hava soğursa ne giyeyim?', icon: 'wb_cloudy' },
    { label: 'Takı önerisi yap', icon: 'flare' },
    { label: 'Daha rahat bir alternatif', icon: 'tune' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    onSendMessage(text.trim());
    setInputText('');
    setIsLocalTyping(true);

    setTimeout(() => {
      setIsLocalTyping(false);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-safe animate-in fade-in duration-200">
      {/* Sub-header context navigation bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-md border-b border-[#E8DEC8]/50 shadow-xs pt-safe">
        <div className="max-w-[480px] mx-auto px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              aria-label="Geri Dön"
              onClick={() => onNavigate('home')}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">chevron_left</span>
            </button>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-on-surface truncate">
                  Stilist Asistanı
                </span>
                <span className="material-symbols-outlined text-primary text-[15px] fill-1">
                  auto_awesome
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[11px] text-on-surface-variant truncate">
                  Kişisel Stil Danışmanın • Çevrimiçi
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Sohbeti Temizle"
              onClick={onResetChat}
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[19px]">restart_alt</span>
            </button>
            <button
              type="button"
              aria-label="Seçenekler"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[480px] mx-auto w-full pt-20 pb-36 px-5 flex flex-col space-y-4">
        {/* Pinned Context: Seçili Kombin */}
        <div className="bg-surface-container-low rounded-2xl p-3.5 shadow-xs border border-[#E8DEC8]/50 relative overflow-hidden">
          <div className="flex items-center justify-between pb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[17px]">checkroom</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                SEÇİLİ KOMBİN
              </span>
            </div>
            <span className="bg-surface-container text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#E8DEC8]/40">
              Dolabından Seçildi
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-surface-container-highest flex-shrink-0 shadow-xs border border-white/60">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtcfSnUOVmSGc_rqxw4PsFcy2BBxQBz5AixneNHPnB7i6XqzOWl_vQbG2IWxaKyE_h0GPy_WOG-e0k4EiFhkWn56yZstYlEWNEQh_qkJTiEA2jBsuDBx3xdiMTOnizH8uLjiSijmDjCybWPZIth_kiA4fUjyZKc8OvGikzj6GaFUUVHedmcLmgdLJtP4KONqKdIiORm_Jeex7-vhdVSrGOjODJSnRLguHy4G2QMs79XI-6bnK0OFB-Q"
                alt="Akşam Yemeği Kombini"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <h4 className="text-[14px] font-bold text-on-surface truncate">
                Akşam Yemeği Kombini
              </h4>
              <p className="text-[12px] text-on-surface-variant truncate mt-0.5">
                İpek Bluz & Keten Pantolon
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-tertiary">
                <span className="material-symbols-outlined text-[15px]">pin_drop</span>
                <span className="text-[11px] font-medium truncate">
                  Boğaz Kıyısı • 20:00 (19°C)
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">keyboard_arrow_right</span>
            </button>
          </div>
        </div>

        {/* Time Separator */}
        <div className="flex items-center justify-center py-1">
          <span className="text-[11px] font-medium px-3 py-1 bg-surface-container-high rounded-full text-on-surface-variant shadow-2xs">
            Bugün, 18:40
          </span>
        </div>

        {/* Chat Log Thread */}
        <div className="flex flex-col gap-4">
          {messages.map((msg) => {
            const isStylist = msg.sender === 'stylist';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  isStylist ? 'max-w-[94%]' : 'max-w-[88%] self-end justify-end'
                }`}
              >
                {/* Stylist Avatar */}
                {isStylist && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow-xs bg-primary-fixed border border-primary/20">
                    <img src={APP_LOGO} alt="Stylist" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className={`flex flex-col gap-1 flex-1 min-w-0 ${!isStylist ? 'items-end' : ''}`}>
                  {/* Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl shadow-xs leading-relaxed ${
                      isStylist
                        ? 'bg-surface-container-low text-on-surface rounded-tl-xs border border-[#E8DEC8]/50'
                        : 'bg-primary text-on-primary rounded-tr-xs'
                    }`}
                  >
                    <p className="text-[13px] leading-relaxed">{msg.text}</p>

                    {/* Optional Suggested Wardrobe Card Attached to message */}
                    {msg.suggestedItem && (
                      <div className="mt-3 bg-surface-container-lowest p-2.5 rounded-xl flex items-center justify-between gap-2.5 shadow-xs border border-[#E8DEC8]/60">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-12 h-14 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 relative">
                            <img
                              src={msg.suggestedItem.image}
                              alt={msg.suggestedItem.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                              Dolabından Öneri
                            </span>
                            <span className="text-[13px] font-semibold text-on-surface truncate">
                              {msg.suggestedItem.name}
                            </span>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: msg.suggestedItem.colorHex }}
                              />
                              <span className="text-[11px] text-on-surface-variant truncate">
                                {msg.suggestedItem.brandColor}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setAddedItems({
                              ...addedItems,
                              [msg.id]: !addedItems[msg.id],
                            });
                          }}
                          className={`px-3 py-1.5 rounded-lg flex items-center gap-1 flex-shrink-0 text-[11px] font-bold shadow-xs active:scale-95 transition-all ${
                            addedItems[msg.id]
                              ? 'bg-primary-fixed text-on-primary-fixed'
                              : 'bg-primary text-on-primary hover:bg-primary-container'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {addedItems[msg.id] ? 'check' : 'add'}
                          </span>
                          <span>{addedItems[msg.id] ? 'Eklendi' : 'Ekle'}</span>
                        </button>
                      </div>
                    )}

                    {/* Optional Comparison Cards */}
                    {msg.comparisons && (
                      <div className="flex flex-col gap-2 pt-2.5 mt-1">
                        {msg.comparisons.map((comp, cIdx) => (
                          <div
                            key={cIdx}
                            className={`p-2.5 rounded-xl flex items-center justify-between shadow-2xs border ${
                              comp.recommended
                                ? 'bg-surface-container-lowest border-primary/20'
                                : 'bg-surface-container-lowest/80 border-surface-container-high'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="material-symbols-outlined text-primary text-[19px]">
                                {comp.icon}
                              </span>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[12px] font-semibold text-on-surface truncate">
                                  {comp.title}
                                </span>
                                <span className="text-[10px] text-on-surface-variant">
                                  {comp.subtitle}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                comp.recommended
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-surface-container text-on-surface-variant'
                              }`}
                            >
                              {comp.match}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Timestamp & read receipts */}
                  <div className="flex items-center gap-1 px-1">
                    <span className="text-[10px] text-on-surface-variant/70">
                      {msg.timestamp}
                    </span>
                    {!isStylist && (
                      <span className="material-symbols-outlined text-[13px] text-primary fill-1">
                        done_all
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-2.5 max-w-[80%]">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-primary-fixed border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[16px] animate-pulse">
                  auto_awesome
                </span>
              </div>
              <div className="bg-surface-container-low px-4 py-3 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-1.5 border border-[#E8DEC8]/50">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                ></span>
                <span className="text-[11px] text-outline ml-1">Stilist hazırlanıyor...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Interactive Controls & Floating Quick Suggestion Tray */}
      <footer className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-[#E8DEC8]/60 pt-2 pb-safe px-4 shadow-[0_-8px_20px_rgba(60,52,42,0.05)]">
        <div className="max-w-[480px] mx-auto flex flex-col gap-2 pb-2">
          {/* Quick Suggestion Action Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-2 px-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q.label)}
                className="bg-surface-container-high hover:bg-surface-container-highest active:bg-primary active:text-on-primary text-on-surface px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all shadow-2xs flex items-center gap-1.5 flex-shrink-0 border border-[#E8DEC8]/40"
              >
                <span className="material-symbols-outlined text-[15px] text-primary">
                  {q.icon}
                </span>
                <span>{q.label}</span>
              </button>
            ))}
          </div>

          {/* Input Bar Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="bg-surface-container-lowest rounded-full p-1.5 pl-3.5 flex items-center gap-2 shadow-md border border-[#E8DEC8]/70"
          >
            {/* Wardrobe attachment picker */}
            <button
              type="button"
              aria-label="Dolabımdan Parça Seç"
              onClick={() => onNavigate('closet')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[19px]">checkroom</span>
            </button>

            {/* Text field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Stilistine soru sor..."
              className="bg-transparent flex-1 min-w-0 text-[13px] text-on-surface placeholder:text-outline focus:outline-none py-1"
            />

            {/* Voice input */}
            <button
              type="button"
              aria-label="Sesli Mesaj"
              onClick={() => handleSend('Bu kombine uygun alternatif bir çanta önerir misin?')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[19px]">mic</span>
            </button>

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              aria-label="Gönder"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-xs flex-shrink-0 ${
                inputText.trim()
                  ? 'bg-primary text-on-primary active:scale-95'
                  : 'bg-surface-container-high text-outline cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};
