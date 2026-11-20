import React, { useCallback, useEffect, useState } from 'react';
import { Delete, Lock, X } from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Language } from '../types/store';
import { TRANSLATIONS } from '../i18n/translations';
import { auth, MANAGER_EMAIL, PASSCODE_SUFFIX } from '../lib/firebase';
import { seedFirestoreIfEmpty } from '../lib/storeService';

interface PinPadModalProps {
  open: boolean;
  lang: Language;
  pinConfigured: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LOCK_KEY = 'cm_pad_lock_until';
const ATTEMPTS_KEY = 'cm_pad_attempts';
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 5 * 60 * 1000;

export const PinPadModal: React.FC<PinPadModalProps> = ({
  open,
  lang,
  pinConfigured,
  onClose,
  onSuccess,
}) => {
  const t = TRANSLATIONS[lang];
  const [pin, setPin] = useState('');
  const [setupFirstPin, setSetupFirstPin] = useState<string | null>(null);
  const [forceLoginOnly, setForceLoginOnly] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [lockUntil, setLockUntil] = useState<number>(() => {
    const raw = localStorage.getItem(LOCK_KEY);
    return raw ? Number(raw) : 0;
  });
  const [attempts, setAttempts] = useState<number>(() => {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    return raw ? Number(raw) : 0;
  });
  const [now, setNow] = useState(Date.now());

  const isSetupMode = !pinConfigured && !forceLoginOnly;
  const isLocked = lockUntil > now;
  const remainingSec = Math.max(0, Math.ceil((lockUntil - now) / 1000));

  useEffect(() => {
    if (!open) {
      setPin('');
      setSetupFirstPin(null);
      setErrorMsg('');
      return;
    }
    setNow(Date.now());
  }, [open]);

  useEffect(() => {
    if (!isLocked) return;
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= lockUntil) {
        localStorage.removeItem(LOCK_KEY);
        localStorage.setItem(ATTEMPTS_KEY, '0');
        setLockUntil(0);
        setAttempts(0);
        setErrorMsg('');
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isLocked, lockUntil]);

  const recordFailedAttempt = useCallback(() => {
    const next = attempts + 1;
    setAttempts(next);
    localStorage.setItem(ATTEMPTS_KEY, String(next));
    if (next >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCK_DURATION_MS;
      setLockUntil(until);
      setNow(Date.now());
      localStorage.setItem(LOCK_KEY, String(until));
    }
  }, [attempts]);

  const submitPin = useCallback(
    async (entered: string) => {
      if (busy || isLocked || entered.length !== 4) return;
      setErrorMsg('');

      if (isSetupMode) {
        if (!setupFirstPin) {
          setSetupFirstPin(entered);
          setPin('');
          return;
        }
        if (setupFirstPin !== entered) {
          setSetupFirstPin(null);
          setPin('');
          setErrorMsg(t.pinMismatch);
          return;
        }

        setBusy(true);
        try {
          await createUserWithEmailAndPassword(
            auth,
            MANAGER_EMAIL,
            entered + PASSCODE_SUFFIX
          );
          await seedFirestoreIfEmpty(true);
          localStorage.setItem(ATTEMPTS_KEY, '0');
          localStorage.removeItem(LOCK_KEY);
          setAttempts(0);
          setPin('');
          setSetupFirstPin(null);
          onSuccess();
        } catch (err: unknown) {
          const code = (err as { code?: string })?.code || '';
          if (code === 'auth/email-already-in-use') {
            // Account already exists — never show setup again
            setForceLoginOnly(true);
            setSetupFirstPin(null);
            try {
              await signInWithEmailAndPassword(
                auth,
                MANAGER_EMAIL,
                entered + PASSCODE_SUFFIX
              );
              await seedFirestoreIfEmpty(true);
              localStorage.setItem(ATTEMPTS_KEY, '0');
              setAttempts(0);
              setPin('');
              onSuccess();
            } catch {
              recordFailedAttempt();
              setErrorMsg(t.pinWrong);
              setPin('');
            }
          } else if (code === 'auth/operation-not-allowed') {
            setErrorMsg(t.pinProviderHelp);
            setPin('');
            setSetupFirstPin(null);
          } else {
            setErrorMsg(t.pinWrong);
            setPin('');
            setSetupFirstPin(null);
          }
        } finally {
          setBusy(false);
        }
        return;
      }

      // Standard 4-digit PIN Sign-In
      setBusy(true);
      try {
        await signInWithEmailAndPassword(
          auth,
          MANAGER_EMAIL,
          entered + PASSCODE_SUFFIX
        );
        await seedFirestoreIfEmpty(true);
        localStorage.setItem(ATTEMPTS_KEY, '0');
        localStorage.removeItem(LOCK_KEY);
        setAttempts(0);
        setPin('');
        onSuccess();
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code || '';
        if (code === 'auth/operation-not-allowed') {
          setErrorMsg(t.pinProviderHelp);
        } else {
          recordFailedAttempt();
          setErrorMsg(t.pinWrong);
        }
        setPin('');
      } finally {
        setBusy(false);
      }
    },
    [
      busy,
      isLocked,
      isSetupMode,
      setupFirstPin,
      t.pinMismatch,
      t.pinWrong,
      t.pinProviderHelp,
      onSuccess,
      recordFailedAttempt,
    ]
  );

  const handleDigit = useCallback(
    (digit: string) => {
      if (busy || isLocked || pin.length >= 4) return;
      const next = pin + digit;
      setPin(next);
      if (next.length === 4) {
        void submitPin(next);
      }
    },
    [busy, isLocked, pin, submitPin]
  );

  const handleBackspace = useCallback(() => {
    if (busy || isLocked) return;
    setPin((prev) => prev.slice(0, -1));
  }, [busy, isLocked]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, handleDigit, handleBackspace, onClose]);

