"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, Cloud, CloudOff } from "lucide-react";
import { onAuth, logout } from "@/lib/auth";
import { saveDraft, loadDraft } from "@/lib/firestore";
import type { User } from "@/types/user";
import AuthPage from "@/components/AuthPage";

export default function Editor() {
  const [user, setUser] = useState<User | undefined>(undefined); // undefined for loading state
  const [text, setText] = useState("");
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const searchParams = useSearchParams();

  // This ref is used to prevent the debounced save effect from running on initial data load.
  const isReadyForSaving = useRef(false);

  // Open auth modal if query param is present
  useEffect(() => {
    if (searchParams.get("auth") === "true" && user === null) {
      setAuthModalOpen(true);
    }
  }, [searchParams, user]);


  // Listen for auth state changes to be the single source of truth
  useEffect(() => {
    const unsubscribe = onAuth(setUser);
    return () => unsubscribe();
  }, []);

  // Effect to load initial data and handle guest->user migration
  useEffect(() => {
    if (user === undefined) {
      return; // Auth state is still loading
    }
    
    // Whenever the user changes, we are not ready for auto-saving until data is loaded.
    isReadyForSaving.current = false;

    const initializeDraft = async () => {
      const guestDraft = localStorage.getItem("draft_guest");

      if (user) {
        // User is logged IN
        if (guestDraft) {
          // A guest draft exists, migrate it by loading it into the editor.
          // The debounced save effect will automatically handle saving it to Firestore.
          setText(guestDraft);
        } else {
          // No guest draft, just load from the cloud
          const cloudDraft = await loadDraft(user.uid);
          setText(cloudDraft);
        }
      } else {
        // User is logged OUT
        setText(guestDraft || "");
      }
    };

    initializeDraft();
  }, [user]); // This effect runs only when user auth state is resolved or changes

  // Debounced save effect for any subsequent changes
  useEffect(() => {
    // If we're not ready for saving (because data was just loaded), we do two things:
    // 1. Mark that we are now ready for any FUTURE changes.
    // 2. Skip the current save.
    if (!isReadyForSaving.current) {
      isReadyForSaving.current = true;
      return;
    }
    
    // If we get here, it means the text change was initiated by the user, not by initial data load.
    const handler = setTimeout(() => {
      if (user) {
        // User is logged in, save to Firestore
        setIsSaving(true);
        saveDraft(user.uid, text)
          .then(() => {
            // If a cloud save is successful, we can safely remove any lingering guest draft.
            if (localStorage.getItem("draft_guest")) {
              localStorage.removeItem("draft_guest");
            }
          })
          .catch(error => {
            console.error("Error saving draft to Firestore:", error);
            // In a future step, we could show a toast notification to the user
          })
          .finally(() => setIsSaving(false));
      } else {
        // User is a guest, save to localStorage
        setIsSaving(true);
        localStorage.setItem("draft_guest", text);
        setIsSaving(false);
      }
    }, 1000); // 1-second debounce

    return () => {
      clearTimeout(handler);
    }
  }, [text, user]);


  const handleLoginSuccess = () => {
    // The onAuth listener will automatically update the user state.
    // All we need to do is close the modal.
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    // The onAuth listener will set the user to null.
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800 font-serif px-6 md:px-12 py-10 transition-colors duration-500">
      
      {isAuthModalOpen && (
        <AuthPage
          onDismiss={() => setAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* TOP BAR */}
      <div className="max-w-2xl mx-auto flex justify-between items-center mb-10 text-xs font-sans tracking-wide text-stone-400 select-none">
        <span className="flex items-center gap-2 animate-fade-in">
          {user === undefined ? (
            <span className="w-4 h-4 border-2 border-stone-200 border-t-stone-400 rounded-full animate-spin" />
          ) : user ? (
            <>
              <Cloud size={14} className="text-emerald-600/70" /> 
              <span className="text-stone-500 font-medium">
                {isSaving ? 'Saving...' : 'Draft secured'}
              </span>
            </>
          ) : (
            <>
              <CloudOff size={14} /> 
              {isSaving ? 'Saving...' : 'Local only'}
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
        {text.length > 0 && (
          <div className="mt-6 flex flex-col items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
             <p className="text-xs text-stone-400 font-sans italic">
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
