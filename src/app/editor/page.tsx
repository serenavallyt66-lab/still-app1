
"use client";

import { useEffect, useState } from "react";
import { Lock, Cloud, CloudOff } from "lucide-react";
import { onAuth, logout } from "@/lib/auth";
import { saveDraft, loadDraft } from "@/lib/firestore";
import type { User } from "@/types/user";
import AuthPage from "@/components/AuthPage";

let authProcessLock = false; // Module-level lock to prevent race conditions

export default function EditorPage({
  initialAuthModalOpen = false,
  onAuthModalDismiss,
}: {
  initialAuthModalOpen?: boolean;
  onAuthModalDismiss?: () => void;
}) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isAuthModalOpen, setAuthModalOpen] = useState(initialAuthModalOpen);
  
  // States based on the "Single Source of Truth" architecture
  const [mode, setMode] = useState<"guest" | "logged" | "loading">("loading");
  const [guestText, setGuestText] = useState("");
  const [cloudText, setCloudText] = useState("");
  const [isMigrating, setIsMigrating] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("saved");
  
  const editorText = mode === "guest" ? guestText : cloudText;

  // --- AUTH & INITIAL DATA LOAD ---

  const handleDismissModal = () => {
    setAuthModalOpen(false);
    onAuthModalDismiss?.();
  };
  
  const handleOpenAuthModal = () => {
    // Force-save guest text to localStorage before opening the auth modal
    // to prevent race conditions where state update hasn't been persisted yet.
    if (mode === 'guest') {
      localStorage.setItem('draft_guest', guestText);
    }
    setAuthModalOpen(true);
  };

  useEffect(() => {
    if (initialAuthModalOpen) {
      setAuthModalOpen(true);
    }
  }, [initialAuthModalOpen]);

  // Main effect to orchestrate mode changes based on auth state.
  useEffect(() => {
    const unsubscribe = onAuth(async (newUser) => {
      if (authProcessLock) return; // If a process is already running, ignore subsequent calls.
      authProcessLock = true;     // Acquire the lock.

      try {
        // If there's a user, we're in logged mode.
        if (newUser) {
          setUser(newUser); // Keep user object for other parts of UI

          // This is the critical migration and loading logic.
          setIsMigrating(true);
          const existingCloudDraft = await loadDraft(newUser.uid);

          // CASE 1: Cloud has content. It is the source of truth.
          if (existingCloudDraft && existingCloudDraft.trim()) {
            setCloudText(existingCloudDraft);
            setSaveState("saved");
          }
          // CASE 2: Cloud is empty (null or ""). We can migrate.
          else {
            const localGuestDraft = localStorage.getItem("draft_guest");
            // Check if there's a local draft to migrate.
            if (localGuestDraft && localGuestDraft.trim()) {
              setCloudText(localGuestDraft); // Show content immediately
              await saveDraft(newUser.uid, localGuestDraft); // Save to cloud
              setSaveState("saved");
            }
            // CASE 3: Cloud is empty and no local draft exists.
            else {
              setCloudText("");
              setSaveState("saved");
            }
          }

          // Migration is complete, switch to logged mode and clean up guest state.
          setGuestText("");
          localStorage.removeItem("draft_guest");
          setMode("logged");
  
          setIsMigrating(false);
          handleDismissModal();
        }
        // No user, we're in guest mode.
        else {
          setUser(null);
          const localGuestDraft = localStorage.getItem("draft_guest");
          setGuestText(localGuestDraft || "");
          setCloudText(""); // Clear cloud text on logout
          setMode("guest");
        }
      } finally {
        authProcessLock = false; // Always release the lock.
      }
    });

    return () => {
      unsubscribe();
      authProcessLock = false; // Also release on component unmount.
    };
  }, []); // This runs only once to set up the auth listener.

  // --- TEXT CHANGE & SAVING LOGIC ---

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (mode === "guest") {
      setGuestText(newText);
    } else if (mode === "logged") {
      setCloudText(newText);
      setSaveState("saving");
    }
  };

  // Debounced save to Firestore for logged-in users.
  useEffect(() => {
    if (mode !== "logged" || saveState !== "saving" || isMigrating) {
      return;
    }

    const handler = setTimeout(() => {
      // Ensure user is still logged in before saving
      if (user) {
        saveDraft(user.uid, cloudText).then(() => {
          setSaveState("saved");
        });
      }
    }, 800);

    return () => clearTimeout(handler);
  }, [cloudText, mode, saveState, user, isMigrating]);

  // Local-only save for guests.
  useEffect(() => {
    if (mode !== "guest") return;
    localStorage.setItem("draft_guest", guestText);
  }, [guestText, mode]);

  // --- ACTIONS & RENDER ---

  const handleLogout = async () => {
    await logout();
    // onAuth listener will handle state change to 'guest' mode.
  };

  const isLoading = mode === "loading" || isMigrating;

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800 font-serif px-6 md:px-12 py-10 transition-colors duration-500">
      
      {isAuthModalOpen && <AuthPage onDismiss={handleDismissModal} />}

      <div className="max-w-2xl mx-auto flex justify-between items-center mb-10 text-[13px] md:text-xs font-sans tracking-wide text-stone-400 select-none">
        <span className="flex items-center gap-2 animate-fade-in h-4">
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-stone-200 border-t-stone-400 rounded-full animate-spin" />
          ) : mode === 'logged' ? (
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
          ) : ( // guest mode
            <>
              <CloudOff size={14} />
              <span className="text-stone-500 font-medium">Local only</span>
            </>
          )}
        </span>

        {mode === 'logged' ? (
          <button onClick={handleLogout} className="hover:text-stone-600 transition cursor-pointer">
            Logout
          </button>
        ) : mode === 'loading' ? null : ( // guest mode
          <button onClick={handleOpenAuthModal} className="flex items-center gap-2 hover:text-stone-600 transition cursor-pointer group">
            <Lock size={12} className="group-hover:text-stone-600 transition" />
            Save privately
          </button>
        )}
      </div>

      <div className="max-w-2xl mx-auto relative">
        <textarea
          value={editorText}
          onChange={handleTextChange}
          autoFocus
          spellCheck={false}
          placeholder="Write what’s on your mind. Messy is fine."
          className="w-full h-[65vh] bg-transparent resize-none outline-none border-none text-xl md:text-2xl leading-relaxed placeholder:text-stone-300 placeholder:italic selection:bg-stone-200 disabled:opacity-50"
          disabled={isLoading}
        />

        {mode === 'guest' && guestText.length > 120 && (
          <div className="mt-6 flex flex-col items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <button onClick={handleOpenAuthModal} className="text-xs font-sans text-stone-400 hover:text-stone-700 underline underline-offset-4 transition cursor-pointer">
              Keep this safe across devices
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
