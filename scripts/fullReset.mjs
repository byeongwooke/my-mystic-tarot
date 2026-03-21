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

async function fullReset() {
  console.log("🔥 전면 데이터 소각을 시작합니다...");
  try {
    const usersSnap = await getDocs(collection(db, "users"));
    let usersCount = 0;
    for (const document of usersSnap.docs) {
      await deleteDoc(doc(db, "users", document.id));
      usersCount++;
    }
    console.log(`✅ users 컬렉션: ${usersCount}명의 데이터가 완전히 소각되었습니다.`);

    const tarotHistorySnap = await getDocs(collection(db, "tarot_history"));
    let tarotCount = 0;
    for (const document of tarotHistorySnap.docs) {
      await deleteDoc(doc(db, "tarot_history", document.id));
      tarotCount++;
    }
    console.log(`✅ tarot_history 컬렉션: ${tarotCount}건의 타로 기록이 재로 변했습니다.`);

    console.log("🎉 서버 환경 초기화가 완벽하게 종료되었습니다!");
  } catch (error) {
    console.error("❌ 데이터 소각 중 치명적 오류 발생:", error);
  }
}

fullReset();
