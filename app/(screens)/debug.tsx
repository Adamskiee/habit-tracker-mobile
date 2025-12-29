import SQLiteService from "@/services/storage/SQLiteService";
import React from "react";
import { Pressable, Text, View } from "react-native";

const DebugScreen = () => {
  const handleDeleteDatabase = async () => {
    try {
      await SQLiteService.deleteDatabase();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTable = async (tableName: string) => {
    try {
      await SQLiteService.deleteTable(tableName);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTable = async () => {
    try {
      await SQLiteService.init();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="screen-view">
      <View className="flex-1 gap-4">
        <Pressable className="btn" onPress={handleDeleteDatabase}>
          <Text>Delete Database</Text>
        </Pressable>
        <Pressable className="btn" onPress={() => handleDeleteTable("habits")}>
          <Text>Delete Habits Table</Text>
        </Pressable>
        <Pressable className="btn" onPress={handleCreateTable}>
          <Text>Create Habits Table</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DebugScreen;
