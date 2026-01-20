'use client';
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Feather, Lock } from "lucide-react";

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

/**
 * 🚀 MAIN APPLICATION
 */

export default function App() {
  // Editor page removed. Only rendering Landing.
  return <Landing onEnter={() => alert("Editor view is currently disabled.")} />;
}

// ✅ LANDING COMPONENT (Unchanged, with Logo)
function Landing({ onEnter }) {
  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800 selection:bg-stone-200 overflow-x-hidden relative">
      
      {/* TOP LEFT BRAND */}
      <div className="absolute top-6 left-6 z-10">
        <StillLogo />
      </div>
      
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
            {/* Option preserved, but logic disconnected as Editor is removed */}
            <button
              onClick={onEnter}
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
              onClick={() => alert("Login coming soon.")}
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
        <div className="absolute bottom-10 animate-bounce duration-[3s] opacity-20">
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
      <footer className="text-center py-24 opacity-40 hover:opacity-100 transition-opacity duration-700">
        <Feather className="w-5 h-5 mx-auto text-stone-400 mb-4" />
        <p className="font-sans text-xs text-stone-500 tracking-widest uppercase">
          Breathe · Write · Return
        </p>
      </footer>
    </div>
  );
}

// Helper for scroll reveal
function ScrollBlock({ title, desc }) {
  const [ref, visible] = useIntersect({ threshold: 0.2 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
    >
      <h2 className="font-serif text-3xl md:text-4xl text-stone-800 mb-4">{title}</h2>
      <p className="font-sans text-lg text-stone-500 leading-relaxed max-w-md">
        {desc}
      </p>
    </div>
  );
}

// Simple Intersection Hook
const useIntersect = (options = {}) => {
  const [ref, setRef] = useState(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);
  return [setRef, visible];
};