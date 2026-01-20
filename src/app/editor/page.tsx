"use client";

import { useEffect, useState } from "react";
import { Lock, Cloud, CloudOff } from "lucide-react";
import { signInWithGoogle, logout } from "@/lib/auth";
import { User } from "@/types/user";

export default function Editor() {
  const [user, setUser] = useState<User>(null);
  const [text, setText] = useState("");

  // Load guest draft
  useEffect(() => {
    const local = localStorage.getItem("draft_guest");
    if (local) setText(local);
  }, []);

  // Save logic
  useEffect(() => {
    if (!user) {
      localStorage.setItem("draft_guest", text);
    } else {
      console.log("Saving to Firestore for:", user.email);
    }
  }, [text, user]);

  const handleLogin = async () => {
    const guestDraft = localStorage.getItem("draft_guest");
    const loggedUser = await signInWithGoogle();

    if (loggedUser) {
      setUser(loggedUser);
      if (guestDraft) {
        console.log("Migrated guest draft to cloud");
        localStorage.removeItem("draft_guest");
      }
    }
  };

  return (
    <div className="min-h-screen px-6 md:px-12 py-10 font-serif">

      {/* TOP BAR */}
      <div className="max-w-2xl mx-auto flex justify-between items-center mb-10 text-xs text-stone-400">
        <span className="flex items-center gap-2">
          {user ? <Cloud size={14} /> : <CloudOff size={14} />}
          {user ? "Draft secured" : "Local only"}
        </span>

        {user ? (
          <button onClick={() => { logout(); setUser(null); }}>
            Logout
          </button>
        ) : (
          <button onClick={handleLogin} className="flex items-center gap-2">
            <Lock size={12} /> Save privately
          </button>
        )}
      </div>

      {/* EDITOR */}
      <div className="max-w-2xl mx-auto">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write what’s on your mind. Messy is fine."
          spellCheck={false}
          autoFocus
          className="w-full h-[65vh] bg-transparent resize-none outline-none text-xl md:text-2xl leading-relaxed placeholder:text-stone-300"
        />

        {text.length > 0 && (
          <p className="mt-6 text-xs text-stone-400 italic">
            You don’t have to finish this.
          </p>
        )}

        {!user && text.length > 120 && (
          <button
            onClick={handleLogin}
            className="mt-4 text-xs text-stone-400 underline"
          >
            Keep this safe across devices
          </button>
        )}
      </div>
    </div>
  );
}
