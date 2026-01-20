import { GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { User } from "@/types/user";

export function onAuth(callback: (user: User) => void) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({ uid: user.uid, email: user.email! });
    } else {
      callback(null);
    }
  });
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return {
    uid: result.user.uid,
    email: result.user.email!,
  };
}

export async function signUpWithEmailAndPassword(email: string, password: string): Promise<{uid: string, email: string}> {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return {
      uid: result.user.uid,
      email: result.user.email!,
    };
  }

export async function logout() {
  await signOut(auth);
}
