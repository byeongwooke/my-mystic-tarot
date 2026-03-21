import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanupPool() {
  console.log("🔥 naming_pool 소각 시작...");
  try {
    const namingPoolSnap = await getDocs(collection(db, "naming_pool"));
    let deleteCount = 0;
    for (const document of namingPoolSnap.docs) {
      await deleteDoc(doc(db, "naming_pool", document.id));
      deleteCount++;
    }
    console.log(`✅ naming_pool: ${deleteCount}개의 문서를 흔적도 없이 소각 완료.`);
  } catch (error) {
    console.error("❌ 오류 발생:", error);
  }
}

cleanupPool();