  if (!open) return null;

  const mins = String(Math.floor(remainingSec / 60)).padStart(2, '0');
  const secs = String(remainingSec % 60).padStart(2, '0');

  const heading = isSetupMode ? t.pinSetupTitle : t.pinEnterTitle;
  const subheading = isSetupMode
    ? setupFirstPin
      ? t.pinConfirmSubtitle
      : t.pinSetupSubtitle
    : t.pinEnterSubtitle;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050A18]/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[#0E1A3B] border border-white/15 p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E6BFF]/15 text-[#1E6BFF] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                {heading}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{subheading}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#070E22] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 PIN Indicators */}
        <div className="flex items-center justify-center gap-4 py-2" dir="ltr">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                idx < pin.length
                  ? 'bg-[#1E6BFF] border-[#1E6BFF] scale-110 shadow-[0_0_12px_rgba(30,107,255,0.8)]'
                  : 'border-slate-500 bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Feedback / Lockout */}
        <div className="min-h-[24px] text-center">
          {isLocked ? (
            <p className="text-xs font-semibold text-rose-400 tabular-nums">
              {t.pinLocked} {mins}:{secs}
            </p>
          ) : errorMsg ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-rose-400">{errorMsg}</p>
              {attempts > 0 && !isSetupMode && (
                <p className="text-[11px] text-slate-400 tabular-nums">
                  {MAX_ATTEMPTS - attempts} {t.pinAttemptsLeft}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* Numeric Pad */}
        <div className="grid grid-cols-3 gap-3" dir="ltr">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={busy || isLocked}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-[#070E22] hover:bg-[#162859] active:scale-95 border border-white/10 text-white font-display text-xl font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              {digit}
            </button>
          ))}

          <button
            type="button"
            disabled={busy || isLocked}
            onClick={() => {
              setPin('');
              setErrorMsg('');
            }}
            className="h-14 rounded-2xl bg-[#070E22] hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
          >
            {t.clearKey}
          </button>

          <button
            type="button"
            disabled={busy || isLocked}
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-[#070E22] hover:bg-[#162859] active:scale-95 border border-white/10 text-white font-display text-xl font-bold transition-all disabled:opacity-40 cursor-pointer"
          >
            0
          </button>

          <button
            type="button"
            disabled={busy || isLocked}
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-[#070E22] hover:bg-white/10 border border-white/10 text-slate-300 flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
            aria-label={t.backKey}
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
