import React, { useState } from 'react';
import { APP_LOGO } from '../data/initialData';
import { ScreenType } from '../types';

interface ForgotPasswordScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-4 sm:px-6 py-8 w-full max-w-[460px] mx-auto animate-in fade-in duration-300">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest p-2 shadow-sm border border-[#E8DEC8]/60 flex items-center justify-center mb-3">
          <img src={APP_LOGO} alt="Akıllı Dolap" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-[26px] font-semibold text-on-surface tracking-tight">
          Şifremi Unuttum
        </h1>
        <p className="text-[13px] text-on-surface-variant max-w-[300px] mt-1 leading-relaxed">
          Kayıtlı e-posta adresinizi girin, sıfırlama bağlantısını anında iletelim.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-7 shadow-sm border border-[#E8DEC8]/60">
        {isSubmitted ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">mark_email_read</span>
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">Bağlantı Gönderildi!</h3>
            <p className="text-[12px] text-on-surface-variant leading-relaxed">
              <strong>{email}</strong> adresine şifre sıfırlama yönergeleri iletildi.
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full h-11 bg-primary text-on-primary rounded-xl font-semibold text-[13px] shadow-sm hover:bg-primary-container active:scale-98 transition-all"
              >
                Giriş Ekranına Dön
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Kayıtlı E-Posta
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[19px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  placeholder="ornek@eposta.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low border border-surface-container-high text-[13px] text-on-surface outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-primary text-on-primary font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container active:scale-98 transition-all"
            >
              <span>Sıfırlama Bağlantısı Gönder</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-[12px] text-primary font-medium hover:underline"
              >
                Giriş Ekranına Geri Dön
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
