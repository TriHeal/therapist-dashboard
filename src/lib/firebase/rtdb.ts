import { getDatabase } from "firebase/database";
import { getFirebaseApp } from "@/lib/auth/firebase-client";

export const database = getDatabase(getFirebaseApp(), process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);
