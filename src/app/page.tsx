"use client";

import { ArrowRight, Feather } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800">
      <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center">
        <div className="max-w-3xl space-y-12 animate-fade-in-up">

          <h1 className="font-serif text-5xl md:text-7xl leading-tight">
            Write things out.
            <br />
            <span className="italic text-stone-600">Slowly.</span>
          </h1>

          <p className="text-stone-500 text-lg md:text-xl max-w-xl mx-auto">
            A quiet writing space for people who think deeply and don’t want to be rushed.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <button
              onClick={() => router.push("/editor")}
              className="flex items-center gap-2 border-b border-stone-800 pb-1 hover:text-stone-500 transition"
            >
              Try without account <ArrowRight size={16} />
            </button>

            <button
              onClick={() => router.push("/editor")}
              className="text-stone-400 hover:text-stone-600"
            >
              Sign in to save privately
            </button>
          </div>

          <p className="text-xs uppercase tracking-widest text-stone-300 pt-12">
            No tracking · No analytics · No AI scoring
          </p>
        </div>
      </section>

      <footer className="text-center py-24 opacity-40">
        <Feather className="mx-auto mb-4" />
        <p className="text-xs tracking-widest">Breathe · Write · Return</p>
      </footer>
    </div>
  );
}
