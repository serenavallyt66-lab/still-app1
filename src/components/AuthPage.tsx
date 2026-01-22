"use client";

import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { signUpWithEmailAndPassword, signInWithEmailAndPassword } from '@/lib/auth';

const AuthPage = ({ onDismiss }: { onDismiss: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState('');
  
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnimating(true);
    setError('');
    try {
      // Optimistically try to sign up the user. This handles new users.
      await signUpWithEmailAndPassword(email, password);
      // If successful, onAuthStateChanged handles the rest.
    } catch (signUpError: any) {
      // If it fails because the email is already in use...
      if (signUpError.code === 'auth/email-already-in-use') {
        try {
          // ...then we know they are an existing user, so we sign them in.
          await signInWithEmailAndPassword(email, password);
        } catch (signInError: any) {
          // If sign-in fails, it's almost certainly a wrong password.
          if (signInError.code === 'auth/wrong-password' || signInError.code === 'auth/invalid-credential') {
            setError('Incorrect password for this email. Please try again.');
          } else {
            setError('An unexpected error occurred during sign-in.');
          }
          setIsAnimating(false);
        }
      } else if (signUpError.code === 'auth/weak-password') {
        // Handle other specific sign-up errors, like a weak password.
        setError('Password should be at least 6 characters.');
        setIsAnimating(false);
      } else {
        // Handle any other unexpected errors during the process.
        setError('An unexpected error occurred. Please try again.');
        setIsAnimating(false);
      }
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
          
          <p className="text-slate-600 font-medium mb-2 whitespace-pre-line">
            Save your progress
          </p>

          <p className="text-xs text-slate-400 leading-relaxed max-w-[85%] mx-auto">
            Create an account or sign in with your email to keep your draft.
          </p>
        </div>

        {error && <p className="text-center text-xs text-red-500 mb-4 animate-in fade-in">{error}</p>}

        <div className="space-y-3">
          <form onSubmit={handleEmailAuth} className="space-y-3 pt-2">
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
              placeholder="Password (6+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-1 focus:ring-slate-300 focus:border-slate-300 block p-3 outline-none"
              required
            />
            <button
              type="submit"
              disabled={isAnimating}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3.5 rounded-xl transition-colors text-sm shadow-md shadow-slate-200 flex justify-center items-center disabled:opacity-50"
            >
              {isAnimating ? 'Saving...' : 'Save Progress'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
