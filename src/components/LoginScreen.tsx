import React, { useState } from 'react';
import { APP_LOGO } from '../data/initialData';
import { ScreenType } from '../types';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Lütfen e-posta adresinizi giriniz.');
      return;
    }
    if (!password) {
      setErrorMsg('Lütfen şifrenizi giriniz.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 450);
  };

  const handleSocialLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-4 sm:px-6 py-8 w-full max-w-[460px] mx-auto animate-in fade-in duration-300">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest p-2 shadow-sm border border-[#E8DEC8]/60 flex items-center justify-center mb-3">
          <img src={APP_LOGO} alt="Akıllı Dolap" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-[26px] font-semibold text-on-surface tracking-tight">
          Akıllı Dolap
        </h1>
        <p className="text-[13px] text-on-surface-variant max-w-[320px] mt-1 leading-relaxed">
          Kişisel AI stilistin ve gardırop asistanın ile her gün özenli ve zahmetsiz giyinin.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-7 shadow-sm border border-[#E8DEC8]/60">
        {/* Card Tab Switcher */}
        <div className="flex items-center rounded-xl bg-surface-container p-1 mb-5">
          <button
            type="button"
            className="flex-1 py-2 text-[13px] font-semibold text-primary bg-surface-container-lowest rounded-lg shadow-xs transition-all text-center"
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="flex-1 py-2 text-[13px] font-medium text-on-surface-variant rounded-lg transition-all text-center hover:text-on-surface"
          >
            Kayıt Ol
          </button>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 flex items-start gap-2.5 text-error text-[12px]">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* E-Posta */}
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
              E-Posta Adresi
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-outline text-[19px]">
                mail
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ornek@eposta.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low border border-surface-container-high text-[13px] text-on-surface outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Şifre */}
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
              Şifre
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-outline text-[19px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Şifrenizi girin"
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-surface-container-low border border-surface-container-high text-[13px] text-on-surface outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[19px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Beni Hatırla & Şifremi Unuttum */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-primary accent-primary"
              />
              <span className="text-[12px] text-on-surface-variant">Beni Hatırla</span>
            </label>

            <button
              type="button"
              onClick={() => onNavigate('forgot_password')}
              className="text-[12px] font-medium text-primary hover:underline"
            >
              Şifremi Unuttum?
            </button>
          </div>

          {/* Giriş Butonu */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-primary text-on-primary font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Social Auth Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-surface-container-high"></div>
          <span className="px-3 text-[11px] text-outline uppercase font-medium whitespace-nowrap text-center">
            veya tek tıkla devam edin
          </span>
          <div className="flex-1 border-t border-surface-container-high"></div>
        </div>

        {/* Social Sign-in Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleSocialLogin}
            className="w-full h-11 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high font-semibold text-[13px] flex items-center justify-center gap-2.5 transition-colors active:scale-98"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google ile Devam Et</span>
          </button>

          <button
            type="button"
            onClick={handleSocialLogin}
            className="w-full h-11 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high font-semibold text-[13px] flex items-center justify-center gap-2.5 transition-colors active:scale-98"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.83-11.89-14.38-6.19-9.58-11.02-20.59-14.5-33.02-3.48-12.42-5.22-24.16-5.22-35.21 0-14.13 3.52-25.79 10.57-34.98 7.05-9.19 16-13.89 26.85-14.1 4.78 0 10.22 1.25 16.32 3.75 6.1 2.5 10.12 3.82 12.06 3.96 1.48-.27 5.6-1.68 12.35-4.23 6.75-2.55 12.27-3.71 16.58-3.48 11.85.66 21.35 4.9 28.51 12.72-10.45 6.31-15.56 14.86-15.34 25.66.22 8.37 3.48 15.39 9.8 21.05 6.31 5.66 13.8 8.92 22.46 9.79-2.28 6.75-5.11 13.71-8.5 20.88zM119.22 31.84c0-7.39 2.66-14.28 7.99-20.67 5.33-6.39 11.85-10.55 19.57-12.47.33 1.52.49 2.93.49 4.23 0 7.39-2.77 14.34-8.31 20.85-5.54 6.51-12.16 10.42-19.86 11.72-.11-1.19-.17-2.42-.17-3.66z"/>
            </svg>
            <span>Apple ile Giriş Yap</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-5 text-center pt-2 border-t border-surface-container-high/60">
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="text-[12px] text-on-surface-variant hover:text-primary font-medium"
          >
            Henüz bir hesabınız yok mu?{' '}
            <strong className="text-primary underline font-semibold">Hesap Oluşturun</strong>
          </button>
        </div>
      </div>
    </div>
  );
};
