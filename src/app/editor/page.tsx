
"use client";

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
  // This ref is critical to prevent debounced saves during the initial data load/migration.
  const isInitialized = useRef(false);

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

  // Main effect for loading data and handling the critical guest-to-logged-in migration.
  // This is designed to be robust against re-runs from the auth listener.
  useEffect(() => {
    // Don't run on the initial undefined state while waiting for the auth check.
    if (user === undefined) return;

    const initializeUserData = async () => {
      isInitialized.current = false; // Prevent other effects until initialization is complete.
      
      if (user) { // A user is logged in.
        // Atomically read both sources of truth before making any decisions.
        const cloudDraft = await loadDraft(user.uid);
        const guestDraft = localStorage.getItem("draft_guest");

        // CASE 1: The user has an existing draft in the cloud. This is the highest priority.
        if (cloudDraft !== null) {
          setText(cloudDraft);
          setSaveState("saved");
        } 
        // CASE 2: The user's cloud account is empty, but a local guest draft exists. Migrate it.
        else if (guestDraft && guestDraft.trim()) {
          setText(guestDraft); // Show content immediately.
          setSaveState("saving");
          await saveDraft(user.uid, guestDraft); // Save to cloud.
          setSaveState("saved");
        } 
        // CASE 3: New user with no drafts anywhere. Start fresh.
        else {
          setText("");
          setSaveState("idle");
        }

        // Clean up the local draft only after all logic is complete to prevent race conditions.
        localStorage.removeItem("draft_guest");

      } 
      // CASE 4: The user is a guest (logged out).
      else {
        const guestDraft = localStorage.getItem("draft_guest");
        setText(guestDraft || "");
        setSaveState("idle");
      }

      // Initialization is complete. Allow other effects (like debounced saving) to run.
      setTimeout(() => {
        isInitialized.current = true;
      }, 50);
    };

    initializeUserData();
  }, [user]);

  // --- TEXT CHANGE & SAVING LOGIC ---

  // On typing, immediately show "Saving..." for logged-in users.
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (user) {
      setSaveState("saving");
    }
  };

  // Debounced save to Firestore for logged-in users.
  useEffect(() => {
    if (!user || !isInitialized.current || saveState !== 'saving') {
      return;
    }

    const handler = setTimeout(() => {
      saveDraft(user.uid, text).then(() => {
        setSaveState("saved");
      });
    }, 800); // Debounce time

    return () => clearTimeout(handler);
  }, [text, user, saveState]);

  // Local-only save for guests.
  useEffect(() => {
    if (user || !isInitialized.current) return;
    localStorage.setItem("draft_guest", text);
  }, [text, user]);

  // Micro-polish: Reset 'saved' state to 'idle' after a delay.
  useEffect(() => {
    if (saveState === 'saved' && isInitialized.current) {
      const timer = setTimeout(() => setSaveState('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveState]);

  // --- ACTIONS & RENDER ---

  const handleLogout = () => {
    if (!user) {
      localStorage.setItem("draft_guest", text);
    }
    logout();
    setText(""); 
    setSaveState("idle");
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800 font-serif px-6 md:px-12 py-10 transition-colors duration-500">
      
      {isAuthModalOpen && <AuthPage onDismiss={handleDismissModal} />}

      <div className="max-w-2xl mx-auto flex justify-between items-center mb-10 text-[13px] md:text-xs font-sans tracking-wide text-stone-400 select-none">
        <span className="flex items-center gap-2 animate-fade-in h-4">
          {user === undefined ? (
            <span className="w-4 h-4 border-2 border-stone-200 border-t-stone-400 rounded-full animate-spin" />
          ) : user ? (
            <>
              {saveState === 'saving' && (
                <>
                  <Cloud size={14} className="animate-pulse" />
                  <span className="text-stone-500 font-medium">Saving...</span>
                </>
              )}
              {saveState === 'saved' && (
                <>
                  <Cloud size={14} className="text-emerald-600/70" />
                  <span className="text-stone-500 font-medium">Draft secured</span>
                </>
              )}
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

        {!user && text.length > 120 && (
          <div className="mt-6 flex flex-col items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <button onClick={() => setAuthModalOpen(true)} className="text-xs font-sans text-stone-400 hover:text-stone-700 underline underline-offset-4 transition cursor-pointer">
              Keep this safe across devices
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
