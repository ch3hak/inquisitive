import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export function makeRandomCode(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export async function generateQuizCode(length = 8) {
  const colRef = collection(db, "quizzes");
  let code, exists;
  do {
    code = makeRandomCode(length);
    const q = query(colRef, where("quizCode", "==", code));
    const snap = await getDocs(q);
    exists = !snap.empty;
  } while (exists);
  return code;
}