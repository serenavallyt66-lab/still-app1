import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function saveDraft(uid: string, text: string) {
  await setDoc(doc(db, "drafts", uid), { text });
}

export async function loadDraft(uid: string) {
  const snap = await getDoc(doc(db, "drafts", uid));
  return snap.exists() ? snap.data().text : "";
}
