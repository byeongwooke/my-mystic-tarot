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

async function resetAll() {
  console.log("🔥 데이터 초기화 작업 시작...");
  try {
    const namingPoolSnap = await getDocs(collection(db, "naming_pool"));
    let resetCount = 0;
    for (const document of namingPoolSnap.docs) {
      if (document.data().isUsed) {
        await updateDoc(doc(db, "naming_pool", document.id), { isUsed: false });
        resetCount++;
      }
    }
    console.log(`✅ naming_pool: ${resetCount}개의 이름을 초기화하여 반환했습니다.`);

    const usersSnap = await getDocs(collection(db, "users"));
    let deleteCount = 0;
    for (const document of usersSnap.docs) {
      await deleteDoc(doc(db, "users", document.id));
      deleteCount++;
    }
    console.log(`✅ users: ${deleteCount}명의 테스트 유저 데이터를 비웠습니다.`);

    console.log("🎉 모든 초기화가 성공적으로 완료되었습니다!");
  } catch (error) {
    console.error("❌ 초기화 실패:", error);
  }
}

resetAll();
