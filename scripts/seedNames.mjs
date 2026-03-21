import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import dotenv from "dotenv";

// .env.local 파일에서 설정값 로드
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

const adjs = ["푸른", "고요한", "타오르는", "은빛", "대지의", "바람의", "새벽의", "영원한", "신비한", "깊은"];
const nouns = ["안개", "별빛", "심장", "달빛", "속삭임", "인도자", "수호자", "방랑자", "현자", "관찰자"];

async function seed() {
  console.log("🔮 운명의 이름 풀을 생성 중입니다...");
  let count = 0;
  try {
    for (let a of adjs) {
      for (let n of nouns) {
        for (let i = 1; i <= 10; i++) {
          const name = `${a} ${n} ${i}호`;
          await setDoc(doc(collection(db, "naming_pool"), `name_${count}`), {
            name: name,
            isUsed: false,
            order: count
          });
          count++;
        }
      }
    }
    console.log(`✅ 성공! ${count}개의 운명의 이름이 'naming_pool'에 저장되었습니다.`);
  } catch (error) {
    console.error("❌ 생성 실패:", error);
  }
}

seed();
