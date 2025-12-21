import { useHabits } from "@/hooks/useHabits";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Button from "./ui/Button";

interface HabitItemProps {
  title: string;
  id: string;
  completed: boolean;
  setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
}

const HabitItem = ({
  title,
  id,
  completed,
  setActiveModal,
}: HabitItemProps) => {
  const { toggleHabit, setActiveHabit } = useHabits();

  const handleHabitItemOnClick = () => {
    setActiveModal("habit-item");
    setActiveHabit(id);
  };

  return (
    <View className="flex-row items-center justify-between w-full">
      <TouchableOpacity onPress={handleHabitItemOnClick}>
        <Text className={`text-2xl ${completed && "complete-habit"}`}>
          {title}
        </Text>
      </TouchableOpacity>
      <Button
        onPress={() => toggleHabit(id)}
        text={`${completed ? "Undone" : "Done"}`}
      />
    </View>
  );
};

export default HabitItem;
