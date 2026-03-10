'use client';
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Feather, Menu, X } from "lucide-react";
import EditorPage from "./editor/page";
import Link from "next/link";
import { onAuth } from "@/lib/auth";

/**
 * 🧱 COMPONENTS: BRANDING
 * Self-contained SVG logos and brand components
 */

function StillLogoMark({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {/* Outer frame — stability */}
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke="#78716c"
        strokeWidth="1"
      />

      {/* Inner still line — focus / cursor */}
      <line
        x1="12"
        y1="7"
        x2="12"
        y2="17"
        stroke="#a8a29e"
        strokeWidth="1"
      />
    </svg>
  );
}

function StillLogo() {
  return (
    <div className="flex items-center gap-3 select-none">
      <StillLogoMark size={26} />
      <span className="font-serif text-[15px] tracking-tight text-stone-800">
        Still
      </span>
    </div>
  );
}

// Simple Intersection Hook for animations
function useIntersect<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, visible };
}


// Helper for scroll reveal sections
function ScrollBlock({ title, desc }: { title: string; desc: string }) {
  const { ref, visible } = useIntersect<HTMLDivElement>({ threshold: 0.2 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      }`}
    >
      <h2 className="font-serif text-3xl md:text-4xl text-stone-800 mb-4">{title}</h2>
      <p className="font-sans text-lg text-stone-500 leading-relaxed max-w-md">
        {desc}
      </p>
    </div>
  );
}

/**
 * 🚀 MAIN LANDING PAGE / APP ENTRY
 */
export default function AppEntry() {
  // 'loading' is the default state to prevent hydration errors.
  // The correct view is determined client-side based on auth state and localStorage.
  const [view, setView] = useState<'landing' | 'editor' | 'loading'>('loading');
  const [initialAuthOpen, setInitialAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const authChecked = useRef(false);

  // This effect runs once on the client to determine the correct initial view.
  useEffect(() => {
    if (authChecked.current) return; // Prevent double-runs in React 18 Strict Mode
    authChecked.current = true;

    // The onAuth function from Firebase is the single source of truth for auth state.
    const unsubscribe = onAuth((user) => {
      if (user) {
        // A user is logged in. Go directly to the editor.
        setView("editor");
      } else {
        // No user is logged in (they are a guest). Check for a local draft.
        const guestDraft = localStorage.getItem("draft_guest");
        if (guestDraft && guestDraft.trim().length > 0) {
          // Guest has a draft, go to the editor.
          setView("editor");
        } else {
          // Guest has no draft, show the landing page.
          setView("landing");
        }
      }
    });

    // It's important to clean up the listener when the component unmounts.
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this effect runs only once on mount.


  const handleSignInClick = () => {
    setInitialAuthOpen(true);
    setView("editor");
    setIsMobileMenuOpen(false);
  };

  const navLinkClass =
    "text-sm font-sans text-stone-500 hover:text-stone-700 transition-colors";
  
  // Render a blank page on the server and during the initial client 'loading' state.
  // This guarantees no hydration mismatch and provides a clean, flicker-free experience.
  if (view === 'loading') {
    return null;
  }

  // If a draft exists or user is logged in, render the editor component directly.
  if (view === "editor") {
    return <EditorPage 
             key={initialAuthOpen ? 'auth-open' : 'auth-closed'} 
             initialAuthModalOpen={initialAuthOpen} 
             onAuthModalDismiss={() => setInitialAuthOpen(false)}
           />;
  }

  // If no valid draft exists and user is not logged in, show the main landing page.
  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800 selection:bg-stone-200 overflow-x-hidden relative">
      
      {/* TOP LEFT BRAND */}
      <header className="absolute top-0 inset-x-0 z-20 px-6 md:px-10 py-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <StillLogo />

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/pricing" className={navLinkClass}>
              Pricing
            </Link>
            <button
              className="text-sm font-sans text-stone-400 hover:text-stone-600 transition-colors"
              onClick={handleSignInClick}
            >
              Sign in
            </button>
          </nav>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            className="md:hidden text-stone-600 hover:text-stone-800 transition-colors"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMobileMenuOpen ? (
          <nav className="md:hidden mt-4 rounded-2xl border border-stone-200/80 bg-[#fcfbf9]/95 backdrop-blur px-4 py-4 shadow-sm flex flex-col gap-3">
            <Link
              href="/pricing"
              className={navLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <button
              className="w-fit text-sm font-sans text-stone-400 hover:text-stone-600 transition-colors"
              onClick={handleSignInClick}
            >
              Sign in
            </button>
          </nav>
        ) : null}
      </header>
      
      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center relative">
        <div className="max-w-3xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

          <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] tracking-tight text-stone-900">
            Write things out.
            <br />
            <span className="italic text-stone-600">Slowly.</span>
          </h1>

          <p className="font-sans text-stone-500 text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed">
            A quiet writing space for people who think deeply
            and don’t want to be rushed by tools.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 pt-6">
            <button
              onClick={() => setView("editor")}
              className="group font-sans text-stone-800 border-b border-stone-800
                         pb-1 flex items-center gap-2 hover:text-stone-500
                         hover:border-stone-400 transition-all duration-300"
            >
              Try without account
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2
                                     group-hover:opacity-100 group-hover:translate-x-0
                                     transition-all duration-300" />
            </button>

            <button 
              className="text-sm font-sans text-stone-400 hover:text-stone-600 transition-colors"
              onClick={handleSignInClick}
            >
              Sign in to save privately
            </button>
          </div>

          {/* Trust signal */}
          <p className="text-[10px] uppercase tracking-widest font-sans text-stone-300 pt-12">
            No tracking · No analytics · No AI scoring
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 opacity-20 animate-[bounce_3s_infinite]">
          <div className="w-[1px] h-12 bg-stone-800"></div>
        </div>
      </section>

      {/* PHILOSOPHY BLOCKS */}
      <section className="max-w-2xl mx-auto px-6 py-32 space-y-32 md:space-y-48">
        <ScrollBlock
          title="This isn’t productivity software."
          desc="No streaks. No metrics. No urgency. This is a place to think without being evaluated."
        />
        <ScrollBlock
          title="Private by design."
          desc="Your writing stays local unless you choose otherwise. We don’t train models on your thoughts."
        />
        <ScrollBlock
          title="Sustainable, not extractive."
          desc="A small paid tier will support calm infrastructure — not ads, not manipulation."
        />
      </section>

      {/* FOOTER */}
      <footer className="text-center py-24 px-6">
        <div className="opacity-40 hover:opacity-100 transition-opacity duration-700">
          <Feather className="w-5 h-5 mx-auto text-stone-400 mb-4" />
          <p className="font-sans text-xs text-stone-500 tracking-widest uppercase">
            Breathe · Write · Return
          </p>
        </div>
        <div className="text-xs text-stone-400 font-sans space-x-6 mt-8">
            <Link href="/terms" className="hover:text-stone-600 transition-colors">Terms of Service</Link>
            <span className="text-stone-300">·</span>
            <Link href="/privacy" className="hover:text-stone-600 transition-colors">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}
