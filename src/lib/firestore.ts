import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

export async function saveDraft(uid: string, text: string) {
  const draftRef = doc(db, "users", uid, "drafts", "default");
  const docSnap = await getDoc(draftRef);

  if (docSnap.exists()) {
    // Document exists, just update it.
    await updateDoc(draftRef, {
      content: text,
      updatedAt: serverTimestamp(),
    });
  } else {
    // Document doesn't exist, create it with createdAt.
    await setDoc(draftRef, {
      content: text,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function loadDraft(uid: string) {
  // Load the draft from the 'default' document within the 'drafts' subcollection.
  const draftRef = doc(db, "users", uid, "drafts", "default");
  const snap = await getDoc(draftRef);
  return snap.exists() ? snap.data().content || "" : "";
}
