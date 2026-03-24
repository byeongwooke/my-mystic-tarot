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

async function clearUsers() {
  console.log("🔥 users 컬렉션 전면 소각 작업을 시작합니다...");
  try {
    const snap = await getDocs(collection(db, "users"));
    let count = 0;
    for (const document of snap.docs) {
      await deleteDoc(doc(db, "users", document.id));
      count++;
    }
    console.log(`🧨 users 컬렉션: 총 ${count}개의 전체 문서 완전 소거 완료.`);
    console.log("🎉 완벽하게 Clean 상태로 복구되었습니다!");
  } catch (error) {
    console.error("❌ 작업 중 오류 발생:", error);
  }
}

clearUsers();
