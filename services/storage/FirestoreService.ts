import { db } from "@/config/firebase";
import {
  collection,
  where,
  getDocs,
  query,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import HabitStorageService from "./HabitStorageService";

class FirestoreService {
  // Get all data in the firestore
  async getAll(
    collectionName: string
  ): Promise<(Habit & { firestoreId: string })[]> {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      return snapshot.docs.map((doc) => ({
        firestoreId: doc.id,
        ...(doc.data() as Habit),
      }));
    } catch (error) {
      console.error("Error getting data from firestore", error);
      throw error;
    }
  }

  // Push data or chagnes to firestore
  async pushDatas(collectionName: string, datas: Habit[]): Promise<void> {
    try {
      datas.forEach(async (data) => {
        if (data.firestoreId) {
          const docRef = doc(db, collectionName, data.firestoreId);
          await setDoc(
            docRef,
            {
              ...data,
            },
            { merge: true }
          );
        } else {
          const docRef = await addDoc(collection(db, collectionName), {
            ...data,
          });
          const newFirestoreId = docRef.id;
          if (collectionName === "habits") {
            HabitStorageService.updateHabit(data.id, {
              firestoreId: newFirestoreId,
            });
          }
        }
      });
    } catch (error) {
      console.error("Error pushing data in firestore: ", error);
      throw error;
    }
  }

  // Get all data in the firestore that is not in the local storage(sqlite)
  async getAllUnsync(
    collectionName: string,
    lastSyncTime: Date
  ): Promise<(Habit & { firestoreId: string })[]> {
    try {
      const q = query(
        collection(db, collectionName),
        where("updatedAt", ">", lastSyncTime)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        firestoreId: doc.id,
        ...(doc.data() as Habit),
      }));
    } catch (error) {
      console.error("Error getting unsync data in firestore: ", error);
      throw error;
    }
  }
}

export default new FirestoreService();
