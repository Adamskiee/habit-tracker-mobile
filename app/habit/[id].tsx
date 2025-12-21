import { useHabits } from "@/hooks/useHabits";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

const HabitDetails = () => {
  const { getHabit } = useHabits();
  const { id } = useLocalSearchParams<{ id: string }>();
  const habit = getHabit(id);

  // For dynamic title in the header
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerTitle: habit?.title });
  });

  return (
    <View className="px-3 mt-5">
      {!habit ? (
        <Text>Habit Not Found.</Text>
      ) : (
        <>
          <Text
            className={`text-5xl font-bold mb-4 ${
              habit.completed && "complete-habit"
            }`}
          >
            {habit.title}
          </Text>
          <View>
            <Text className="text-lg font-medium text-gray-500 mb-2">Description</Text>
            <Text className="text-base border rounded-2xl p-3 border-gray-400 h-32">{habit.description}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default HabitDetails;
