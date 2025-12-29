import * as SQLite from "expo-sqlite";

class HabitStorageService {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync("habit-tracker");
    this.sqliteInit();
  }

  async sqliteInit() {
    await this.db.runAsync(
      `CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      firestore_id TEXT UNIQUE,
      title TEXT NOT NULL, 
      description TEXT DEFAULT NULL, 
      completed INTEGER CHECK(completed IN (0, 1)) NOT NULL DEFAULT "0", 
      isDeleted INTEGER CHECK(isSync IN(0, 1)) NOT NULL DEFAULT "0",
      isSync INTEGER CHECK(isSync IN (0,1)) NOT NULL DEFAULT "0",
      updatedAt TEXT DEFAULT (datetime('now')))`
    );
  }

  // READ
  async getAllHabits(): Promise<Habit[]> {
    try {
      const habits = await this.db.getAllAsync<Habit>(
        "SELECT * FROM habits WHERE isDeleted = 0"
      );

      return habits as Habit[];
    } catch (error) {
      throw error;
    }
  }

  async getHabitById(id: number): Promise<Habit | null> {
    try {
      const habit = await this.db.getFirstAsync<Habit>(
        "SELECT * FROM habits WHERE isDeleted = ? AND id = ?",
        [0, id]
      );
      return habit || null;
    } catch (error) {
      console.error("[SQLITE]: Error getting habit: ", error);
      throw error;
    }
  }

  async getAllUnsyncHabits(): Promise<Habit[]> {
    try {
      console.log(`[SQLITE]: Getting all unsync data in habits...`);
      const habits = await this.db.getAllAsync<Habit>(
        "SELECT * FROM habits WHERE isSync = ?",
        [0]
      );
      console.log(`[SQLITE]: Unsync data in habits: `);
      console.log(habits);

      return habits as Habit[];
    } catch (error) {
      console.log(`[SQLITE]: Error getting all unsync data: ${error}`);
      throw error;
    }
  }

  // CREATE
  async createHabit(newHabit: {
    title: string;
    description?: string;
    id?: number;
    firestoreId?: string;
    completed?: boolean;
    updatedAt?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      await this.db.runAsync(
        "INSERT INTO habits(title, description) VALUES (?, ?)",
        [newHabit.title, newHabit.description ?? null]
      );
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
    id: number,
    updates: HabitEditProps
  ): Promise<{ success: boolean; message: string }> {
    try {
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.title !== undefined) {
        fields.push("title = ?");
        values.push(updates.title);
        fields.push("isSync = 0");
      }
      if (updates.description !== undefined) {
        fields.push("description = ?");
        values.push(updates.description);
        fields.push("isSync = 0");
      }
      if (updates.completed !== undefined) {
        fields.push("completed = ?");
        values.push(updates.completed);
        fields.push("isSync = 0");
      }
      if (updates.firestore_id !== undefined) {
        fields.push("firestore_id = ?");
        values.push(updates.firestore_id);
      }
      if (updates.isSync !== undefined) {
        fields.push("isSync = ?");
        values.push(updates.isSync);
      }

      fields.push("updatedAt = (datetime('now', 'utc'))");
      values.push(id);

      if (fields.length === 1) {
        return {
          success: false,
          message: "No fields to update",
        };
      }

      console.log("[SQLite]: Updating DB...");
      await this.db.runAsync(
        `UPDATE habits SET ${fields.join(", ")} WHERE id = ?`,
        values
      );
      console.log("[SQLite]: Updated DB");

      return {
        success: true,
        message: "Updated successfully",
      };
    } catch (error) {
      console.log("[SQLITE]: Error updating data: ", error);
      throw error;
    }
  }

  async toggleHabitCompletion(
    id: number
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
      console.error("[SQLITE]: Error toggling habit completion: ", error);
      return { success: false, message: "Toggling habit error" };
    }
  }

  async makeHabitsSync(habits: Habit[]): Promise<Habit[]> {
    try {
      console.log(`[SQLITE]: Making data's isSync field to true...`);
      habits.forEach(
        async (habit) => await this.updateHabit(habit.id, { isSync: 1 })
      );

      const syncHabits = habits.map((habit) => ({ ...habit, isSync: 1 }));
      console.log(`[SQLITE]: Making data's isSync field to true done`);

      return syncHabits;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // DELETE
  async deteteHabit(id: number): Promise<void> {
    try {
      await this.db.runAsync(
        "UPDATE habits SET isDeleted = 1, isSync = 0 WHERE id = ?",
        [id]
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteAllhabit(): Promise<void> {
    try {
      await this.db.runAsync("DELETE FROM habits");
    } catch (error) {
      console.error("Error deleting all habit: ", error);
      throw error;
    }
  }

  // DATABASE UTILITIES
  // to close database
  async closeDatabase(): Promise<void> {
    try {
      await this.db.closeAsync();
    } catch (error) {
      console.error("Error closing database:", error);
    }
  }

  // to reopen database
  async reopenDatabase(): Promise<void> {
    try {
      this.db = SQLite.openDatabaseSync("habit-tracker");
      await this.sqliteInit();
    } catch (error) {
      console.error("Error reopening database:", error);
    }
  }
}

export default new HabitStorageService();
