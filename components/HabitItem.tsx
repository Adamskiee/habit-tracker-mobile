import { useHabits } from "@/hooks/useHabits";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import Button from "./ui/Button";

interface HabitItemProps {
  title: string;
  id: string;
  completed: boolean;
}

const HabitItem = ({ title, id, completed }: HabitItemProps) => {
  const { toggleHabit } = useHabits();

  return (
    <View className="py-4 flex-row items-center justify-between w-full">
      <Link href={`/habit/${id}`}>
        <Text className={`text-2xl ${completed && "line-through"}`}>
          {title}
        </Text>
      </Link>
      <Button
        onPress={() => toggleHabit(id)}
        text={`${completed ? "Undone" : "Done"}`}
      />
    </View>
  );
};

export default HabitItem;
