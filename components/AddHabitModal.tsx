import { useHabits } from "@/hooks/useHabits";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import Modal from "react-native-modal";
import Button from "./ui/Button";

interface AddHabitModalProps {
  visible: boolean;
  setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
}

const AddHabitModal = ({ visible, setActiveModal }: AddHabitModalProps) => {
  const { addHabit } = useHabits();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddHabit = () => {
    if (!title || !description) {
      return;
    }

    addHabit(title, description);
    setTitle("");
    setDescription("");
    setActiveModal("none");
  };

  return (
    <Modal isVisible={visible} backdropOpacity={0.4} onBackdropPress={()=>setActiveModal("none")}>
      <View className="rounded-2xl gap-4 w-full max-w-96 bg-gray-200 p-4">
        <Text className="font-bold text-2xl">Add Habit</Text>
        <TextInput
          keyboardType="default"
          className="border border-gray-400 px-4 font-medium bg-white rounded-2xl text-2xl placeholder:text-gray-400"
          onChangeText={setTitle}
          placeholder="Title"
          textAlignVertical="center"
          value={title}
        />
        <TextInput
          keyboardType="default"
          multiline
          textAlignVertical="top"
          className="border border-gray-400 p-3 bg-white rounded-2xl h-32 placeholder:text-gray-400"
          numberOfLines={5}
          maxLength={200}
          onChangeText={setDescription}
          placeholder="Description"
          value={description}
        />

        <Button onPress={handleAddHabit} text="Add" />
      </View>
    </Modal>
  );
};

export default AddHabitModal;
