import { db, collection, addDoc, getDoc, doc, serverTimestamp } from './firebase';

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

const toPlainObject = (obj: any) => {
  return JSON.parse(JSON.stringify(obj, (key, value) => 
    value === undefined ? null : value
  ));
};

export const saveSharedResult = async (data: {
  displayName: string;
  category: string;
  cardsInfo: any[];
  overallAdvice: string;
}) => {
  try {
    const sanitizedData = toPlainObject(data);
    const docRef = await addDoc(collection(db, 'shared_results'), {
      ...sanitizedData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving shared result: ", error);
    throw error;
  }
};

/**
 * [NEW] Records minimal usage data without saving card details.
 */
export const logSpreadUsage = async (profileId: string, userName: string, spread: string, category: string) => {
  try {
    await addDoc(collection(db, 'usage_analytics'), {
      profileId,
      userName,
      spread,
      category,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error logging spread usage:", error);
  }
};

export const getSharedResult = async (id: string) => {
  try {
    const docRef = doc(db, 'shared_results', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as any) } as any;
    }
    return null;
  } catch (error) {
    console.error("Error getting shared result: ", error);
    throw error;
  }
};
