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
  onAuthModalDismiss
}: {
  initialAuthModalOpen?: boolean;
  onAuthModalDismiss?: () => void;
}) {
  const [user, setUser] = useState<User | undefined>(undefined); // undefined: auth state is loading
  const [text, setText] = useState("");
  const [isAuthModalOpen, setAuthModalOpen] = useState(initialAuthModalOpen);
  const [isSaving, setIsSaving] = useState(false);
  const isMounted = useRef(false);
  const router = useRouter();

  // Handle parent component's request to open modal
  useEffect(() => {
    if(initialAuthModalOpen) {
      setAuthModalOpen(true);
    }
  }, [initialAuthModalOpen]);

  const handleDismissModal = () => {
    setAuthModalOpen(false);
    onAuthModalDismiss?.();
  };

  // Listen for auth state changes to be the single source of truth
  useEffect(() => {
    const unsubscribe = onAuth((newUser) => {
      setUser(newUser);
      // If we get a user object, it means login was successful.
      if (newUser) {
        handleDismissModal();
      }
    });
    return () => unsubscribe();
  }, []);

  // Effect to load initial data and handle guest->user migration
  useEffect(() => {
    if (user === undefined) {
      return; // Auth state is still loading, do nothing.
    }

    const initializeDraft = async () => {
      // Mark that initial load is happening.
      // This prevents the save effect from firing on this initial text change.
      isMounted.current = false;
      const guestDraft = localStorage.getItem("draft_guest");

      if (user) {
        // User is logged IN
        if (guestDraft && guestDraft.trim().length > 0) {
          // A guest draft exists, migrate it by loading it into the editor.
          // The debounced save effect will automatically handle saving it to Firestore.
          setText(guestDraft);
        } else {
          // No guest draft, just load from the cloud
          const cloudDraft = await loadDraft(user.uid);
          
          // If the cloud draft is empty, the user should be on the landing page.
          if (!cloudDraft || cloudDraft.trim().length === 0) {
              // This case should now be handled by the parent component logic, but as a fallback:
              // window.location.href = '/'; 
              // A hard redirect is safer if this component is ever rendered standalone.
              // For now, we assume parent component handles the view.
          }

          setText(cloudDraft || '');
        }
      } else {
        // User is logged OUT (is a guest)
        setText(guestDraft || "");
      }
      
      // Use a timeout to ensure this runs after the state has been set and rendered.
      setTimeout(() => {
        isMounted.current = true;
      }, 50);
    };

    initializeDraft();
  }, [user, router]); // This effect runs only when user auth state is resolved or changes

  // Save effect for any subsequent changes
  useEffect(() => {
    // Do not save on the very first render or during the initial data load.
    if (!isMounted.current) {
      return;
    }

    if (user) {
      // User is logged in, use debounced save to Firestore
      setIsSaving(true);
      const handler = setTimeout(() => {
        saveDraft(user.uid, text)
          .then(() => {
            // If a cloud save is successful, we can safely remove any lingering guest draft.
            if (localStorage.getItem("draft_guest")) {
              localStorage.removeItem("draft_guest");
            }
          })
          .catch((error) => {
            console.error("Error saving draft to Firestore:", error);
          })
          .finally(() => setIsSaving(false));
      }, 1500); // 1.5-second debounce

      return () => {
        clearTimeout(handler);
      };
    } else {
      // User is a guest. Save to localStorage immediately on text change.
      if (text.trim().length > 0) {
        localStorage.setItem("draft_guest", text);
      } else {
        localStorage.removeItem("draft_guest");
      }
    }
  }, [text, user]); // Rerun on text or user change


  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800 font-serif px-6 md:px-12 py-10 transition-colors duration-500">
      
      {isAuthModalOpen && (
        <AuthPage
          onDismiss={handleDismissModal}
        />
      )}

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
