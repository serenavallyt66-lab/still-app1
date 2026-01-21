import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function saveDraft(uid: string, text: string) {
  // Using the 'users' collection as per the final correct architecture.
  await setDoc(doc(db, "users", uid), { text });
}

export async function loadDraft(uid:string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().text : "";
}
