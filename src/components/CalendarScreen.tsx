import React, { useState } from 'react';
import { CalendarEvent } from '../types';

interface CalendarScreenProps {
  events: CalendarEvent[];
  onToggleReminder: (eventId: string) => void;
  onAddEvent: (newEvent: CalendarEvent) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  events,
  onToggleReminder,
  onAddEvent,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(4); // 4 = Bugün (31 Mayıs)
  const [readyHangerId, setReadyHangerId] = useState<string | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('Gündelik Şık');
  const [newTime, setNewTime] = useState('14:00');

  const days = [
    { name: 'Pzt', number: 27, hasDot: true },
    { name: 'Sal', number: 28, hasDot: false },
    { name: 'Çar', number: 29, hasDot: true },
    { name: 'Per', number: 30, hasDot: false },
    { name: 'BUGÜN', number: 31, isToday: true, hasDot: true },
    { name: 'Cmt', number: 1, hasDot: true },
    { name: 'Paz', number: 2, hasDot: true },
  ];

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newCalEvent: CalendarEvent = {
      id: `cal-${Date.now()}`,
      dayIndex: selectedDay,
      dateString: '31 Mayıs Cuma',
      title: newTitle,
      tag: newTag,
      tagClass: 'bg-primary-fixed text-on-primary-fixed',
      timeRange: newTime,
      temperature: '23°C',
      stylistNote: 'Stil Danışmanı: Seçtiğin parçalar günün saatine ve mekana uyumlu şekilde organize edildi.',
      reminderLabel: 'Öncesinde Hatırlat (1 Saat Önce)',
      isReminderOn: true,
      isConfirmed: false,
      garments: [
        {
          name: 'Keten Gömlek',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdUXOCemwdTsM08bn6E6Vww9uk5G8jKNuPNLRj0jnIMLC1aHlRTytKAFYFq-qjqCYu1uOrqF7gotJTqA2-HzAxvdgmk8-7QsE6Hj3WHUPtmW7TmQ9h1cGCAy3m1at7BAOqFOEY8RyQzZjPjJrAbadLqMVY8NyjF53RhVq9W-3hEw0iZcAGzlWq-O4hlhbZiwNdQ8gh6E0qXk44nSIh41mOjvkO_Tj30OZhOBc9EmCe8DhIV-yFARgBbw',
        },
        {
          name: 'Pileli Pantolon',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUP3DM8T64CnXt2E9mYkbRPRKQjFFED-1Zyidto-Whqx2KBNWaE3G9dHdajLlC2NFBG1KPNA0NLlaSxerR9sSw_GtOY9O1LhF1-qA8yRXrUfGvP0BYMAcC6gEDwnKeR_Imvs7HrkXze1fL6btLVKWS87wZcssPMyGlUettZxF7ns6AJt74Somep4iCmFXajRI8PCQDTVmwXlJaIluo6aMZJ2dtEZVyeTfRxECABrUK9fCAXIiAVD_TdQ',
        },
        {
          name: 'Deri Loafer',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgvA8NdPxS5kcbTdtv8xVJDcZyPuNGhBpmec462n3jW1lWK3KHVs457ibQ6CruJo_G0xv87nSH2jDxzFxUfd5dLPhUEi-QBgwMf4RplAsIAfbmgaHCxI7uzXlTO-BbX4RK0A1_h3JiicO-p5G_kGVmCwqOIzQlu52Vu3CyWf0r8gD2-s5_vED5giOBQk4kInHkaK13J77jTkFGaDNav5j4wQ6bRAcRNqX0NuuaHOHYfm-2BZHEoCmjrA',
        },
        {
          name: 'Örgü Çanta',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAshCGC1T34E7fyQzA3aLIx9pxn_MXJG_tyLosW8CESTIsFSoxvLmFwu6mqjevswm5zsPdVRAHWyTBZlRbwxFADj3JcMdUhIccOeivtEGY6-V_Jj8-tXCpNzgobdMnKa-ClOQlaF_GocfD7XUCo9mW1Pxs5hQOJmRcS1wQqx7YE1rxwIGzdu4cBKYbBCQzuNtz8v1bHuOiLI0odmwzblWLuZnvO8FtbOCa-jHKAcarxcVCJ5bzVNWN67g',
        },
      ],
    };

