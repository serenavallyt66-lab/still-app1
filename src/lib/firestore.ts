import { db } from "./firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export async function saveDraft(uid: string, text: string) {
  // Using the 'users' collection and saving the correct data structure.
  await setDoc(
    doc(db, "users", uid),
    {
      content: text,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function loadDraft(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  // Reading from the 'content' field to match the save structure.
  return snap.exists() ? snap.data().content || "" : "";
}
