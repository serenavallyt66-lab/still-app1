"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
  const [isSaving, setIsSaving] = useState(false);
  const isMounted = useRef(false);
  const router = useRouter();

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
    if (user === undefined) return; // Wait for auth state to be determined

    const initialize = async () => {
      isMounted.current = false; // Prevent save effect from running on this initial load
      const guestDraft = localStorage.getItem("draft_guest");
      const alreadyMigrated = localStorage.getItem("guest_migrated");

      if (user) {
        // User is logged in
        if (guestDraft && guestDraft.trim().length > 0 && !alreadyMigrated) {
          // ONE-TIME MIGRATION: Guest draft exists and has never been migrated
          setText(guestDraft); // Set text in UI immediately
          await saveDraft(user.uid, guestDraft); // Save to cloud
          localStorage.setItem("guest_migrated", "true"); // Mark as migrated
          localStorage.removeItem("draft_guest"); // Clean up local draft
        } else {
          // RETURNING USER: Load their draft from the cloud
          const cloudDraft = await loadDraft(user.uid);
          setText(cloudDraft || "");
        }
      } else {
        // GUEST: Load draft from local storage
        setText(guestDraft || "");
      }
      // Allow saving effects to run after this initial setup is complete
      setTimeout(() => {
        isMounted.current = true;
      }, 50);
    };

    initialize();
  }, [user]); // This effect runs only when auth state changes

  // Effect for saving data (separated for clarity)
  useEffect(() => {
    // Do not run on the initial render/data load
    if (!isMounted.current) {
      return;
    }

    // --- GUEST SAVING ---
    if (!user) {
      if (text.trim().length > 0) {
        localStorage.setItem("draft_guest", text);
      } else {
        localStorage.removeItem("draft_guest");
      }
      return; // End here for guests
    }

    // --- LOGGED-IN SAVING (DEBOUNCED) ---
    const handler = setTimeout(() => {
      setIsSaving(true);
      
      const savePromise = saveDraft(user.uid, text);
      // Ensure the saving indicator is visible for at least 500ms to avoid flickering
      const minDisplayTimePromise = new Promise(resolve => setTimeout(resolve, 500));

      Promise.all([savePromise, minDisplayTimePromise])
        .catch((error) => {
          console.error("Error saving draft:", error);
        })
        .finally(() => {
          setIsSaving(false);
        });
    }, 1500); // 1.5-second debounce

    return () => {
      clearTimeout(handler);
    };
  }, [text, user]); // This effect runs when text or user changes

  const handleLogout = () => {
    setText(""); // Hard reset of text state on logout
    logout();
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800 font-serif px-6 md:px-12 py-10 transition-colors duration-500">
      {isAuthModalOpen && <AuthPage onDismiss={handleDismissModal} />}

      {/* TOP BAR */}
      <div className="max-w-2xl mx-auto flex justify-between items-center mb-10 text-[13px] md:text-xs font-sans tracking-wide text-stone-400 select-none">
        <span className="flex items-center gap-2 animate-fade-in">
          {user === undefined ? (
            <span className="w-4 h-4 border-2 border-stone-200 border-t-stone-400 rounded-full animate-spin" />
          ) : user ? (
            isSaving ? (
              <>
                <Cloud size={14} className="animate-pulse" />
                <span className="text-stone-500 font-medium">Saving...</span>
              </>
            ) : (
              <>
                <Cloud size={14} className="text-emerald-600/70" />
                <span className="text-stone-500 font-medium">
                  Draft secured
                </span>
              </>
            )
          ) : (
            <>
              <CloudOff size={14} />
              <span className="text-stone-500 font-medium">Local only</span>
            </>
          )}
        </span>

        {user ? (
          <button
            onClick={handleLogout}
            className="hover:text-stone-600 transition cursor-pointer"
          >
            Logout
          </button>
        ) : user === undefined ? null : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-2 hover:text-stone-600 transition cursor-pointer group"
          >
            <Lock size={12} className="group-hover:text-stone-600 transition" />
            Save privately
          </button>
        )}
      </div>

      {/* EDITOR */}
      <div className="max-w-2xl mx-auto relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
          spellCheck={false}
          placeholder="Write what’s on your mind. Messy is fine."
          className="
            w-full
            h-[65vh]
            bg-transparent
            resize-none
            outline-none
            border-none
            text-xl md:text-2xl
            leading-relaxed
            placeholder:text-stone-300
            placeholder:italic
            selection:bg-stone-200
            disabled:opacity-50
          "
          disabled={user === undefined}
        />

        {/* SOFT GUIDANCE */}
        {text.length > 0 && text.length < 400 && (
          <div className="mt-6 flex flex-col items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <p className="text-[14px] md:text-xs text-stone-400 font-sans italic">
              You don’t have to finish this.
            </p>

            {/* CONVERSION MOMENT */}
            {!user && text.length > 120 && (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="
                  text-xs
                  font-sans
                  text-stone-400
                  hover:text-stone-700
                  underline
                  underline-offset-4
                  transition
                  cursor-pointer
                "
              >
                Keep this safe across devices
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
