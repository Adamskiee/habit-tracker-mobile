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
        const allHabits = await FirestoreService.getAll("habits");
        if (allHabits.length > 0) {
          await SQLiteService.fetchAll("habit", allHabits);
          this.setLastSyncTime();
        }
      } else {
        const lastSync = await this.getLastSyncTime();
        if (!lastSync) {
          const allHabits = await FirestoreService.getAll("habits");

          if (allHabits.length > 0) {
            await SQLiteService.fetchAll("habit", allHabits);
            this.setLastSyncTime();
          }
        } else {
          console.log(lastSync);
          const changedData = await FirestoreService.getAllUnsync(
            "habits",
            lastSync
          );
          if (changedData.length > 0) {
            SQLiteService.fetchAll("habits", changedData);
            this.setLastSyncTime();
          }
        }
      }
      console.log("[SYNC]: End sync");
    } catch (error) {
      console.error("[SYNC]: Error syncing data: ", error);
    }
  }

  // Sync data from sqlite to firestore
  async pushLocalChanges() {
    try {
      console.log(`[SYNC]: Start push local changes`);
      const allHabits = await HabitStorageService.getAllUnsyncHabits();

      if (allHabits.length < 1) {
        console.log(`[SYNC]: End`);
        return;
      }

      const syncedHabits = await HabitStorageService.makeHabitsSync(allHabits);

      await FirestoreService.pushDatas("habits", syncedHabits);
      this.setLastSyncTime();
      console.log(`[SYNC]: End`);
    } catch (error) {
      console.error(`[SYNC]: Error pushing local changes: ${error}`);
    }
  }

  async setLastSyncTime() {
    try {
      const date = Math.floor(Date.now() / 1000);
      console.log(`[SYNC]: Set last sync time to: ${date}`);
      console.log(date);
      await AsyncStorage.setItem(this.LAST_SYNC_KEY, date.toString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getLastSyncTime() {
    try {
      const timestamp = await AsyncStorage.getItem(this.LAST_SYNC_KEY);

      if (!timestamp) return null;

      const date = parseInt(timestamp);

      console.log(`[SYNC]: Last sync time: ${timestamp}`);

      return date;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new SyncManager();
