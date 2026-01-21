import { db } from "./firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export async function saveDraft(uid: string, text: string) {
  // Save the draft to a 'default' document within a 'drafts' subcollection.
  const draftRef = doc(db, "users", uid, "drafts", "default");
  await setDoc(
    draftRef,
    {
      content: text,
      updatedAt: serverTimestamp(),
    },
    { merge: true } // Creates the doc if it doesn't exist, merges if it does.
  );
}

export async function loadDraft(uid: string) {
  // Load the draft from the 'default' document within the 'drafts' subcollection.
  const draftRef = doc(db, "users", uid, "drafts", "default");
  const snap = await getDoc(draftRef);
  return snap.exists() ? snap.data().content || "" : "";
}
