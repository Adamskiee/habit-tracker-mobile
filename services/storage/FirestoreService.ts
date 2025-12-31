import { db } from "@/config/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import HabitStorageService from "./HabitStorageService";

class FirestoreService {
  // Get all data in the firestore
  async getAll(
    collectionName: string
  ): Promise<(Habit & { firestore_id: string })[]> {
    try {
      console.log(`[FIRESTORE]: Getting all data in ${collectionName}...`);
      const snapshot = await getDocs(collection(db, collectionName));

      console.log(`[FIRESTORE]: Data: `);
      const data = snapshot.docs.map((doc) => ({
        firestore_id: doc.id,
        ...(doc.data() as Habit),
      }));
      console.log(data);

      return data;
    } catch (error) {
      console.error("[FIRESTORE]: Error getting data: ", error);
      throw error;
    }
  }

  // Push data or chagnes to firestore
  async pushDatas(collectionName: string, datas: Habit[]): Promise<void> {
    try {
      console.log(`[FIRESTORE]: Pushing datas to ${collectionName}...`);
      datas.forEach(async (data) => {
        if (data.firestore_id) {
          const docRef = doc(db, collectionName, data.firestore_id);
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
            await HabitStorageService.updateHabit(data.id, {
              firestore_id: newFirestoreId,
            });
          }
        }
      });
      // For deleted habits
      await HabitStorageService.deleteSyncDeletedHabits();
      console.log(`[FIRESTORE]: Pushing datas to ${collectionName} done`);
    } catch (error) {
      console.error("[FIRESTORE]: Error pushing data: ", error);
      throw error;
    }
  }

  // Get all data in the firestore that is not in the local storage(sqlite)
  async getAllUnsync(
    collectionName: string,
    lastSyncTime: number
  ): Promise<(Habit & { firestore_id: string })[]> {
    try {
      console.log(
        `[FIRESTORE]: Getting all unsync data in ${collectionName}...`
      );
      console.log(lastSyncTime);
      const q = query(
        collection(db, collectionName),
        where("updatedAt", ">", lastSyncTime)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        ...(doc.data() as Habit),
        firestore_id: doc.id,
      }));
      console.log(`[FIRESTORE]: All unsync data in ${collectionName}: `);
      console.log(data);

      return data;
    } catch (error) {
      console.error("[FIRESTORE]: Error getting unsync data: ", error);
      throw error;
    }
  }
}

export default new FirestoreService();