    onAddEvent(newCalEvent);
    setNewTitle('');
    setShowPlanModal(false);
  };

  return (
    <div className="flex flex-col w-full px-5 pt-3 pb-28 gap-4 animate-in fade-in duration-300">
      {/* Top Section Title & Month Context */}
      <div className="flex items-end justify-between pt-1">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-secondary font-bold">
            HAFTALIK PLANLAYICI
          </span>
          <h1 className="text-[26px] font-semibold text-on-surface tracking-tight mt-0.5">
            Kombin Takvimi
          </h1>
          <p className="text-[12px] text-on-surface-variant font-medium">
            Haftalık stil programın & özel etkinliklerin
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container shadow-xs text-primary transition-all active:scale-95 border border-[#E8DEC8]/50"
        >
          <span className="text-[12px] text-primary font-semibold">Haziran 2024</span>
          <span className="material-symbols-outlined text-[17px]">calendar_month</span>
        </button>
      </div>

      {/* Weekly Horizontal Calendar Strip */}
      <div className="bg-surface-container-lowest rounded-2xl p-2.5 shadow-xs border border-[#E8DEC8]/60">
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((d, index) => {
            const isSelected = selectedDay === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedDay(index)}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-sm scale-105'
                    : 'hover:bg-surface-container-low text-on-surface'
                }`}
              >
                <span
                  className={`text-[10px] font-semibold uppercase ${
                    isSelected ? 'text-on-primary-container' : 'text-on-surface-variant'
                  }`}
                >
                  {d.name}
                </span>
                <span
                  className={`text-[15px] font-bold mt-1 ${
                    isSelected ? 'text-on-primary' : 'text-on-surface'
                  }`}
                >
                  {d.number}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                    isSelected
                      ? 'bg-secondary-container'
                      : d.hasDot
                      ? 'bg-primary/50'
                      : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Planlanan Kombinler Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <h2 className="text-[17px] font-bold text-on-surface tracking-tight">
            Planlanan Kombinler
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
            {events.length} Etkinlik
          </span>
        </div>
        <button
          type="button"
          className="text-[12px] text-primary font-bold flex items-center gap-0.5 hover:underline"
        >
          <span>Tümünü Gör</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </button>
      </div>

      {/* Cards Container */}
      <div className="flex flex-col gap-3.5">
        {events.map((event) => {
          const isHangerReady = readyHangerId === event.id;

          return (
            <div
              key={event.id}
              className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#E8DEC8]/60 flex flex-col gap-3 relative overflow-hidden"
            >
              {/* Top Badges & Meta */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${event.tagClass}`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {event.tag.includes('Kokteyl') ? 'celebration' : 'business_center'}
                      </span>
                      {event.tag}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {event.timeRange}
                    </span>
                  </div>
                  <h3 className="text-[15px] text-on-surface font-semibold mt-0.5">
                    {event.title}
                  </h3>
                </div>

                {event.statusTag ? (
                  <div className="flex items-center gap-1 bg-secondary-container/40 text-on-secondary-container px-2 py-1 rounded-full text-[11px] font-bold shrink-0">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>{event.statusTag}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full text-on-surface-variant text-[11px] font-semibold shrink-0">
                    <span className="material-symbols-outlined text-[15px] text-tertiary">
                      wb_sunny
                    </span>
                    <span>{event.temperature}</span>
                  </div>
                )}
              </div>

              {/* Garment Preview Mosaic (4 pieces) */}
              <div className="grid grid-cols-4 gap-2 bg-surface-container-low p-2 rounded-xl border border-[#E8DEC8]/40">
                {event.garments.map((g, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="aspect-[4/5] bg-surface-container-highest rounded-lg overflow-hidden shadow-2xs">
                      <img
                        src={g.image}
                        alt={g.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] text-on-surface-variant truncate text-center font-medium">
                      {g.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* AI Stylist Note */}
              <div className="flex items-start gap-2.5 bg-primary-fixed-dim/20 p-3 rounded-xl text-on-surface border border-primary-fixed-dim/30">
                <span className="material-symbols-outlined text-primary text-[17px] mt-0.5 fill-1">
                  auto_awesome
                </span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  <strong className="font-semibold text-primary">Stil Danışmanı:</strong> "
                  {event.stylistNote}"
                </p>
              </div>

              {/* Reminder Switch */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    notifications_active
                  </span>
                  <span className="text-[12px] font-medium text-on-surface">
                    {event.reminderLabel}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Hatırlatıcıyı değiştir"
                  onClick={() => onToggleReminder(event.id)}
                  className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    event.isReminderOn ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      event.isReminderOn ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Card Action Buttons */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => alert(`"${event.title}" kombini düzenleme ekranı açıldı.`)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-primary text-on-primary text-[12px] font-semibold text-center shadow-xs active:scale-98 transition-transform"
                >
                  Kombini Düzenle
                </button>

                <button
                  type="button"
                  onClick={() => setReadyHangerId(isHangerReady ? null : event.id)}
                  className={`py-2.5 px-3 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 active:scale-98 transition-all border ${
                    isHangerReady
                      ? 'bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed'
                      : 'bg-surface-container text-on-surface border-[#E8DEC8]/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">dry_cleaning</span>
                  <span>{isHangerReady ? 'Askıda Hazır!' : 'Askıya Hazırla'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Floating Button Area */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowPlanModal(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-primary text-on-primary text-[15px] font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Yeni Gün Planla</span>
        </button>
      </div>

      {/* New Event Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-[#E8DEC8]/60 space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest">
              <h3 className="text-[15px] font-bold text-on-surface">Yeni Kombin Planla</h3>
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                  Etkinlik Adı
                </label>
                <input
                  type="text"
                  placeholder="Örn: Akşam Yemeği, Kahve Buluşması"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container-high text-[13px] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                    Stil Konsepti
                  </label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full h-11 px-2.5 bg-surface-container-low rounded-xl border border-surface-container-high text-[12px] outline-none"
                  >
                    <option value="Ofis & Şık">Ofis & Şık</option>
                    <option value="Gündelik Şık">Gündelik Şık</option>
                    <option value="Kokteyl & Davet">Kokteyl & Davet</option>
                    <option value="Rahat & Spor">Rahat & Spor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                    Saat
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container-high text-[12px] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-primary text-on-primary rounded-xl font-semibold text-[13px] shadow-sm active:scale-98"
                >
                  Takvime Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
