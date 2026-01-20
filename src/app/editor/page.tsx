"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, Cloud, CloudOff } from "lucide-react";
import { onAuth, logout } from "@/lib/auth";
import { saveDraft, loadDraft } from "@/lib/firestore";
import { User } from "@/types/user";
import AuthPage from "@/components/AuthPage";

export default function Editor() {
  const [user, setUser] = useState<User | undefined>(undefined); // undefined for loading state
  const [text, setText] = useState("");
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const searchParams = useSearchParams();

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

    const initializeDraft = async () => {
      const guestDraft = localStorage.getItem("draft_guest");

      if (user) {
        // User is logged IN
        if (guestDraft) {
          // A guest draft exists, migrate it. This is now the source of truth.
          setText(guestDraft);
          await saveDraft(user.uid, guestDraft);
          localStorage.removeItem("draft_guest");
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
    if (user === undefined) {
      return;
    }
    
    setIsSaving(true);
    const handler = setTimeout(() => {
      if (user) {
        saveDraft(user.uid, text).finally(() => setIsSaving(false));
      } else {
        localStorage.setItem("draft_guest", text);
        setIsSaving(false);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    }
  }, [text, user]);


  const handleLoginSuccess = (newUser: User) => {
    if (!newUser) return;
    // The useEffect listening to onAuth will handle the state change and data migration.
    // We just need to close the modal.
    // We can also optimistically set the user to make the UI feel faster.
    setUser(newUser);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUser(null); // Let the onAuth listener handle state changes for consistency
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
