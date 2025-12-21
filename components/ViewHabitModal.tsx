import { useHabits } from "@/hooks/useHabits";
import React from "react";
import { Text, View } from "react-native";
import Modal from "react-native-modal";
import Button from "./ui/Button";

interface AddHabitModalProps {
  visible: boolean;
  setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
}

const ViewHabitModal = ({ visible, setActiveModal }: AddHabitModalProps) => {
  const { toggleHabit, activeHabit, getHabit } = useHabits();

  const habit = getHabit(activeHabit);

  const handleButton = () => {
    toggleHabit(activeHabit);
    setActiveModal("none");
  };

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.4}
      onBackdropPress={() => setActiveModal("none")}
    >
      <View className="bg-gray-200 rounded-2xl gap-4 w-full max-w-96 p-4">
        <Text className="font-bold text-2xl">{habit?.title}</Text>
        <Text>{habit?.description}</Text>
        <Button
          text={habit?.completed ? "Undone" : "Done"}
          onPress={handleButton}
        />
      </View>
    </Modal>
  );
};

export default ViewHabitModal;
