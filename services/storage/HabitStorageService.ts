import { db } from "@/config/firebase";
import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

class HabitStorageService {
  private habitsKey: string;
  private habitsRef: CollectionReference<Habit, DocumentData>;

  constructor() {
    this.habitsKey = "@habits";
    this.habitsRef = collection(db, "habits") as CollectionReference<Habit>;
  }

  // READ
  async getAllHabits(): Promise<(Habit & { id: string })[]> {
    try {
      const snapshot = await getDocs(this.habitsRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Habit),
      }));
    } catch (error) {
      throw error;
    }
  }

  async getHabitById(id: string): Promise<Habit | null> {
    try {
      const ref = doc(db, "habits", id);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        return {
          ...(snapshot.data() as Habit),
        };
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  // CREATE
  async createHabit(newHabit: {
    title: string;
    description: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      await addDoc(this.habitsRef, {
        ...newHabit,
        completed: false
      });
      return {
        success: true,
        message: "Created successfully",
      };
    } catch (error) {
      console.error(`Error creating habits: ${error}`);

      return {
        success: false,
        message: "Failed to create todo",
      };
    }
  }

  // UPDATE
  async updateHabit(
    id: string,
    updates: HabitEditProps
  ): Promise<{ success: boolean; message: string }> {
    try {

      await updateDoc(doc(db, "habits", id), {
        ...updates
      })

      return {
        success: true,
        message: "Updated successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Updating error",
      };
    }
  }

  async toggleHabitCompletion(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const habit = await this.getHabitById(id);

      if (!habit) {
        return {
          success: false,
          message: "Habit not found",
        };
      }

      await this.updateHabit(id, {
        completed: !habit.completed,
      });

      return {
        success: true,
        message: "Toggle habit successfully",
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Toggling habit error" };
    }
  }

  // DELETE
  async deteteHabit(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "habits", id));
    } catch (error) {
      throw error;
    }
  }
}

export default new HabitStorageService();
