import {
  signInWithCustomToken,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/auth/firebase-client";

/**
 * Signs in using a Firebase custom token returned by the NestJS backend.
 * Called after `POST /auth/login` succeeds with a valid T.Z. + password.
 */
export async function signIn(customToken: string) {
  return signInWithCustomToken(getFirebaseAuth(), customToken);
}

/** Signs out the current user and clears the Firebase session. */
export async function signOut() {
  return firebaseSignOut(getFirebaseAuth());
}

/**
 * Returns a fresh Firebase ID token for the current user.
 * This token is sent as `Authorization: Bearer <token>` to the NestJS API.
 * Returns `null` if no user is signed in.
 */
export async function getToken(): Promise<string | null> {
  const currentUser = getFirebaseAuth().currentUser;
  if (!currentUser) return null;
  return currentUser.getIdToken(true);
}
