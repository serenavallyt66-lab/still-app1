"use client";

import React, { useState } from 'react';
import { Mail, X, ShieldCheck } from 'lucide-react';
import { signInWithGoogle, signUpWithEmailAndPassword } from '@/lib/auth';

const AuthPage = ({ onDismiss, onLoginSuccess }: { onDismiss: () => void, onLoginSuccess: () => void }) => {
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setIsAnimating(true);
    setError('');
    try {
      await signInWithGoogle();
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      setError('Failed to sign in with Google.');
      setIsAnimating(false);
    }
  };
  
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnimating(true);
    setError('');
    try {
      await signUpWithEmailAndPassword(email, password);
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Try signing in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to create an account.');
      }
      setIsAnimating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm transition-all duration-500">
      
      <div className="relative w-full max-w-sm p-8 mx-4 bg-white shadow-2xl rounded-3xl border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
        
        <button 
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-full transition-all"
          aria-label="Stay as guest"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8 mt-2">
          <div className="mx-auto w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 text-emerald-600/80">
             <ShieldCheck size={20} strokeWidth={2} />
          </div>
          
          <p className="text-slate-600 font-medium mb-2">
            You’re already here. <br/>
            Sign in only if you want to keep this space.
          </p>

          <p className="text-xs text-slate-400 leading-relaxed max-w-[85%] mx-auto">
            Access your drafts from any device. Nothing else changes.
          </p>
        </div>

        {error && <p className="text-center text-xs text-red-500 mb-4 animate-in fade-in">{error}</p>}

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={isAnimating}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md hover:border-slate-300 group disabled:opacity-50"
          >
            {isAnimating && !emailMode ? (
               <span className="w-5 h-5 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-medium text-sm">Save with Google</span>
              </>
            )}
          </button>

          {!emailMode ? (
            <button
              onClick={() => setEmailMode(true)}
              disabled={isAnimating}
              className="w-full bg-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-700 py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 text-sm disabled:opacity-50"
            >
              <Mail size={18} />
              <span className="font-medium">Save with Email</span>
            </button>
          ) : (
            <form onSubmit={handleEmailSignUp} className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-1 duration-300">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-1 focus:ring-slate-300 focus:border-slate-300 block p-3 outline-none"
                required
              />
              <input
                type="password"
                placeholder="Set a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-1 focus:ring-slate-300 focus:border-slate-300 block p-3 outline-none"
                required
              />
              <div className="flex gap-2">
                 <button
                  type="submit"
                  disabled={isAnimating}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-colors text-sm shadow-md shadow-slate-200 flex justify-center items-center disabled:opacity-50"
                >
                  {isAnimating ? "Saving..." : "Save Progress"}
                </button>
                <button
                  type="button"
                  onClick={() => setEmailMode(false)}
                  className="px-4 bg-transparent hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
                  disabled={isAnimating}
                >
                  <X size={18} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
