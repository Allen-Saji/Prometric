import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";

export async function signInWithGoogle() {
  if (!isFirebaseConfigured || !auth) {
    // Demo mode: simulate login
    const demoUser = {
      uid: "demo-user",
      email: "demo@prometrichereo.com",
      displayName: "Demo User",
    };
    localStorage.setItem("demo-user", JSON.stringify(demoUser));
    return demoUser;
  }
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signInWithEmail(email: string, password: string) {
  if (!isFirebaseConfigured || !auth) {
    const demoUser = {
      uid: "demo-user",
      email,
      displayName: email.split("@")[0],
    };
    localStorage.setItem("demo-user", JSON.stringify(demoUser));
    return demoUser;
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  }
}

export async function signOut() {
  if (!isFirebaseConfigured || !auth) {
    localStorage.removeItem("demo-user");
    localStorage.removeItem("user-profile");
    localStorage.removeItem("daily-progress");
    return;
  }
  await firebaseSignOut(auth);
}
