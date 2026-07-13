import { getDatabase } from "firebase/database";
import { app } from "./config";

export const database = getDatabase(app, process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);
