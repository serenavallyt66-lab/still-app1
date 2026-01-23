
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
  const [isAuthModalOpen, setAuthModalOpen] = useState(initialAuthModalOpen);
  
  // This ref is the definitive guard to prevent race conditions and re-runs.
  // It tracks the ID of the user (or 'guest') for which initialization has completed.
  const initializedFor = useRef<string | null>(null);
  
  // The single text state that is controlled by the robust initialization logic.
  const [text, setText] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  // --- AUTH & INITIAL DATA LOAD ---

  const handleDismissModal = () => {
    setAuthModalOpen(false);
    onAuthModalDismiss?.();
  };

  useEffect(() => {
    if (initialAuthModalOpen) {
      setAuthModalOpen(true);
    }
  }, [initialAuthModalOpen]);

  useEffect(() => {
    const unsubscribe = onAuth((newUser) => {
      // If the user logs in or out, we must clear the initialization guard.
      // This allows the main data loading effect to run for the new state.
      if ((newUser?.uid || null) !== (user?.uid || null)) {
        initializedFor.current = null;
      }
      setUser(newUser);
      if (newUser) {
        handleDismissModal();
      }
    });
    return () => unsubscribe();
  }, [user?.uid]);


  // Main effect for loading data and handling the critical guest-to-logged-in migration.
  // This is designed to be robust against re-runs from the auth listener.
  useEffect(() => {
    // 1. Don't run if the auth state is still being determined.
    if (user === undefined) return;
    
    const currentId = user ? user.uid : 'guest';
    
    // 2. THE GUARD: If we have already run the initialization for this user/guest, do not proceed.
    if (initializedFor.current === currentId) {
      return;
    }
    
    const initializeUserData = async () => {
      // 3. Mark initialization as having run for this ID, preventing re-entry.
      initializedFor.current = currentId;
      
      // --- LOGGED-IN USER FLOW ---
      if (user) { 
        const guestDraft = localStorage.getItem("draft_guest");
        // IMPORTANT: Immediately remove the guest draft to prevent race conditions.
        localStorage.removeItem("draft_guest");
        
        const cloudDraft = await loadDraft(user.uid);

        // CASE 1: Cloud draft exists. It is the source of truth.
        if (cloudDraft !== null) {
          setText(cloudDraft);
          setSaveState("saved");
        } 
        // CASE 2: Cloud is empty, but a guest draft existed. Migrate it.
        else if (guestDraft && guestDraft.trim()) {
          setText(guestDraft); // Show content immediately.
          setSaveState("saving");
          await saveDraft(user.uid, guestDraft); // Save to cloud.
          setSaveState("saved");
        } 
        // CASE 3: New user, no drafts anywhere. Start fresh.
        else {
          setText("");
          setSaveState("idle");
        }
      } 
      // --- GUEST USER FLOW ---
      else {
        const guestDraft = localStorage.getItem("draft_guest");
        setText(guestDraft || "");
        setSaveState("idle");
      }
    };

    initializeUserData();
  }, [user]);

  // --- TEXT CHANGE & SAVING LOGIC ---

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (user) {
      setSaveState("saving");
    }
  };

  // Debounced save to Firestore for logged-in users.
  useEffect(() => {
    const currentId = user ? user.uid : 'guest';
    if (initializedFor.current !== currentId || !user || saveState !== 'saving') {
      return;
    }

    const handler = setTimeout(() => {
      saveDraft(user.uid, text).then(() => {
        setSaveState("saved");
      });
    }, 800);

    return () => clearTimeout(handler);
  }, [text, user, saveState]);

  // Local-only save for guests.
  useEffect(() => {
    const currentId = user ? user.uid : 'guest';
    if (initializedFor.current !== 'guest' || user) return;

    localStorage.setItem("draft_guest", text);
  }, [text, user]);

  // Micro-polish: Reset 'saved' state to 'idle' after a delay
  useEffect(() => {
    if (saveState === 'saved' && initializedFor.current !== null) {
      const timer = setTimeout(() => setSaveState('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveState]);

  // --- ACTIONS & RENDER ---

  const handleLogout = () => {
    // Logged data never leaks into guest mode on logout.
    logout();
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
               {saveState === 'idle' && text.length > 0 && <Cloud size={14} />}
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
