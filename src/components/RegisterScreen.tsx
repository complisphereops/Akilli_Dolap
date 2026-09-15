import React, { useState } from 'react';
import { APP_LOGO } from '../data/initialData';
import { ScreenType } from '../types';

interface RegisterScreenProps {
  onRegisterSuccess: (name: string, email: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onNavigate,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Style Preference
  const [selectedStyle, setSelectedStyle] = useState<string>('Kapsül & Minimalist');

  // Checkboxes
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [agreedMarketing, setAgreedMarketing] = useState(true);

  // Loading & error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['Zayıf', 'Zayıf', 'Orta', 'İyi', 'Güçlü'];
  const strengthColors = ['bg-outline', 'bg-error', 'bg-amber-500', 'bg-primary/80', 'bg-primary'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Lütfen ad ve soyadınızı giriniz.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Girdiğiniz şifreler birbiriyle eşleşmiyor.');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Devam etmek için kullanım şartlarını kabul etmelisiniz.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess(name, email);
    }, 450);
  };

  const handleSocialRegister = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess(name || `${provider} Kullanıcısı`, email || 'kullanici@eposta.com');
    }, 400);
  };

  const styleOptions = [
    { id: 'kapsul', label: 'Kapsül & Minimalist', icon: 'checkroom' },
    { id: 'ofis', label: 'İş & Akıllı Şık', icon: 'work' },
    { id: 'casual', label: 'Günlük & Rahat', icon: 'style' },
    { id: 'luks', label: 'Sessiz Lüks', icon: 'diamond' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-4 sm:px-6 py-8 w-full max-w-[460px] mx-auto animate-in fade-in duration-300">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest p-2 shadow-sm border border-[#E8DEC8]/60 flex items-center justify-center mb-3">
          <img src={APP_LOGO} alt="Akıllı Dolap" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-[26px] font-semibold text-on-surface tracking-tight">
          Dolabını Dijitalleştir
        </h1>
        <p className="text-[13px] text-on-surface-variant max-w-[320px] mt-1 leading-relaxed">
          Kişisel AI stilistinle zahmetsiz kombinler hazırla, gardırobundaki her parçaya yeniden hayat ver.
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-7 shadow-sm border border-[#E8DEC8]/60">
        {/* Card Tab Switcher */}
        <div className="flex items-center rounded-xl bg-surface-container p-1 mb-5">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="flex-1 py-2 text-[13px] font-medium text-on-surface-variant rounded-lg transition-all text-center hover:text-on-surface"
          >
            Giriş Yap
          </button>
          <button
            type="button"
            className="flex-1 py-2 text-[13px] font-semibold text-primary bg-surface-container-lowest rounded-lg shadow-xs transition-all text-center"
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
          {/* Ad Soyad */}
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
              Ad Soyad
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-outline text-[19px]">
                person
              </span>
              <input
                type="text"
                required
                placeholder="örn. Selin Kaya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low border border-surface-container-high text-[13px] text-on-surface outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* E-Posta Adresi */}
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
                required
                placeholder="ornek@eposta.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low border border-surface-container-high text-[13px] text-on-surface outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Şifre */}
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
              Şifre Belirleyin
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-outline text-[19px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Şifre Gücü Çubuğu */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-on-surface-variant">Şifre Gücü:</span>
                  <span className="font-semibold text-on-surface">
                    {strengthLabels[strength]}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                  <div
                    className={`rounded-full ${
                      strength >= 1 ? strengthColors[strength] : 'bg-surface-container-high'
                    }`}
                  ></div>
                  <div
                    className={`rounded-full ${
                      strength >= 2 ? strengthColors[strength] : 'bg-surface-container-high'
                    }`}
                  ></div>
                  <div
                    className={`rounded-full ${
                      strength >= 3 ? strengthColors[strength] : 'bg-surface-container-high'
                    }`}
                  ></div>
                  <div
                    className={`rounded-full ${
                      strength >= 4 ? strengthColors[strength] : 'bg-surface-container-high'
                    }`}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Şifre Tekrarı */}
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
              Şifre Tekrarı
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-outline text-[19px]">
                lock_reset
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Şifrenizi tekrar yazın"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full h-11 pl-10 pr-10 rounded-xl bg-surface-container-low border text-[13px] text-on-surface outline-none transition-colors ${
                  confirmPassword && confirmPassword !== password
                    ? 'border-error'
                    : confirmPassword && confirmPassword === password
                    ? 'border-primary'
                    : 'border-surface-container-high focus:border-primary'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[19px]">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {confirmPassword && confirmPassword !== password && (
              <span className="text-[11px] text-error mt-1 block">Şifreler uyuşmuyor</span>
            )}
          </div>

          {/* Tarz Tercihi */}
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Tarz Tercihin
            </label>
            <div className="grid grid-cols-2 gap-2">
              {styleOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedStyle(opt.label)}
                  className={`h-9 px-2.5 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 transition-all text-left truncate ${
                    selectedStyle === opt.label
                      ? 'bg-primary/10 border-primary text-primary font-semibold'
                      : 'bg-surface-container-low border-surface-container-high text-on-surface-variant hover:border-outline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] shrink-0">
                    {opt.icon}
                  </span>
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Onay Kutuları */}
          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-left select-none">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-primary accent-primary shrink-0"
              />
              <span className="text-[11px] text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface font-semibold">Kullanım Koşulları</strong> ve{' '}
                <strong className="text-on-surface font-semibold">Gizlilik Politikası</strong>'nı
                okudum, onaylıyorum.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-left select-none">
              <input
                type="checkbox"
                checked={agreedMarketing}
                onChange={(e) => setAgreedMarketing(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-primary accent-primary shrink-0"
              />
              <span className="text-[11px] text-on-surface-variant leading-relaxed">
                Günün hava durumuna göre kişiselleştirilmiş kombin ve stil bildirimleri almak istiyorum.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !agreedTerms}
              className="w-full h-12 rounded-xl bg-primary text-on-primary font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
              ) : (
                <>
                  <span>Hesabımı Oluştur</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Social Register Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-surface-container-high"></div>
          <span className="px-3 text-[11px] text-outline uppercase font-medium whitespace-nowrap text-center">
            veya tek tıkla kaydolun
          </span>
          <div className="flex-1 border-t border-surface-container-high"></div>
        </div>

        {/* Social Register Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleSocialRegister('Google')}
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
            <span>Google ile Kayıt Ol</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialRegister('Apple')}
            className="w-full h-11 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high font-semibold text-[13px] flex items-center justify-center gap-2.5 transition-colors active:scale-98"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.83-11.89-14.38-6.19-9.58-11.02-20.59-14.5-33.02-3.48-12.42-5.22-24.16-5.22-35.21 0-14.13 3.52-25.79 10.57-34.98 7.05-9.19 16-13.89 26.85-14.1 4.78 0 10.22 1.25 16.32 3.75 6.1 2.5 10.12 3.82 12.06 3.96 1.48-.27 5.6-1.68 12.35-4.23 6.75-2.55 12.27-3.71 16.58-3.48 11.85.66 21.35 4.9 28.51 12.72-10.45 6.31-15.56 14.86-15.34 25.66.22 8.37 3.48 15.39 9.8 21.05 6.31 5.66 13.8 8.92 22.46 9.79-2.28 6.75-5.11 13.71-8.5 20.88zM119.22 31.84c0-7.39 2.66-14.28 7.99-20.67 5.33-6.39 11.85-10.55 19.57-12.47.33 1.52.49 2.93.49 4.23 0 7.39-2.77 14.34-8.31 20.85-5.54 6.51-12.16 10.42-19.86 11.72-.11-1.19-.17-2.42-.17-3.66z"/>
            </svg>
            <span>Apple ile Kayıt Ol</span>
          </button>
        </div>

        {/* Back to Login Footer */}
        <div className="mt-5 text-center pt-2 border-t border-surface-container-high/60">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-[12px] text-on-surface-variant hover:text-primary font-medium"
          >
            Zaten bir hesabınız var mı?{' '}
            <strong className="text-primary underline font-semibold">Giriş Yapın</strong>
          </button>
        </div>
      </div>
    </div>
  );
};
