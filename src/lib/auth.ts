import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";
import type { User } from "@/types/user";

export function onAuth(callback: (user: User) => void) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({ uid: user.uid, email: user.email || "" });
    } else {
      callback(null);
    }
  });
}

export async function signInWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

export async function signUpWithEmailAndPassword(
  email: string,
  password: string
): Promise<void> {
  await createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<void> {
  await firebaseSignInWithEmail(auth, email, password);
}

export async function logout() {
  await signOut(auth);
}
