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

async function clearData() {
  console.log("🔥 보안 점검을 위한 데이터 통합 초기화 시작...");
  try {
    const namingPoolSnap = await getDocs(collection(db, "naming_pool"));
    let resetCount = 0;
    for (const document of namingPoolSnap.docs) {
      if (document.data().isUsed) {
        await updateDoc(doc(db, "naming_pool", document.id), { isUsed: false });
        resetCount++;
      }
    }
    console.log(`✅ naming_pool: ${resetCount}개의 문서 isUsed 필드를 false로 리셋했습니다.`);

    const usersSnap = await getDocs(collection(db, "users"));
    let deleteCount = 0;
    for (const document of usersSnap.docs) {
      await deleteDoc(doc(db, "users", document.id));
      deleteCount++;
    }
    console.log(`✅ users: ${deleteCount}개의 사용자 문서를 완전히 삭제했습니다.`);

    console.log("🎉 보안 데이터 초기화 완료!");
  } catch (error) {
    console.error("❌ 초기화 중 오류 발생:", error);
  }
}

clearData();
