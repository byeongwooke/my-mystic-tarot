import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const saveTarotResult = async (profileId: string, userName: string, cards: any[], resultText: string) => {
  try {
    const docRef = await addDoc(collection(db, 'tarot_history'), {
      profileId,
      userName,
      cards,
      resultText,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving tarot history: ", error);
    throw error;
  }
};
