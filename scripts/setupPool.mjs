import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
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

async function setupPool() {
  console.log("🔥 지능형 인증 도입을 위한 데이터 통일화 시작...");
  try {
    const namingPoolSnap = await getDocs(collection(db, "naming_pool"));
    let resetCount = 0;
    for (const document of namingPoolSnap.docs) {
      if (document.data().isUsed) {
        await updateDoc(doc(db, "naming_pool", document.id), { isUsed: false });
        resetCount++;
      }
    }
    console.log(`✅ naming_pool: ${resetCount}건 리셋 완료.`);

    const usersSnap = await getDocs(collection(db, "users"));
    let deleteCount = 0;
    for (const document of usersSnap.docs) {
      await deleteDoc(doc(db, "users", document.id));
      deleteCount++;
    }
    console.log(`✅ users: ${deleteCount}명 삭제 완료.`);

    console.log("🎉 완벽하게 텅 빈 상태로 준비되었습니다!");
  } catch (error) {
    console.error("❌ 초기화 중 오류 발생:", error);
  }
}

setupPool();
