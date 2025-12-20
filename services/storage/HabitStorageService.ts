import AsyncStorage from "@react-native-async-storage/async-storage";

interface Habit {
  title: string;
  description: string;
  completed: boolean;
  id: string;
}

class HabitStorageService {
  private habitsKey: string;
  constructor() {
    this.habitsKey = "@habits";
  }

  async getAllHabits(): Promise<Habit[] | []> {
    try {
      const jsonValue = await AsyncStorage.getItem(this.habitsKey);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error(`Error getting all habits: ${error}`);
      return [];
    }
  }

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

  async getHabitById(id: string): Promise<Habit | null> {
    try {
      const habits = await this.getAllHabits();
      return habits.find((habit) => habit.id === id) || null;
    } catch (error) {
      throw error;
    }
  }

  async updateHabit(
    id: string,
    updates: { title?: string; description?: string; completed?: boolean }
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

      const updatedhabits = [...habits];
      updatedhabits[habitIndex] = updatedHabit;

      await this.saveAllHabits(updatedhabits);

      return {
        success: true,
        message: "Updated successfully"
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Updating error",
      };
    }
  }

  async toggleHabitCompletion(id: string): Promise<{success:boolean, message: string}> {
    try {
      const habit = await this.getHabitById(id);
      if(!habit) {
        return {
          success: false,
          message: "Habit not found"
        }
      }

      await this.updateHabit(id, {
        completed: !habit.completed
      });
      console.log("toggled")
      return {
        success: true,
        message: "Toggle habit successfully"
      }
    } catch (error) {
      console.error(error)
      return {success: false, message: "Toggling habit error"}
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
