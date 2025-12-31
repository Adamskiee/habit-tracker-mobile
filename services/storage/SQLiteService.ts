import * as SQLite from "expo-sqlite";
import HabitStorageService from "./HabitStorageService";

class SQLiteService {
  private dbName = "habit-tracker";
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync(this.dbName);
  }

  async init(): Promise<void> {
    try {
      await this.db.runAsync(`CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        firestore_id TEXT UNIQUE,
        title TEXT NOT NULL, 
        description TEXT DEFAULT NULL, 
        completed INTEGER CHECK(completed IN (0, 1)) NOT NULL DEFAULT "0", 
        isDeleted INTEGER CHECK(isDeleted IN(0, 1)) NOT NULL DEFAULT "0",
        isSync INTEGER CHECK(isSync IN (0,1)) NOT NULL DEFAULT "0",
        updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        )`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // TODO: rename considering that there is an habit created
  // fetch unsync data to the sqlite
  async fetchAll(
    tableName: string,
    datas: (Habit & {
      firestore_id: string;
    })[]
  ): Promise<void> {
    try {
      console.log(`[SQLITE]: Fetching data to ${tableName}...`);
      if (tableName === "habits") {
        datas.forEach(async (data) => {
          if (await HabitStorageService.getHabitById(data.id)) {
            await HabitStorageService.updateHabit(data.id, data);
          } else {
            await HabitStorageService.createHabit(data);
          }
        });
      }
      console.log(`[SQLITE]: Fetching data to ${tableName} done`);
    } catch (error) {
      console.error("[SQLITE]: Error fetching data: ", error);
      throw error;
    }
  }

  // Update records
  async update(
    tableName: string,
    datas: (Habit & { firestoreId: string })[]
  ): Promise<void> {
    try {
      console.log(`[SQLITE]: Updating data in ${tableName}...`);
      if (tableName === "habits") {
        datas.forEach((data) => {
          // TODO: update the specific records that is changed
          HabitStorageService.updateHabit(data.id, data);
        });
      }
      console.log(`[SQLITE]: Updating data in ${tableName} done`);
    } catch (error) {
      console.error(`[SQLITE]: Error updating data: ${error}`);
    }
  }

  // Check if there is no records in the database
  async isDatabaseEmpty(): Promise<boolean> {
    try {
      await this.init();
      const result = await this.db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM habits"
      );
      return result?.count === 0;
    } catch (error) {
      console.error("Error checking SQLite database: ", error);
      return true;
    }
  }

  async isInitialized(): Promise<boolean> {
    try {
      const result = await this.db.getFirstAsync<{ name: string }>(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='habits'`
      );
      return result !== null;
    } catch (error) {
      console.error("Error checking initialization:", error);
      return false;
    }
  }

  // Helper function
  toSQLiteDateFormat(date: Date = new Date()): string {
    return date.toISOString().replace("T", " ").slice(0, 19);
  }

  async deleteDatabase(): Promise<void> {
    try {
      await this.db.closeAsync();

      await HabitStorageService.closeDatabase();

      await SQLite.deleteDatabaseAsync(this.dbName);

      this.db = SQLite.openDatabaseSync(this.dbName);
      await this.init();

      await HabitStorageService.reopenDatabase();
    } catch (error) {
      console.error("Error deleting database: ", error);
    }
  }

  async deleteTable(tableName: string): Promise<void> {
    try {
      await this.db.runAsync("DROP TABLE IF EXISTS habits");
    } catch (error) {
      console.error(error);
    }
  }
}

export default new SQLiteService();
