import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  DocumentData,
  CollectionReference,
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
    const snapshot = await getDocs(this.habitsRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Habit),
    }));
  }

  async getHabitById(id: string): Promise<Habit | null> {
    try {
      const habits = await this.getAllHabits();
      return habits.find((habit) => habit.id === id) || null;
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
      const habits = await this.getAllHabits();

      const habitsWithMetaData = {
        ...newHabit,
        id: this.generateUUID(),
        completed: false,
      };

      const updatedHabits = [...habits, habitsWithMetaData];

      this.saveAllHabits(updatedHabits);

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
      const habits = await this.getAllHabits();
      const habitIndex = habits.findIndex((todo) => todo.id === id);

      if (habitIndex === -1) {
        return {
          success: false,
          message: "Habit not found",
        };
      }

      const { id: habitId, ...preserved } = habits[habitIndex];

      const updatedHabit = {
        id: habitId,
        ...preserved,
        ...updates,
      };
      console.log(updatedHabit);

      const updatedhabits = [...habits];
      updatedhabits[habitIndex] = updatedHabit;

      await this.saveAllHabits(updatedhabits);

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
      console.log("toggled");
      return {
        success: true,
        message: "Toggle habit successfully",
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Toggling habit error" };
    }
  }

  async saveAllHabits(habits: Habit[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(habits);
      await AsyncStorage.setItem(this.habitsKey, jsonValue);
    } catch (error) {
      throw error;
    }
  }

  // DELETE
  async deteteHabit(id: string): Promise<void> {
    try {
      const habits = await this.getAllHabits();

      const updatedHabits = habits.filter((habit) => habit.id !== id);

      await this.saveAllHabits(updatedHabits);
    } catch (error) {
      throw error;
    }
  }

  // UTILITIES
  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}

export default new HabitStorageService();
