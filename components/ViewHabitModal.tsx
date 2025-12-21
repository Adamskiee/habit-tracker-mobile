import { useHabits } from "@/hooks/useHabits";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Modal from "react-native-modal";
import Button from "./ui/Button";

interface AddHabitModalProps {
  visible: boolean;
  setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
}

const ViewHabitModal = ({ visible, setActiveModal }: AddHabitModalProps) => {
  const { toggleHabit, activeHabit, getHabit, deleteHabit } = useHabits();
  const [habit, setHabit] = useState<HabitList | undefined>(undefined);

  useEffect(() => {
    setHabit(getHabit(activeHabit));
    console.log("hello");
  }, [habit, activeHabit, getHabit]);

  const handleOnToggle = () => {
    toggleHabit(activeHabit);
    setActiveModal("none");
  };

  const handleOnDelete = (id: string) => {
    deleteHabit(id);
    setActiveModal("none");
  };

  return (
    <Modal
      isVisible={visible}
      animationOut={"fadeOutDown"}
      animationIn={"fadeIn"}
      backdropOpacity={0.4}
      backdropColor="black"
      backdropTransitionOutTiming={10}
      useNativeDriver={false}
      onBackdropPress={() => setActiveModal("none")}
    >
      {habit ? (
        <View className="bg-gray-200 rounded-2xl gap-4 w-full max-w-96 p-4">
          <Text
            className={`font-bold text-5xl ${
              habit.completed && "complete-habit"
            }`}
          >
            {habit.title}
          </Text>
          <Text>{habit.description}</Text>
          <Button
            text={habit.completed ? "Undone" : "Done"}
            onPress={handleOnToggle}
          />
          <Button text="Delete" onPress={() => handleOnDelete(habit.id)} />
        </View>
      ) : (
        <View>
          <Text>Not found.</Text>
        </View>
      )}
    </Modal>
  );
};

export default ViewHabitModal;
