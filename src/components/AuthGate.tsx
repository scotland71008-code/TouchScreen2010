import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import OctaveLogo from './OctaveLogo';

interface AuthGateProps {
  onLoginSuccess: (username: string) => void;
}

export default function AuthGate({ onLoginSuccess }: AuthGateProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const cleanUser = username.trim().toLowerCase();
      const cleanPass = password.trim();

      if (cleanUser === 'ali' && cleanPass === 'leapksa') {
        try {
          sessionStorage.setItem('octave_auth_user', 'ali');
          localStorage.setItem('octave_auth_user', 'ali');
        } catch {
          // ignore storage restrictions
        }
        onLoginSuccess('ali');
      } else {
        setError('Invalid username or password. Please check your credentials.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07090e] text-white flex items-center justify-center p-4 select-none overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-md bg-neutral-900/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Branding & Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <OctaveLogo iconSize={44} variant="full" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-mono font-bold uppercase tracking-widest">
            <Icons.ShieldCheck className="w-3.5 h-3.5" />
            <span>ADIPEC Hall 12 - Stand #12610</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Sign In to Access Terminal
          </h1>
          <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
            Enter your credentials to unlock the Octave Enterprise Showcase & Architecture Workspace.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2 animate-shake">
              <Icons.AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Icons.User className="w-4 h-4" />
              </div>
              <input
                id="login-username-input"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="ali"
                autoFocus
                required
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-sm font-semibold text-white placeholder-neutral-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 transition-all font-mono"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Icons.Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-sm font-semibold text-white placeholder-neutral-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-sky-400 hover:bg-sky-300 active:scale-[0.99] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Icons.Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Icons.LogIn className="w-4 h-4" />
                <span>Unlock Exhibition Terminal</span>
              </>
            )}
          </button>
        </form>

        {/* Exhibition Notice Footer */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <span>ADIPEC Hall 12 - Stand #12610</span>
          <span>Octave v1.0</span>
        </div>
      </div>
    </div>
  );
}
