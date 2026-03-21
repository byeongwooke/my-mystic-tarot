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

async function finalReset() {
  console.log("🔥 성명+PIN 체계 확립 전 최종 데이터를 리셋합니다.");
  try {
    for (const target of ["users", "tarot_history"]) {
      const snap = await getDocs(collection(db, target));
      let count = 0;
      for (const d of snap.docs) {
        await deleteDoc(doc(db, target, d.id));
        count++;
      }
      console.log(`✅ ${target}: ${count}건 말소 완료.`);
    }
  } catch (err) {
    console.error("❌ 오류 발생:", err);
  }
}

finalReset();
