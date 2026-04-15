import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, indexedDBLocalPersistence } from "firebase/auth";
import { 
  getFirestore, 
  initializeFirestore, 
  doc as firestoreDoc, 
  getDoc as firestoreGetDoc, 
  getDocs as firestoreGetDocs, 
  setDoc as firestoreSetDoc, 
  updateDoc as firestoreUpdateDoc, 
  addDoc as firestoreAddDoc, 
  collection as firestoreCollection, 
  query as firestoreQuery, 
  where as firestoreWhere, 
  onSnapshot as firestoreOnSnapshot,
  deleteDoc as firestoreDeleteDoc,
  increment as firestoreIncrement,
  serverTimestamp as firestoreServerTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence,
  popupRedirectResolver: undefined,
});

let _webDb: any = null;
try {
  _webDb = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    experimentalAutoDetectLongPolling: true,
  });
} catch (e) {
  _webDb = getFirestore(app);
}

// Global db instance
export const db = _webDb;

export const doc: any = (pathOrDb: any, path?: string, ...segments: string[]) => {
  if (typeof pathOrDb === 'string') return firestoreDoc(db, pathOrDb, ...(path ? [path] : []), ...segments);
  return firestoreDoc(pathOrDb, path as string, ...segments);
};

export const collection: any = (pathOrDb: any, path?: string) => {
  const actualPath = (typeof pathOrDb === 'string') ? pathOrDb : path;
  if (typeof pathOrDb === 'string') return firestoreCollection(db, actualPath as string);
  return firestoreCollection(pathOrDb, path as string);
};

export const getDoc = async (docRef: any) => {
  return firestoreGetDoc(docRef);
};

export const getDocs = async (queryRef: any) => {
  return firestoreGetDocs(queryRef);
};

export const setDoc = async (docRef: any, data: any, options?: { merge?: boolean }) => {
  return firestoreSetDoc(docRef, data, options as any);
};

export const updateDoc = async (docRef: any, data: any) => {
  return firestoreUpdateDoc(docRef, data);
};

export const addDoc = async (collectionRef: any, data: any) => {
  return firestoreAddDoc(collectionRef, data);
};

export const deleteDoc = async (docRef: any) => {
  return firestoreDeleteDoc(docRef);
};

export const onSnapshot = (docRef: any, onNext: (snapshot: any) => void, onError?: (error: any) => void) => {
  return firestoreOnSnapshot(docRef, onNext, onError as any);
};

export const increment = (value: number) => {
  return firestoreIncrement(value);
};

export const serverTimestamp = () => {
  return firestoreServerTimestamp();
};

export const query: any = (collectionRef: any, ...constraints: any[]) => {
  return firestoreQuery(collectionRef, ...constraints);
};

export const where: any = (field: string, op: any, value: any) => {
  return firestoreWhere(field, op, value);
};
