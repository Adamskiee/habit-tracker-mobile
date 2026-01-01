import { db, auth } from "@/config/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import HabitStorageService from "./HabitStorageService";
import { onAuthStateChanged } from "@firebase/auth";

class FirestoreService {
  private userUid: string | null = null;
  private authReady: Promise<void>;
  constructor() {
    this.authReady = new Promise((res) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        this.userUid = user?.uid || null;
        unsubscribe();
        res();
      });
    });
  }

  private async ensureAuth() {
    await this.authReady;
    if (!this.userUid) {
      throw new Error("User must be authenticated");
    }
  }

  private async getUserCollection(collectionName: string) {
    await this.ensureAuth();
    return collection(db, "users", this.userUid!, collectionName);
  }

  // Get all data in the firestore
  async getAll(
    collectionName: string
  ): Promise<(Habit & { firestore_id: string })[]> {
    try {
      console.log(`[FIRESTORE]: Getting all data in ${collectionName}...`);
      const snapshot = await getDocs(
        await this.getUserCollection(collectionName)
      );

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
          const docRef = doc(
            await this.getUserCollection(collectionName),
            data.firestore_id
          );
          await setDoc(
            docRef,
            {
              ...data,
            },
            { merge: true }
          );
        } else {
          const docRef = await addDoc(
            await this.getUserCollection(collectionName),
            {
              ...data,
            }
          );

          const newFirestoreId = docRef.id;
          if (collectionName === "habits") {
            await HabitStorageService.updateHabit(data.id, {
              firestore_id: newFirestoreId,
            });
          }
        }
      });

      await HabitStorageService.makeHabitsSync(datas);

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
        await this.getUserCollection(collectionName),
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
