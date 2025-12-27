import * as SQLite from "expo-sqlite";

class HabitStorageService {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync("habits");
    this.sqliteInit();
  }

  async sqliteInit() {
    await this.db.runAsync(
      `CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      title TEXT NOT NULL, 
      description TEXT DEFAULT NULL, 
      completed INTEGER CHECK(completed IN (0, 1)) NOT NULL DEFAULT "0", 
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP)`
    );
  }

  // READ
  async getAllHabits(): Promise<Habit[]> {
    try {
      const habits = await this.db.getAllAsync<Habit>("SELECT * FROM habits");

      return habits as Habit[];
    } catch (error) {
      throw error;
    }
  }

  async getHabitById(id: number): Promise<Habit | null> {
    try {
      const habit = await this.db.getFirstAsync<Habit>(
        "SELECT * FROM habits WHERE id = ?",
        [id]
      );
      return habit || null;
    } catch (error) {
      throw error;
    }
  }

  // CREATE
  async createHabit(newHabit: {
    title: string;
    description?: string;
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
      }
      if (updates.description !== undefined) {
        fields.push("description = ?");
        values.push(updates.description);
      }
      if (updates.completed !== undefined) {
        fields.push("completed = ?");
        values.push(updates.completed);
      }
      fields.push("updatedAt = CURRENT_TIMESTAMP")

      values.push(id)

      if(fields.length === 1) {
        return {
          success: false,
          message: "No fields to update"
        }
      }
      
      await this.db.runAsync(`UPDATE habits SET ${fields.join(', ')} WHERE id = ?`, values);

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
      console.error(error);
      return { success: false, message: "Toggling habit error" };
    }
  }

  // DELETE
  async deteteHabit(id: number): Promise<void> {
    try {
      await this.db.runAsync("DELETE FROM habits WHERE id = ?", [id])
    } catch (error) {
      throw error;
    }
  }
}

export default new HabitStorageService();
