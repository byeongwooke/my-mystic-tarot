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

async function nuclearReset() {
  console.log("🔥 모든 데이터를 소멸시키는 초강력 핵폐기 작업을 시작합니다...");
  try {
    const targets = ["users", "tarot_history", "naming_pool"];
    
    for (const target of targets) {
      const snap = await getDocs(collection(db, target));
      let count = 0;
      for (const document of snap.docs) {
        await deleteDoc(doc(db, target, document.id));
        count++;
      }
      console.log(`🧨 ${target} 컬렉션: ${count}개의 문서 완전 소거.`);
    }

    console.log("🎉 완벽하게 태초의 상태로 소각되었습니다!");
  } catch (error) {
    console.error("❌ 작업 중 오류 발생:", error);
  }
}

nuclearReset();
