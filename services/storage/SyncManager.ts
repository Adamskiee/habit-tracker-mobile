import AsyncStorage from "@react-native-async-storage/async-storage";
import FirestoreService from "./FirestoreService";
import HabitStorageService from "./HabitStorageService";
import SQLiteService from "./SQLiteService";

class SyncManager {
  private LAST_SYNC_KEY = "last_sync_timestamp";

  // Sync data from firestore to sqlite
  async startSync() {
    try {
      console.log("[SYNC]: Start sync");
      if (await SQLiteService.isDatabaseEmpty()) {
        console.log("[SYNC]: Getting all data from firestore...");
        const allHabits = await FirestoreService.getAll("habits");
        if (allHabits.length > 0) {
          console.log(`[SYNC]: Data:`);
          console.log(allHabits);
          console.log("[SYNC]: Fetch datas to SQLite");
          await SQLiteService.fetchAll("habit", allHabits);
          console.log(`[SYNC]: Updated last sync`);
          this.setLastSyncTime();
        }
      } else {
        console.log("[SYNC]: Get last sync time");
        const lastSync = await this.getLastSyncTime();
        if (!lastSync) {
          console.log("[SYNC]: Getting all data from firestore...");
          const allHabits = await FirestoreService.getAll("habits");
          console.log(`[SYNC]: Data:`);
          console.log(allHabits);

          if (allHabits.length > 0) {
            console.log("[SYNC]: Fetching data to the SQLite...");
            await SQLiteService.fetchAll("habit", allHabits);
            console.log("[SYNC]: Fetched data to the SQLite");
            console.log(`[SYNC]: Updated last sync`);
            this.setLastSyncTime();
          }
        } else {
          console.log("[SYNC]: Getting unsync data...");
          const changedData = await FirestoreService.getAllUnsync(
            "habits",
            lastSync
          );
          console.log(`[SYNC]: Unsync data: `);
          console.log(changedData);
          if (changedData.length > 0) {
            console.log(`[SYNC]: Updating datas...`);
            console.log(`[SYNC]: Updated data`);
            await SQLiteService.update("habit", changedData);
            console.log(`[SYNC]: Updated last sync`);
            this.setLastSyncTime();
          }
        }
      }
      console.log("[SYNC]: End sync");
    } catch (error) {
      console.error("Error syncing data: ", error);
    }
  }

  async pushLocalChanges() {
    // Sync data from sqlite to firestore
    try {
      console.log(`[SYNC]: Start push local changes`);
      console.log(`[SYNC]: Getting all unsync habits...`);
      const allHabits = await HabitStorageService.getAllUnsyncHabits();
      console.log(`[SYNC]: Unsync habits: `);
      console.log(allHabits);

      if (allHabits.length < 1) {
        console.log(`[SYNC]: End`);
        return;
      }

      console.log(`[SYNC]: Making all unsync habits to be sync...`);
      const syncedHabits = await HabitStorageService.makeHabitsSync(allHabits);
      console.log(`[SYNC]: Done making habits to be sync: `);
      console.log(allHabits);

      console.log(`[SYNC]: Pushing datas to the firestore...`);
      await FirestoreService.pushDatas("habits", syncedHabits);
      console.log(`[SYNC]: Pushed datas to the firestore`);
      this.setLastSyncTime();
      console.log(`[SYNC]: End`);
    } catch (error) {
      console.error(`Error pushing local changes: ${error}`);
    }
  }

  async setLastSyncTime(date: Date = new Date()) {
    try {
      await AsyncStorage.setItem(this.LAST_SYNC_KEY, date.toISOString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getLastSyncTime() {
    try {
      const timestamp = await AsyncStorage.getItem(this.LAST_SYNC_KEY);
      return timestamp ? new Date(timestamp) : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new SyncManager();
