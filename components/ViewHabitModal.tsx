import { useHabits } from "@/hooks/useHabits";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Modal from "react-native-modal";
import EditableText from "./EditableText";
import Button from "./ui/Button";

interface AddHabitModalProps {
  visible: boolean;
  setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
}

const ViewHabitModal = ({ visible, setActiveModal }: AddHabitModalProps) => {
  const { toggleHabit, activeHabit, getHabit, deleteHabit, updateHabit } =
    useHabits();
  const [habit, setHabit] = useState<HabitList | undefined>(undefined);
  const [editableTitle, setEditableTitle] = useState(habit?.title);
  const [editableDescription, setEditableDescription] = useState(
    habit?.description
  );

  useEffect(() => {
    setHabit(getHabit(activeHabit));
    setEditableTitle(habit?.title);
    setEditableDescription(habit?.description);
  }, [habit, activeHabit, getHabit]);

  if (!habit) {
    return;
  }

  const handleOnToggle = () => {
    toggleHabit(activeHabit);
    setActiveModal("none");
  };

  const handleOnDelete = (id: string) => {
    deleteHabit(id);
    setActiveModal("none");
  };

  const handleOnModalHide = () => {
    updateHabit(habit.id, {
      title: editableTitle,
      description: editableDescription,
    });
  };

  return (
    <Modal
      isVisible={visible}
      animationOut={"fadeOutDown"}
      animationIn={"fadeIn"}
      backdropOpacity={0.4}
      backdropColor="black"
      backdropTransitionOutTiming={10}
      onModalHide={handleOnModalHide}
      useNativeDriver={false}
      onBackdropPress={() => setActiveModal("none")}
    >
      <View className="bg-gray-200 rounded-2xl gap-4 w-full max-w-96 p-4">
        <EditableText
          onChangeText={setEditableTitle}
          text={editableTitle}
          className={`font-bold text-5xl ${
            habit.completed && "complete-habit"
          }`}
        />
        <EditableText
          onChangeText={setEditableDescription}
          text={editableDescription}
        />
        <View className="flex-row gap-2">
          <Button
            text="Delete"
            onPress={() => handleOnDelete(habit.id)}
            className="bg-red-700 flex-1"
          />
          <Button
            text={habit.completed ? "Undone" : "Done"}
            onPress={handleOnToggle}
            className="flex-1"
          />
        </View>
      </View>
    </Modal>
  );
};

export default ViewHabitModal;
