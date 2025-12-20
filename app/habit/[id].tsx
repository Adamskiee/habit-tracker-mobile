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
    <View className="screen-view">
      {!habit ? (
        <Text>Habit Not Found.</Text>
      ) : (
        <>
          <Text>Habit Details</Text>
          <Text>Name: {habit.title}</Text>
          <Text>Description: {habit.description}</Text>
        </>
      )}
    </View>
  );
};

export default HabitDetails;
