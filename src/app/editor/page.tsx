"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Lock, Cloud, CloudOff } from "lucide-react";
import { onAuth, logout } from "@/lib/auth";
import { saveDraft, loadDraft } from "@/lib/firestore";
import type { User } from "@/types/user";
import AuthPage from "@/components/AuthPage";

export default function EditorPage({
  initialAuthModalOpen = false,
  onAuthModalDismiss,
}: {
  initialAuthModalOpen?: boolean;
  onAuthModalDismiss?: () => void;
}) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [text, setText] = useState("");
  const [isAuthModalOpen, setAuthModalOpen] = useState(initialAuthModalOpen);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const isMounted = useRef(false);

  // --- AUTH & INITIAL DATA LOAD ---

  useEffect(() => {
    if (initialAuthModalOpen) {
      setAuthModalOpen(true);
    }
  }, [initialAuthModalOpen]);

  const handleDismissModal = () => {
    setAuthModalOpen(false);
    onAuthModalDismiss?.();
  };

  useEffect(() => {
    const unsubscribe = onAuth((newUser) => {
      setUser(newUser);
      if (newUser) {
        handleDismissModal();
      }
    });
    return () => unsubscribe();
  }, []);

  // Effect for loading data and handling one-time migration
  useEffect(() => {
    if (user === undefined) return;

    const initialize = async () => {
      isMounted.current = false;
      const guestDraft = localStorage.getItem("draft_guest");
      const alreadyMigrated = localStorage.getItem("guest_migrated");

      if (user) {
        if (guestDraft && guestDraft.trim().length > 0 && !alreadyMigrated) {
          setSaveState("saving");
          await saveDraft(user.uid, guestDraft);
          localStorage.setItem("guest_migrated", "true");
          localStorage.removeItem("draft_guest");
          const cloudDraft = await loadDraft(user.uid);
          setText(cloudDraft || "");
          setSaveState("saved");
        } else {
          const cloudDraft = await loadDraft(user.uid);
          setText(cloudDraft || "");
          setSaveState("idle");
        }
      } else {
        setText(guestDraft || "");
        setSaveState("idle");
      }
      setTimeout(() => {
        isMounted.current = true;
      }, 50);
    };

    initialize();
  }, [user]);

  // --- TEXT CHANGE & SAVING LOGIC ---

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (user) {
      setSaveState("saving");
    }
  };

  // Debounced save to Firestore for logged-in users
  useEffect(() => {
    if (!isMounted.current || !user || saveState !== 'saving') {
      return;
    }
    
    const handler = setTimeout(() => {
      saveDraft(user.uid, text).then(() => {
        setSaveState("saved");
      });
    }, 800); // Debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [text, user, saveState]);

  // Local-only save for guests
  useEffect(() => {
    if (user || !isMounted.current) return;

    if (text.trim().length > 0) {
      localStorage.setItem("draft_guest", text);
    } else {
      localStorage.removeItem("draft_guest");
    }
  }, [text, user]);

  // Micro-polish: Reset 'saved' state to 'idle' after a delay
  useEffect(() => {
    if (saveState === 'saved') {
      const timer = setTimeout(() => {
        setSaveState('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [saveState]);

  // --- ACTIONS & RENDER ---

  const handleLogout = () => {
    logout();
    setText("");
    setSaveState("idle");
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800 font-serif px-6 md:px-12 py-10 transition-colors duration-500">
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center gap-3 select-none">
          <Image src="/logo.svg" width={28} height={28} alt="Still Logo Mark" />
          <span className="font-serif text-[15px] tracking-tight text-stone-800">
            Still
          </span>
        </div>
      </div>
      
      {isAuthModalOpen && <AuthPage onDismiss={handleDismissModal} />}

      <div className="max-w-2xl mx-auto flex justify-between items-center mb-10 text-[13px] md:text-xs font-sans tracking-wide text-stone-400 select-none">
        <span className="flex items-center gap-2 animate-fade-in">
          {user === undefined ? (
            <span className="w-4 h-4 border-2 border-stone-200 border-t-stone-400 rounded-full animate-spin" />
          ) : user ? (
            <>
              {saveState === 'saving' ? (
                <>
                  <Cloud size={14} className="animate-pulse" />
                  <span className="text-stone-500 font-medium">Saving...</span>
                </>
              ) : saveState === 'saved' ? (
                <>
                  <Cloud size={14} className="text-emerald-600/70" />
                  <span className="text-stone-500 font-medium">Draft secured</span>
                </>
              ) : null}
            </>
          ) : (
            <>
              <CloudOff size={14} />
              <span className="text-stone-500 font-medium">Local only</span>
            </>
          )}
        </span>

        {user ? (
          <button onClick={handleLogout} className="hover:text-stone-600 transition cursor-pointer">
            Logout
          </button>
        ) : user === undefined ? null : (
          <button onClick={() => setAuthModalOpen(true)} className="flex items-center gap-2 hover:text-stone-600 transition cursor-pointer group">
            <Lock size={12} className="group-hover:text-stone-600 transition" />
            Save privately
          </button>
        )}
      </div>

      <div className="max-w-2xl mx-auto relative">
        <textarea
          value={text}
          onChange={handleTextChange}
          autoFocus
          spellCheck={false}
          placeholder="Write what’s on your mind. Messy is fine."
          className="w-full h-[65vh] bg-transparent resize-none outline-none border-none text-xl md:text-2xl leading-relaxed placeholder:text-stone-300 placeholder:italic selection:bg-stone-200 disabled:opacity-50"
          disabled={user === undefined}
        />

        {text.length > 0 && text.length < 400 && (
          <div className="mt-6 flex flex-col items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <p className="text-[14px] md:text-xs text-stone-400 font-sans italic">
              You don’t have to finish this.
            </p>

            {!user && text.length > 120 && (
              <button onClick={() => setAuthModalOpen(true)} className="text-xs font-sans text-stone-400 hover:text-stone-700 underline underline-offset-4 transition cursor-pointer">
                Keep this safe across devices
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
