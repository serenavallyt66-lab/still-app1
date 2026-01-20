import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { User } from "@/types/user";

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user.email) {
      return {
        uid: result.user.uid,
        email: result.user.email,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error during sign-in:", error);
    return null;
  }
}

export async function logout() {
  await signOut(auth);
}
